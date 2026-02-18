/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{ts,tsx,js,jsx}",
    "./app/**/*.{ts,tsx,js,jsx}",
  ],
  theme: {
    extend: {
      colors: {
        pm: {
          blue: "hsl(210 100% 8%)",
          yellow: "#f1c40f",
        },
        primary: "hsl(var(--primary) / <alpha-value>)",
        foreground: "hsl(var(--foreground) / <alpha-value>)",
        background: "hsl(var(--background) / <alpha-value>)",
        card: "hsl(var(--card) / <alpha-value>)",
      },
      fontFamily: {
        sans: "var(--font-geist-sans), ui-sans-serif, system-ui, -apple-system, 'Segoe UI', Roboto, 'Helvetica Neue', Arial",
        mono: "var(--font-geist-mono), ui-monospace, SFMono-Regular, Menlo, Monaco, 'Roboto Mono'",
      },
      borderRadius: {
        sm: "var(--radius-sm)",
        md: "var(--radius-md)",
        lg: "var(--radius-lg)",
        xl: "var(--radius-xl)",
      },
    },
  },
  plugins: [
    require("tailwindcss-animate"),
  ],
};

