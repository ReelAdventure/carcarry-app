import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'
import tailwindcss from 'tailwindcss'
import autoprefixer from 'autoprefixer'

// On Windows, path.resolve uses backslashes which fast-glob can't handle.
// Convert to forward slashes for glob patterns.
const toGlob = (p: string) => p.replace(/\\/g, '/')
const srcDir = toGlob(path.resolve(__dirname, 'src'))

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  css: {
    postcss: {
      plugins: [
        (tailwindcss as any)({
          darkMode: ['class'],
          content: [`${srcDir}/**/*.{ts,tsx,js,jsx}`],
          theme: {
            extend: {
              colors: {
                primary: { DEFAULT: '#FF7700', foreground: '#FFFFFF' },
                secondary: { DEFAULT: '#272727', foreground: '#FFFFFF' },
                muted: { DEFAULT: '#1A1A1A', foreground: '#B0B0B0' },
                accent: { DEFAULT: '#FF7700', foreground: '#FFFFFF' },
                card: { DEFAULT: '#1C1C1C', foreground: '#FFFFFF' },
                carcarry: {
                  orange: '#FF7700',
                  gray: '#B0B0B0',
                  dark: '#272727',
                  darker: '#1C1C1C',
                  darkest: '#111111',
                  black: '#000000',
                  white: '#FFFFFF',
                  border: '#2E2E2E',
                },
              },
              fontFamily: {
                sans: ['Inter', 'Avenir Next', 'system-ui', 'sans-serif'],
                title: ['Montserrat', 'Inter', 'system-ui', 'sans-serif'],
              },
              keyframes: {
                'fade-in': {
                  from: { opacity: '0', transform: 'translateY(8px)' },
                  to: { opacity: '1', transform: 'translateY(0)' },
                },
              },
              animation: {
                'fade-in': 'fade-in 0.3s ease-out',
              },
            },
          },
        } as any),
        autoprefixer(),
      ],
    },
  },
})
