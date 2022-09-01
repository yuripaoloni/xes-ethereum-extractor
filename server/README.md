# XES Ethereum Extractor server

The server is built with [Flask](https://flask.palletsprojects.com/en/2.2.x/).

To run the server execute: `flask run`
To restart on save: `flask --debug run`

To get the Flask server to work, a `.env` file with the following content should be provided:

```
ETHERSCAN_API_KEY=<api_key>
GETBLOCK_ENDPOINT=https://eth.getblock.io/mainnet/?api_key=<api_key>
INFURA_ENDPOINT=https://mainnet.infura.io/v3/<api_key>
```