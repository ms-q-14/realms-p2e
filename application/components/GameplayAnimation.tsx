import { NFT } from "@thirdweb-dev/sdk";
import React from "react";
import styles from "../styles/Gameplay.module.css";

const CorruptedSkeleton = (
  <div className={styles.slide}>
    <img src="./enemy.gif" height="48" width="48" alt="corrupted_skeleton" />
  </div>
);

type Props = {
  weapon: NFT | undefined;
};

export default function GameplayAnimation({ weapon }: Props) {
  if (!weapon) {
    return <div style={{ marginLeft: 8 }}>I need a weapon!</div>;
  }

  return (
    <div className={styles.slider}>
      <div className={styles.slideTrack}>
        {CorruptedSkeleton}
        {CorruptedSkeleton}
        {CorruptedSkeleton}
        {CorruptedSkeleton}
        {CorruptedSkeleton}
        {CorruptedSkeleton}
        {CorruptedSkeleton}
        {CorruptedSkeleton}
        {CorruptedSkeleton}
        {CorruptedSkeleton}
        {CorruptedSkeleton}
        {CorruptedSkeleton}
        {CorruptedSkeleton}
      </div>
    </div>
  );
}
