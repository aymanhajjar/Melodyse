import styles from "./ChatInput.module.scss";
import { useEffect, useState } from "react";
import axios from "axios";

export default function ChatInput({
  submit,
  project = null,
  user = null,
}: any) {
  const [messageValue, setMessageValue] = useState("");
  const [loading, setLoading] = useState(false);

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      submit(messageValue);
      setMessageValue("");
    }
  };

  const upload = (e) => {
    setLoading(true);
    const data = new FormData();
    data.append("id", project.id);
    data.append("file", e.target.files[0]);
    axios
      .post(`${process.env.SITE_URL}/uploadfile`, data, {
        withCredentials: true,
      })
      .then((res) => {
        setLoading(false);
        submit(`${user} has uploaded a file: ${e.target.files[0].name}`);
      })
      .catch((err) => {
        setLoading(false);
        console.error(err);
      });
  };

  return (
    <div className={styles.container}>
      <input
        placeholder="Write a message..."
        value={messageValue}
        onChange={(e) => setMessageValue(e.target.value)}
        onKeyDown={(e) => handleKeyDown(e)}
      />

      <div className={styles.actions}>
        {project && (
          <>
            <button
              type="button"
              onClick={
                loading
                  ? () => {}
                  : () => document.getElementById("profile-upload").click()
              }
            >
              {loading ? (
                <img src="/loadinggif.gif" />
              ) : (
                <img src="/icons/upload.png" />
              )}
            </button>

            <input
              id="profile-upload"
              type="file"
              accept="image/*"
              onChange={upload}
              hidden
            />
          </>
        )}

        <button
          type="button"
          onClick={() => {
            setMessageValue("");
            submit(messageValue);
          }}
        >
          <img src="/icons/send.png" />
        </button>
      </div>
    </div>
  );
}
