export default {
  content: [
    "./index.html",
    "./src/**/*.{vue,js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
      },
      colors: {
        brand: {
          light: "#A5B4FC",
          DEFAULT: "#6366F1",
          dark: "#4F46E5",
        },
        base: "#0f172a", // 👈 màu nền chính (dark)
        card: "#1e293b", // 👈 nền thẻ
        textbase: "#e2e8f0", // 👈 màu chữ chính
        textmuted: "#94a3b8", // 👈 màu chữ phụ
      },
    },
  },
  plugins: [],
};
