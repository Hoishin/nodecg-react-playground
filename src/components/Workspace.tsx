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

interface Corner {
	x: number;
	y: number;
	topAdjacent: PanelPosition | null;
	leftAdjacent: PanelPosition | null;
}

const checkPanelOverlap = (panel1: PanelPosition, panel2: PanelPosition) => {
	return (
		panel1.left - GAP < panel2.right &&
		panel2.left < panel1.right + GAP &&
		panel1.top - GAP < panel2.bottom &&
		panel2.top < panel1.bottom + GAP
	);
};

class CornerStore {
	readonly corners: Corner[] = [
		{ x: 0, y: 0, topAdjacent: null, leftAdjacent: null },
	];

	add(newCorner: Corner) {
		const existingCorner = this.corners.find(
			(corner) => corner.x === newCorner.x && corner.y === newCorner.y
		);
		if (!existingCorner) {
			this.corners.push(newCorner);
			return;
		}
		// Check if the new corner has a closer top adjacent
		if (
			existingCorner.topAdjacent &&
			newCorner.topAdjacent &&
			newCorner.topAdjacent.left < existingCorner.topAdjacent.left
		) {
			existingCorner.topAdjacent = newCorner.topAdjacent;
		}
		// Check if the new corner has a closer left adjacent
		if (
			existingCorner.leftAdjacent &&
			newCorner.leftAdjacent &&
			newCorner.leftAdjacent.top < existingCorner.leftAdjacent.top
		) {
			existingCorner.leftAdjacent = newCorner.leftAdjacent;
		}
	}
}

const Workspace: FC<Props> = ({ panels }) => {
	const [containerRef, { width: containerWidth, height: containerHeight }] =
		useElementResize();
	const [panelSizes, setPanelSizes] = useState<Size[]>(() => []);
	const [panelPositions, setPanelPositions] = useState<PanelPosition[]>(() =>
		panels.map(() => ({ top: 0, left: 0, bottom: 0, right: 0 }))
	);

	const [draggedPanel, setDraggedPanel] = useState<{
		index: number;
		top: number;
		left: number;
	}>();

	const [positionOrder, setPositionOrder] = useState(() =>
		panels.map((_, i) => i)
	);

	const [corners, setCorners] = useState<Corner[]>([]);

	useEffect(() => {
		setPositionOrder((positionOrder) => {
			const newOrder = panelPositions
				.map((panelPosition, i) => {
					if (i === draggedPanel?.index) {
						console.log(draggedPanel);
						return {
							index: i,
							left: draggedPanel.left,
							top: draggedPanel.top,
							right:
								draggedPanel.left + panelPosition.right - panelPosition.left,
							bottom:
								draggedPanel.top + panelPosition.bottom - panelPosition.top,
						};
					}
					return { ...panelPosition, index: i };
				})
				.sort((a, b) => {
					return a.top - b.top || a.left - b.left;
				})
				.map((position) => position.index);
			const isSameOrder = positionOrder.every((index, i) => index === i);
			return isSameOrder ? positionOrder : newOrder;
		});
	}, [draggedPanel, panelPositions]);

	useEffect(() => {
		if (containerWidth === 0 || panelSizes.length === 0) {
			return;
		}
		if (panelSizes.every((size) => size.width === 0)) {
			return;
		}

		setPanelPositions((panelPositions) => {
			const _panelPositions: PanelPosition[] = [];
			const cornerStore = new CornerStore();

			for (const i of positionOrder) {
				const size = panelSizes[i];
				const oldPosition = panelPositions[i];
				if (!size || !oldPosition) {
					throw new Error("literally impossible");
				}

				let fittingCorner: Corner | undefined;

				for (const corner of cornerStore.corners) {
					const left = corner.x;
					const top = corner.y;
					const right = corner.x + size.width;
					const bottom = corner.y + size.height;
					// Check if the panel is outside the container unless it's on the first column
					if (containerWidth < right && corner.x !== 0) {
						continue;
					}
					// Check if the panel overlaps with another
					const overlapsWithOtherPanel = _panelPositions.some((position) =>
						checkPanelOverlap(position, { left, top, right, bottom })
					);
					if (overlapsWithOtherPanel) {
						continue;
					}
					if (!fittingCorner) {
						fittingCorner = corner;
						continue;
					}
					const containerRatio = containerWidth / containerHeight;
					const distance = Math.sqrt(
						(oldPosition.left - left) ** 2 +
							((oldPosition.top - top) * containerRatio) ** 2
					);
					const distanceToFittingCorner = Math.sqrt(
						(oldPosition.left - fittingCorner.x) ** 2 +
							((oldPosition.top - fittingCorner.y) * containerRatio) ** 2
					);
					if (distance < distanceToFittingCorner) {
						if (
							corner.y < fittingCorner.y ||
							(corner.y === fittingCorner.y && corner.x < fittingCorner.x)
						) {
							fittingCorner = corner;
							continue;
						}
					}
				}

				if (!fittingCorner) {
					throw new Error("literally impossible");
				}

				const top = fittingCorner.y;
				const left = fittingCorner.x;
				const bottom = top + size.height;
				const right = left + size.width;

				const newPosition = { top, left, bottom, right };

				// Add new corner this panel creates on the right
				const rightPanels = _panelPositions
					.filter(
						(position) => right < position.right && position.bottom < bottom
					)
					.sort((a, b) => b.bottom - a.bottom);
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
						cornerStore.add({
							x: right + GAP,
							y: rightPanel.bottom + GAP,
							topAdjacent: rightPanel.bottom > 0 ? rightPanel : null,
							leftAdjacent: newPosition,
						});
						if (rightPanel.left - GAP <= right) {
							break;
						}
					}
				}

				// Add new corner this panel creates on the bottom
				const belowPanels = _panelPositions
					.filter(
						(position) => bottom < position.bottom && position.right < right
					)
					.sort((a, b) => b.right - a.right);
				belowPanels.push({ top: 0, bottom: Infinity, left: -GAP, right: -GAP });
				let maxY = Infinity;
				for (const belowPanel of belowPanels) {
					if (belowPanel.top < maxY) {
						maxY = belowPanel.top;
						cornerStore.add({
							x: belowPanel.right + GAP,
							y: bottom + GAP,
							topAdjacent: newPosition,
							leftAdjacent: belowPanel.right > 0 ? belowPanel : null,
						});
						if (belowPanel.top - GAP <= bottom) {
							break;
						}
					}
				}

				_panelPositions[i] = newPosition;
			}

			setCorners(cornerStore.corners);
			return _panelPositions;
		});
	}, [panelSizes, containerWidth, containerHeight, positionOrder]);

	return (
		<Box ref={containerRef} position="relative" width="100%" height="100%">
			{panels.map((panel, i) => {
				const position = panelPositions[i];
				const size = panelSizes[i];
				return (
					<Panel
						key={panel.name}
						name={panel.name}
						content={panel.content}
						width={128 + 144 * (panel.width - 1)}
						left={
							i === draggedPanel?.index
								? draggedPanel.left
								: position?.left ?? 0
						}
						top={
							i === draggedPanel?.index ? draggedPanel.top : position?.top ?? 0
						}
						onStartDrag={() => {
							if (position) {
								setDraggedPanel({
									index: i,
									left: position.left,
									top: position.top,
								});
							}
						}}
						onStopDrag={() => setDraggedPanel(undefined)}
						onDrag={(x: number, y: number) => {
							setDraggedPanel((draggedPanel) => {
								if (draggedPanel?.index !== i) {
									return undefined;
								}
								if (draggedPanel.left === x && draggedPanel.top === y) {
									return draggedPanel;
								}
								return { index: i, left: x, top: y };
							});
						}}
						onElementResize={({ width, height }) => {
							setPanelSizes((panelSizes) => {
								if (width === size?.width && height === size?.height) {
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
