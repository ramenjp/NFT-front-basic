import * as React from "react";
import type { NextPage } from "next";
import { Index as IndexTemplate } from "../components/template";
import { ethers } from "ethers";
import MerkleTree from "merkletreejs";
import keccak256 from "keccak256";
// [TODO]: change abi
import abi from "../config/abi.json";
import { whitelist } from "../config/whitelist";
import { contractAddress } from "../config";

const Index: NextPage = () => {
  const [walletAddress, setWalletAddress] = React.useState<string>();
  const [provider, setProvider] =
    React.useState<ethers.providers.Web3Provider>();
  const [signer, setSigner] = React.useState<ethers.providers.JsonRpcSigner>();

  const publicSalePrice = 0.02;
  const privateSalePrice = "0.01";

  const connectWallet = async () => {
    if (!provider) {
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      await provider.send("eth_requestAccounts", []);
    }
    if (provider && !signer) {
      const signer = provider.getSigner();
      const walletAddress = await signer.getAddress();
      setWalletAddress(walletAddress);
    }
  };

  const publicMint = React.useCallback(async (selectedTokenIds: number[]) => {
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    await provider.send("eth_requestAccounts", []);

    const signer = provider.getSigner();

    const contract = await new ethers.Contract(contractAddress, abi, signer);
    // const salePrice = contract.publicSalePrice.toString();

    const mintConfig = {
      value: ethers.utils.parseEther(
        (publicSalePrice * selectedTokenIds.length).toString()
      ),
    };
    console.log("get price : ", publicSalePrice * selectedTokenIds.length);
    console.log("selectedTokenIds : ", selectedTokenIds);

    const tx = await contract.publicSaleMint(selectedTokenIds, mintConfig);
    console.log("tx :", tx);
  }, []);

  const privateMint = React.useCallback(async (selectedTokenId: number) => {
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    await provider.send("eth_requestAccounts", []);

    const signer = provider.getSigner();

    const contract = await new ethers.Contract(contractAddress, abi, signer);
    // const salePrice = contract.publicSalePrice.toString();
    const salePrice = "0.01";
    const mintConfig = {
      value: ethers.utils.parseEther(privateSalePrice),
    };

    const leafNodes = whitelist.map((leaf) => keccak256(leaf));
    const tree = new MerkleTree(leafNodes, keccak256, { sortPairs: true });
    const rootHash = tree.getHexRoot();

    const walletAddress = await signer.getAddress();

    const hashedAddress = keccak256(walletAddress);
    const proof = tree.getHexProof(hashedAddress);
    const verify = tree.verify(proof, hashedAddress, rootHash);
    console.log("walletAddress :", walletAddress);
    if (verify) {
      const tx = await contract.privateSaleMint(
        walletAddress,
        proof,
        selectedTokenId,
        mintConfig
      );
      console.log("tx :", tx);
    }
  }, []);

  React.useEffect(() => {
    (async () => {
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      await provider.send("eth_requestAccounts", []);
      const signer = provider.getSigner();
      const walletAddress = await signer.getAddress();
      setProvider(provider);
      setSigner(signer);
      setWalletAddress(walletAddress);

      const leafNodes = whitelist.map((leaf) => keccak256(leaf));
      const tree = new MerkleTree(leafNodes, keccak256, { sortPairs: true });
      const rootHash = tree.getHexRoot();
      console.log("rootHash :", rootHash);
      const hashedAddress = keccak256(walletAddress);
      const proof = tree.getHexProof(hashedAddress);

      const verify = tree.verify(proof, hashedAddress, rootHash);
      console.log("verify :", verify);
    })();
  }, []);

  return (
    <IndexTemplate
      walletAddress={walletAddress}
      connectWallet={connectWallet}
      privateMint={privateMint}
      publicMint={publicMint}
    />
  );
};

export default Index;
