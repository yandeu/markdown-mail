#!/usr/bin/env node

import { Arguments } from 'node-cli'
import { preview } from './preview'
import FiveServer from 'five-server'
import { init as initFnc } from './init'

const Args = new Arguments()

const root = Args.getOption('root')?.[0]
const port = Args.getOption('port')?.[0] ?? 3500
const open = Args.getOption('open')?.[0] === 'false' ? false : true
const init = Args.hasOption('init')

const main = async () => {
  if (init) {
    initFnc(root)
    return
  }

  const _port = await preview({ root, port })
  const fiveserver = new FiveServer()
  fiveserver.start({ injectCss: false, open, port: _port + 1, proxy: { '/': `http://localhost:${port}` } })
}
main()
