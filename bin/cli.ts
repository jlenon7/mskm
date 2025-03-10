#!/usr/bin/env node

import { Exec } from '@athenna/common'

Exec.artisan('./bin/main.js', {
  nodeOptions: ['--disable-warning=DEP0180', '--disable-warning=DEP0040']
})
