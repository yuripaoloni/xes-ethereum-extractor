import "../styles/globals.css";
import type { AppProps } from "next/app";
import Layout from "../components/layout/Layout";
import axios from "axios";
import { AlertProvider } from "../contexts/AlertContext";

axios.defaults.baseURL = process.env.NEXT_PUBLIC_SERVER_URL;

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <AlertProvider>
      <Layout>
        <Component {...pageProps} />
      </Layout>
    </AlertProvider>
  );
}

export default MyApp;
