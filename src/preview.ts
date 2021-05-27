import fs from 'fs/promises'
import { join } from 'path'
import express, { Request } from 'express'
import { parseMail } from './mail'

export interface PreviewOptions {
  root: string
  port: number
}

export const preview = async (options: PreviewOptions): Promise<number> => {
  const { root: _root = 'mails', port = 3500 } = options

  const root = join(process.cwd(), _root)
  const app = express()

  app.get('/', async (req, res) => {
    const directory = await fs.readdir(root)

    let html = `<!doctype html><html><body>`
    html += `<style>*{ font-family: Arial, Helvetica, sans-serif; } li  { margin-top: 12px; } a { color: black; text-decoration: none; } a:hover { text-decoration: underline; }</style>`
    html += `<ul>`

    for (const file of directory.filter(f => /\.md$/.test(f))) {
      html += `<li><a href="${file}">${file}</a></li>`
    }

    html += `</ul>`
    html += `</body></html>`

    res.send(html)
  })

  app.get('/:file', async (req: Request, res, next) => {
    try {
      const { file } = req.params
      if (!/\.md$/.test(file)) return next()

      const mail = await parseMail(root, file)

      return res.send(mail)
    } catch (error) {
      return next()
    }
  })

  app.get('/favicon.ico', (req, res) => {
    res.send('[]')
  })

  app.get('*', (req, res) => {
    res.send('not found')
  })

  return new Promise(resolve => {
    app.listen(port, () => {
      resolve(port)
    })
  })
}
