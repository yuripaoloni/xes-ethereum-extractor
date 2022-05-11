import os

from dotenv import load_dotenv
from ethtx import EthTx, EthTxConfig
from ethtx.models.decoded_model import DecodedTransaction

load_dotenv()

# initialize etherscan-python and web3.py with respective API keys
ETHERSCAN_API_KEY = os.getenv("ETHERSCAN_API_KEY")
GETBLOCK_ENDPOINT = os.getenv("GETBLOCK_ENDPOINT")

ethtx_config = EthTxConfig(
    mongo_connection_string="mongomock://localhost/ethtx",  # MongoDB connection string,
    etherscan_api_key=ETHERSCAN_API_KEY,
    web3nodes={
        "mainnet": {
            # multiple nodes supported, separate them with comma
            "hook": GETBLOCK_ENDPOINT,
            "poa": False  # represented by bool value
        }
    },
    default_chain="mainnet",
    etherscan_urls={"mainnet": "https://api.etherscan.io/api", },
)

ethtx = EthTx.initialize(ethtx_config)
transaction: DecodedTransaction = ethtx.decoders.decode_transaction(
    '0x2c2c40743117d5e6fa3ca2931fcfff40dc998c33109fc132a8ca4d640f39b996')
