import { FC, useState } from "react";
import {
	AppBar,
	Box,
	Drawer,
	Divider,
	IconButton,
	List,
	ListItem,
	ListItemButton,
	ListItemIcon,
	ListItemText,
	Tab,
	Tabs,
	Toolbar,
} from "@mui/material";
import { Menu, Close, Dashboard as DashboardIcon } from "@mui/icons-material";
import squareLogo from "../assets/square-logo.png";
import horizontalLogo from "../assets/horizontal-logo.png";
import { Link, Outlet, useLocation } from "react-router-dom";
import { theme } from "../App";
import { workspaces, pages } from "../router";

const Dashboard: FC = () => {
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
											<DashboardIcon />
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
			<Box
				component="main"
				flexGrow={1}
				sx={{ overflowX: "hidden", overflowY: "scroll" }}
			>
				<Outlet />
			</Box>
		</Box>
	);
};

export default Dashboard;
