/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        bg: '#f8f5f0',
        surface: '#ffffff',
        border: '#e8e0d5',
        card: '#ffffff',
        accent: '#2196f3',
        accent2: '#5c6bc0',
        success: '#26a69a',
        text: '#2d2d2d',
        muted: '#9e9e9e',
      },
      fontFamily: {
        sans: ['"Noto Sans KR"', 'system-ui', 'sans-serif'],
        mono: ['"IBM Plex Mono"', 'ui-monospace', 'SFMono-Regular', 'monospace'],
      },
    },
  },
  plugins: [],
}

