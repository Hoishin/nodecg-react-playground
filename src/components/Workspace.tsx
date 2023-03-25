import { FC, useState } from "react";
import { Box, Card, CardContent, CardHeader } from "@mui/material";
import Draggable from "react-draggable";
import { loremIpsum } from "lorem-ipsum";

interface Props {
	name: string;
	panels: string[];
}

const SAMPLE_PANELS = [
	{ width: 2 },
	{ width: 3 },
	{ width: 5 },
	{ width: 2 },
	{ width: 3 },
	{ width: 2 },
	{ width: 6 },
];

const calcPanelWidth = (n: number) => 144 * n;

const randomInt = (max: number) => {
	return Math.floor(Math.random() * max);
};

interface PanelProps {
	width: number;
}

const Panel: FC<PanelProps> = (props) => {
	const [contentLorem] = useState(loremIpsum({ count: randomInt(5) }));

	return (
		<Draggable bounds="parent">
			<Card
				raised
				sx={{
					width: calcPanelWidth(props.width),
				}}
			>
				<CardHeader title="THIS IS PANEL" />
				<CardContent>{contentLorem}</CardContent>
			</Card>
		</Draggable>
	);
};

const Workspace: FC<Props> = () => {
	return (
		<Box
			display="flex"
			gap={2}
			padding={4}
			flexDirection="row"
			flexWrap="wrap"
			alignItems="flex-start"
		>
			{SAMPLE_PANELS.map((panel, i) => (
				<Panel key={i} {...panel} />
			))}
		</Box>
	);
};

export default Workspace;
