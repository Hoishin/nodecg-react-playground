import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import CardHeader from "@mui/material/CardHeader";
import { FC, useEffect } from "react";

import { useElementResize } from "../hooks/useElementResize";

interface Props {
	name: string;
	content: string;
	width: number;
	top: number;
	left: number;
	onElementResize: (position: { width: number; height: number }) => void;
}

const Panel: FC<Props> = (props) => {
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

export default Panel;
