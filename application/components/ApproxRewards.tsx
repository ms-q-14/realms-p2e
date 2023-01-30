import { useAddress } from "@thirdweb-dev/react";
import { SmartContract } from "@thirdweb-dev/sdk";
import { ethers } from "ethers";
import React, { useEffect, useState } from "react";
import ContractMappingResponse from "../types/ContractMappingResponse";

type Props = {
  fightingContract: SmartContract<any>;
};

export default function ApproxRewards({ fightingContract }: Props) {
  const address = useAddress();

  const everyMillisecondAmount = parseInt(
    (10_000_000_000_000 / 2.1).toFixed(0)
  );

  const [amount, setAmount] = useState<number>(0);

  const [multiplier, setMultiplier] = useState<number>(0);

  useEffect(() => {
    (async () => {
      if (!address) return;

      const p = (await fightingContract.call(
        "playerWeapon",
        address
      )) as ContractMappingResponse;

      if (p.isData) {
        setMultiplier(p.value.toNumber() + 1);
      } else {
        setMultiplier(0);
      }
    })();
  }, [address, fightingContract]);

  useEffect(() => {
    // set interval counter
    const interval = setInterval(() => {
      // update the amount of tokens earned
      setAmount(amount + everyMillisecondAmount);
    }, 100);
    // clear interval when component unmounts
    return () => clearInterval(interval);
  }, [amount, everyMillisecondAmount]);

  return (
    <p style={{ width: 370, overflow: "hidden" }}>
      Earned this session:{" "}
      <b>
        {ethers.utils.formatEther((amount * multiplier).toFixed(0)) ||
          "Error..."}
      </b>
    </p>
  );
}
