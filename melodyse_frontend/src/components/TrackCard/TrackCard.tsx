import { useState, useEffect } from "react";
import styles from "./TrackCard.module.scss";
import { useRouter } from "next/router";
import axios from "axios";

export default function TrackCard({ track }) {
  const [liked, setLiked] = useState(track.liked);

  const router = useRouter();
  const likeTrack = () => {
    const data = new FormData();
    data.append("id", track.id);
    axios
      .post(`${process.env.SITE_URL}/liketrack`, data, {
        withCredentials: true,
      })
      .then((res) => {
        if (liked) {
          track.likes = track.likes - 1;
        } else track.likes = track.likes + 1;
        setLiked(!liked);
      })
      .catch((err) => console.error(err));
  };

  return (
    <div className={styles.container}>
      <div className={styles.coverContainer}>
        <img
          className={styles.cover}
          src={process.env.SITE_URL + track.cover}
        />
        <img
          className={styles.like}
          src={liked ? "/icons/liked.png" : "/icons/like.png"}
          onClick={likeTrack}
        />
      </div>
      <div className={styles.details}>
        <div className={styles.title}>
          <h2>{track.name}</h2> by <h5>{track.owner.name}</h5>
        </div>
        <span>{track.description}</span>
        <audio controls={true} preload="none">
          <source src={process.env.SITE_URL + track.track} type="audio/mpeg" />
        </audio>
        <h6>
          Credits:{" "}
          {track.project_members
            .map((member) => (
              <span
                className={styles.member}
                onClick={() => router.push(`/profile/${member.username}`)}
              >
                {member.name}
              </span>
            ))
            .reduce((prev, curr) => [prev, ", ", curr])}
        </h6>
      </div>
      <div className={styles.stats}>
        <div className={styles.stat}>
          <img src="/icons/play.png" />
          <span>{track.plays}</span>
        </div>
        <div className={styles.stat}>
          <img src="/icons/like.png" />
          <span>{track.likes}</span>
        </div>
      </div>
    </div>
  );
}
