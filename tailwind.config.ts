import type { Config } from "tailwindcss";

export default {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "#121212", // Dark background (Main UI)
        foreground: "#E0E0E0", // Primary text (White/Grey)
        secondary: "#1E1E1E", // Dark grey for cards, modals
        accent: "#8A2BE2", // Neon purple (Play button, highlights)
        mutedText: "#B0B0B0", // Secondary text (Muted grey)
        error: "#FF4C4C", // Error messages, warnings
        success: "#2ECC71", // Success messages, confirmations
      },
      fontFamily: {
        heading: ["Kanit", "sans-serif"],
        body: ["Sora", "sans-serif"],
      },
    },
  },
  plugins: [],
} satisfies Config;
