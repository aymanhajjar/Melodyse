import styles from "./CollabSearchBar.module.scss";
import { useEffect, useState } from "react";

export default function CollabSearchBar({ value, setValue, submit }) {
  const checkSubmit = (e) => {
    if (e.key === "Enter") {
      submit();
    }
  };

  return (
    <div className={styles.container}>
      <input
        placeholder="@username..."
        value={value}
        onChange={(e) => setValue(e.target.value)}
        onKeyDown={checkSubmit}
      />
      <img src="/icons/search.png" />
    </div>
  );
}
