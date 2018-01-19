# 8. Build and deploy

**Work in progress**

Normally every of these public cloud offer free tiers. But there is no warantte (à revoir) using this guid -> costs.

## Build

`npm run build`

## Deploy on AWS

## Deploy on Microsoft Azure

https://docs.microsoft.com/en-us/azure/app-service/app-service-deploy-zip

Prerequities: install the azure cli.

Create a zip file.

```bash
cd dist
# Bash
zip -r bundle.zip .

# PowerShell (does it work on a simple windows cmd?)
Compress-Archive -Path * -DestinationPath bundle.zip
```

`az webapp deployment source config-zip --resource-group myResouceGroup --name <app_name> --src bundle.zip`

`az webapp log tail --name webappname --resource-group myResourceGroup`

## Deploy on Google Cloud Platform (GCP)

1. Subscribe to a [Google Cloud Platform account]().
2. Create a project called `foal-todo-app`.
3. Create your database
3. Install the [GCP SDK]() to use the command line interface and run `gcloud init`.

4. `yo foal:cloud create-config`

Add the following config file (`app.yaml`) next to your `package.json`:
```yaml
runtime: nodejs
env: flex

env_variables:
  DB_NAME: ""
  DB_USERNAME: ""
  DB_PASSWORD: ""
```

Build the project by running `npm run build`.

Deploy your app with `gcloud app deploy --project your-project-id`. This may ask you some questions and take a few minutes the first time.

Open your browser at `xxxxx`. Your app should be running!

You can watch the logs with this command: `gcloud app logs tail -s default --project your-project-id`.

### Create the database

1. Enable the Cloud SQL API

Create an instance