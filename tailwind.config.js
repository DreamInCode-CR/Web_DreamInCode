/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        bg: "#0A0F1F",
        card: "#1B2332",
        primary: "#1ED4CB",
        accent: "#C9822A"
      },
      fontFamily: {
        sans: ["Poppins", "ui-sans-serif", "system-ui"]
      },
      boxShadow: {
        'soft': '0 10px 25px rgba(0,0,0,0.25)',
        'soft-lg': '0 20px 40px rgba(0,0,0,0.35)'
      },
      borderRadius: {
        'xl2': '1.25rem'
      }
    },
  },
  plugins: [],
};
