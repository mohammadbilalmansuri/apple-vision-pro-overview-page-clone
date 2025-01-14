/** @type {import('tailwindcss').Config} */
export default {
  content: ["./dist/**/*.{html,js}"],
  theme: {
    colors: {
      transparent: "transparent",
      current: "currentColor",
      black: "#000000",
      white: "#FFFFFF",
      secondaryBlack: "#1D1D1F",
      orange: "#FF5A00",
      blue: "#0071E3",
      gray: "#86868B",
      lightGray: "#F5F5F7",
      extraLightGray: "#FBFBFD",
    },
    screens: {
      xs: "480px",
      sm: "640px",
      md: "840px",
      lg: "1024px",
      xl: "1280px",
      "2xl": "1540px",
    },
    extend: {},
  },
  plugins: [],
};
