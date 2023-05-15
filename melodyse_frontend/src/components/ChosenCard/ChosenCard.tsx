import styles from "./ChosenCard.module.scss";

export default function ChosenCard({ name, remove }: any) {
  return (
    <div className={styles.artistCard}>
      <span>{name}</span>

      <img src={"/icons/x.png"} onClick={remove} />
    </div>
  );
}
