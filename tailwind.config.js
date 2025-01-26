import daisyui from "daisyui";
import tailwindScrollbar from "tailwind-scrollbar";
import containerQueries from "@tailwindcss/container-queries";

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{html,js,ts,jsx,tsx}"],
  theme: {
    extend: {},
  },
  plugins: [daisyui, tailwindScrollbar, containerQueries],
  daisyui: {
    themes: ["cupcake"],
  },
};
