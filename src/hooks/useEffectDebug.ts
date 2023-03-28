import { useEffect, useRef } from "react";

const usePrevious = <T>(value: T, initialValue: T) => {
	const ref = useRef(initialValue);
	useEffect(() => {
		ref.current = value;
	});
	return ref.current;
};

export const useEffectDebug = (
	effect: React.EffectCallback,
	deps: React.DependencyList
) => {
	const prevDeps = usePrevious(deps, []);

	useEffect(() => {
		const changedDeps = deps
			.filter((dep, i) => !Object.is(dep, prevDeps[i]))
			.map((dep) => {
				const index = deps.indexOf(dep);
				const previous = prevDeps[index];
				const current = dep;
				return {
					index,
					previous: previous,
					current: current,
				};
			});
		console.log(...changedDeps);
		effect();
	}, [...deps]); // eslint-disable-line react-hooks/exhaustive-deps
};
