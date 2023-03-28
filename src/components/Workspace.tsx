import { throttle } from "@github/mini-throttle";
import Box from "@mui/material/Box";
import {
	FC,
	useCallback,
	useEffect,
	useMemo,
	useState,
} from "react";

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

	const calculatePanelPositions = useCallback(
		(panelSizes: Size[], containerWidth: number) => {
			const _panelPositions: PanelPosition[] = [];
			const _corners: Coordinate[] = [{ x: 0, y: 0 }];

			const addCorner = (x: number, y: number) => {
				const alreadyExists = _corners.some(
					(corner) => corner.x === x && corner.y === y
				);
				if (alreadyExists) {
					return;
				}
				if (containerWidth <= x) {
					return;
				}
				for (const position of _panelPositions) {
					const insidePanel =
						position.left - GAP < x &&
						x < position.right + GAP &&
						position.top - GAP < y &&
						y < position.bottom + GAP;
					if (insidePanel) {
						return;
					}
				}
				_corners.push({ x, y });
			};

			for (const size of panelSizes) {
				const fittingCorner = [..._corners]
					.sort((a, b) => {
						return a.y - b.y || a.x - b.x;
					})
					.find((corner) => {
						const tmpRight = corner.x + size.width;
						const tmpBottom = corner.y + size.height;
						if (containerWidth < tmpRight && corner.x !== 0) {
							return false;
						}
						const overlapsWithOtherPanel = _panelPositions.some(
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

				const rightPanels = _panelPositions
					.filter(
						(position) => right < position.right && position.bottom < bottom
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

				const belowPanels = _panelPositions
					.filter(
						(position) => bottom < position.bottom && position.right < right
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

				_panelPositions.push({ top, left, bottom, right });
			}

			setPanelPositions(_panelPositions);
			setCorners(_corners);
		},
		[]
	);

	const throttledCalculatePanelPositions = useMemo(
		() => throttle(calculatePanelPositions, 200),
		[calculatePanelPositions]
	);

	useEffect(() => {
		throttledCalculatePanelPositions(panelSizes, containerWidth);
	}, [panelSizes, containerWidth, throttledCalculatePanelPositions]);

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
