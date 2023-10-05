/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./views/**/*.{html,ejs,js}"],
  theme: {
    extend: {
      colors: {
        dark: "#2f3237",
        primary: "#007bff",
        success: "#d4edda",
        danger: "#f8d7da",
      },
    },
  },
};
