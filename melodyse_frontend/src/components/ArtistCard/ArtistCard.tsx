import styles from "./ArtistCard.module.scss";
import { useEffect, useState } from "react";
import { useRouter } from "next/router";

export default function ArtistCard({ data, index }: any) {
  const router = useRouter();

  return (
    <div
      className={styles.artist}
      style={{ "--index": index }}
      onClick={() => router.push(`/profile/${data.username}`)}
    >
      <img
        src={
          data.picture
            ? process.env.SITE_URL + data.picture
            : "/icons/avatar.png"
        }
      />
      <span>{data.full_name}</span>
    </div>
  );
}
