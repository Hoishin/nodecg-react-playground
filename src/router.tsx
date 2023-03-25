import { Visibility, VolumeUp, FileUpload } from "@mui/icons-material";
import { Navigate, createHashRouter } from "react-router-dom";
import Dashboard from "./components/Dashboard";
import ErrorBoundary from "./components/ErrorBoundary";
import Workspace from "./components/Workspace";

export const workspaces = [
	{
		name: "Stream Tech",
		route: "stream-tech",
		default: true,
		panels: ["aaa", "bbb", "ccc"],
	},
	{ name: "Audio Tech", route: "audio-tech", panels: ["aaa", "bbb", "ccc"] },
	{
		name: "Interview Studio",
		route: "interview-studio",
		panels: ["aaa", "bbb", "ccc"],
	},
	{ name: "Misc", route: "misc", panels: ["aaa", "bbb", "ccc"] },
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
				Component: () => {
					const defaultWorkspace = workspaces.find(
						(workspace) => workspace.default
					);
					return defaultWorkspace ? (
						<Navigate replace to={defaultWorkspace.route} />
					) : null;
				},
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
