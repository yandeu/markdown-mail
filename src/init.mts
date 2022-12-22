import { existsSync } from 'node:fs'
import { join, dirname } from 'node:path'
import { copyDir } from './helpers.mjs'
import { fileURLToPath } from 'node:url'
const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

export const init = async (root: string = process.cwd()) => {
  const dest = join(root, 'mails')
  const src = join(__dirname, '../mails')

  if (existsSync(dest)) {
    console.log('The directory "mails" does already exist.')
    return
  }

  await copyDir(src, dest)
}
