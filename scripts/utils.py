from inspect import _void
import os,json

def get_contract_address(ethereum_network: str, contract_name: str ) -> str:
    with open("constants/addresses.json") as addresses_file :
        addresses_list = json.load(addresses_file)
    
    return addresses_list[ethereum_network][contract_name]

def export_transactions(transactions: dict, filename: str) -> _void:
    os.makedirs("data", exist_ok=True)
    with open(f"data/{filename}.json", "w", encoding="utf-8") as f:
        json.dump(transactions, f, ensure_ascii=False, indent=2)