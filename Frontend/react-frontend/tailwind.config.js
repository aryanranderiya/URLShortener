const { nextui } = require("@nextui-org/react");

/** @type {import('tailwindcss').Config} */
module.exports = {
  mode: "jit",

  content: [
    "./src/**/*.{html,js}",
    "./public/**/*.{html,js}",
    "./build/**/*.{html,js}",
    "./node_modules/@nextui-org/theme/dist/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: "class",
  plugins: [
    nextui({
      themes: {
        light: {
          colors: {
            primary: "#00bbff",
          },
        },
        dark: {
          colors: {
            primary: "#00bbff",
          },
        },
      },
    }),
  ],
};
