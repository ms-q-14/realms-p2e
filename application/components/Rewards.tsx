import React from "react";
import {
  ThirdwebNftMedia,
  useAddress,
  useContractRead,
  useMetadata,
  useTokenBalance,
  Web3Button,
} from "@thirdweb-dev/react";
import { SmartContract, Token } from "@thirdweb-dev/sdk";
import { ethers } from "ethers";

import styles from "../styles/Home.module.css";
import ApproxRewards from "./ApproxRewards";
import { FIGHTING_ADDRESS } from "../const/contractAddresses";

type Props = {
  fightingContract: SmartContract<any>;
  tokenContract: Token;
};

export default function Rewards({ fightingContract, tokenContract }: Props) {
  const address = useAddress();

  const { data: tokenMetadata } = useMetadata(tokenContract);
  const { data: currentBalance } = useTokenBalance(tokenContract, address);
  const { data: unclaimedAmount } = useContractRead(
    fightingContract,
    "calculateRewards",
    address
  );

  return (
    <div
      style={{ display: "flex", flexDirection: "column", alignItems: "center" }}
    >
      <p>
        Your <b>Corrupted Souls</b>
      </p>

      {tokenMetadata && (
        <ThirdwebNftMedia
          // @ts-ignore
          metadata={tokenMetadata}
          height={"48"}
        />
      )}
      <p className={styles.noGapBottom}>
        Balance: <b>{currentBalance?.displayValue}</b>
      </p>
      <p>
        Unclaimed:{" "}
        <b>{unclaimedAmount && ethers.utils.formatUnits(unclaimedAmount)}</b>
      </p>

      <ApproxRewards fightingContract={fightingContract} />

      <div className={styles.smallMargin}>
        <Web3Button
          contractAddress={FIGHTING_ADDRESS}
          action={(contract) => contract.call("claim")}
        >
          Claim
        </Web3Button>
      </div>
    </div>
  );
}
