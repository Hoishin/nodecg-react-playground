import { FC } from "react";
import CssBaseline from "@mui/material/CssBaseline";
import ThemeProvider from "@mui/material/styles/ThemeProvider";
import createTheme from "@mui/material/styles/createTheme";

import { RouterProvider } from "react-router-dom";
import { router } from "./router";

export const theme = createTheme({ palette: { mode: "dark" } });

const App: FC = () => (
	<ThemeProvider theme={theme}>
		<CssBaseline />
		<RouterProvider router={router} />
	</ThemeProvider>
);

export default App;
