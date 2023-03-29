import FileUpload from "@mui/icons-material/FileUpload";
import Visibility from "@mui/icons-material/Visibility";
import VolumeUp from "@mui/icons-material/VolumeUp";
import { loremIpsum } from "lorem-ipsum";

import { randomInt } from "./randomInt";

const createSamplePanels = (id: string) =>
	Array.from({ length: 8 }).map((_, i) => ({
		name: `${id} ${i}`,
		width: randomInt(5),
		content: loremIpsum({ count: randomInt(5) }),
	}));

export const workspaces = [
	{
		name: "Stream Tech",
		route: "stream-tech",
		default: true,
		panels: createSamplePanels("Stream Tech"),
	},
	{
		name: "Audio Tech",
		route: "audio-tech",
		panels: createSamplePanels("Audio Tech"),
	},
	{
		name: "Interview Studio",
		route: "interview-studio",
		panels: createSamplePanels("Interview"),
	},
	{ name: "Misc", route: "misc", panels: createSamplePanels("Misc") },
];

export const pages = [
	{ name: "Graphics", route: "graphics", Icon: Visibility },
	{ name: "Audio", route: "audio", Icon: VolumeUp },
	{ name: "Upload", route: "upload", Icon: FileUpload },
];
