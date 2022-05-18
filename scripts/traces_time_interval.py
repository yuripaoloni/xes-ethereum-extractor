import os
import sys
import pandas as pd
from pm4py.objects.log.util import dataframe_utils
from pm4py.objects.conversion.log import converter as log_converter
from pm4py.objects.log.exporter.xes import exporter as xes_exporter

# ? params: input file
# ? set the frequence value

# transactions JSON file
file_path = sys.argv[1]

# import json file
transactions_df = pd.read_json(file_path)

# remove unnecessary fields
transactions_df.drop(["nonce", "gas", "gasPrice", "isError", "txreceipt_status",
                     "contractAddress", "gasUsed", "cumulativeGasUsed", "confirmations"], axis=1, inplace=True)

# timestamp to readable format
transactions_df['datetime'] = pd.to_datetime(
    transactions_df['timeStamp'], unit='s')

# drop null values (in case any)
transactions_df.dropna(inplace=True)

# reference values: https://bit.ly/3kY9FHi
freq = '20H'

# group by week-month
transactions_df['week_id'] = transactions_df.groupby(
    ['from', pd.Grouper(key='datetime', freq=freq)]).ngroup()
transactions_df['week_id'] -= transactions_df.groupby(
    'from')['week_id'].transform('min')

# tag
transactions_df['first_datetime'] = transactions_df.groupby(
    ['from', 'week_id'])['datetime'].transform('min')
transactions_df['tag'] = transactions_df['from'] + '_' + \
    transactions_df['first_datetime'].dt.strftime(
        '%Y%m%dT%H%M%S') + '_' + transactions_df['week_id'].astype(str)


# sort by 'timeStamp' value
transactions_df = transactions_df.sort_values("timeStamp")

# rename: from -> case: concept: name, inputFunctionName -> concept: name, timeStamp -> time: timestamp
transactions_df.rename(columns={"tag": "case:concept:name"}, inplace=True)
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
    log, f"data/logs/{freq.replace('-', '_')}_{os.path.splitext(os.path.basename(file_path))[0]}.xes")
