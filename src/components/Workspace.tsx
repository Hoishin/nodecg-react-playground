import Box from "@mui/material/Box";
import { FC, useEffect, useState } from "react";

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

	const [panelPositions, setPanelPositions] = useState<PanelPosition[]>([]);
	const [corners, setCorners] = useState<Coordinate[]>([]);

	const [panels, setPanels] = useState(props.panels);

	useEffect(() => {
		setPanels(props.panels);
	}, [props.panels]);

	useEffect(() => {
		if (containerWidth === 0 || panelSizes.length === 0) {
			return;
		}

		const _panelPositions: PanelPosition[] = [];
		const _corners: Coordinate[] = [{x: 0, y: 0}];

		const addCorner = (x: number, y: number) => {
			_corners.push({ x, y });
		};

		for (const [i, size] of panelSizes.entries()) {
			let fittingCorner: Coordinate | undefined;
			for (const corner of _corners) {
				const tmpRight = corner.x + size.width;
				if (containerWidth < tmpRight && corner.x !== 0) {
					continue;
				}
				const tmpBottom = corner.y + size.height;
				const overlapsWithOtherPanel = _panelPositions.some(
					(position) =>
						position.left - GAP < tmpRight &&
						corner.x < position.right + GAP &&
						position.top - GAP < tmpBottom &&
						corner.y < position.bottom + GAP
				);
				if (overlapsWithOtherPanel) {
					continue;
				}
				if (
					!fittingCorner ||
					corner.y < fittingCorner.y ||
					(corner.y === fittingCorner.y && corner.x < fittingCorner.x)
				) {
					fittingCorner = corner;
				}
			}

			if (!fittingCorner) {
				continue;
			}

			const top = fittingCorner.y;
			const left = fittingCorner.x;
			const bottom = top + size.height;
			const right = left + size.width;

			const rightPanels = _panelPositions.filter(
				(position) => right < position.right && position.bottom < bottom
			);
			rightPanels.sort((a, b) => b.bottom - a.bottom);
			rightPanels.push({
				top: -GAP,
				bottom: -GAP,
				left: 0,
				right: containerWidth,
			});
			let maxX = containerWidth;
			for (const rightPanel of rightPanels) {
				if (rightPanel.left < maxX) {
					maxX = rightPanel.left;
					addCorner(right + GAP, rightPanel.bottom + GAP);
					if (rightPanel.left - GAP <= right) {
						break;
					}
				}
			}

			const belowPanels = _panelPositions.filter(
				(position) => bottom < position.bottom && position.right < right
			);
			belowPanels.sort((a, b) => b.right - a.right);
			belowPanels.push({ top: 0, bottom: Infinity, left: -GAP, right: -GAP });
			let maxY = Infinity;
			for (const belowPanel of belowPanels) {
				if (belowPanel.top < maxY) {
					maxY = belowPanel.top;
					addCorner(belowPanel.right + GAP, bottom + GAP);
					if (belowPanel.top - GAP <= bottom) {
						break;
					}
				}
			}

			_panelPositions[i] = { top, left, bottom, right };
		}

		setPanelPositions(_panelPositions);
		setCorners(_corners);
	}, [panelSizes, containerWidth]);

	return (
		<Box ref={containerRef} position="relative" width="100%" height="100%">
			{panels.map((panel, i) => {
				const position = panelPositions[i];
				return (
					<Panel
						key={panel.name}
						name={panel.name}
						content={panel.content}
						width={128 + 144 * (panel.width - 1)}
						top={position?.top ?? 0}
						left={position?.left ?? 0}
						onDrag={(x, y) => {
							console.log(x, y);
						}}
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
