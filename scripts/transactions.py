import os
import sys

from contextlib import suppress
from dotenv import load_dotenv
from etherscan import Etherscan
from numpy import block
from web3 import Web3
from utils import get_contract_address, export_dictionary

# ? params: output file name

load_dotenv()

# initialize etherscan-python and web3.py with respective API keys
ETHERSCAN_API_KEY = os.getenv("ETHERSCAN_API_KEY")
eth = Etherscan(ETHERSCAN_API_KEY)
PROVIDER_ENDPOINT = os.getenv("INFURA_ENDPOINT")
w3 = Web3(Web3.HTTPProvider(PROVIDER_ENDPOINT))

# define list of contracts to analyze by specifying the contract on which get txs and the contract for decoding the abi
contracts = []

contracts.append({"name": "LAND", "txs_contract": get_contract_address(
    "mainnet", "LANDProxy"), "abi_contract": get_contract_address("mainnet", "LANDRegistry")})
contracts.append({"name": "ESTATE", "txs_contract": get_contract_address(
    "mainnet", "EstateProxy"), "abi_contract": get_contract_address("mainnet", "EstateRegistry")})
contracts.append({"name": "Marketplace", "txs_contract": get_contract_address(
    "mainnet", "MarketplaceProxy"), "abi_contract": get_contract_address("mainnet", "Marketplace")})

# will contain all the retrieved transactions
results = []

for contract in contracts:
    print(f"Contract: {contract['name']}")

    # ? one year block: 12322265
    blockNumber = 12322265

    # get contracts ABI
    contract_abi = eth.get_contract_abi(contract["abi_contract"])

    # create a contract instance to decode transactions input
    contract_instance = w3.eth.contract(
        w3.toChecksumAddress(contract["abi_contract"]), abi=contract_abi)

    # the Etherscan APIs returns max 10000 results. The "while true" loop allows to get all the transactions from an address
    # Retrieve 10000 a time and append them on 'results'. Stop when the length of the retrieved transactions is 1
    while True:

        print(f"\tBlock number: {blockNumber}")

        # retrieve transactions within the specified block range (max 10000 transactions)
        transactions = eth.get_normal_txs_by_address(
            contract["txs_contract"], blockNumber, 99999999, "asc")

        print(f"\t{len(transactions)} transactions retrieved")

        # if the transactions length is 1 means that we reached the last block with a transaction to the specified address
        if(len(transactions) == 1):
            break

        # iterate through transactions to decode input and get function signature (function) and params (function_params)
        for transaction in transactions:

            # decode input of valid transactions
            if(transaction["isError"] == "0"):

                # in case of 'ValueError' exceptions, the execution goes on. This kind of exceptions are thrown when the input isn't decodable
                # happens with the deploy transaction and with functions of Proxy contracts like 'upgrade'.
                with suppress(ValueError):
                    function, function_params = contract_instance.decode_function_input(
                        transaction["input"])
                    transaction["inputFunction"] = str(function)
                    transaction["inputFunctionName"] = str(function.fn_name)

                    # bytes value must be decoded in utf-8
                    for key, value in function_params.items():
                        if isinstance(value, bytes):
                            function_params[key] = function_params[key].decode(
                                "utf-8", "ignore")

                    transaction["inputFunctionParams"] = str(function_params)

            # remove failed transactions
            else:
                transactions.remove(transaction)

        # save block number of lastest element in the transactions list
        blockNumber = transactions[-1]["blockNumber"]

        # append transactions retrieved in the current iteration to the total list of transactions
        results.extend(transactions)

# export JSON file
export_dictionary(results, "data/transactions", sys.argv[1])
