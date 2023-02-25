import type { NextPage } from "next";
import Head from "next/head";

const Custom404: NextPage = () => {
  return (
    <div className="max-w-7xl mx-auto">
      <Head>
        <title>EveLog</title>
      </Head>
      <main className="mt-10 mx-auto max-w-7xl px-4 sm:mt-12 sm:px-6 md:mt-16 lg:mt-20 lg:px-8 xl:mt-28">
        <div className="sm:text-center lg:text-left">
          <h1 className="text-4xl tracking-tight font-extrabold sm:text-5xl md:text-6xl">
            <span className="block xl:inline">404</span> <span className="block xl:inline">Page Not Found</span>
          </h1>
          <p className="mt-3 text-gray-500 sm:mt-5 sm:text-lg sm:max-w-3xl sm:mx-auto md:mt-5 md:text-xl lg:mx-0">
            Please check the URL in the address bar and try again.
          </p>
        </div>
      </main>
    </div>
  );
};

export default Custom404;
