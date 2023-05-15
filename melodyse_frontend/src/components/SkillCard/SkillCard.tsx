import styles from "./SkillCard.module.scss";
import { useEffect, useState } from "react";

export default function SkillCard({ skill, index, checked, addRemove }: any) {
  return (
    <div
      className={styles.skill}
      style={{ "--index": index }}
      onClick={() => addRemove()}
    >
      {checked && <img src={"/icons/check.png"} className={styles.check} />}
      <img src={process.env.SITE_URL + skill.picture} />
      <span>{skill.name}</span>
    </div>
  );
}
