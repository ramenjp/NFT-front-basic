import * as React from "react";
import Head from "next/head";
import Image from "next/image";
import styles from "../../styles/Home.module.css";
import { Token } from "../../type";

type Props = {
  walletAddress?: string;

  connectWallet: () => void;
  privateMint: (selectedTokenId: number) => void;
  publicMint: (selectedTokenId: number) => void;
};

export const Index: React.FC<Props> = (props) => {
  return (
    <div className={styles.container}>
      <Head>
        <title>Create Next App</title>
        <meta name="description" content="Generated by create next app" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className={styles.main}>
        <h1 className={styles.title}>
          Welcome to <a href="https://nextjs.org">WEB3 Frontend Basics</a>
        </h1>

        <p className={styles.description}>
          Get started by editing{" "}
          <code className={styles.code}>
            pages/index.tsx and templates/index.tsx
          </code>
        </p>

        {props.walletAddress ?? (
          <div className={styles.description}>{props.walletAddress}</div>
        )}

        <div className={styles.grid}>
          <div className={styles.card} onClick={props.connectWallet}>
            <h2>Connect Wallet &rarr;</h2>
            <p>Connect Metamask .</p>
          </div>
        </div>

        <div className={styles.card} onClick={() => props.publicMint(27)}>
          <h2>publicMint &rarr;</h2>
        </div>
        <div className={styles.card} onClick={() => props.privateMint(14)}>
          <h2>privateMint &rarr;</h2>
        </div>
      </main>

      <footer className={styles.footer}>
        <a
          href="https://vercel.com?utm_source=create-next-app&utm_medium=default-template&utm_campaign=create-next-app"
          target="_blank"
          rel="noopener noreferrer"
        >
          Powered by{" "}
          <span className={styles.logo}>
            <Image src="/vercel.svg" alt="Vercel Logo" width={72} height={16} />
          </span>
        </a>
      </footer>
    </div>
  );
};