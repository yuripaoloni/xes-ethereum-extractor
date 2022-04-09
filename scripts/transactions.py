import os, json
from dotenv import load_dotenv
from etherscan import Etherscan

load_dotenv()

ETHERSCAN_API_KEY = os.getenv("ETHERSCAN_API_KEY")
eth = Etherscan(ETHERSCAN_API_KEY)


with open("./constants/addresses.json") as addresses :
    d = json.load(addresses)
    print(d["mainnet"]["LANDProxy"])

# print(eth.get_block_number_by_timestamp(timestamp="1578638524", closest="before"))
