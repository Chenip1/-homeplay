import { createServer } from 'node:http'
import { readFile } from 'node:fs/promises'
import { extname, resolve, sep } from 'node:path'
import { fileURLToPath } from 'node:url'
import { play } from './pk-local.mjs'

const root = fileURLToPath(new URL('./dist', import.meta.url))
const host = process.env.HOMEPLAY_HOST || '127.0.0.1'
const port = Number(process.env.HOMEPLAY_PORT || 4173)
const types = {
  '.html': 'text/html; charset=utf-8', '.js': 'text/javascript; charset=utf-8',
  '.css': 'text/css; charset=utf-8', '.jpg': 'image/jpeg', '.png': 'image/png'
}

createServer(async (request, response) => {
  try {
    const url = new URL(request.url, 'http://localhost')
    if (url.pathname === '/api/pk' && request.method === 'POST') {
      const identity = /^Bearer ([a-f0-9]{64})$/.exec(request.headers.authorization || '')?.[1]
      if (!identity || (request.headers.origin && new URL(request.headers.origin).host !== request.headers.host)) {
        response.writeHead(403).end()
        return
      }
      let body = ''
      for await (const chunk of request) {
        body += chunk
        if (body.length > 8192) {
          response.writeHead(413).end()
          return
        }
      }
      response.setHeader('Content-Type', 'application/json; charset=utf-8')
      response.end(JSON.stringify(await play(identity, JSON.parse(body))))
      return
    }
    if (request.method !== 'GET' && request.method !== 'HEAD') {
      response.writeHead(405).end()
      return
    }
    if (url.pathname === '/pk-config.js') {
      response.setHeader('Content-Type', types['.js'])
      response.end('window.homePlayOnline = true;')
      return
    }
    const path = resolve(root, '.' + decodeURIComponent(url.pathname === '/' ? '/index.html' : url.pathname))
    if (!path.startsWith(root + sep)) {
      response.writeHead(404).end()
      return
    }
    const content = await readFile(path)
    response.setHeader('Content-Type', types[extname(path)] || 'application/octet-stream')
    response.end(content)
  } catch (error) {
    const status = error.code === 'ENOENT' || error.code === 'EISDIR' ? 404 : error instanceof SyntaxError ? 400 : 500
    response.writeHead(status).end()
  }
}).listen(port, host, () => console.log('萌宠 homePlay · http://' + host + ':' + port))
