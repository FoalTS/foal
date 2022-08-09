---
title: Visual Studio Code
sidebar_label: VSCode
---

import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

> *Visual Studio Code is a lightweight but powerful source code editor which runs on your desktop and is available for Windows, macOS and Linux. It comes with built-in support for JavaScript, TypeScript and Node.js.*
>
> Source:  https://code.visualstudio.com/docs

[VS Code](https://code.visualstudio.com/) has become **one of the most popular code editors in the JavaScript ecosystem**. It offers useful features (auto-completion, debugging tools, etc.) that work very well with TypeScript and Node.js. That's why it has a dedicated page in the documentation.

But using VS Code is not mandatory to develop a FoalTS app. So feel free to use another code editor if you prefer.

## Configuring the linting

In order to directly print the ESLint errors in VS Code and auto-fix the problems on save you need to install the `ESLint` extension.

It can be installed by launching *VS Code Quick Open* (`Ctrl`+`P` or `Cmd`+`P`), pasting the following command, and pressing enter:

```
ext install dbaeumer.vscode-eslint
```

Then, you will need to configure it for TypeScript and make it fix the errors on save (when it is possible).

1. Open the *Command Palette* (`Ctrl`+`Shift`+`P` or `Cmd`+`Shift`+`P`) and type `Open Settings (JSON)`.

    ![Open VSCode Settings](./open-vscode-settings.png)

2. Then extend the settings to add the options below.

    ```json
    {
      // ...
      "eslint.validate": [
          "typescript"
      ],
      "editor.codeActionsOnSave": {
          "source.fixAll.eslint": true
      }
    }
    ```

## Debugging with VS Code

Add the following two files in a new `.vscode/` directory at the root of your project:

<Tabs
  defaultValue="tasks"
  values={[
    {label: 'tasks.json', value: 'tasks'},
    {label: 'launch.json', value: 'launch'},
  ]}
>
<TabItem value="tasks">

```json
{
  // See https://go.microsoft.com/fwlink/?LinkId=733558
  // for the documentation about the tasks.json format
  "version": "2.0.0",
  "tasks": [
    {
      "type": "npm",
      "script": "build",
      "label": "build",
      "problemMatcher": []
    },
    {
      "type": "npm",
      "script": "build:test",
      "label": "build:test",
      "problemMatcher": []
    },
    {
      "type": "npm",
      "script": "build:e2e",
      "label": "build:e2e",
      "problemMatcher": []
    }
  ]
}
```

</TabItem>
<TabItem value="launch">

```json
{
  "version": "0.2.0",
  "configurations": [
    {
      "type": "node",
      "request": "launch",
      "name": "Start the server",
      "program": "${workspaceFolder}/build/index.js",
      "preLaunchTask": "build",
      "outFiles": [
        "${workspaceFolder}/build/**/*.js"
      ],
      "internalConsoleOptions": "openOnSessionStart"
    },
    {
      "type": "node",
      "request": "launch",
      "name": "Run unit tests",
      "program": "${workspaceFolder}/node_modules/mocha/bin/_mocha",
      "args": [
        "--timeout",
        "999999",
        "--colors",
        "--file",
        "./build/test.js",
        "${workspaceFolder}/build/**/*.spec.js"
      ],
      "preLaunchTask": "build:test",
      "outFiles": [
        "${workspaceFolder}/build/**/*.js"
      ],
      "internalConsoleOptions": "openOnSessionStart"
    },
    {
      "type": "node",
      "request": "launch",
      "name": "Run e2e tests",
      "program": "${workspaceFolder}/node_modules/mocha/bin/_mocha",
      "args": [
        "--timeout",
        "999999",
        "--colors",
        "--file",
        "./build/e2e.js",
        "${workspaceFolder}/build/e2e/**/*.js"
      ],
      "preLaunchTask": "build:e2e",
      "outFiles": [
        "${workspaceFolder}/build/**/*.js"
      ],
      "internalConsoleOptions": "openOnSessionStart"
    }
  ]
}
```

</TabItem>
</Tabs>

Now you can add a breakpoint in your code and start the app in debug mode.

![Debugging demo](./debugger.gif)

The generated files also include configurations to run your unit and end-to-end tests.

![Debug configurations](./debug-configurations.png)
