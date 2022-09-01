import os
import json


def get_contract_address(ethereum_network: str, contract_name: str) -> str:
    with open("constants/addresses.json") as addresses_file:
        addresses_list = json.load(addresses_file)

    return addresses_list[ethereum_network][contract_name]


def export_dictionary(transactions: dict, dirname: str, filename: str) -> None:
    os.makedirs(dirname, exist_ok=True)
    with open(f"{dirname}/{filename}.json", "w", encoding="utf-8") as f:
        json.dump(transactions, f, ensure_ascii=False, indent=2)


def print_stats(log):
    events = 0

    for t in log:
        events += len(t)

    print(f"Traces: {len(log)}")
    print(f"Events: {events}")
