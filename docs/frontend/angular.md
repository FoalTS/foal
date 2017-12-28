# Angular + FoalTS

## Create and configure the project

### Create the git repo

```bash
mkdir my-project
cd my-project
git init
```

### Create the backend

```bash
npm install -g yo generator-foal
yo foal server
```

### Create the frontend

```bash
npm install -g @angular/cli
ng new client
```

### Link the front and back ends for prod and development

In `server/src/main.ts` replace the line `app.get('/', ... )` by `app.get('/', (req, res) => res.render('index.html'))`.

In `client/package.json` replace
- the `start` script by `ng serve --proxy proxy.conf.json`,
- and the `build` script by `ng build --prod --output-path ../server/dist/public`.

Add the `proxy.conf.json` in `client/`:
```json
{
  "/": {
    "target": "http://localhost:3000",
    "secure": false
  }
}
```

### Commit the project

```bash
git add .
git commit -m "First commit"
```

## Development

Open two terminals in your project directory and run the following commands.

```bash
cd client
npm run start
```

```bash
cd server
npm run dev:app
```

Now open the browser at `http://localhost:4200`.

## Production

```bash
cd client
npm run build
cd ..
cd server
npm run build
npm run start
```
