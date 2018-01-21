# 7. Test

While we created services across this tutorial you may have noticed that other `spec` files have been created as well. They are tests files. By default the generator install `mocha` and `chai` to let you quickly test your components.

To do so run `npm run build` and then `npm run test`.

During developpement you may be interested as well by the `npm run dev:test` command. It works the same way as `npm run dev:app` expect that it is used to execute the tests and not to launch the app.