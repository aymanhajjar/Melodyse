import styles from "./UserSkillCard.module.scss";
import { useEffect, useState } from "react";

export default function UserSkillCard({ skill, search = null }: any) {
  return (
    <div className={styles.skill} onClick={search}>
      <img src={process.env.SITE_URL + skill.picture} />
      <span>{skill.name}</span>
      <div className={styles.stars}>
        {[...Array(5)].map((_, index) => (
          <img
            key={index}
            src={
              index < skill.rating
                ? "/icons/starEnabled.png"
                : "/icons/starDisabled.png"
            }
          />
        ))}
      </div>
    </div>
  );
}
