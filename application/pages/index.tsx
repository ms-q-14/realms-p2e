import type { NextPage } from "next";
import styles from "../styles/Home.module.css";
import {
  ConnectWallet,
  useAddress,
  useContract,
  useOwnedNFTs,
} from "@thirdweb-dev/react";
import { CHARACTER_ADDRESS } from "../const/contractAddresses";
import MintContainer from "../components/MintContainer";
import { useRouter } from "next/router";
import Head from "next/head";

const Home: NextPage = () => {
  const { contract: editionDrop } = useContract(
    CHARACTER_ADDRESS,
    "edition-drop"
  );

  const address = useAddress();
  const router = useRouter();

  const {
    data: ownedNfts,
    isLoading,
    isError,
  } = useOwnedNFTs(editionDrop, address);

  if (!address) {
    return (
      <div className={styles.container}>
        <ConnectWallet colorMode="dark" />
      </div>
    );
  }

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (!ownedNfts || isError) {
    return <div>Error</div>;
  }

  if (ownedNfts.length === 0) {
    return (
      <div className={styles.container}>
        <MintContainer />
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <Head>
        <title>Realms - P2E</title>
        <link rel="icon" href="./corrupted_soul.png" />
      </Head>
      {
        <div className={styles.container}>
          <button
            className={`${styles.mainButton} ${styles.spacerBottom}`}
            onClick={() => router.push(`/play`)}
          >
            Play Game
          </button>
        </div>
      }
    </div>
  );
};

export default Home;
