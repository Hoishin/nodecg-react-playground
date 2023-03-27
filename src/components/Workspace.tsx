import { FC, RefObject, useEffect, useRef, useState } from "react";
import { Box, Card, CardContent, CardHeader } from "@mui/material";
import { loremIpsum } from "lorem-ipsum";

interface Props {
	name: string;
	panels: string[];
}

const randomInt = (max: number) => {
	return Math.ceil(Math.random() * max);
};

const SAMPLE_PANELS = [
	{ width: randomInt(8) },
	{ width: randomInt(8) },
	{ width: randomInt(8) },
	{ width: randomInt(8) },
	{ width: randomInt(8) },
	{ width: randomInt(8) },
	{ width: randomInt(8) },
	{ width: randomInt(8) },
];

interface PanelProps {
	name: string;
	width: number;
	top: number;
	left: number;
	onElementResize: (position: { width: number; height: number }) => void;
}

const useElementResize = <T extends Element>(
	ref: RefObject<T>,
	onElementResize?: PanelProps["onElementResize"]
) => {
	const [position, setPosition] = useState({ width: 0, height: 0 });
	useEffect(() => {
		if (!ref.current) {
			return;
		}
		const container = ref.current;
		const observer = new ResizeObserver((entries) => {
			const entry = entries[0];
			if (!entry) {
				return;
			}
			setPosition((position) => {
				if (
					position.width === entry.contentRect.width &&
					position.height === entry.contentRect.height
				) {
					return position;
				}
				if (onElementResize) {
					onElementResize({
						width: entry.contentRect.width,
						height: entry.contentRect.height,
					});
				}
				return {
					width: entry.contentRect.width,
					height: entry.contentRect.height,
				};
			});
		});
		observer.observe(container);
		return () => {
			observer.disconnect();
		};
	}, [onElementResize]);
	return position;
};

const Panel: FC<PanelProps> = (props) => {
	const [contentLorem, setContentLorem] = useState(
		loremIpsum({ count: randomInt(5) })
	);
	const containerRef = useRef<HTMLDivElement>(null);
	useElementResize(containerRef, props.onElementResize);

	return (
		<Card
			ref={containerRef}
			raised
			sx={{
				width: props.width,
				position: "absolute",
				top: props.top,
				left: props.left,
			}}
			onDoubleClick={() => {
				setContentLorem(loremIpsum({ count: randomInt(5) }));
			}}
		>
			<CardHeader title={`Random Panel ${props.name}`} />
			<CardContent>{contentLorem}</CardContent>
		</Card>
	);
};

const GAP = 16;

const Workspace: FC<Props> = () => {
	const panels = SAMPLE_PANELS.map((panel) => ({
		width: 128 + 144 * (panel.width - 1),
	}));

	const [panelSizes, setPanelSizes] = useState(() =>
		panels.map(() => ({ width: 0, height: 0 }))
	);

	const containerRef = useRef<HTMLDivElement>(null);
	const { width } = useElementResize(containerRef);

	const panelPositions: Array<{
		top: number;
		left: number;
		bottom: number;
		right: number;
	}> = [];

	let maxHeightPanel = { bottom: 0, right: 0 };

	const topLeftCorners: Array<{
		top: number;
		left: number;
		topAdjasentPanel: { bottom: number; right: number };
		leftAdjasentPanel: { bottom: number; right: number };
	}> = [
		{
			top: 0,
			left: 0,
			topAdjasentPanel: { bottom: 0, right: width },
			leftAdjasentPanel: { bottom: Infinity, right: 0 },
		},
	];

	for (const [panelIndex, panel] of panels.entries()) {
		const size = panelSizes[panelIndex];
		if (!size) {
			throw new Error("literally impossible");
		}
		const fittingCornerIndex = topLeftCorners.findIndex((corner) => {
			const tmpRight = corner.left + size.width;
			const tmpBottom = corner.top + size.height;
			if (width < tmpRight) {
				return;
			}
			const overlapsWithOtherPanel = panelPositions.some(
				(position) =>
					position.left - GAP < tmpRight &&
					corner.left < position.right + GAP &&
					position.top - GAP < tmpBottom &&
					corner.top < position.bottom + GAP
			);
			return !overlapsWithOtherPanel;
		});
		const fittingCorner = topLeftCorners[fittingCornerIndex] ?? {
			top: maxHeightPanel.bottom + GAP,
			left: 0,
			topAdjasentPanel: maxHeightPanel,
			leftAdjasentPanel: { bottom: Infinity, right: 0 },
		};
		if (fittingCornerIndex !== -1) {
			topLeftCorners.splice(fittingCornerIndex, 1);
		}
		const top = fittingCorner.top;
		const left = fittingCorner.left;
		const bottom = top + size.height;
		const right = left + size.width;
		if (fittingCorner.topAdjasentPanel.right > right) {
			topLeftCorners.push({
				top: fittingCorner.top,
				left: right + GAP,
				topAdjasentPanel: fittingCorner.topAdjasentPanel,
				leftAdjasentPanel: { bottom, right },
			});
		}
		if (fittingCorner.leftAdjasentPanel.bottom > bottom) {
			topLeftCorners.push({
				top: bottom + GAP,
				left: fittingCorner.left,
				topAdjasentPanel: { bottom, right },
				leftAdjasentPanel: fittingCorner.leftAdjasentPanel,
			});
		}
		if (maxHeightPanel.bottom < bottom) {
			maxHeightPanel = { bottom, right };
		}
		panelPositions.push({ top, left, bottom, right });
		console.log(JSON.stringify(topLeftCorners, null, 2));
	}

	return (
		<Box ref={containerRef} position="relative" width="100%" height="100%">
			{panels.map((panel, i) => {
				const position = panelPositions[i];
				if (!position) {
					return null;
				}
				return (
					<Panel
						key={i}
						name={String(i)}
						width={panel.width}
						top={position.top}
						left={position.left}
						onElementResize={({ width, height }) => {
							setPanelSizes((panelSizes) => {
								const newPanelSizes = [...panelSizes];
								newPanelSizes[i] = { width, height };
								return newPanelSizes;
							});
						}}
					/>
				);
			})}
		</Box>
	);
};

export default Workspace;
