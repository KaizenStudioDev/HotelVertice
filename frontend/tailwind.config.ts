/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {
            colors: {
                gold: {
                    DEFAULT: '#D4AF37',
                    light: '#E5C667',
                    dark: '#B08D22',
                },
                primary: {
                    DEFAULT: '#1A1A2E',
                    light: '#2B2B4A',
                },
                dark: '#0A0A0A',
                gray: {
                    light: '#F3F3F5',
                    medium: '#ECEEF2',
                    DEFAULT: '#717182',
                },
                success: '#00A63E',
                successLight: '#DCFCE7',
                danger: '#D4183D',
            },
            fontFamily: {
                playfair: ['"Playfair Display"', 'serif'],
                inter: ['Inter', 'sans-serif'],
                mono: ['Consolas', 'monospace'],
            },
            boxShadow: {
                card: '0px 4px 6px -4px rgba(0, 0, 0, 0.10), 0px 10px 15px -3px rgba(0, 0, 0, 0.10)',
            }
        },
    },
    plugins: [],
}
