import styles from "./ChosenSkill.module.scss";
import { useEffect, useState } from "react";

export default function ChosenSkill({
  name,
  remove,
  rating,
  updateRating,
}: any) {
  const [chosenRating, setChosenRating] = useState(rating);

  const increaseRating = (index) => {
    setChosenRating(index + 1);
    updateRating(name, index + 1);
  };

  const decreaseRating = (index) => {
    setChosenRating(index + 1);
    updateRating(name, index + 1);
  };

  return (
    <div className={styles.artistCard}>
      <span>{name}</span>
      {[...Array(5)].map((_, index) => (
        <img
          key={index}
          src={
            index < chosenRating
              ? "/icons/starEnabled.png"
              : "/icons/starDisabled.png"
          }
          onClick={() =>
            index < chosenRating ? decreaseRating(index) : increaseRating(index)
          }
        />
      ))}
      <img src={"/icons/x.png"} onClick={remove} />
    </div>
  );
}
