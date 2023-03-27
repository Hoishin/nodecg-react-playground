import FileUpload from "@mui/icons-material/FileUpload";
import Visibility from "@mui/icons-material/Visibility";
import VolumeUp from "@mui/icons-material/VolumeUp";
import { loremIpsum } from "lorem-ipsum";
import { Navigate, createHashRouter } from "react-router-dom";

import Dashboard from "./components/Dashboard";
import ErrorBoundary from "./components/ErrorBoundary";
import Workspace from "./components/Workspace";

const randomInt = (max: number) => {
	return Math.ceil(Math.random() * max);
};

const createSamplePanels = (id: string) =>
	Array.from({ length: 10 }).map((_, i) => ({
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
	{ name: "Graphics", route: "graphics", icon: <Visibility /> },
	{ name: "Audio", route: "audio", icon: <VolumeUp /> },
	{ name: "Upload", route: "upload", icon: <FileUpload /> },
];

export const router = createHashRouter([
	{
		path: "/",
		element: <Dashboard />,
		errorElement: <ErrorBoundary />,
		children: [
			{
				path: "/",
				element: <Navigate replace to={workspaces[0]!.route} />,
			},
			...workspaces.map((workspace) => ({
				path: workspace.route,
				element: <Workspace name={workspace.name} panels={workspace.panels} />,
			})),
			...pages.map((page) => ({
				path: page.route,
				element: <div>{page.name}</div>,
			})),
		],
	},
]);
