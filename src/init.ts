import { existsSync } from 'fs'
import { join } from 'path'
import { copyDir } from './helpers'

export const init = (root: string = process.cwd()) => {
  const dest = join(root, 'mails')
  const src = join(__dirname, '../mails')

  if (existsSync(dest)) {
    console.log('The directory "mails" does already exist.')
    return
  }

  copyDir(src, dest)
}
