import os
import sys

import pandas as pd
from dotenv import load_dotenv
from ethtx import EthTx, EthTxConfig
from ethtx.models.w3_model import W3Transaction, W3Block, W3Receipt, W3CallTree
from ethtx.models.decoded_model import DecodedCall
from ethtx.models.objects_model import Transaction, Block

load_dotenv()

ETHERSCAN_API_KEY = os.getenv("ETHERSCAN_API_KEY")

# getblock.io free node get only the last 64 blocks
GETBLOCK_ENDPOINT = os.getenv("GETBLOCK_ENDPOINT")
NODE_ENPOINT = os.getenv("NODE_ENDPOINT")

ethtx_config = EthTxConfig(
    mongo_connection_string="mongomock://localhost/ethtx",  # MongoDB connection string,
    etherscan_api_key=ETHERSCAN_API_KEY,
    web3nodes={
        "mainnet": {
            # multiple nodes supported, separate them with comma
            "hook": [GETBLOCK_ENDPOINT, NODE_ENPOINT],
            "poa": False  # represented by bool value
        }
    },
    default_chain="mainnet",
    etherscan_urls={"mainnet": "https://api.etherscan.io/api", },
)

ethtx = EthTx.initialize(ethtx_config)
web3provider = ethtx.providers.web3provider

file_path = sys.argv[1]

transactions_df = pd.read_json(file_path)
internal_calls_df = pd.DataFrame()

for row in transactions_df.itertuples(index=True, name='Pandas'):

    # read raw transaction data directly from the node
    w3transaction: W3Transaction = web3provider.get_transaction(
        row.hash)
    w3block: W3Block = web3provider.get_block(w3transaction.blockNumber)
    w3receipt: W3Receipt = web3provider.get_receipt(w3transaction.hash.hex())
    w3calls: W3CallTree = web3provider.get_calls(w3transaction.hash.hex())

    # read the raw transaction from the node
    transaction = Transaction.from_raw(
        w3transaction=w3transaction, w3receipt=w3receipt, w3calltree=w3calls
    )

    # get proxies used in the transaction
    proxies = ethtx.decoders.get_proxies(transaction.root_call, "mainnet")

    block: Block = Block.from_raw(
        w3block=web3provider.get_block(transaction.metadata.block_number),
        chain_id="mainnet",
    )

    # decode transaction calls
    abi_decoded_calls: DecodedCall = ethtx.decoders.abi_decoder.decode_calls(
        transaction.root_call, block.metadata, transaction.metadata, proxies
    )

    abi_decoded_calls.function_name = row.inputFunctionName
    abi_decoded_calls.function_signature = row.inputFunction
    abi_decoded_calls.arguments = row.inputFunctionParams

    internal_calls_df = internal_calls_df.append(
        abi_decoded_calls.dict(), ignore_index=True)

internal_calls_df.to_json("exported.json", orient="records")
