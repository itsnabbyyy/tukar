// tailwind.config.js
export default {
  content: ["./index.html","./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Satoshi', 'ui-sans-serif', 'system-ui', 'Segoe UI', 'Roboto', 'Helvetica', 'Arial', 'Noto Sans', 'Apple Color Emoji', 'Segoe UI Emoji'],
      },
      colors: {
        paper:"#f4f3f1", ink:"#1f1f1f", muted:"#8a8988",
        cta:"#fb7232", "cta-text":"#ffe1d4",
      },
      boxShadow: { soft: "0 6px 24px rgba(0,0,0,.08)" },
      borderRadius: { xl2: '1rem', '2xl':'1.25rem' },
    },
  },
  plugins: [],
}
