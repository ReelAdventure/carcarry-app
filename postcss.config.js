import { fileURLToPath } from 'url'
import { resolve, dirname } from 'path'

const __dirname = dirname(fileURLToPath(import.meta.url))

export default {
  plugins: {
    tailwindcss: { config: resolve(__dirname, './tailwind.config.cjs') },
    autoprefixer: {},
  },
}
