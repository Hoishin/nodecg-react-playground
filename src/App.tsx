import CssBaseline from "@mui/material/CssBaseline";
import ThemeProvider from "@mui/material/styles/ThemeProvider";
import { FC, StrictMode } from "react";
import { RouterProvider } from "react-router-dom";

import { router } from "./router";
import { theme } from "./theme";

const App: FC = () => (
	<StrictMode>
		<ThemeProvider theme={theme}>
			<CssBaseline />
			<RouterProvider router={router} />
		</ThemeProvider>
	</StrictMode>
);

export default App;
