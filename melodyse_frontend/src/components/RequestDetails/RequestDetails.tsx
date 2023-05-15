import styles from "./RequestDetails.module.scss";
import { useEffect, useState } from "react";
import axios from "axios";

export default function RequestDetails({ close, type, request }) {
  const respond = (action) => {
    const data = new FormData();
    data.append("id", request.request_id);
    data.append("action", action);
    data.append("username", request.sender_username);
    axios
      .post(`${process.env.SITE_URL}/accept-request`, data, {
        withCredentials: true,
      })
      .then((res) => {
        close();
      })
      .catch((err) => console.error(err));
  };
  const respondInvite = (action) => {
    const data = new FormData();
    data.append("id", request.request_id);
    data.append("action", action);
    axios
      .post(`${process.env.SITE_URL}/accept-invite`, data, {
        withCredentials: true,
      })
      .then((res) => {
        close();
      })
      .catch((err) => console.error(err));
  };

  return (
    <>
      {type == "join" ? (
        <>
          {" "}
          <div className={styles.hireContainer}>
            <h2>REQUEST TO JOIN "{request.project_name}"</h2>
            <div className={styles.inputDiv}>
              <label>
                <b>Message from {request.sender_name}</b>:
              </label>
              <p>{request.message}</p>
            </div>
            <button
              type="button"
              className={styles.sendBtnHire}
              onClick={() => respond("accept")}
            >
              APPROVE
            </button>
            <button
              type="button"
              className={styles.sendBtnHire}
              onClick={() => respond("reject")}
            >
              REJECT
            </button>
            <div className={styles.close} onClick={close}>
              <img src="/icons/close.png" />
            </div>
          </div>
          <div className={styles.overlay}></div>
        </>
      ) : (
        <>
          {" "}
          <div className={styles.hireContainer}>
            <h2>INVITE TO JOIN "{request.project_name}"</h2>
            <div className={styles.inputDiv}>
              <label>
                <b>Message from {request.sender_name}</b>:
              </label>
              <p>{request.message}</p>
            </div>
            {request.offered_amount && (
              <div className={styles.inputDiv}>
                <label>
                  <b>Offered Amount:</b>
                </label>
                <p>${request.offered_amount}</p>
              </div>
            )}
            <button
              type="button"
              className={styles.sendBtnHire}
              onClick={() => respondInvite("accept")}
            >
              APPROVE
            </button>
            <button
              type="button"
              className={styles.sendBtnHire}
              onClick={() => respondInvite("reject")}
            >
              REJECT
            </button>
            <div className={styles.close} onClick={close}>
              <img src="/icons/close.png" />
            </div>
          </div>
          <div className={styles.overlay}></div>
        </>
      )}
    </>
  );
}
