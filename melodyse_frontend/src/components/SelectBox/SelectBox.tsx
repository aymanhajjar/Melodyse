import styles from "./SelectBox.module.scss";
import { useEffect, useState } from "react";

export default function SelectBox({ text, value, setValue, data = null }) {
  return (
    <select
      className={styles.select}
      value={value}
      onChange={(e) => setValue(e.target.value)}
    >
      <option selected value={""}>
        {text}
      </option>
      {data ? (
        data.map((item) => <option value={item.name}>{item.name}</option>)
      ) : (
        <>
          <option value={1}>1</option>
          <option value={2}>2</option>
          <option value={3}>3</option>
          <option value={4}>4</option>
          <option value={5}>5</option>
        </>
      )}
    </select>
  );
}
