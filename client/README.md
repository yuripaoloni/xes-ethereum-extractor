# EveLog client

The client is built with [Next.js](https://flask.palletsprojects.com/en/2.2.x/). To execute the client in development add a `.env.development.local` file with the following content, run `yarn install` and `yarn dev`:

```env
NEXT_PUBLIC_SERVER_URL = <server_url> // http://localhost:5000
```

## Manual deploy

To manually deploy the client add a `.env.production.local` file with the same format as above, run `yarn install` and `yarn build`. Make sure to use the exact endpoint at which the Flask server is running. Finally, run `yarn start` and the client is now accessible at `localhost:3000`.

## Heroku deploy

The deployment is automatically done by the GitHub actions [client_deploy.yaml](../.github/workflows/client_deploy.yaml) on every push in the `/client` folder. To manually push updates to Heroku execute from the project root folder: `git subtree push --prefix client heroku-client main`.



