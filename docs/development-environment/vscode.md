# Visual Studio Code

> *Visual Studio Code is a lightweight but powerful source code editor which runs on your desktop and is available for Windows, macOS and Linux. It comes with built-in support for JavaScript, TypeScript and Node.js.*
>
> Source:  https://code.visualstudio.com/docs

[VS Code](https://code.visualstudio.com/) has become **one of the most popular code editors in the JavaScript ecosystem**. It offers useful features (auto-completion, debugging tools, etc.) that work very well with TypeScript and Node.js. That's why it has a dedicated page in the documentation.

But using VS Code is not mandatory to develop a FoalTS app. So feel free to use another code editor if you prefer.

## Configuring the linting

In order to directly print the tslint errors in VS Code and auto-fix the problems on save you need to install the `TSLint` extension.

> *To open the menu with the search bar, use `Cmd`+`Shift`+`P` or  `Ctrl`+`Shift`+`P`.*

![TSLint installation and configuration](./tslint.gif)

## Debugging with VS Code

Create a new folder called `.vscode` in the root directory and add these two files:

*launch.json*
```json
{
  // Utilisez IntelliSense pour en savoir plus sur les attributs possibles.
  // Pointez pour afficher la description des attributs existants.
  // Pour plus d'informations, visitez : https://go.microsoft.com/fwlink/?linkid=830387
  "version": "0.2.0",
  "configurations": [
    {
      "type": "node",
      "request": "launch",
      "name": "Lancer le programme",
      "program": "${workspaceFolder}/lib/index.js",
      "preLaunchTask": "build",
      "outFiles": [
        "${workspaceFolder}/lib/**/*.js"
      ]
    }
  ]
}
```

*tasks.json*
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
    }
  ]
}
```

Now you can add a breakpoint in your code and start the app in debug mode.

![Debugging demo](./debugger.gif)
