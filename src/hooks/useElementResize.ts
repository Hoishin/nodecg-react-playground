import { useLayoutEffect, useRef, useState } from "react";

type ResizeObserverCallback = (entry: ResizeObserverEntry) => void;

const elementCallbacks = new Map<Element, Set<ResizeObserverCallback>>();

const observer = new ResizeObserver((entries) => {
	for (const entry of entries) {
		const callbacks = elementCallbacks.get(entry.target);
		if (callbacks) {
			for (const callback of callbacks) {
				callback(entry);
			}
		}
	}
});

const addCallback = (element: Element, callback: ResizeObserverCallback) => {
	observer.observe(element);
	const callbacks = elementCallbacks.get(element);
	if (callbacks) {
		callbacks.add(callback);
	} else {
		elementCallbacks.set(element, new Set([callback]));
	}

	return () => {
		const callbacks = elementCallbacks.get(element);
		if (callbacks) {
			callbacks.delete(callback);
			if (callbacks.size === 0) {
				observer.unobserve(element);
				elementCallbacks.delete(element);
			}
		}
	};
};

export const useElementResize = <T extends Element>() => {
	const ref = useRef<T>(null);
	const [size, setSize] = useState({ width: 0, height: 0 });

	useLayoutEffect(() => {
		if (!ref.current) {
			return;
		}
		const element = ref.current;
		const removeCallback = addCallback(element, (entry) => {
			setSize((position) => {
				const newWidth = entry.contentRect.width;
				const newHeight = entry.contentRect.height;
				if (position.width === newWidth && position.height === newHeight) {
					return position;
				}
				return { width: newWidth, height: newHeight };
			});
		});
		return () => {
			removeCallback();
		};
	}, []);

	return [ref, size] as const;
};
