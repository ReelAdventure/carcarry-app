import { createServer } from 'vite'

const server = await createServer({
  root: new URL('.', import.meta.url).pathname.replace(/^\//, ''),
  server: { port: 5174, host: '0.0.0.0' },
})

await server.listen()
server.printUrls()
