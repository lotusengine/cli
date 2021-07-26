import http from 'http'
// import { requireModule } from '../../../lib/file'

export const serveModule = (path: any, port: any) => {
  const m = require(path)

  const server = http.createServer()
  const fn = async (parameters: any) => {
    try {
      if (Object.prototype.hasOwnProperty.call(m, 'default')) { return await m.default(parameters) }
      return await m(parameters)
    } catch (e) {
      return {
        status: 'error',
        errors: [{ code: 'SCRIPT_EXCEPTION', message: e.message }]
      }
    }
  }

  server.on('request', async (req, res) => {
    if (req.method === 'POST') {
      var body = ''
      req.on('data', (chunk: any) => {
        body += chunk
      })

      req.on('end', async () => {
        try {
          const payload = JSON.parse(body)
          const data = await fn(payload)
          res.writeHead(200, { 'Content-Type': 'application/json' })
          res.end(JSON.stringify(typeof data === 'object' && data.status ? data : { status: 'success', result: data }))
        } catch (e) {
          res.writeHead(200, { 'Content-Type': 'application/json' })
          res.end(JSON.stringify({ status: 'error', errors: [{ code: e.message }] }))
        }
      })
    } else {
      res.end()
    }
  })

  server.listen(port)
}
