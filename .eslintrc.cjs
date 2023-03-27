module.exports = {
	root: true,
	parser: "@typescript-eslint/parser",
	plugins: ["react-refresh", "import"],
	extends: ["plugin:react-hooks/recommended"],
	rules: {
		"react-refresh/only-export-components": "error",
		"import/order": [
			"error",
			{
				"newlines-between": "always",
				alphabetize: { order: "asc" },
			},
		],
	},
};
