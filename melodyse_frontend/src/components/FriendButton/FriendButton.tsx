import styles from "./friendButton.module.scss";
import { useEffect, useState, useRef } from "react";
import FormInput from "../FormInput/FormInput";
import axios from "axios";
import Request from "./Request";
import Cookies from "js-cookie";

export default function FriendButton(props: any) {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [friendsTab, setFriendsTab] = useState(true);
  const [friendRequests, setFriendRequests] = useState();
  const [projectRequests, setProjectRequests] = useState();
  const [joinRequests, setJoinRequests] = useState();
  const dropdownRef = useRef(null);

  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdownOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [dropdownRef]);

  const openDropDown = () => {
    if (!dropdownOpen) {
      setLoading(true);
      getRequests();
    }
    setDropdownOpen(!dropdownOpen);
  };

  const getRequests = () => {
    axios
      .get(`${process.env.SITE_URL}/getrequests`, {
        withCredentials: true,
      })
      .then((res) => {
        if (res.data) {
          setFriendRequests(res.data.friends);
          setProjectRequests(res.data.projects);
          setJoinRequests(res.data.join);
        } else {
          setFriendRequests("");
          setProjectRequests("");
          setJoinRequests("");
        }
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
      });
  };

  return (
    <div className={styles.container} ref={dropdownRef}>
      <img
        className={styles.frdimg}
        src="/friendss.png"
        onClick={openDropDown}
      />
      <div
        className={dropdownOpen ? styles.dropdownOpen : styles.dropdownHidden}
      >
        {loading ? (
          <img className={styles.loading} src="/loading-melodyse.gif" />
        ) : (
          <>
            <h2>Requests:</h2>
            <div className={styles.reqContainer}>
              <div className={styles.tabs}>
                <button
                  type="button"
                  className={
                    friendsTab ? styles.reqBtnActive : styles.reqBtnInactive
                  }
                  onClick={() => setFriendsTab(true)}
                >
                  Friends
                </button>
                <button
                  type="button"
                  className={
                    friendsTab ? styles.reqBtnInactive : styles.reqBtnActive
                  }
                  onClick={() => setFriendsTab(false)}
                >
                  Projects
                </button>
              </div>

              {friendsTab &&
                (friendRequests ? (
                  friendRequests.map((req) => (
                    <Request type="friend" request={req} />
                  ))
                ) : (
                  <span className={styles.noReq}>
                    You don't have any friend requests
                  </span>
                ))}

              {!friendsTab &&
                (projectRequests ? (
                  <>
                    {projectRequests.map((req) => (
                      <Request type="project" request={req} />
                    ))}
                    {joinRequests.map((req) => (
                      <Request type="join" request={req} />
                    ))}
                  </>
                ) : (
                  <span className={styles.noReq}>
                    You don't have any project requests
                  </span>
                ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
