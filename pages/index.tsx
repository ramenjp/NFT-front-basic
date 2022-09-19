import * as React from "react";
import type { NextPage } from "next";
import Head from "next/head";
import Image from "next/image";
import styles from "../styles/Home.module.css";
import { useEthers, Config, Mainnet, Goerli } from "@usedapp/core";
import { getDefaultProvider } from "ethers";
import Moralis from "moralis";
import { Index as IndexTemplate } from "../templates";
import { ethers, utils } from "ethers";
import abi from "../abi.json";

const Home: NextPage = () => {
  const config = {
    readOnlyUrls: {
      [Mainnet.chainId]: getDefaultProvider("mainnet"),
      [Goerli.chainId]: getDefaultProvider("goerli"),
    },
  };

  const contractAddress = "0x91c08B3c72B1A665F038b6629C3d683C81a6a4B2";

  const [nfts, setNFTs] = React.useState<any[]>();
  const { activateBrowserWallet, chainId, account, library } = useEthers();

  // 所有NFT画像一覧表示
  React.useEffect(() => {
    (async () => {
      if (account) {
        const NFTs = await Moralis.EvmApi.nft.getWalletNFTs({
          address: account,
        });
        console.log("NFTs :", NFTs.result);
        const NFTimages = NFTs.result.map((nft, i) => {
          console.log("nft ", i);
          const imageURL = nft?.metadata?.image as string;
          console.log("imageURL.slice(0, 4) ", imageURL?.slice(0, 4));
          //もっといい方法ありそう
          //metadataパラメータ無いnftが画像取れない
          if (imageURL?.slice(0, 4) === "ipfs") {
            const ipfsURL = imageURL.substring(7);
            console.log("ipfsURL :", ipfsURL);
            console.log("整形後IPFS :", "https://ipfs.io/ipfs/" + ipfsURL);
            return "https://ipfs.io/ipfs/" + ipfsURL;
          }
          return imageURL;
        });
        setNFTs(NFTimages);
      }
    })();
  }, [account]);

  // metamask接続 mobile判定
  const connect = () => {
    const agent = window.navigator.userAgent.toLowerCase();
    if (navigator.userAgent.match(/iPhone|Android.+Mobile/)) {
      const { ethereum } = window;
      if (ethereum && ethereum.isMetaMask) {
        console.log("metamask installed!");
        activateBrowserWallet();
      } else {
        window.open(
          "https://metamask.app.link/dapp/wrappy-freemint.vercel.app/"
        );
        console.log("please metamask install");
      }
    }
    activateBrowserWallet();
  };

  // mint NFT
  const mint = async () => {
    const signer = library?.getSigner();
    const contract = await new ethers.Contract(contractAddress, abi, signer);
    const tx = await contract.mint();
    console.log("tx :", tx);
  };

  React.useEffect(() => {
    if (!chainId || !config.readOnlyUrls[chainId]) {
      <p>please connect mainnet</p>;
    }
  }, [chainId]);

  return (
    <IndexTemplate nfts={nfts} activateBrowserWallet={activateBrowserWallet} />
  );
};

export default Home;
