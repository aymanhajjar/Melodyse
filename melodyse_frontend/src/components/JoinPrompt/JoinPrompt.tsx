import styles from "./JoinPrompt.module.scss";
import { useEffect, useState } from "react";
import axios from "axios";

export default function JoinPrompt({ close, project }) {
  const [messageVal, setMessageVal] = useState("");

  const sendInvite = () => {
    const data = new FormData();
    data.append("id", project.id);
    data.append("owner", project.owner.username);
    data.append("message", messageVal);
    axios
      .post(`${process.env.SITE_URL}/join-request`, data, {
        withCredentials: true,
      })
      .then((res) => {
        close();
      })
      .catch((err) => console.error(err));
  };

  return (
    <>
      <div className={styles.hireContainer}>
        <h2>REQUEST TO JOIN "{project.title}"</h2>
        <div className={styles.inputDiv}>
          <label>Message to {project.owner.name} (optional):</label>
          <textarea
            placeholder={"Message..."}
            value={messageVal}
            onChange={(e) => setMessageVal(e.target.value)}
          />
        </div>
        <button
          type="button"
          className={styles.sendBtnHire}
          onClick={() => sendInvite()}
        >
          SEND REQUEST
        </button>
        <div className={styles.close} onClick={close}>
          <img src="/icons/close.png" />
        </div>
      </div>
      <div className={styles.overlay}></div>
    </>
  );
}
