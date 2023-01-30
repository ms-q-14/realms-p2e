import {
  ConnectWallet,
  useAddress,
  useContract,
  useMetamask,
} from "@thirdweb-dev/react";
import React from "react";
import CurrentGear from "../components/CurrentGear";
import LoadingSection from "../components/LoadingSection";
import OwnedGear from "../components/OwnedGear";
import Rewards from "../components/Rewards";
import Shop from "../components/Shop";
import {
  CHARACTER_ADDRESS,
  SOULS_ADDRESS,
  FIGHTING_ADDRESS,
  WEAPON_ADDRESS,
} from "../const/contractAddresses";
import styles from "../styles/Home.module.css";

export default function Play() {
  const address = useAddress();

  const { contract: fightingContract } = useContract(FIGHTING_ADDRESS);
  const { contract: characterContract } = useContract(
    CHARACTER_ADDRESS,
    "edition-drop"
  );
  const { contract: weaponContract } = useContract(
    WEAPON_ADDRESS,
    "edition-drop"
  );
  const { contract: tokenContract } = useContract(SOULS_ADDRESS, "token");

  if (!address) {
    return (
      <div className={styles.container}>
        <ConnectWallet colorMode="dark" />
      </div>
    );
  }

  return (
    <div className={styles.container}>
      {fightingContract &&
      characterContract &&
      tokenContract &&
      weaponContract ? (
        <div className={styles.mainSection}>
          <CurrentGear
            fightingContract={fightingContract}
            characterContract={characterContract}
            weaponContract={weaponContract}
          />
          <Rewards
            fightingContract={fightingContract}
            tokenContract={tokenContract}
          />
        </div>
      ) : (
        <LoadingSection />
      )}

      <hr className={`${styles.divider} ${styles.bigSpacerTop}`} />

      {weaponContract && fightingContract ? (
        <>
          <h2 className={`${styles.noGapTop} ${styles.noGapBottom}`}>
            Your Owned Weapons
          </h2>
          <div
            style={{
              width: "100%",
              minHeight: "10rem",
              display: "flex",
              flexDirection: "row",
              justifyContent: "center",
              alignItems: "center",
              marginTop: 8,
            }}
          >
            <OwnedGear
              weaponContract={weaponContract}
              fightingContract={fightingContract}
            />
          </div>
        </>
      ) : (
        <LoadingSection />
      )}

      <hr className={`${styles.divider} ${styles.bigSpacerTop}`} />

      {weaponContract && tokenContract ? (
        <>
          <h2 className={`${styles.noGapTop} ${styles.noGapBottom}`}>Shop</h2>
          <div
            style={{
              width: "100%",
              minHeight: "10rem",
              display: "flex",
              flexDirection: "row",
              justifyContent: "center",
              alignItems: "center",
              marginTop: 8,
            }}
          >
            <Shop weaponContract={weaponContract} />
          </div>
        </>
      ) : (
        <LoadingSection />
      )}
    </div>
  );
}
