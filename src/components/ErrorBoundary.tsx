import { FC } from "react";
import { isRouteErrorResponse, useRouteError } from "react-router-dom";

const ErrorBoundary: FC = () => {
	const error = useRouteError();

	if (!isRouteErrorResponse(error)) {
		return <div>Something went wrong: {String(error)}</div>;
	}
	if (error.status === 404) {
		return <div>Not found</div>;
	}
	return <div>Something went wrong: {error.statusText}</div>;
};

export default ErrorBoundary;