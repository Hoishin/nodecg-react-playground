import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import CardHeader from "@mui/material/CardHeader";
import { FC, useEffect, useState } from "react";

import { useElementResize } from "../hooks/useElementResize";

interface PanelProps {
	name: string;
	content: string;
	width: number;
	top: number;
	left: number;
	onElementResize: (position: { width: number; height: number }) => void;
}

const Panel: FC<PanelProps> = (props) => {
	const [containerRef, containerSize] = useElementResize<HTMLDivElement>();

	useEffect(() => {
		props.onElementResize(containerSize);
	}, [containerSize]);

	return (
		<Card
			ref={containerRef}
			raised
			sx={{
				width: props.width,
				position: "absolute",
				top: props.top,
				left: props.left,
				transitionProperty: "top, left",
			}}
		>
			<CardHeader title={props.name} />
			<CardContent>{props.content}</CardContent>
		</Card>
	);
};

const GAP = 16;

interface Props {
	name: string;
	panels: Array<{ width: number; content: string; name: string }>;
}

const Workspace: FC<Props> = (props) => {
	const panels = props.panels.map((panel) => ({
		...panel,
		width: 128 + 144 * (panel.width - 1),
	}));

	const [panelSizes, setPanelSizes] = useState(() =>
		panels.map(() => ({ width: 0, height: 0 }))
	);

	const [containerRef, { width: containerWidth }] = useElementResize();

	const panelPositions: Array<{
		top: number;
		left: number;
		bottom: number;
		right: number;
	}> = [];

	const topLeftCorners: Array<{ top: number; left: number }> = [
		{ top: 0, left: 0 },
	];
	const panelsAreReady = panelSizes.some((panel) => panel.width !== 0);
	if (panelsAreReady) {
		for (const size of panelSizes) {
			topLeftCorners.sort((a, b) => {
				if (a.top === b.top) {
					return a.left - b.left;
				}
				return a.top - b.top;
			});
			const fittingCornerIndex = topLeftCorners.findIndex((corner) => {
				const tmpRight = corner.left + size.width;
				const tmpBottom = corner.top + size.height;
				if (containerWidth < tmpRight) {
					return corner.left === 0;
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
			const fittingCorner = topLeftCorners[fittingCornerIndex];

			if (fittingCornerIndex !== -1) {
				topLeftCorners.splice(fittingCornerIndex, 1);
			}

			if (!fittingCorner) {
				continue;
			}

			const top = fittingCorner.top;
			const left = fittingCorner.left;
			const bottom = top + size.height;
			const right = left + size.width;

			const rightPanels = panelPositions
				.filter(
					(position) =>
						right + GAP < position.right && position.bottom < bottom + GAP
				)
				.sort((a, b) => b.bottom - a.bottom);
			rightPanels.push({
				top: -Infinity,
				left: 0,
				bottom: -GAP,
				right: Infinity,
			});
			let maxRight = Infinity;
			for (const rightPanel of rightPanels) {
				if (rightPanel.left < maxRight) {
					maxRight = rightPanel.left;
					topLeftCorners.push({
						top: rightPanel.bottom + GAP,
						left: right + GAP,
					});
				}
			}
			const belowPanels = panelPositions
				.filter(
					(position) =>
						bottom + GAP < position.bottom && position.right < right + GAP
				)
				.sort((a, b) => b.right - a.right);
			belowPanels.push({
				top: 0,
				left: -Infinity,
				bottom: Infinity,
				right: -GAP,
			});
			let maxBottom = Infinity;
			for (const belowPanel of belowPanels) {
				if (belowPanel.top < maxBottom) {
					maxBottom = belowPanel.top;
					topLeftCorners.push({
						top: bottom + GAP,
						left: belowPanel.right + GAP,
					});
				}
			}
			panelPositions.push({ top, left, bottom, right });
		}
	}

	return (
		<Box ref={containerRef} position="relative" width="100%" height="100%">
			{panels.map((panel, i) => {
				const position = panelPositions[i];
				return (
					<Panel
						key={panel.name}
						name={panel.name}
						content={panel.content}
						width={panel.width}
						top={position?.top ?? 0}
						left={position?.left ?? 0}
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
			{topLeftCorners.map((corner, i) => (
				<Box key={i} position="absolute" top={corner.top} left={corner.left}>
					↖{i}
				</Box>
			))}
		</Box>
	);
};

export default Workspace;
