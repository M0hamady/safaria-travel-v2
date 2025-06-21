
module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        en: ["Montserrat", "sans-serif"],
        ar: ["Cairo", "sans-serif"], // or any Arabic-friendly font
      },
      colors: {
        primary: "#11A4FF",
        primary_dark: "#737373",
        secondary: "#e07354",
        boarder: "#E8ECF2",
        dark: "#0A162A",
        white: "#FFFFFF",
        black: "#1E1E1E",
        light: "#FCF1EE",
      },
      gridTemplateColumns: {
        24: "repeat(24, minmax(0, 1fr))",
      },
    },
  },
  plugins: [],
};