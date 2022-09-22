import axios from "axios";
import { NextPage } from "next";
import Head from "next/head";
import Link from "next/link";
import { useEffect, useState } from "react";
import Spinner from "../components/layout/Spinner";
import { useAlert } from "../contexts/AlertContext";
import { Contract } from "../typings/Contract";

const Log: NextPage = () => {
  const [contracts, setContracts] = useState<Contract[]>([]);
  const [startBlock, setStartBlock] = useState(0);
  const [endBlock, setEndBlock] = useState(99999999);

  const [loading, setLoading] = useState(false);
  const [keys, setKeys] = useState([""]);
  const [result, setResult] = useState([]);

  const [sortBy, setSortBy] = useState<string[]>([]);
  const [caseID, setCaseID] = useState("");
  const [conceptName, setConceptName] = useState("");

  const { toggleAlert } = useAlert();

  useEffect(() => {
    const contracts = localStorage.getItem("contracts");
    setContracts(JSON.parse(contracts ? contracts : "[]"));

    const startBlock = localStorage.getItem("startBlock");
    setStartBlock(startBlock ? parseInt(startBlock) : 0);

    const endBlock = localStorage.getItem("endBlock");
    setEndBlock(endBlock ? parseInt(endBlock) : 99999999);
  }, []);

  useEffect(() => {
    const fetchKeys = async () => {
      const res = await axios.get(`/keys/${contracts.map((contract) => `${contract.name}_`)}${startBlock}_${endBlock}`);

      setKeys(res.data);
      setCaseID(res.data[0]);
      setConceptName(res.data[0]);
    };

    contracts.length > 0 && fetchKeys();
  }, [contracts, startBlock, endBlock]);

  const generateXES = async () => {
    setLoading(true);
    try {
      const res = await axios.post(
        `/xes/${contracts.map((contract) => `${contract.name}_`)}${startBlock}_${endBlock}`,
        {
          columns: sortBy,
          caseID,
          conceptName,
        }
      );

      setResult(res.data);
    } catch (err) {
      toggleAlert("Error while generating the XES log. Try again!", "error");
    } finally {
      setLoading(false);
    }
  };

  const handleChangeSortBy = (value: string) => {
    let updatedSortBy = sortBy.slice();
    const index = updatedSortBy.indexOf(value);
    index === -1 ? updatedSortBy.push(value) : updatedSortBy.splice(index, 1);
    setSortBy(updatedSortBy);
  };

  return (
    <div className="flex flex-col items-center my-5">
      <Head>
        <title>XES Ethereum Extractor</title>
      </Head>
      <div className="w-11/12 bg-gray-200 grid grid-cols-12 p-3 gap-y-3 gap-x-2 rounded-md shadow-md">
        <h4 className="col-span-12 text-xl text-center font-semibold">
          Generate a XES log according to the following parameters
          <p className="text-sm text-center font-light">
            For more information on how to use the tool check the{" "}
            <span className="underline font-normal">
              <Link href="/about#usage">About page</Link>
            </span>
          </p>
        </h4>
        {contracts.map(({ name, abiAddress, txsAddress }, index) => (
          <div key={index} className="col-span-12 grid grid-cols-12 gap-x-2 mt-2 first:mt-0">
            <p className="lg:col-span-2 sm:text-base text-sm col-span-12">
              <span className="font-semibold sm:text-lg text-base mr-2">{index + 1}.</span> Name:{" "}
              <span className="font-semibold">{name}</span>
            </p>
            <p className="lg:col-span-5 lg:ml-0 sm:text-base text-sm ml-6 col-span-12 break-words">
              Transaction address: <span className="font-semibold">{txsAddress}</span>
            </p>
            <p className="lg:col-span-5 lg:ml-0 sm:text-base text-sm ml-6 col-span-12 break-words">
              ABI address: <span className="font-semibold">{abiAddress}</span>
            </p>
          </div>
        ))}
        <p className="lg:col-span-3 sm:col-span-4 col-span-12 sm:text-base text-sm">
          Start block: <span className="font-semibold">{startBlock}</span>
        </p>
        <p className="lg:col-span-3 sm:col-span-4 col-span-12 sm:text-base text-sm">
          End block: <span className="font-semibold">{endBlock}</span>
        </p>
        <div className="col-span-12 grid grid-cols-12 gap-x-6 gap-y-6 mt-2 pt-2 border-t border-gray-300">
          <div className="md:col-span-4 col-span-12">
            <label className="block text-sm font-medium p-2">
              Sort by
              <span className="text-xs font-light"> (Select one or more fields)</span>
            </label>
            <select
              placeholder="e.g. hash"
              className="scrollbar w-full rounded-md p-2 shadow-md border-transparent"
              onChange={(e) => handleChangeSortBy(e.target.value)}
            >
              {keys.map((key, index) => (
                <option
                  value={key}
                  key={index}
                  className={sortBy.indexOf(key) !== -1 ? "bg-indigo-700 text-white font-bold" : ""}
                >
                  {key}
                  {"  "}
                  <span>{sortBy.indexOf(key) !== -1 ? `(${sortBy.indexOf(key) + 1}°) ` : ""}</span>
                </option>
              ))}
            </select>
            {sortBy.length > 0 && (
              <label className="block text-sm font-semibold p-2">
                Selected fields: <span className="font-normal">{sortBy.join(", ")}</span>
              </label>
            )}
          </div>
          <div className="md:col-span-4 col-span-12">
            <label className="block text-sm font-medium p-2">Case ID</label>
            <select
              placeholder="e.g. from"
              className="w-full rounded-md p-2 shadow-md border-transparent"
              value={caseID}
              onChange={(e) => setCaseID(e.target.value)}
            >
              {keys.map((key, index) => (
                <option key={index}>{key}</option>
              ))}
            </select>
          </div>
          <div className="md:col-span-4 col-span-12">
            <label className="block text-sm font-medium p-2">Concept name</label>
            <select
              placeholder="e.g. inputFunctionName"
              className="w-full rounded-md p-2 shadow-md border-transparent"
              value={conceptName}
              onChange={(e) => setConceptName(e.target.value)}
            >
              {keys.map((key, index) => (
                <option key={index}>{key}</option>
              ))}
            </select>
          </div>
          <div className="col-span-12">
            <button
              className="bg-indigo-500 hover:bg-indigo-700 text-white p-2 rounded-md shadow-md self-end"
              onClick={() => generateXES()}
            >
              Generate XES
            </button>
          </div>
        </div>
      </div>
      <div className="w-11/12 mt-16 max-h-[650px]">
        {loading ? (
          <Spinner text="Large block intervals may take several minutes..." />
        ) : (
          result.length > 0 && (
            <>
              <p className="text-center text-xl font-semibold mb-2">
                First 400 lines of XES log for{" "}
                {contracts.map((contract, index) => `${index != 0 ? ", " : ""}${contract.name}`)}
              </p>
              <div className="scrollbar overflow-auto max-h-[550px] border rounded-md w-full">
                <pre>{result}</pre>
                <pre>{"\n\t\t\t...\n\n"}</pre>
                <pre>{"\t</trace>"}</pre>
                <pre>{"</log>"}</pre>
              </div>
              <button>
                <a
                  href={`${process.env.NEXT_PUBLIC_SERVER_URL}/download_xes/${contracts.map(
                    (contract) => `${contract.name}_`
                  )}${startBlock}_${endBlock}`}
                  download
                  className="block bg-gray-500 hover:bg-gray-600 text-white p-2 rounded-md shadow-md mt-4"
                >
                  Download full dataset
                </a>
              </button>
            </>
          )
        )}
      </div>
    </div>
  );
};

export default Log;
