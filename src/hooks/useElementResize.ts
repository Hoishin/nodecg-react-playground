import { useEffect, useRef, useState } from "react";

export const useElementResize = <T extends Element>() => {
	const ref = useRef<T>(null);
	const [size, setSize] = useState({ width: 0, height: 0 });

	useEffect(() => {
		if (!ref.current) {
			return;
		}
		const element = ref.current;
		const observer = new ResizeObserver((entries) => {
			const entry = entries[0];
			if (!entry) {
				return;
			}
			setSize((position) => {
				const newWidth = entry.contentRect.width;
				const newHeight = entry.contentRect.height;
				if (position.width === newWidth && position.height === newHeight) {
					return position;
				}
				return { width: newWidth, height: newHeight };
			});
		});
		observer.observe(element);
		return () => {
			observer.disconnect();
		};
	}, []);

	return [ref, size] as const;
};
