#!/usr/bin/env node

import { Arguments } from 'node-cli'
import { preview } from './preview.mjs'
import { init as initFnc } from './init.mjs'
import FiveServer from 'five-server'

const Args = new Arguments()

const root = Args.getOption('root')?.[0]
const port = Args.getOption('port')?.[0] ?? 3500
const open = Args.getOption('open')?.[0] === 'false' ? false : true
const init = Args.hasOption('init')

console.log(open)

if (init) {
  initFnc(root)
  process.exit()
}

const _port = await preview({ root, port })
const fiveserver = new FiveServer.default()
fiveserver.start({ injectCss: false, open, port: _port + 1, proxy: { '/': `http://localhost:${port}` } })
