module.exports = {
	root: true,
	parser: "@typescript-eslint/parser",
	plugins: ["react-refresh", "import"],
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
