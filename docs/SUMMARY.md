# Documentation

* [Why FoalTS?](./README.md)

## Tutorials

* Simple To-Do List
  * [Installation](./tutorials/simple-todo-list/1-installation.md)
  * [Introduction](./tutorials/simple-todo-list/2-introduction.md)
  * [The Todo Model](./tutorials/simple-todo-list/3-the-todo-model.md)
  * [The Shell Script create-todo](./tutorials/simple-todo-list/4-the-shell-script-create-todo.md)
  * [The REST API](./tutorials/simple-todo-list/5-the-rest-api.md)
  * [Validation & Sanitization](./tutorials/simple-todo-list/6-validation-and-sanitization.md)
  * [Unit Testing](./tutorials/simple-todo-list/7-unit-testing.md)
* Multi-User To-Do List
  * [Introduction](./tutorials/multi-user-todo-list/1-Introduction.md)
  * [The User & Todo Models](./tutorials/multi-user-todo-list/2-the-user-and-todo-models.md)
  * [The Shell Scripts](./tutorials/multi-user-todo-list/3-the-shell-scripts.md)
  * [Auth Controllers & Hooks](./tutorials/multi-user-todo-list/5-auth-controllers-and-hooks.md)
  * [Todos & Ownership](./tutorials/multi-user-todo-list/6-todos-and-ownership.md)
  * [The Sign Up Page](./tutorials/multi-user-todo-list/7-the-signup-page.md)
  * [E2E Testing & Auth](./tutorials/multi-user-todo-list/8-e2e-testing-and-authentication.md)
* MongoDB To-Do List
  * [Installation](./tutorials/mongodb-todo-list/1-installation.md)
  * [Introduction](./tutorials/mongodb-todo-list/2-introduction.md)
  * [The Todo Model](./tutorials/mongodb-todo-list/3-the-todo-model.md)
  * [The Shell Script create-todo](./tutorials/mongodb-todo-list/4-the-shell-script-create-todo.md)
  * [The REST API](./tutorials/mongodb-todo-list/5-the-rest-api.md)
  * [Validation & Sanitization](./tutorials/mongodb-todo-list/6-validation-and-sanitization.md)
  * [Unit Testing](./tutorials/mongodb-todo-list/7-unit-testing.md)

## Topic Guides

* Architecture
  * [Architecture Overview](./architecture/architecture-overview.md)
  * [Controllers](./architecture/controllers.md)
  * [Services & Dependency Injection](./architecture/services-and-dependency-injection.md)
  * [Hooks](./architecture/hooks.md)
* Databases
  * [TypeORM (SQL & noSQL)](./databases/typeorm.md)
  * [Create Models & Queries](./databases/create-models-and-queries.md)
  * [Generate & Run Migrations](./databases/generate-and-run-migrations.md)
  * [Use Mongoose (MongoDB)](./databases/using-mongoose.md)
  * [Use Another ORM](./databases/using-another-orm.md)
* Authentication & Access Control
  * [Quick Start](./authentication-and-access-control/quick-start.md)
  * [User Class & create-user Script](./authentication-and-access-control/user-class.md)
  * [Passwords](./authentication-and-access-control/password-management.md)
  * [Session Tokens (authentication)](./authentication-and-access-control/session-tokens.md)
  * [JSON Web Tokens (authentication)](./authentication-and-access-control/jwt.md)
  * [Administrators & Roles](./authentication-and-access-control/administrators-and-roles.md)
  * [Groups & Permissions](./authentication-and-access-control/groups-and-permissions.md)
* [Validation & Sanitization](./validation-and-sanitization.md)
* [Serializing & Deserializing](./serializing-and-deserializing.md)
* API
  * [REST API](./api-section/rest-blueprints.md)
  * [OpenAPI & Swagger UI](./api-section/openapi-and-swagger-ui.md)
  * [Public API & CORS Requests](./api-section/public-api-and-cors-requests.md)
  * [GraphQL](./api-section/graphql.md)
* Frontend Integration
  * [Single Page Applications](./frontend-integration/single-page-applications.md)
  * [Angular, React & Vue](./frontend-integration/angular-react-vue.md)
  * [JSX Server-Side Rendering](./frontend-integration/jsx-server-side-rendering.md)
* CLI & Development Environment
  * [Build & Start the App](./development-environment/build-and-start-the-app.md)
  * [Create & Run Scripts](./development-environment/create-and-run-scripts.md)
  * [Code Generation](./development-environment/code-generation.md)
  * [Linting & Code Style](./development-environment/linting-and-code-style.md)
  * [VS Code](./development-environment/vscode.md)
* Testing
  * [Introduction](./testing/introduction.md)
  * [Unit Testing](./testing/unit-testing.md)
  * [E2E Testing](./testing/e2e-testing.md)
* Cloud
  * [AWS Beanstalk](./cloud/aws-beanstalk.md)
  * [Firebase](./cloud/firebase.md)
* Security
  * [HTTP Headers Protection](./security/http-headers-protection.md)
  * [CSRF Protection](./security/csrf-protection.md)
  * [XSS Protection](./security/xss-protection.md)
* Utilities
  * [Static Files](./utilities/static-files.md)
  * [Templates (SSR)](./utilities/templating.md)
  * [Logging & Debugging](./utilities/logging-and-debugging.md)
* Cookbook
  * [Upload & Download Files](./cookbook/upload-and-download-files.md)
  * [Generate Tokens](./cookbook/generate-tokens.md)
  * [Scheduling Jobs](./cookbook/scheduling-jobs.md)
  * [404 Page](./cookbook/404-page.md)
  * [ExpressJS](./cookbook/expressjs.md)
  * [Root Imports](./cookbook/root-imports.md)
  * [Custom Directory Structure](./cookbook/custom-directory-structure.md)
  * [Limit Repeated Requests](./cookbook/limit-repeated-requests.md)
* Deployment & Environments
  * [Configuration](./deployment-and-environments/configuration.md)
  * [Ship to Production](./deployment-and-environments/ship-to-production.md)
* [Comparison with Other Frameworks](./comparison-with-other-frameworks.md)

## Upgrading

* [To v0.8](https://github.com/FoalTS/foal/releases/tag/v0.8.0)
* [To v1](https://github.com/FoalTS/foal/releases/tag/v1.0.0)

## API Reference

* [@foal/core](./api/core/README.md)
* [@foal/csrf](./api/csrf/README.md)
* [@foal/ejs](./api/ejs/README.md)
* [@foal/formidable](./api/formidable/README.md)
* [@foal/graphql](./api/graphql/README.md)
* [@foal/jwks-rsa](./api/jwks-rsa/README.md)
* [@foal/jwt](./api/jwt/README.md)
* [@foal/mongoose](./api/mongoose/README.md)
* [@foal/password](./api/password/README.md)
* [@foal/redis](./api/password/README.md)
* [@foal/swagger](./api/swagger/README.md)
* [@foal/typeorm](./api/typeorm/README.md)
