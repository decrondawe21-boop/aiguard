import animate from "tailwindcss-animate";

/** @type {import('tailwindcss').Config} */
export default {
  content: ["./app/**/*.{js,jsx,ts,tsx}", "./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        sans: ["var(--font-secondary)", "ui-sans-serif", "system-ui", "sans-serif"],
        mono: ["var(--font-code)", "ui-monospace", "SFMono-Regular", "monospace"],
      },
    },
  },
  plugins: [animate],
};
