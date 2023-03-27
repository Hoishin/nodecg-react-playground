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

const calcPositions = (panelSizes: Size[], containerWidth: number) => {
	const panelPositions: PanelPosition[] = [];

	const corners = [{ x: 0, y: 0 }];
	const addCorner = (x: number, y: number) => {
		const alreadyExists = corners.some(
			(corner) => corner.x === x && corner.y === y
		);
		if (alreadyExists) {
			return;
		}

		// If the new corner is inside an existing panel, don't add the corner
		for (const position of panelPositions) {
			const insidePanel =
				position.left - GAP < x &&
				x < position.right + GAP &&
				position.top - GAP < y &&
				y < position.bottom + GAP;
			if (insidePanel) {
				return;
			}
		}

		corners.push({ x, y });

		corners.sort((a, b) => {
			return a.y - b.y || a.x - b.x;
		});
	};

	for (const size of panelSizes) {
		const fittingCorner = corners.find((corner) => {
			const tmpRight = corner.x + size.width;
			const tmpBottom = corner.y + size.height;
			if (containerWidth < tmpRight && corner.x !== 0) {
				return false;
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
		let maxX = Infinity;
		for (const rightPanel of rightPanels) {
			if (rightPanel.left < maxX) {
				maxX = rightPanel.left;
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
		let maxY = Infinity;
		for (const belowPanel of belowPanels) {
			if (belowPanel.top < maxY) {
				maxY = belowPanel.top;
				addCorner(belowPanel.right + GAP, bottom + GAP);
			}
		}
		addCorner(0, bottom + GAP);

		panelPositions.push({ top, left, bottom, right });
	}
	return { panelPositions, corners };
};

const Workspace: FC<Props> = (props) => {
	const [containerRef, { width: containerWidth }] = useElementResize();
	const [panelSizes, setPanelSizes] = useState<Size[]>([]);

	const { panelPositions, corners } = calcPositions(panelSizes, containerWidth);

	return (
		<Box ref={containerRef} position="relative" width="100%" height="100%">
			{props.panels.map((panel, i) => {
				const position = panelPositions[i];
				return (
					<Panel
						key={panel.name}
						name={panel.name}
						content={panel.content}
						width={128 + 144 * (panel.width - 1)}
						top={position?.top ?? 0}
						left={position?.left ?? 0}
						onElementResize={({ width, height }) => {
							if (width === 0 || height === 0) {
								return;
							}
							setPanelSizes((panelSizes) => {
								if (
									width === panelSizes[i]?.width &&
									height === panelSizes[i]?.height
								) {
									return panelSizes;
								}
								const newPanelSizes = [...panelSizes];
								newPanelSizes[i] = { width, height };
								return newPanelSizes;
							});
						}}
					/>
				);
			})}
			{corners.map((corner, i) => (
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
