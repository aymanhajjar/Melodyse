import styles from "./Song.module.scss";
import { useEffect, useState } from "react";

export default function Song({ data, index, checked, addRemove }: any) {
  return (
    <div
      className={styles.artist}
      style={{ "--index": index }}
      onClick={() => addRemove()}
    >
      {checked && <img src={"/icons/check.png"} className={styles.check} />}
      <img
        src={
          data.album.images[0] ? data.album.images[0].url : "/icons/avatar.png"
        }
      />
      <span>
        {data.artists[0].name} -{" "}
        {`${data.name.slice(0, 25)} ${data.name.length > 25 ? "..." : ""}`}
      </span>
    </div>
  );
}
