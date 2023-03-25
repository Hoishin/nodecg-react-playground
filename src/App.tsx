import { FC, useState } from "react";
import {
	AppBar,
	Toolbar,
	IconButton,
	Drawer,
	CssBaseline,
	ThemeProvider,
	createTheme,
	Divider,
	List,
	ListItem,
	ListItemButton,
	ListItemIcon,
	ListItemText,
	Tabs,
	Tab,
	Box,
} from "@mui/material";
import {
	Menu,
	Close,
	Dashboard,
	Visibility,
	VolumeUp,
	FileUpload,
} from "@mui/icons-material";
import ErrorBoundary from "./ErrorBoundary";

import squareLogo from "./assets/square-logo.png";
import horizontalLogo from "./assets/horizontal-logo.png";
import {
	createBrowserRouter,
	Link,
	Navigate,
	Outlet,
	RouterProvider,
	useLocation,
} from "react-router-dom";

const workspaces = [
	{ name: "Stream Tech", route: "stream-tech" },
	{ name: "Audio Tech", route: "audio-tech" },
	{ name: "Interview Studio", route: "interview-studio" },
	{ name: "Misc", route: "misc" },
];

const pages = [
	{ name: "Graphics", route: "graphics", icon: <Visibility /> },
	{ name: "Audio", route: "audio", icon: <VolumeUp /> },
	{ name: "Upload", route: "upload", icon: <FileUpload /> },
];

const theme = createTheme({ palette: { mode: "dark" } });

const NcgDashboard: FC = () => {
	const [drawerOpened, setDrawerOpened] = useState(false);
	const location = useLocation();

	return (
		<Box
			sx={{
				display: "flex",
				flexDirection: "column",
				height: "100vh",
				width: "100vw",
			}}
		>
			<AppBar component="nav" position="static">
				<Toolbar
					sx={{
						".MuiTabs-indicator": { height: 4 },
					}}
				>
					<IconButton
						sx={{ display: { sm: "none" }, marginRight: 1 }}
						color="inherit"
						onClick={() => setDrawerOpened(true)}
					>
						<Menu />
					</IconButton>
					<Box
						component="img"
						src={squareLogo}
						sx={{ height: 48, marginRight: 1 }}
						alt="NodeCG Icon"
					/>
					<Tabs
						variant="scrollable"
						sx={{
							[theme.breakpoints.down("sm")]: { display: "none" },
							alignSelf: "stretch",
							flexGrow: 1,
							".MuiTabs-scroller": { height: "100%" },
							".MuiTabs-flexContainer": { height: "100%" },
						}}
						value={location.pathname}
					>
						{workspaces.map((workspace) => (
							<Tab
								key={workspace.name}
								component={Link}
								sx={{ fontSize: 16 }}
								label={workspace.name}
								to={`/${workspace.route}`}
								value={`/${workspace.route}`}
							/>
						))}
						{pages.map((page, index) => (
							<Tab
								key={page.name}
								component={Link}
								sx={{
									marginLeft: index === 0 ? "auto" : 0,
									fontSize: 12,
									".MuiTab-iconWrapper": { margin: 0 },
								}}
								icon={page.icon}
								label={page.name}
								to={`/${page.route}`}
								value={`/${page.route}`}
							/>
						))}
					</Tabs>
				</Toolbar>
			</AppBar>
			<Box component="nav">
				<Drawer open={drawerOpened} onClose={() => setDrawerOpened(false)}>
					<Box width={256}>
						<Box display="flex">
							<IconButton
								sx={{ margin: 1 }}
								onClick={() => setDrawerOpened(false)}
							>
								<Close />
							</IconButton>
							<Box
								component="img"
								src={horizontalLogo}
								sx={{ height: 28, alignSelf: "center" }}
								alt="NodeCG Icon"
							/>
						</Box>
						<Divider />
						<List>
							{workspaces.map((workspace) => (
								<ListItem key={workspace.name} disablePadding>
									<ListItemButton
										component={Link}
										to={`/${workspace.route}`}
										onClick={() => setDrawerOpened(false)}
									>
										<ListItemIcon>
											<Dashboard />
										</ListItemIcon>
										<ListItemText primary={workspace.name} />
									</ListItemButton>
								</ListItem>
							))}
							<Divider />
							{pages.map((page) => (
								<ListItem key={page.name} disablePadding>
									<ListItemButton
										component={Link}
										to={`/${page.route}`}
										onClick={() => setDrawerOpened(false)}
									>
										<ListItemIcon>{page.icon}</ListItemIcon>
										<ListItemText primary={page.name} />
									</ListItemButton>
								</ListItem>
							))}
						</List>
					</Box>
				</Drawer>
			</Box>
			<Box component="main">
				<Outlet />
			</Box>
		</Box>
	);
};

const router = createBrowserRouter(
	[
		{
			path: "/",
			element: <NcgDashboard />,
			errorElement: <ErrorBoundary />,
			children: [
				{
					path: "/",
					Component: () => {
						if (workspaces[0]) {
							return <Navigate replace to={workspaces[0].route} />;
						} else {
							return null;
						}
					},
				},
				...workspaces.map((workspace) => ({
					path: workspace.route,
					element: <div>{workspace.name}</div>,
				})),
				...pages.map((page) => ({
					path: page.route,
					element: <div>{page.name}</div>,
				})),
			],
		},
	],
	{ basename: import.meta.env.BASE_URL }
);

const App: FC = () => (
	<ThemeProvider theme={theme}>
		<CssBaseline />
		<RouterProvider router={router} />
	</ThemeProvider>
);

export default App;
