/** @type {import('tailwindcss').Config} */
export default {
  content: ["./dist/**/*.{html,js}"],
  darkMode: "class",
  theme: {
    colors: {
      transparent: "transparent",
      current: "currentColor",
      black: {
        DEFAULT: "#000000",
        2: "#1D1D1F",
      },
      white: "#FFFFFF",
      orange: "#FF5A00",
      blue: "#0071E3",
      gray: {
        DEFAULT: "#86868B",
        2: "#F5F5F7",
        3: "#FBFBFD",
      },
    },
    screens: {
      xs: "480px",
      sm: "640px",
      md: "840px",
      lg: "1040px",
      xl: "1240px",
      "2xl": "1440px",
    },
    extend: {
      fontFamily: {
        display: ['"SF Pro Display"', '"SF Pro Text"', "sans-serif"],
        text: ['"SF Pro Text"', '"SF Pro Display"', "sans-serif"],
      },
    },
  },
  plugins: [],
};
