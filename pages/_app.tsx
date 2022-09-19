import * as React from "react";
import "../styles/globals.css";
import type { AppProps } from "next/app";
import { Mainnet, DAppProvider, Config, Goerli } from "@usedapp/core";
import { getDefaultProvider } from "ethers";
import Moralis from "moralis";

declare global {
  interface Window {
    ethereum: any;
  }
}

function MyApp({ Component, pageProps }: AppProps) {
  const config: Config = {
    readOnlyChainId: Mainnet.chainId,
    readOnlyUrls: {
      [Mainnet.chainId]: getDefaultProvider("mainnet"),
      [Goerli.chainId]: getDefaultProvider("goerli"),
    },
  };

  React.useEffect(() => {
    console.log("initialize moralis...");
    (async () =>
      await Moralis.start({
        apiKey: process.env.NEXT_PUBLIC_MORALIS_API_KEY,
      }))();
  }, []);

  return (
    <DAppProvider config={config}>
      <Component {...pageProps} />;
    </DAppProvider>
  );
}

export default MyApp;
