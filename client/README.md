# XES Ethereum Extractor client

The client is built with [Next.js](https://flask.palletsprojects.com/en/2.2.x/) and deployed with Heroku on: [xes-ethereum-extractor.herokuapp.com](https://xes-ethereum-extractor.herokuapp.com/). 

To execute the client in development add a `.env.development.local` file with the following content and run `yarn dev`:

```env
NEXT_PUBLIC_SERVER_URL = <server_url>
```

## Deploy

The deployment is automatically done by the GitHub actions [client_deploy.yaml](../.github/workflows/client_deploy.yaml) on every push in the `/client` folder.

To manually push updates to Heroku execute from the project root folder: `git subtree push --prefix client heroku-client main`