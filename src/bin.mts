#!/usr/bin/env node

import { Arguments } from 'node-cli'
import { preview } from './preview.mjs'
import { init as initFnc } from './init.mjs'
import FiveServer from 'five-server'
import { parseMail } from './mail.mjs'
import { mkdir, readdir, writeFile } from 'node:fs/promises'
import { existsSync } from 'node:fs'

const Args = new Arguments()

const root = Args.getOption('root')?.[0]
const port = Args.getOption('port')?.[0] ?? 3500
const open = Args.getOption('open')?.[0] === 'true' ? true : false
const init = Args.hasOption('init')
const build = Args.hasOption('build')

if (root) {
  if (!existsSync(root)) await mkdir(root)
}

if (init) {
  await initFnc(root)
  process.exit()
}

if (build) {
  const dir = await readdir(root || 'mails')
  const mails = dir.filter(d => d.endsWith('.md'))
  if (!existsSync('dist')) await mkdir('dist', {})

  for (const mail of mails) {
    const html = await parseMail(root || 'mails', mail)
    if (html) await writeFile('dist/' + mail?.replace('.md', '.html'), html)
  }
  process.exit()
}

const _port = await preview({ root, port })
const fiveserver = new FiveServer.default()
fiveserver.start({ injectCss: false, open, port: _port + 1, proxy: { '/': `http://localhost:${port}` } })
