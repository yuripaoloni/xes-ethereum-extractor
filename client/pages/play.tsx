import { useEffect, useState } from "react";
import { NextPage } from "next";
import Head from "next/head";
import axios from "axios";

import { Contract } from "../typings/Contract";
import AddIcon from "../components/Icons/AddIcon";
import RemoveIcon from "../components/Icons/RemoveIcon";
import { useAlert } from "../contexts/AlertContext";
import Link from "next/link";

// 0xf87e31492faf9a91b02ee0deaad50d51d56d5d4d, 0xa57e126b341b18c262ad25b86bb4f65b5e2ade45
// 15429981, 99999999

const Play: NextPage = () => {
  const [contracts, setContracts] = useState<Contract[]>([{ name: "", txsAddress: "", abiAddress: "" }]);
  const [startBlock, setStartBlock] = useState(0);
  const [endBlock, setEndBlock] = useState(99999999);

  const [result, setResult] = useState([]);
  const [loading, setLoading] = useState(false);

  const { toggleAlert } = useAlert();

  useEffect(() => {
    const contracts = localStorage.getItem("contracts");
    setContracts(JSON.parse(contracts ? contracts : "[]"));

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
      <div className="w-11/12 bg-gray-200 grid grid-cols-12 p-3 gap-y-6 gap-x-4 rounded-md shadow-md">
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
        <div className="col-span-12">
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
          <div className="flex flex-col items-center justify-center">
            <svg className="w-20 h-20  animate-spin" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
              <path
                d="M8.175 7.377l-3.042-5.27 1.732-1 3.045 5.273c-.635.238-1.222.573-1.735.997zm-.799.8l-5.27-3.042-1 1.732 5.274 3.045c.237-.635.572-1.223.996-1.735zm-1.376 3.823c0-.341.035-.673.09-.999h-6.09v1.999h6.09c-.055-.326-.09-.659-.09-1zm11.351-2.705l5.208-3.007-.333-.577-5.206 3.007c.121.185.23.379.331.577zm-5.351-3.295c.341 0 .673.035.999.09v-6.09h-1.999v6.09c.326-.055.659-.09 1-.09zm3.14.894l3.004-5.204-.288-.166-3 5.197.284.173zm1.685 8.662l5.234 3.022.666-1.154-5.229-3.019c-.181.41-.408.794-.671 1.151zm-10.444-1.467l-5.274 3.046 1 1.732 5.27-3.042c-.424-.513-.759-1.1-.996-1.736zm11.594-2.589l.025.5-.025.5h6.025v-1h-6.025zm-3.727 6.061l3.03 5.249 1.442-.833-3.031-5.25c-.437.34-.92.623-1.441.834zm-2.248.439c-.341 0-.674-.035-1-.09v6.09h1.999v-6.09c-.326.055-.658.09-.999.09zm-3.824-1.376l-3.042 5.27 1.732 1 3.045-5.274c-.635-.237-1.222-.572-1.735-.996z"
                fill="#6B7280"
              />
            </svg>
            <p className="text-xl italic text-gray-500 font-semibold mt-3">
              Large block intervals may take several minutes...
            </p>
          </div>
        ) : (
          result.length > 0 && (
            <>
              <p className="text-center text-xl font-semibold mb-2">
                Preview results for {contracts.map((contract, index) => `${index != 0 ? ", " : ""}${contract.name} `)}
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

export default Play;
