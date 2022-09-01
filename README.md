# XES Ethereum Extractor

Application-agnostic methodology to enable the application of Process Mining techniques on the Ethereum blockchain. Read the paper on [/server/paper](/server/paper/xes_ethereum_extractor.pdf).

## Client

The client has been developed with Next.js. Read more on the client's [README](client/README.md).

## Server

The server has been developed with Flask. Read more on the server's [README](server/README.md).

## Misc

The *misc* folder contains the set of scripts and notebooks used during the development of the methodology. It also contains the results (e.g., logs, models, charts, and more) obtained with it.

To get the Python scripts to work, a `.env` file with the following content should be provided:

```
ETHERSCAN_API_KEY=<api_key>
GETBLOCK_ENDPOINT=https://eth.getblock.io/mainnet/?api_key=<api_key>
INFURA_ENDPOINT=https://mainnet.infura.io/v3/<api_key>
```

To install the required dependencies listed in `requirements.txt` run: `pip install -r requirements.txt`.

### Scripts

The *scripts* folder contains Python scripts used frequently in the notebooks.
- `traces_time_interval.py`: during the experiment I tried to group transactions in trace considering also a time interval. Traces aree built considering transactions from the same address and within a time interval. So, for a user we have more than one trace, e.g., if a user has done transactions for 15 days and we consider a time interval a 5 days, we will end up with 3 different traces for the user.
- `traces.py`: contains the methods to clean the dataframe (i.e., `clean_df(df)`), sort by a list of columns (i.e., `sort_df(df, columns: list[str])`), and generate and export the XES log (i.e., `generate_xes(df, filename, case_concept_name, concept_name)`).
- `transactions.py`: contains the method to collect transactions from a one or more smart contracts, a start block, and an end block.
- `utils.py`: contains utility methods
- `transaction_internal_execution.py`: contains the code to collect transactions internal execution using the [EthTx](https://github.com/ethtx/ethtx) library. To work it requires an Ethereum node with *debug_mode* activated. Two services that provides such nodes for free are [getblock.io](https://getblock.io/)(only last 64 blocks) and [archivenode.io](https://archivenode.io/).

### Notebooks

The *notebooks* folder contains Jupyter Notebooks to executed more complex operations with respect to the scripts.
- `framework.ipynb`: contains the code for a full execution with transactions
- `function_name_dfs.ipynb`: contains the code to generate XES logs for each function name using the transactions internal execution logs. Each log refers to specific function and the traces, which contains internal executions, are grouped by transaction hash.
- `subcalls_trace.ipynb`: contains the code to generate XES logs compliant with [BPMNMiner](https://www.sciencedirect.com/science/article/abs/pii/S0306437915001325).
- `discovery.ipynb`: contains the code to run the [Inductive Miner (IM)](https://citeseerx.ist.psu.edu/viewdoc/download?doi=10.1.1.396.197&rep=rep1&type=pdf), the [Inductive Miner Infrequent (IMf)](http://www.padsweb.rwth-aachen.de/wvdaalst/publications/p761.pdf), the Inductive Miner Directly-follows (IMd), the [Heuristics Miner](https://www.semanticscholar.org/paper/Process-mining-with-the-HeuristicsMiner-algorithm-Weijters-Aalst/e61c748f9a2df9c3fbda3a8361fdc3d847b7e3ae?p2df), and the Alpha Miner. The Process Discovery algorithms are executed with [PM4Py](https://pm4py.fit.fraunhofer.de/).
- `conformance_checking.ipynb`: contains the code to run Conformance checking with PM4Py. It supports token-based replay and alignment to obtain fitness, precision, generalization, and simplicity.
- `pm4py_simulation.ipynb`: contains the code to execute a playout of a Petri Net and a Process Tree with PM4Py.
- `pm4py_statistics.ipynb`: contains the code to run some of the [PM4Py statistics](https://pm4py.fit.fraunhofer.de/documentation#statistics).
- `sna.ipynb`: contains the code to run Social Network Analysis with PM4Py.

### Data

The *data* folder contains the results of the operations executed in */scripts* and */notebooks*. It contains the fetched transactions, the generated logs, the discovered models and other data obtained with the execution of Process Mining techniques.

## Author

- [yuripaoloni](https://github.com/yuripaoloni)
