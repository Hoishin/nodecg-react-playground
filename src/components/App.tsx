import CssBaseline from "@mui/material/CssBaseline";
import ThemeProvider from "@mui/material/styles/ThemeProvider";
import { FC, StrictMode } from "react";
import { RouterProvider } from "react-router-dom";
import { Navigate, createHashRouter } from "react-router-dom";


import Dashboard from "../components/Dashboard";
import ErrorBoundary from "../components/ErrorBoundary";
import Workspace from "../components/Workspace";
import { theme } from "../theme";
import { workspaces, pages } from "../utils/sample";

const router = createHashRouter([
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

const App: FC = () => (
	<StrictMode>
		<ThemeProvider theme={theme}>
			<CssBaseline />
			<RouterProvider router={router} />
		</ThemeProvider>
	</StrictMode>
);

export default App;
