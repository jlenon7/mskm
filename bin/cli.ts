#!/usr/bin/env node

import { sep } from 'node:path'
import { Exec, Module } from '@athenna/common'

const dirname = Module.createDirname(import.meta.url)

Exec.artisan(`${dirname}${sep}main.js`, {
  nodeOptions: ['--disable-warning=DEP0180', '--disable-warning=DEP0040']
})
