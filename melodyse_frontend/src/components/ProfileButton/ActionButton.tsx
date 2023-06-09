import styles from "./profileButton.module.scss";
import { useEffect, useState } from "react";
import axios from "axios";

export default function ActionButton({ name, onClick }: any) {
  return (
    <button className={styles.actionbutton} onClick={onClick}>
      {name}
    </button>
  );
}
