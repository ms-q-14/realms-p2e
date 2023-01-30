import { ThirdwebNftMedia, useAddress, useNFT } from "@thirdweb-dev/react";
import { EditionDrop, NFT, SmartContract } from "@thirdweb-dev/sdk";
import React, { useEffect, useState } from "react";
import ContractMappingResponse from "../types/ContractMappingResponse";
import GameplayAnimation from "./GameplayAnimation";
import styles from "../styles/Home.module.css";

type Props = {
  fightingContract: SmartContract<any>;
  characterContract: EditionDrop;
  weaponContract: EditionDrop;
};

export default function CurrentGear({
  fightingContract,
  characterContract,
  weaponContract,
}: Props) {
  const address = useAddress();

  const { data: playerNft } = useNFT(characterContract, 0);
  const [weapon, setWeapon] = useState<NFT>();

  useEffect(() => {
    (async () => {
      if (!address) return;

      const p = (await fightingContract.call(
        "playerWeapon",
        address
      )) as ContractMappingResponse;

      if (p.isData) {
        const weaponMetadata = await weaponContract.get(p.value);
        setWeapon(weaponMetadata);
      }
    })();
  }, [address, fightingContract, weaponContract]);

  return (
    <div style={{ display: "flex", flexDirection: "column" }}>
      <h2 className={`${styles.noGapTop} `}>Equipped Items</h2>
      <div
        style={{
          display: "flex",
          alignItems: "center",
          flexDirection: "row",
          justifyContent: "center",
        }}
      >
        {/* Currently equipped player */}
        <div style={{ outline: "1px solid grey", borderRadius: 16 }}>
          {playerNft && (
            <ThirdwebNftMedia metadata={playerNft?.metadata} height={"64"} />
          )}
        </div>
        {/* Currently equipped weapon */}
        <div
          style={{ outline: "1px solid grey", borderRadius: 16, marginLeft: 8 }}
        >
          {weapon && (
            // @ts-ignore
            <ThirdwebNftMedia metadata={weapon.metadata} height={"64"} />
          )}
        </div>
      </div>

      {/* Gameplay Animation */}

      <div
        style={{
          display: "flex",
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "center",
          marginTop: 24,
        }}
      >
        <img
          src="./warrior.gif"
          height={64}
          width={64}
          alt="character-fighting"
        />
        <GameplayAnimation weapon={weapon} />
      </div>
    </div>
  );
}
