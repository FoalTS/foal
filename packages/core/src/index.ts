/**
 * FoalTS
 * Copyright(c) 2017-2020 Loïc Poullain <loic.poullain@centraliens.net>
 * Released under the MIT License.
 */

try {
  const version = process.versions.node;
  const NODE_MAJOR_VERSION = parseInt(version.split('.')[0], 10);
  if (NODE_MAJOR_VERSION < 10) {
    console.warn(`[Warning] You are using version ${version} of Node. FoalTS requires at least version 10.`);
  }
} finally {}

export * from './common';
export * from './core';
export * from './express';
export * from './openapi';
export * from './sessions';
