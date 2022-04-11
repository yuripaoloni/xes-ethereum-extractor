import os

from dotenv import load_dotenv
from etherscan import Etherscan
from web3 import Web3
from utils import get_contract_address

load_dotenv()

ETHERSCAN_API_KEY = os.getenv("ETHERSCAN_API_KEY")
eth = Etherscan(ETHERSCAN_API_KEY)

PROVIDER_ENDPOINT = os.getenv("INFURA_ENDPOINT")
w3 = Web3(Web3.HTTPProvider(PROVIDER_ENDPOINT))


LAND_PROXY_ADDRESS = get_contract_address("mainnet", "LANDProxy")
LAND_REGISTRY_ADDRESS = get_contract_address("mainnet", "LANDRegistry")

# retrieved transaction: https://etherscan.io/tx/0x4bc4ef4740c9bb7c2032a0f8ced2dcd1343c07dc43dbbb8de79fec8e63e24b9b
land_proxy_transactions = eth.get_normal_txs_by_address(LAND_PROXY_ADDRESS, 14558519 , 14558519, "asc")

land_registry_abi = eth.get_contract_abi(LAND_REGISTRY_ADDRESS)

land_registry_contract = w3.eth.contract(w3.toChecksumAddress(LAND_REGISTRY_ADDRESS), abi=land_registry_abi)

func_obj, func_params = land_registry_contract.decode_function_input(land_proxy_transactions[0]["input"])

print(func_obj, func_params)

