import "../styles/globals.css";
import type { AppProps } from "next/app";
import { ethers } from "ethers";

declare global {
  interface Window {
    ethereum: any;
  }
}

function MyApp({ Component, pageProps }: AppProps) {
  return <Component {...pageProps} />;
}

export default MyApp;
