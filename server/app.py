import json
import os
import pandas as pd

from flask import Flask, request, send_file
from flask_cors import CORS
from contextlib import suppress
from dotenv import load_dotenv
from etherscan import Etherscan
from web3 import Web3
from pm4py.objects.log.util import dataframe_utils
from pm4py.objects.conversion.log import converter as log_converter
from pm4py.objects.log.exporter.xes import exporter as xes_exporter

app = Flask(__name__)
cors = CORS(app, resources={"/*": {"origins": "*"}})


# download paper
@app.route("/download_paper", methods=['GET'])
def download_paper():
    try:
        return send_file("paper/xes_ethereum_extractor.pdf", as_attachment=True)
    except Exception as e:
        return e, 400


# download txs. file_name should be {contract_name}_{start_block}_{end_block}
# e.g. LAND_15429981_999999999 or LAND_ESTATE_0_999999999
@app.route("/download_txs/<file_name>", methods=['GET'])
def download_txs(file_name):
    try:
        return send_file(f"txs/{file_name}.json", as_attachment=True)
    except Exception as e:
        return e, 400


# download xes. file_name should be {contract_name}_{start_block}_{end_block}
# e.g. LAND_15429981_999999999 or LAND_ESTATE_0_999999999
@app.route("/download_xes/<file_name>", methods=['GET'])
def download_xes(file_name):
    try:
        return send_file(f"xes/{file_name}.xes", as_attachment=True)
    except Exception as e:
        return e, 400


# fetch txs, stores in /txs and return first 20 elements
@app.route("/txs", methods=['POST'])
def fetch_transactions():
    try:

        # initialize etherscan-python and web3.py with respective API keys
        load_dotenv()
        ETHERSCAN_API_KEY = os.getenv("ETHERSCAN_API_KEY")
        eth = Etherscan(ETHERSCAN_API_KEY)
        PROVIDER_ENDPOINT = os.getenv("INFURA_ENDPOINT")
        w3 = Web3(Web3.HTTPProvider(PROVIDER_ENDPOINT))

        # will contain all the retrieved transactions
        results = []

        data = request.get_json()

        # name, txs_contract, abi_contract
        contracts = data['contracts']
        start_block = data['startBlock']
        end_block = data['endBlock']

        filename = ""

        for contract in contracts:
            print(f"Contract: {contract['name']}")

            filename += f"{contract['name']}"

            block_number = start_block

            # get contracts ABI
            contract_abi = eth.get_contract_abi(contract["abiAddress"])

            # create a contract instance to decode transactions input
            contract_instance = w3.eth.contract(
                w3.toChecksumAddress(contract["abiAddress"]), abi=contract_abi)

            # the Etherscan APIs returns max 10000 results. The "while true" loop allows to get all the transactions from an address
            # Retrieve 10000 a time and append them on 'results'. Stop when the length of the retrieved transactions is 1
            while True:

                print(f"\tBlock number: {block_number}")

                # retrieve transactions within the specified block range (max 10000 transactions)
                transactions = eth.get_normal_txs_by_address(
                    contract["txsAddress"], block_number, end_block, "asc")

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

        dirname = "txs"
        filename += f"_{start_block}_{end_block}"

        os.makedirs(dirname, exist_ok=True)
        with open(f"{dirname}/{filename}.json", "w", encoding="utf-8") as f:
            json.dump(results, f, ensure_ascii=False, indent=2)

        return results[0:20], 200

    except Exception as e:
        print(e)
        return str(e), 400


# get all the keys in the extracted transactions
@app.route("/keys/<file_name>", methods=['GET'])
def get_txs_keys(file_name):
    try:
        f = open(f'txs/{file_name}.json')
        data = json.load(f)

        all_keys = set().union(*(d.keys() for d in data))

        return sorted(list(filter(None, all_keys))), 200

    except Exception as e:
        return e, 400


# generate XES log and return first 400 lines
@app.route("/xes/<file_name>", methods=['POST'])
def generate_xes(file_name):
    try:
        data = request.get_json()
        columns = data['columns']
        case_concept_name = data['caseID']
        concept_name = data['conceptName']

        df = pd.read_json(f'txs/{file_name}.json')
        df.drop(["blockNumber", "nonce", "blockHash", "value", "gas", "gasPrice", "isError", "txreceipt_status", "input",
                 "contractAddress", "cumulativeGasUsed", "gasUsed",  "confirmations", "methodId"], axis=1, inplace=True)
        df = dataframe_utils.convert_timestamp_columns_in_df(df)
        df = df.sort_values(by=['timeStamp', 'transactionIndex'])

        df = df.sort_values(by=columns)
        df.reset_index(drop=True, inplace=True)

        # create columns: from -> case:concept:name, inputFunctionName -> concept:name, timeStamp -> time:timestamp, from -> org:resource
        df["org:resource"] = df["from"]
        df["case:concept:name"] = df[case_concept_name]
        df["time:timestamp"] = df["timeStamp"]
        df["concept:name"] = df[concept_name]

        # specify that the field identifying the case identifier attribute is the field with name 'case:concept:name'
        parameters = {
            log_converter.Variants.TO_EVENT_LOG.value.Parameters.CASE_ID_KEY: 'case:concept:name'}
        log = log_converter.apply(df, parameters=parameters,
                                  variant=log_converter.Variants.TO_EVENT_LOG)

        pd.options.mode.use_inf_as_na = True  # consider NA also "" or '' during notna()

        # remove "nan" attributes from events
        for t in log:
            for i, e in enumerate(t):
                t[i] = {k: v for k, v in e.items() if pd.Series(
                    v).notna().all()}

        os.makedirs("xes", exist_ok=True)
        xes_exporter.apply(
            log, f"./xes/{file_name}.xes")

        with open(f"./xes/{file_name}.xes") as f:
            lines = [next(f) for x in range(400)]

        return lines

    except Exception as e:
        print(e)
        return e, 400
