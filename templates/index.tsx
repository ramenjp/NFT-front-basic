import * as React from "react";
import type { NextPage } from "next";
import Head from "next/head";
import Image from "next/image";
import styles from "../styles/Home.module.css";
import { useEthers, Config, Mainnet, Goerli } from "@usedapp/core";

type Props = {
  nfts?: any[];
  activateBrowserWallet: () => void;
};

export const Index: React.FC<Props> = (props) => {
  return (
    <div className={styles.container}>
      <main className={styles.main}>
        <div className={styles.images}>
          {props.nfts?.map((NFTimageURL) => {
            console.log("表示IPFS :", NFTimageURL);
            return (
              <Image
                alt=""
                src={NFTimageURL}
                key={NFTimageURL}
                width={200}
                height={200}
              />
            );
          })}
        </div>
        <button className={styles.card} onClick={props.activateBrowserWallet}>
          <h2>Connect Wallet</h2>
        </button>
      </main>
    </div>
  );
};
