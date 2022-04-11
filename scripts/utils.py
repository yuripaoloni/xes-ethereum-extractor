import  json

def get_contract_address(ethereum_network: str, contract_name: str ) -> str:
    with open("./constants/addresses.json") as addresses_file :
        addresses_list = json.load(addresses_file)
    
    return addresses_list[ethereum_network][contract_name]
