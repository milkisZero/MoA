/** @type {import('tailwindcss').Config} */
module.exports = {
    content: [
        './src/**/*.{js,ts,jsx,tsx}',
        // './pages/**/*.{js,ts,jsx,tsx,mdx}',
        // './components/**/*.{js,ts,jsx,tsx,mdx}',
        // './app/**/*.{js,ts,jsx,tsx,mdx}',
    ],
    theme: {
        extend: {
            keyframes: {
                dropdown: {
                    '0%': { opacity: '0', transform: 'scale(0.9)' },
                    '100%': { opacity: '1', transform: 'scale(1)' },
                },
            },
            animation: {
                dropdown: 'dropdown 0.1s ease',
            },
            colors: {
                primary: {
                    300: '#08995C',
                    200: '#0ABE7D',
                    100: '#CFF4D2',
                    50: '#F5FFF6',
                },
                grey: {
                    800: '#1B1D1F',
                    700: '#26282B',
                    600: '#474C51',
                    500: '#74787D',
                    400: '#A0A4A8',
                    300: '#CBCDD2',
                    200: '#E9EBED',
                    100: '#F7F8F9',
                },
            },
            fontSize: {
                h1PC: ['32px', { lineHeight: '40px', fontWeight: 'bold' }],
                h2PC: ['26px', { lineHeight: '34px', fontWeight: 'bold' }],
                h3PC: ['22px', { lineHeight: '30px', fontWeight: 'bold' }],
                b1PC: ['18px', { lineHeight: '26px', fontWeight: 'normal' }],
            },
            screens: {
                sm: '640px',
                md: '768px',
                lg: '1024px',
                xl: '1280px',
            },
        },
    },
    plugins: [require('tailwind-scrollbar-hide')],
};
