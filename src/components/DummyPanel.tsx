import { FC } from "react";

interface Props {
	top: number;
	left: number;
	width: number;
	height: number;
}

const DummyPanel: FC<Props> = ({top, left, width, height}) => {
	return (
		<div
			style={{
				position: "absolute",
				top,
				left,
				width,
				height,
				backgroundColor: 'cyan'
			}}
		/>
	);
};

export default DummyPanel