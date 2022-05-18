import os
import sys
import pandas as pd
from pm4py.objects.log.util import dataframe_utils
from pm4py.objects.conversion.log import converter as log_converter
from pm4py.objects.log.exporter.xes import exporter as xes_exporter

# ? params: input file

# transactions JSON file
file_path = sys.argv[1]

# import json file and sort by 'timeStamp' value
transactions_df = pd.read_json(file_path)
transactions_df = dataframe_utils.convert_timestamp_columns_in_df(
    transactions_df)
transactions_df = transactions_df.sort_values("timeStamp")

# remove unnecessary fields
transactions_df.drop(["nonce", "gas", "gasPrice", "isError", "txreceipt_status",
                     "contractAddress", "gasUsed", "cumulativeGasUsed", "confirmations"], axis=1, inplace=True)

# drop null values (in case any)
transactions_df.dropna(inplace=True)

# set the user as the resource that perform the transaction
transactions_df["org:resource"] = transactions_df["from"]

# rename: from -> case:concept:name, inputFunctionName -> concept:name, timeStamp -> time:timestamp
transactions_df.rename(columns={"from": "case:concept:name"}, inplace=True)
transactions_df.rename(columns={"timeStamp": "time:timestamp"}, inplace=True)
transactions_df.rename(
    columns={"inputFunctionName": "concept:name"}, inplace=True)

# specify that the field identifying the case identifier attribute is the field with name 'case:concept:name'
parameters = {
    log_converter.Variants.TO_EVENT_LOG.value.Parameters.CASE_ID_KEY: 'case:concept:name'}
log = log_converter.apply(transactions_df, parameters=parameters,
                          variant=log_converter.Variants.TO_EVENT_LOG)

# export generated events log in xes
xes_exporter.apply(
    log, f"data/logs/{os.path.splitext(os.path.basename(file_path))[0]}.xes")
