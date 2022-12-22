// copied and modified from https://gist.github.com/tkihira/3014700

import fs from 'node:fs'
import { readdir, mkdir, copyFile } from 'node:fs/promises'
import path from 'node:path'

const _mkdir = async (dir: string) => {
  // making directory without exception if exists
  try {
    await mkdir(dir)
  } catch (e: any) {
    if (e.code != 'EEXIST') {
      throw e
    }
  }
}

export const copy = async (src: string, dest: string) => {
  await copyFile(src, dest)
}

export const copyDir = async (src: string, dest: string) => {
  await _mkdir(dest)
  const files = await readdir(src)

  for (const i in files) {
    const current = fs.lstatSync(path.join(src, files[i]))
    if (current.isDirectory()) {
      await copyDir(path.join(src, files[i]), path.join(dest, files[i]))
    } else if (current.isSymbolicLink()) {
      const symlink = fs.readlinkSync(path.join(src, files[i]))
      fs.symlinkSync(symlink, path.join(dest, files[i]))
    } else {
      await copy(path.join(src, files[i]), path.join(dest, files[i]))
    }
  }
}
