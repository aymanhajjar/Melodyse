import styles from "./LeaveProject.module.scss";
import { useEffect, useState } from "react";
import axios from "axios";
import { useRouter } from "next/router";

export default function LeaveProject({ project, close }) {
  const router = useRouter();

  const leaveProject = () => {
    const data = new FormData();
    data.append("id", project.id);
    axios
      .post(`${process.env.SITE_URL}/leaveproject`, data, {
        withCredentials: true,
      })
      .then((res) => router.push("/"))
      .catch((err) => console.error(err));
  };
  return (
    <>
      <div
        className={
          !project.is_collab ? styles.hireContainer : styles.collabContainer
        }
      >
        <>
          <h2>LEAVE PROJECT</h2>
          <div className={styles.inputDiv}>
            <span>
              Are you sure you want to leave this project? You won't be able to
              access it after you leave.
            </span>
          </div>

          <button
            type="button"
            className={styles.sendBtnHire}
            onClick={() => leaveProject()}
          >
            LEAVE PROJECT
          </button>

          <div className={styles.close} onClick={close}>
            <img src="/icons/close.png" />
          </div>
        </>
      </div>
      <div className={styles.overlay}></div>
    </>
  );
}
