import Box from "@mui/material/Box";
import { FC, useState } from "react";

import { useElementResize } from "../hooks/useElementResize";

import Panel from "./Panel";

const GAP = 16;

interface Props {
	name: string;
	panels: Array<{ width: number; content: string; name: string }>;
}

interface Size {
	width: number;
	height: number;
}

interface PanelPosition {
	top: number;
	left: number;
	bottom: number;
	right: number;
}

interface Coordinate {
	x: number;
	y: number;
}

const Workspace: FC<Props> = (props) => {
	const [containerRef, { width: containerWidth }] = useElementResize();

	const [panelSizes, setPanelSizes] = useState<Size[]>([]);

	const panels = props.panels.map((panel) => ({
		...panel,
		width: 128 + 144 * (panel.width - 1),
	}));

	const panelPositions: PanelPosition[] = [];

	const topLeftCorners: Coordinate[] = [{ x: 0, y: 0 }];
	const addCorner = (x: number, y: number) => {
		const alreadyExists = topLeftCorners.some(
			(corner) => corner.x === x && corner.y === y
		);
		if (!alreadyExists) {
			topLeftCorners.push({ x, y });
		}
	};

	for (const size of panelSizes) {
		topLeftCorners.sort((a, b) => {
			if (a.y === b.y) {
				return a.x - b.x;
			}
			return a.y - b.y;
		});

		const fittingCorner = topLeftCorners.find((corner) => {
			const tmpRight = corner.x + size.width;
			const tmpBottom = corner.y + size.height;
			if (containerWidth < tmpRight) {
				return corner.x === 0;
			}
			const overlapsWithOtherPanel = panelPositions.some(
				(position) =>
					position.left - GAP < tmpRight &&
					corner.x < position.right + GAP &&
					position.top - GAP < tmpBottom &&
					corner.y < position.bottom + GAP
			);
			return !overlapsWithOtherPanel;
		});

		if (!fittingCorner) {
			continue;
		}

		const top = fittingCorner.y;
		const left = fittingCorner.x;
		const bottom = top + size.height;
		const right = left + size.width;

		const rightPanels = panelPositions
			.filter(
				(position) =>
					right + GAP < position.right && position.bottom < bottom + GAP
			)
			.sort((a, b) => b.bottom - a.bottom);
		let maxRight = Infinity;
		for (const rightPanel of rightPanels) {
			if (rightPanel.left < maxRight) {
				maxRight = rightPanel.left;
				addCorner(right + GAP, rightPanel.bottom + GAP);
			}
		}
		addCorner(right + GAP, 0);

		const belowPanels = panelPositions
			.filter(
				(position) =>
					bottom + GAP < position.bottom && position.right < right + GAP
			)
			.sort((a, b) => b.right - a.right);
		let maxBottom = Infinity;
		for (const belowPanel of belowPanels) {
			if (belowPanel.top < maxBottom) {
				maxBottom = belowPanel.top;
				addCorner(belowPanel.right + GAP, bottom + GAP);
			}
		}
		addCorner(0, bottom + GAP);

		panelPositions.push({ top, left, bottom, right });
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
				<Box
					key={i}
					position="absolute"
					top={corner.y}
					left={corner.x}
					width={16}
					height={16}
					borderTop="2px solid white"
					borderLeft="2px solid white"
				>
					{i}
				</Box>
			))}
		</Box>
	);
};

export default Workspace;
