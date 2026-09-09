/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        command: {
          950: '#f8fafc', // Light canvas background (slate-50)
          900: '#ffffff', // Pure white for headers, cards, panels
          850: '#f8fafc', // Soft off-white for nested containers
          800: '#f1f5f9', // Slate-100 for buttons, pills, hover states
          700: '#e2e8f0', // Slate-200 for clean crisp borders
          600: '#cbd5e1', // Slate-300 for medium dividers
          500: '#94a3b8', // Slate-400
        },
        tactical: {
          cyan: '#0284c7', // vibrant deep sky blue
          sky: '#0284c7',
          blue: '#2563eb',
          emerald: '#059669', // forest sage emerald
          amber: '#d97706', // rich amber
          orange: '#ea580c',
          rose: '#e11d48', // crimson rose
        },
        human: {
          bg: '#f8fafc',
          surface: '#ffffff',
          elevated: '#ffffff',
          card: '#ffffff',
          border: '#e2e8f0',
          borderLight: '#cbd5e1',
          terracotta: '#e11d48',
          coral: '#f43f5e',
          amber: '#d97706',
          honey: '#b45309',
          sage: '#059669',
          azure: '#0284c7',
          textMuted: '#64748b',
          textSubtle: '#94a3b8',
        }
      },
      fontFamily: {
        sans: ['"Plus Jakarta Sans"', 'Inter', 'system-ui', '-apple-system', 'sans-serif'],
        heading: ['Outfit', '"Plus Jakarta Sans"', 'Inter', 'sans-serif'],
        mono: ['"JetBrains Mono"', 'ui-monospace', 'SFMono-Regular', 'Menlo', 'Consolas', 'monospace'],
      },
      animation: {
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'ping-slow': 'ping 2.5s cubic-bezier(0, 0, 0.2, 1) infinite',
      }
    },
  },
  plugins: [],
}
