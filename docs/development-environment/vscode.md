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

Run the following command to create the suitable debug config files.

```
foal generate vscode-config
```

Now you can add a breakpoint in your code and start the app in debug mode.

![Debugging demo](./debugger.gif)

The generated files also include configurations to run your unit and end-to-end tests.

![Debug configurations](./debug-configurations.png)