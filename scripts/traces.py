import os
import sys
import pandas as pd
from pm4py.objects.log.util import dataframe_utils
from pm4py.objects.conversion.log import converter as log_converter
from pm4py.objects.log.exporter.xes import exporter as xes_exporter


def clean_df(df):
    # remove unnecessary fields
    df.drop(["blockNumber", "nonce", "blockHash", "value", "gas", "gasPrice", "isError", "txreceipt_status", "input",
             "contractAddress", "cumulativeGasUsed", "gasUsed",  "confirmations", "methodId"], axis=1, inplace=True)

    df = dataframe_utils.convert_timestamp_columns_in_df(df)
    df = df.sort_values(by=['timeStamp', 'transactionIndex'])

    return df


def sort_df(df, columns: list[str]):
    df = df.sort_values(by=columns)
    df.reset_index(drop=True, inplace=True)  # needed after sorting

    return df


def generate_xes(df, filename, case_concept_name, concept_name):

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
        events += len(t)
        for i, e in enumerate(t):
            t[i] = {k: v for k, v in e.items() if pd.Series(
                v).notna().all()}

    # export generated events log in xes
    xes_exporter.apply(
        log, f"../data/logs/{os.path.splitext(os.path.basename(filename))[0]}.xes")
