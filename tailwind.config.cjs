/** @type {import('tailwindcss').Config} */
module.exports = {
	content: ['./index.html', './src/**/*.{vue,js,ts,jsx,tsx}'],
	theme: {
		extend: {
			fontFamily: {
				sans: ['Trebuchet MS', 'Segoe UI', 'Helvetica', 'ui-sans-serif']
			}
		}
	},
	plugins: []
};
