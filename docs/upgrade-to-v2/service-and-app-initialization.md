# Service and Application Initialization

FoalTS offers two ways to initialize the application: by the `boot` methods of the services or with the `AppController.init` method.

Previously we had to call `ServicesManager.boot` and use the `createAndInitApp` function. This is no longer necessary. FoalTS will call the `boot` and `init` methods if they exist when the application is launched. Therefore, the `createAndInitApp` function no longer exists (use `createApp` instead).