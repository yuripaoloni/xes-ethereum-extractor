# XES Ethereum Extractor

Application-agnostic methodology to enable the application of Process Mining techniques on blockchain.

## Client

Frontend built with Next.js.

Read more on the client [README](client/README.md).


## Server

Server built with Flask.

Read more on the server [README](server/README.md).

## Script and Notebooks

Application of Process Mining techniques on Decentraland's smart contracts. [Etherscan-python](https://github.com/pcko1/etherscan-python) was used to retrieve the transactions and [web3.py](https://web3py.readthedocs.io/en/stable/) to decode the `input` field of each transaction. [PM4Py](https://pm4py.fit.fraunhofer.de/) was used to run Process Mining techniques.

To get the Python scripts to work, a `.env` file with the following content should be provided:

```
ETHERSCAN_API_KEY=<api_key>
GETBLOCK_ENDPOINT=https://eth.getblock.io/mainnet/?api_key=<api_key>
INFURA_ENDPOINT=https://mainnet.infura.io/v3/<api_key>
```

To install the required dependencies listed in `requirements.txt` run:

```bash
pip install -r requirements.txt
```

## Data

TODO

## Author

- [yuripaoloni](https://github.com/yuripaoloni)
