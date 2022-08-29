import { useState } from "react";
import { NextPage } from "next";
import Head from "next/head";
import axios from "axios";

import { Contract } from "../typings/Contract";
import AddIcon from "../components/Icons/AddIcon";
import RemoveIcon from "../components/Icons/RemoveIcon";
import { useAlert } from "../contexts/AlertContext";

// 0xf87e31492faf9a91b02ee0deaad50d51d56d5d4d, 0xa57e126b341b18c262ad25b86bb4f65b5e2ade45
// 15429981, 99999999

const Play: NextPage = () => {
  const [contracts, setContracts] = useState<Contract[]>([{ name: "", txsAddress: "", abiAddress: "" }]);
  const [startBlock, setStartBlock] = useState(0);
  const [endBlock, setEndBlock] = useState(0);
  const [result, setResult] = useState([]);

  const { toggleAlert } = useAlert();

  const changeContract = (contractIndex: number, name: string, txsAddress: string, abiAddress: string) => {
    let updatedContracts = contracts.slice();
    updatedContracts = updatedContracts.map((contract, index) =>
      index === contractIndex ? { name, txsAddress, abiAddress } : contract
    );

    setContracts(updatedContracts);
  };

  const fetchTxs = async () => {
    try {
      const res = await axios.post("/txs", { contracts, startBlock, endBlock });

      setResult(res.data);
    } catch (err) {
      toggleAlert("Error while fetching transactions. Try again.", "error");
    }
  };

  return (
    <div className="flex flex-col items-center">
      <Head>
        <title>XES Ethereum Extractor</title>
      </Head>
      <div className="w-11/12 bg-gray-200 grid grid-cols-12 p-3 gap-6 rounded-md shadow-md">
        <h4 className="col-span-12">Something</h4>
        <div className="col-span-12 grid grid-cols-12 gap-x-5">
          {contracts.map(({ name, abiAddress, txsAddress }, index) => (
            <div key={index} className="col-span-12 grid grid-cols-12 gap-x-5 mt-2 first:mt-0">
              <div className="col-span-3">
                <label className="block text-sm font-medium p-2">Smart contract name</label>
                <input
                  type="text"
                  placeholder="Smart contract name"
                  className="w-full rounded-md p-2 shadow-md"
                  value={name}
                  onChange={(e) => changeContract(index, e.target.value, txsAddress, abiAddress)}
                />
              </div>
              <div className="col-span-4">
                <label className="block text-sm font-medium p-2">Smart contract transaction address</label>
                <input
                  type="text"
                  placeholder="Smart contract transaction address"
                  className="w-full rounded-md p-2 shadow-md"
                  value={txsAddress}
                  onChange={(e) => changeContract(index, name, e.target.value, abiAddress)}
                />
              </div>
              <div className="col-span-4">
                <label className="block text-sm font-medium p-2">Smart contract ABI address</label>
                <input
                  type="text"
                  placeholder="Smart contract ABI address"
                  className="w-full rounded-md p-2 shadow-md"
                  value={abiAddress}
                  onChange={(e) => changeContract(index, name, txsAddress, e.target.value)}
                />
              </div>
              <div className="col-span-1">
                <label className="block text-sm font-medium p-2 text-gray-200">{index === 0 ? "Add" : "Remove"}</label>
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
        <div className="col-span-3">
          <label className="block text-sm font-medium p-2">Start block</label>
          <input
            type="number"
            placeholder="Start block"
            className="w-full rounded-md p-2 shadow-md"
            value={startBlock}
            onChange={(e) => setStartBlock(e.target.valueAsNumber)}
          />
        </div>
        <div className="col-span-3">
          <label className="block text-sm font-medium p-2">End block</label>
          <input
            type="number"
            placeholder="End block"
            className="w-full rounded-md p-2 shadow-md"
            value={endBlock}
            onChange={(e) => setEndBlock(e.target.valueAsNumber)}
          />
        </div>
        <div className="col-span-12">
          <button
            className="bg-gray-500 hover:bg-gray-600 text-white p-2 rounded-md shadow-md self-end"
            onClick={() => fetchTxs()}
          >
            SEARCH
          </button>
        </div>
      </div>
      <div className="overflow-auto max-h-[550px] border w-11/12">
        <pre>{JSON.stringify(result, null, 2)}</pre>
      </div>
      <a
        href={`${process.env.NEXT_PUBLIC_SERVER_URL}/download_txs/${contracts.map(
          (contract) => `${contract.name}_`
        )}${startBlock}_${endBlock}`}
        download
        className="bg-gray-500 hover:bg-gray-600 text-white p-2 rounded-md shadow-md"
      >
        Click to download
      </a>
    </div>
  );
};

export default Play;
