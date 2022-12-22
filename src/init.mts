import { existsSync } from 'node:fs'
import { join } from 'node:path'
import { copyDir } from './helpers.mjs'

export const init = (root: string = process.cwd()) => {
  const dest = join(root, 'mails')
  const src = join(__dirname, '../mails')

  if (existsSync(dest)) {
    console.log('The directory "mails" does already exist.')
    return
  }

  copyDir(src, dest)
}
