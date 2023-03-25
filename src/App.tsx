import { FC } from "react";
import { CssBaseline, ThemeProvider, createTheme } from "@mui/material";

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
