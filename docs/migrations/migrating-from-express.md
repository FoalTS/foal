ex with several teams

First team is ready to move on: create a module and use Foal directly here with its router.
A middleware is shared by every team at the main room level -> nothing to do
Some shared decorators are used in the team -> easy to create a controller decorator

express is in peerDependencies so that you can use your current 4.x version of node.

.expressRouter() -> easily migrate your app
if already using services : almost nothing to change for testing thanks to controller decorators which are skipped