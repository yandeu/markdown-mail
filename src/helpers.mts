// copied and modified from https://gist.github.com/tkihira/3014700

import fs from 'node:fs'
import path from 'node:path'

export const mkdir = function (dir) {
  // making directory without exception if exists
  try {
    fs.mkdirSync(dir)
  } catch (e: any) {
    if (e.code != 'EEXIST') {
      throw e
    }
  }
}

export const copy = function (src, dest) {
  const oldFile = fs.createReadStream(src)
  const newFile = fs.createWriteStream(dest)
  oldFile.pipe(newFile)
}

export const copyDir = function (src, dest) {
  mkdir(dest)
  const files = fs.readdirSync(src)
  for (let i = 0; i < files.length; i++) {
    const current = fs.lstatSync(path.join(src, files[i]))
    if (current.isDirectory()) {
      copyDir(path.join(src, files[i]), path.join(dest, files[i]))
    } else if (current.isSymbolicLink()) {
      const symlink = fs.readlinkSync(path.join(src, files[i]))
      fs.symlinkSync(symlink, path.join(dest, files[i]))
    } else {
      copy(path.join(src, files[i]), path.join(dest, files[i]))
    }
  }
}
