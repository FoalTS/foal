---
title: Solución de Problemas de Instalación
---

## Errores con `node-gyp`

Si está en Windows y obtiene errores que mencionan `gyp` o `node_gyp`, probablemente sea porque esta [biblioteca](https://github.com/nodejs/node-gyp) no tiene todas las dependencias que necesita.

Intente ejecutar `npm install --global windows-build-tools` desde un PowerShell elevado o CMD.exe (ejecutado como administrador).

¡Si esto no resuelve su problema, por favor [envíe una issue](https://github.com/FoalTS/foal/issues/new) en Github con la salida de su terminal para que podamos ayudarle!

## ¿Otro problema?

Por favor, [envíe una issue](https://github.com/FoalTS/foal/issues/new) en Github.