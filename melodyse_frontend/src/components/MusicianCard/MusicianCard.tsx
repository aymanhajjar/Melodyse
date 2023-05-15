import styles from "./MusicianCard.module.scss";
import { useEffect, useState } from "react";
import { useRouter } from "next/router";

export default function MusicianCard({ artist }) {
  const [cards, setCards] = useState([]);

  const router = useRouter();

  useEffect(() => {
    let card_list = [];
    artist.subscription_tag != "Free" &&
      card_list.push({
        name: artist.subscription_tag,
        color: artist.subscription_tag_color,
      });
    artist.is_match &&
      card_list.push({
        name: "MATCH",
      });
    setCards(card_list);
  }, []);

  return (
    <>
      <div
        className={styles.container}
        style={{
          backgroundColor: artist.subscription_color,
          color: artist.subscription_color && "black",
        }}
        onClick={() => router.push(`/profile/${artist.username}`)}
      >
        <img
          className={styles.profilePic}
          src={process.env.SITE_URL + artist.picture}
        />
        <h1>{artist.full_name}</h1>
        <h4>@{artist.username}</h4>
        <div className={styles.rating}>
          <div className={styles.stars}>
            {[...Array(5)].map((_, index) => (
              <img
                key={index}
                src={
                  index < artist.rating
                    ? "/icons/starEnabled.png"
                    : "/icons/starDisabled.png"
                }
              />
            ))}
          </div>
          <span>{artist.rating_count}</span>
        </div>
        <div className={styles.skills}>
          {artist.skills.slice(0, 3).map((skill) => (
            <div className={styles.skill}>
              <img src={process.env.SITE_URL + skill.picture} />
              <span>{skill.name}</span>
            </div>
          ))}
        </div>
        {artist.favorite_artists.length > 0 && (
          <div className={styles.favoriteArtists}>
            Favorite artists:{" "}
            {artist.favorite_artists
              .slice(0, 5)
              .map((art) => art.name)
              .join(", ")}
          </div>
        )}

        {cards.length > 0 && (
          <div className={styles.cards}>
            <div
              className={styles.cardOne}
              style={cards[0].color && { backgroundColor: cards[0].color }}
            >
              {cards[0].name}
            </div>
            {cards[1] && <div className={styles.cardTwo}>{cards[1].name}</div>}
          </div>
        )}
      </div>
    </>
  );
}
