# XES Ethereum Extractor server

The server is built with [Flask](https://flask.palletsprojects.com/en/2.2.x/) and deployed with Heroku on: [xes-ethereum-extractor-server.herokuapp.com](https://xes-ethereum-extractor-server.herokuapp.com/).

To get the Flask server to work, a `.env` file with the following content should be provided:

```
ETHERSCAN_API_KEY=<api_key>
GETBLOCK_ENDPOINT=https://eth.getblock.io/mainnet/?api_key=<api_key>
INFURA_ENDPOINT=https://mainnet.infura.io/v3/<api_key>
```

To start the server in development run:

```bash
flask run

# restart on save
flask --debug run
```

## Deploy

The deployment is automatically done by the GitHub actions [server_deploy.yaml](../.github/workflows/server_deploy.yaml) on every push in the `/server` folder.

To manually push updates to Heroku execute from the project root folder: `git subtree push --prefix server heroku-server main`
