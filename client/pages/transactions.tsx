import { useEffect, useState } from "react";
import { NextPage } from "next";
import Head from "next/head";
import axios from "axios";

import { Contract } from "../typings/Contract";
import AddIcon from "../components/Icons/AddIcon";
import RemoveIcon from "../components/Icons/RemoveIcon";
import { useAlert } from "../contexts/AlertContext";
import Link from "next/link";
import Spinner from "../components/layout/Spinner";

const Transactions: NextPage = () => {
  const [contracts, setContracts] = useState<Contract[]>([{ name: "", txsAddress: "", abiAddress: "" }]);
  const [startBlock, setStartBlock] = useState(0);
  const [endBlock, setEndBlock] = useState(99999999);

  const [result, setResult] = useState([]);
  const [loading, setLoading] = useState(false);

  const { toggleAlert } = useAlert();

  useEffect(() => {
    const contracts = localStorage.getItem("contracts");
    setContracts(JSON.parse(contracts ? contracts : '[{"name":"","txsAddress":"","abiAddress":""}]'));

    const startBlock = localStorage.getItem("startBlock");
    setStartBlock(startBlock ? parseInt(startBlock) : 0);

    const endBlock = localStorage.getItem("endBlock");
    setEndBlock(endBlock ? parseInt(endBlock) : 99999999);
  }, []);

  const handleChangeContract = (contractIndex: number, name: string, txsAddress: string, abiAddress: string) => {
    let updatedContracts = contracts.slice();
    updatedContracts = updatedContracts.map((contract, index) =>
      index === contractIndex ? { name, txsAddress, abiAddress } : contract
    );

    localStorage.setItem("contracts", JSON.stringify(updatedContracts));

    setContracts(updatedContracts);
  };

  const handleChangeStartBlock = (value: number) => {
    setStartBlock(value);
    localStorage.setItem("startBlock", value.toString());
  };

  const handleChangeEndBlock = (value: number) => {
    setEndBlock(value);
    localStorage.setItem("endBlock", value.toString());
  };

  const fetchTxs = async () => {
    setLoading(true);
    try {
      const res = await axios.post("/txs", { contracts, startBlock, endBlock });

      setResult(res.data);

      res.data.length === 0 && toggleAlert("No result. Try again with different search parameters!", "warning", 5000);
    } catch (err) {
      toggleAlert("Error while fetching transactions. Try again.", "error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center my-5">
      <Head>
        <title>XES Ethereum Extractor</title>
      </Head>
      <div className="w-11/12 bg-gray-200 grid grid-cols-12 p-3 gap-4 rounded-md shadow-md">
        <h4 className="col-span-12 text-xl text-center font-semibold">
          Insert the smart contracts you want to collect data from
        </h4>
        <div className="col-span-12 grid grid-cols-12 gap-x-4">
          {contracts.map(({ name, abiAddress, txsAddress }, index) => (
            <div
              key={index}
              className="col-span-12 grid grid-cols-12 gap-x-4 mt-2 first:mt-0 border-b pb-4 border-gray-300"
            >
              <div className="sm:col-span-3 col-span-10">
                <label className="block text-sm font-medium p-2">Name</label>
                <input
                  type="text"
                  placeholder="e.g. UniswapV2Factory"
                  className="w-full rounded-md p-2 shadow-md"
                  value={name}
                  onChange={(e) => handleChangeContract(index, e.target.value, txsAddress, abiAddress)}
                />
              </div>
              <div className="sm:col-span-4 col-span-10">
                <label className="block text-sm font-medium p-2">Transactions address</label>
                <input
                  type="text"
                  placeholder="0x...123"
                  className="w-full rounded-md p-2 shadow-md"
                  value={txsAddress}
                  onChange={(e) => handleChangeContract(index, name, e.target.value, abiAddress)}
                />
              </div>
              <div className="sm:col-span-4 col-span-10">
                <label className="block text-sm font-medium p-2">ABI address</label>
                <input
                  type="text"
                  placeholder="0x...123"
                  className="w-full rounded-md p-2 shadow-md"
                  value={abiAddress}
                  onChange={(e) => handleChangeContract(index, name, txsAddress, e.target.value)}
                />
              </div>
              <div className="sm:col-span-1 col-span-1 self-end">
                <button
                  onClick={() =>
                    index === 0
                      ? setContracts((prev) => [...prev, { name: "", txsAddress: "", abiAddress: "" }])
                      : setContracts((prev) => prev.filter((item, itemIndex) => index !== itemIndex))
                  }
                >
                  {index === 0 ? <AddIcon /> : <RemoveIcon />}
                </button>
              </div>
            </div>
          ))}
        </div>
        <div className="lg:col-span-3 col-span-5">
          <label className="block text-sm font-medium p-2">Start block</label>
          <input
            type="number"
            placeholder="0"
            className="w-full rounded-md p-2 shadow-md"
            value={startBlock}
            onChange={(e) => handleChangeStartBlock(e.target.valueAsNumber)}
          />
        </div>
        <div className="lg:col-span-3 col-span-5">
          <label className="block text-sm font-medium p-2">End block</label>
          <input
            type="number"
            placeholder="99999999"
            className="w-full rounded-md p-2 shadow-md"
            value={endBlock}
            onChange={(e) => handleChangeEndBlock(e.target.valueAsNumber)}
          />
        </div>
        <div className="col-span-12 mt-2">
          <button
            className="bg-indigo-500 hover:bg-indigo-700 text-white p-2 rounded-md shadow-md self-end"
            onClick={() => fetchTxs()}
          >
            SEARCH
          </button>
        </div>
      </div>
      <div className="w-11/12 mt-16 max-h-[650px]">
        {loading ? (
          <Spinner text="Large block intervals may take several minutes..." />
        ) : (
          result.length > 0 && (
            <>
              <p className="text-center text-xl font-semibold mb-2">
                Preview results for {contracts.map((contract, index) => `${index != 0 ? ", " : ""}${contract.name}`)}
              </p>
              <div className="scrollbar overflow-auto max-h-[550px] border rounded-md w-full">
                <pre>{JSON.stringify(result, null, 2)}</pre>
              </div>
              <button>
                <a
                  href={`${process.env.NEXT_PUBLIC_SERVER_URL}/download_txs/${contracts.map(
                    (contract) => `${contract.name}_`
                  )}${startBlock}_${endBlock}`}
                  download
                  className="block bg-gray-500 hover:bg-gray-600 text-white p-2 rounded-md shadow-md mt-4"
                >
                  Download full dataset
                </a>
              </button>
              <button className="bg-indigo-500 hover:bg-indigo-700 text-white p-2 rounded-md shadow-md mt-4 ml-4">
                <Link href="/log">Next step</Link>
              </button>
            </>
          )
        )}
      </div>
    </div>
  );
};

export default Transactions;
