import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import CardHeader from "@mui/material/CardHeader";
import { FC, useEffect, useState } from "react";
import Draggable from "react-draggable";

import { useElementResize } from "../hooks/useElementResize";

interface Props {
	name: string;
	content: string;
	width: number;
	top: number;
	left: number;
	onElementResize: (size: { width: number; height: number }) => void;
	onDrag: (x: number, y: number) => void;
	onStartDrag: () => void;
	onStopDrag: () => void;
}

const Panel: FC<Props> = ({
	onElementResize,
	width,
	top,
	left,
	name,
	content,
	onDrag,
	onStartDrag,
	onStopDrag,
}) => {
	const [dragged, setDragged] = useState(false);
	const [containerRef, containerSize] = useElementResize<HTMLDivElement>();

	useEffect(() => {
		onElementResize(containerSize);
	}, [containerSize, onElementResize]);

	return (
		<Draggable
			position={{ x: left, y: top }}
			onStart={() => {
				setDragged(true);
				onStartDrag();
			}}
			onStop={() => {
				setDragged(false);
				onStopDrag();
			}}
			onDrag={(_, data) => onDrag(data.x, data.y)}
		>
			<Card
				ref={containerRef}
				raised
				sx={{
					position: "absolute",
					width,
					transitionProperty: dragged ? "none" : "top, left, transform",
					transitionDuration: "0.2s",
					transitionDelay: "0s",
					zIndex: dragged ? 100 : 0,
				}}
			>
				<CardHeader title={name} />
				<CardContent>{content}</CardContent>
			</Card>
		</Draggable>
	);
};

export default Panel;
