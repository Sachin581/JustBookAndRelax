/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {
            colors: {
                primary: '#FFF9C4', // Light Yellow
                'primary-light': '#FFFFF7', // Lighter Yellow
                'primary-dark': '#FBC02D', // Darker Yellow for accents/buttons
                secondary: '#FFFFFF', // White
                accent: '#212121', // Dark Gray/Black for text
            }
        },
    },
    plugins: [],
}
