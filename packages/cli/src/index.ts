#!/usr/bin/env node
/**
 * FoalTS
 * Copyright(c) 2017-2018 Loïc Poullain <loic.poullain@centraliens.net>
 * Released under the MIT License.
 */

// 3p
import * as program from 'commander';

// FoalTS
import './build/commands';
import './database/commands';
import './generate/commands';

// tslint:disable-next-line:no-var-requires
const pkg = require('../package.json');

program.version(pkg.version, '-v, --version');

program.parse(process.argv);
