import os

from contextlib import suppress
from dotenv import load_dotenv
from etherscan import Etherscan
from web3 import Web3


# contracts are in the form: {"name": "LAND", "txs_contract": "0xf87e31492faf9a91b02ee0deaad50d51d56d5d4d","abi_contract": "0xa57e126b341b18c262ad25b86bb4f65b5e2ade45"}
def get_transactions(contracts, start_block, end_block):

    # initialize etherscan-python and web3.py with respective API keys
    load_dotenv()
    ETHERSCAN_API_KEY = os.getenv("ETHERSCAN_API_KEY")
    eth = Etherscan(ETHERSCAN_API_KEY)
    PROVIDER_ENDPOINT = os.getenv("INFURA_ENDPOINT")
    w3 = Web3(Web3.HTTPProvider(PROVIDER_ENDPOINT))

    # will contain all the retrieved transactions
    results = []

    for contract in contracts:
        print(f"Contract: {contract['name']}")

        block_number = start_block

        # get contracts ABI
        contract_abi = eth.get_contract_abi(contract["abi_contract"])

        # create a contract instance to decode transactions input
        contract_instance = w3.eth.contract(
            w3.toChecksumAddress(contract["abi_contract"]), abi=contract_abi)

        # the Etherscan APIs returns max 10000 results. The "while true" loop allows to get all the transactions from an address
        # Retrieve 10000 a time and append them on 'results'. Stop when the length of the retrieved transactions is 1
        while True:

            print(f"\tBlock number: {block_number}")

            # retrieve transactions within the specified block range (max 10000 transactions)
            transactions = eth.get_normal_txs_by_address(
                contract["txs_contract"], block_number, end_block, "asc")

            print(f"\t{len(transactions)} transactions retrieved")

            last_transaction = transactions[-1] if transactions else None
            last_result = results[-1] if results else None

            # if last_transaction hash = last_result hash, it means we reached the end
            if(last_transaction is not None and last_result is not None and last_transaction['hash'] == last_result['hash']):
                break

            # iterate through transactions to decode input and get function signature (function) and params (function_params)
            # transactions[:] is a copy transactions. We iterate on a copy to not screw up the list with transactions.remove() below
            for transaction in transactions[:]:

                # decode input of valid transactions
                if(transaction["isError"] == "0"):

                    # in case of 'ValueError' exceptions, the execution goes on. This kind of exceptions are thrown when the input isn't decodable
                    # happens with the deploy transaction and with functions of Proxy contracts like 'upgrade'.
                    with suppress(ValueError):
                        function, function_params = contract_instance.decode_function_input(
                            transaction["input"])
                        transaction["inputFunctionName"] = str(
                            function.fn_name)

                        # bytes value must be decoded in utf-8
                        for key, value in function_params.items():
                            if isinstance(value, bytes):
                                function_params[key] = function_params[key].decode(
                                    "utf-8", "ignore")

                            transaction[f"{contract['name']}_{key}" if len(contracts) > 1 else f"{key}"] = str(
                                value)

                        transaction["inputFunctionParams"] = str(
                            function_params)

                # remove failed transactions
                else:
                    transactions.remove(transaction)

            # save block number of lastest element in the transactions list
            block_number = transactions[-1]["blockNumber"]

            # append transactions retrieved in the current iteration to the total list of transactions
            results.extend(transactions)

    return results
