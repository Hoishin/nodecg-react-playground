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
}

const Panel: FC<Props> = ({
	onElementResize,
	width,
	top,
	left,
	name,
	content,
	onDrag,
}) => {
	const [focused, setFocused] = useState(false);
	const [containerRef, containerSize] = useElementResize<HTMLDivElement>();

	useEffect(() => {
		onElementResize(containerSize);
	}, [containerSize, onElementResize]);

	return (
		<Draggable
			onStart={() => setFocused(true)}
			onStop={() => setFocused(false)}
			onDrag={(_, data) => {
				onDrag(left + data.x, top + data.y);
			}}
		>
			<Card
				ref={containerRef}
				raised
				sx={{
					position: "absolute",
					width,
					top,
					left,
					transitionProperty: "top, left",
					transitionDuration: "0.2s",
					zIndex: focused ? 100 : 0,
					backgroundColor: focused ? "primary.main" : "background.paper",
				}}
			>
				<CardHeader title={name} />
				<CardContent>{content}</CardContent>
			</Card>
		</Draggable>
	);
};

export default Panel;
