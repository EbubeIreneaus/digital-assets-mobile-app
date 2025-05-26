/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./app/**/*.{js,jsx,ts,tsx}", "./components/**/*.{js,jsx,ts,tsx}"],
  presets: [require("nativewind/preset")],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        // Backgrounds
        // bgDark: '#121212',
        // dark: '#1E1E1E',

        // bgLight: '#ffffff',
        // light: '#f7f7f8',

        dark: "#0f172a", // Tailwind's slate-900
        bgDark: "#020617", // Tailwind's slate-950

        light: "#e2e8f0", // Tailwind's slate-200
        bgLight: "#cbd5e1",

        // Texts
        textLight: "#E0E0E0",
        textDark: "#1A1A1A",

        // Accent
        primary: "#002B7F",
      },
    },
  },
  plugins: [],
};
