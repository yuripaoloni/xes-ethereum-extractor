import os

from dotenv import load_dotenv
from etherscan import Etherscan
from web3 import Web3
from utils import get_contract_address, export_transactions

load_dotenv()

# initialize etherscan-python and web3.py with respective API keys
ETHERSCAN_API_KEY = os.getenv("ETHERSCAN_API_KEY")
eth = Etherscan(ETHERSCAN_API_KEY)
PROVIDER_ENDPOINT = os.getenv("INFURA_ENDPOINT")
w3 = Web3(Web3.HTTPProvider(PROVIDER_ENDPOINT))

# get contracts addresses from /constants/addresses.json
LAND_PROXY_ADDRESS = get_contract_address("mainnet", "LANDProxy")
LAND_REGISTRY_ADDRESS = get_contract_address("mainnet", "LANDRegistry")

# get contracts ABI
land_registry_abi = eth.get_contract_abi(LAND_REGISTRY_ADDRESS)

# create a contract instance to decode transactions input
land_registry_contract = w3.eth.contract(w3.toChecksumAddress(LAND_REGISTRY_ADDRESS), abi=land_registry_abi)
 
# retrieve transactions. The inserted blocks range comprehend 2500 transactions [13883342-14576650]
land_proxy_transactions = eth.get_normal_txs_by_address(LAND_PROXY_ADDRESS, 13883342, 14576650, "asc")

# iterate through transactions to decode input and get function signature (function) and params (function_params)
for transaction in land_proxy_transactions:
    # decode input of valid transactions
    if(transaction["isError"] == "0"):
        function, function_params = land_registry_contract.decode_function_input(transaction["input"])
        transaction["input_function"] = str(function)
        # bytes value must be decoded in utf-8
        for key, value in function_params.items():
            if isinstance(value, bytes):
                function_params[key] = function_params[key].decode("utf-8", "ignore")

        transaction["input_function_params"] = str(function_params)
    # remove failed transactions
    else:
        land_proxy_transactions.remove(transaction)

# export JSON file
export_transactions(land_proxy_transactions, "land_proxy_transactions")

