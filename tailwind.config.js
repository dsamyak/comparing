/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        navy: 'var(--color-navy)',
        blue: 'var(--color-blue)',
        orange: 'var(--color-orange)',
        purple: 'var(--color-purple)',
        gold: 'var(--color-gold)',
        green: 'var(--color-green)',
      },
      fontFamily: {
        display: ['Fredoka One', 'cursive'],
        body: ['Nunito', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
