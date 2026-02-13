/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {
            colors: {
                primary: '#7B2D26', // Deep Maroon
                secondary: '#5C4033', // Rich Brown
                'primary-hover': '#9C3F35', // Lighter Maroon
                'primary-active': '#4A2F27', // Dark Brown
                'background-light': '#FFF9F5', // Soft Warm White/Beige for background
                accent: '#212121', // Dark Text
            }
        },
    },
    plugins: [],
}
