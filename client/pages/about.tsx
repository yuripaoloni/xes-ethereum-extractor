import { NextPage } from "next";
import Head from "next/head";
import Image from "next/image";
import Link from "next/link";

const About: NextPage = () => {
  return (
    <div className="flex flex-col items-center my-5">
      <Head>
        <title>XES Ethereum Extractor</title>
      </Head>
      <div className="w-9/12">
        <h1 className="text-center text-4xl tracking-tight font-bold sm:text-5xl">
          <span className="block sm:inline">XES</span> <span className="block text-indigo-500 sm:inline">Ethereum</span>{" "}
          <span className="block sm:inline">Extractor</span>
          <h4 className="text-xl font-medium text-gray-500 mt-2">
            Application-agnostic methodology to enable the application of Process Mining techniques on the Ethereum
            blockchain
          </h4>
        </h1>
        <h4 className="text-2xl font-semibold mt-5 mb-3 pt-5 border-t border-gray-300">Abstract</h4>
        <p className="text-justify text-lg">
          Through smart contracts, blockchain has become a technology for managing trustless peer-to-peer exchanges of
          digital assets, paving the way for new forms of trade and business. In such a scenario, the application of
          Process Mining can help understand processes and their actual execution in ways other strategies cannot.
          However, due to the structure of blockchain data, applying Process Mining in such a context is challenging.
          The techniques created so far by researchers have limitations when applied to smart contracts. Some are
          tailored to specific use cases like blockchain-based Business Process Management Systems. Others require the
          data under analysis to be in a precise format which is uncommon for a significant portion of the existing
          smart contracts. To solve this challenge, we propose an application-agnostic extraction methodology to collect
          data from every EVM-compatible smart contract and enable the application of Process Mining techniques. The
          proposed methodology focuses on blockchain transations and their internal execution. The former, unlike
          events, have standard parameters that ensure a common ground of operations. The latter represents the
          execution flow of transactions, which is the invocations of the functions of smart contracts involved in the
          process. The methodology comprises five steps: (i) extraction of data from smart contracts, (ii) cleaning of
          raw data, (iii) selecting and defining sorting criteria, (iv) trace construction, and, finally, (v) XES log
          generation. An in-depth case study of Decentraland, a metaverse and digital assets marketplace developed on
          the Ethereum blockchain, has been carried out to demonstrate the validity of the proposed methodology. We were
          able to generate XES logs from different block ranges and one or more Decentraland smart contracts combined.
          Unlike event data collection, a plain execution with transactions does not require prior knowledge of smart
          contract code. On the generated XES logs, we successfully applied several Process Mining techniques like
          Simulation, Social Network Analysis, and Process discovery.
        </p>
        <h4 id="usage" className="text-2xl font-semibold mt-5 mb-3 pt-5 border-t border-gray-300">
          How to use
        </h4>
        <p className="text-justify text-lg">
          To start using the methodology, head over to the{" "}
          <span className="underline text-indigo-600">
            <Link href="/transactions">Tool</Link>
          </span>{" "}
          page. There you can add one or more smart contracts to analyze by specifying three parameters for each:
          <ul className="list-disc ml-10 my-3 space-y-2">
            <li>
              <span className="font-semibold">Name: </span> the name of the smart contract. It is not mandatory to use
              the actual smart contract name (e.g., UniswapV2Factory). Use a name that can help you identify it.
            </li>
            <li>
              <span className="font-semibold">Transaction address: </span> this is the address from which transactions
              will be collected.
            </li>
            <li>
              <span className="font-semibold">ABI address: </span> this is the address of the smart contract that
              contains the logic to execute the transactions. In general, it coincides with the{" "}
              <span className="italic">Transaction address</span> but, in same cases (e.g.,{" "}
              <a
                className="underline text-indigo-600"
                href="https://docs.openzeppelin.com/contracts/4.x/api/proxy"
                target="_blank"
                rel="noopener noreferrer"
              >
                Proxy pattern
              </a>
              ), it does not. An example is the{" "}
              <a
                className="underline text-indigo-600"
                href="https://etherscan.io/address/0xa57e126b341b18c262ad25b86bb4f65b5e2ade45"
                target="_blank"
                rel="noopener noreferrer"
              >
                LANDRegistry
              </a>{" "}
              contract which is contacted through a proxy contract (i.e.,{" "}
              <a
                className="underline text-indigo-600"
                href="https://etherscan.io/address/0xf87e31492faf9a91b02ee0deaad50d51d56d5d4d"
                target="_blank"
                rel="noopener noreferrer"
              >
                LANDProxy
              </a>
              ).
            </li>
          </ul>
          In addition, you can specify a <span className="font-semibold">start block</span> and an{" "}
          <span className="font-semibold">end block</span> to scope the research to a precise time interval. If not, you
          can stick with the default parameters: <span className="italic">0</span> and{" "}
          <span className="italic">99999999</span>.
          <div className="my-4">
            <Image
              src="/trasanctions_form_example.png"
              alt="transactions form example"
              layout="responsive"
              width={1715}
              height={436}
            />
          </div>
          At this point, you can search for transactions based on the selected parameters by clicking the SEARCH button.
          You will see a preview of the results, a download button to get the complete data set, and a button to proceed
          to the next step.
          <div className="my-4">
            <Image
              src="/transactions_preview.png"
              alt="transactions preview"
              layout="responsive"
              width={1710}
              height={812}
            />
          </div>
          The next step is the generation of the XES log. This second step starts from the transactions fetched earlier.
          The parameters you need to specify here are:
          <ul className="list-disc ml-10 my-3 space-y-2">
            <li>
              <span className="font-semibold">Sort by:</span> the parameter by which the sorting is done.
            </li>
            <li>
              <span className="font-semibold">Case ID:</span> the parameter selected to built trace. For instance, if
              you select <span className="italic">&#34;from&#34;</span>, you will get a trace for each user that has
              interacted with the contract.
            </li>
            <li>
              <span className="font-semibold">Concept name: </span>the <span className="italic">case:concept:name</span>{" "}
              value in the XES event. In general, is used in Process Discovery as the name of the activities contained
              in the output model.
            </li>
          </ul>
          These parameters can be selected through a dropdown containing the standard Ethereum transactions fields plus
          the parameters extracted from the smart contract function executed in the transactions. For instance, from{" "}
          <code>updateLandData(int256 x, int256 y, string data)</code> the framework extracted <code>x</code>,{" "}
          <code>y</code>, and <code>data</code>.
          <div className="my-4">
            <Image src="/log_form_example.png" alt="log form example" layout="responsive" width={1715} height={415} />
          </div>
          Clicking on the &#34;Generate XES&#34; button will show a preview of the generated XES log and a button to
          download the full XES log. The generated log can be successfully used as input for every Process Mining
          technique accepting XES logs.
        </p>
        <div className="my-4">
          <Image src="/log_preview.png" alt="log preview" layout="responsive" width={1710} height={806} />
        </div>
        <h4 className="text-2xl font-semibold mt-5 mb-3 pt-5 border-t border-gray-300">Contact</h4>
        <p className="text-justify text-lg">
          <ul className="list-disc ml-10 my-3 space-y-2">
            <li>
              <a
                href="https://github.com/yuripaoloni/xes-ethereum-extractor"
                target="_blank"
                rel="noopener noreferrer"
                className="underline text-indigo-500"
              >
                GitHub
              </a>
            </li>
            <li>
              <a
                href={`${process.env.NEXT_PUBLIC_SERVER_URL}/download_paper`}
                download
                className="underline text-indigo-500"
              >
                Read the paper
              </a>
            </li>
            <li>
              <a href="mailto:yuri.paoloni3@gmail.com">yuri.paoloni3@gmail.com</a>
            </li>
          </ul>
        </p>
      </div>
    </div>
  );
};

export default About;
