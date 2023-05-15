import styles from "./WhiteButton.module.scss";
import { useEffect, useState } from "react";

export default function WhiteButton({ note, select, selected }) {
  const [active, setActive] = useState(false);

  useEffect(() => {
    setActive(selected);
  }, [selected]);

  const handleClick = () => {
    setActive(!active);
    select();
  };

  return (
    <>
      <div
        className={active ? styles.whiteButtonActive : styles.whiteButton}
        onClick={handleClick}
      >
        <span>{note}</span>
      </div>
    </>
  );
}
