# EveLog server

The server is built with [Flask](https://flask.palletsprojects.com/en/2.2.x/). To get the Flask server to work, a `.env` file with the following content should be provided:

```
ETHERSCAN_API_KEY=<api_key>
GETBLOCK_ENDPOINT=https://eth.getblock.io/mainnet/?api_key=<api_key>
INFURA_ENDPOINT=https://mainnet.infura.io/v3/<api_key>
```

Install dependencies: `pip install -r requirements.txt`

To start the server in development run:

```bash
flask run

or

py -m flask run

# restart on save
flask --debug run
```

## Manual deploy

To manually deploy the server add a `.env` file with the same format as above, install the dependencies with `pip install -r requirements.txt` and run `waitress-serve --port=<port> wsgi:app`. The port should be the same used in `.env.production.local` for the client.

## Heroku deploy

The deployment is automatically done by the GitHub actions [server_deploy.yaml](../.github/workflows/server_deploy.yaml) on every push in the `/server` folder. To manually push updates to Heroku execute from the project root folder: `git subtree push --prefix server heroku-server main`
