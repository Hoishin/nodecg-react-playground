import "@fontsource/roboto/300.css";
import "@fontsource/roboto/400.css";
import "@fontsource/roboto/500.css";
import "@fontsource/roboto/700.css";
import './styles/index.css'

import ReactDOM from "react-dom/client";

import App from "./components/App";

const rootElement = document.getElementById("root");
if (rootElement instanceof Element) {
	ReactDOM.createRoot(rootElement).render(<App />);
}
