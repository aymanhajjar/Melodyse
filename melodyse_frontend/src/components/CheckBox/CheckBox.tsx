import styles from "./CheckBox.module.scss";

export default function CheckBox({ text, value, setValue }) {
  return (
    <div className={styles.container}>
      <input
        className={styles.container}
        type="checkbox"
        onClick={(e) => setValue(e.target.value)}
      />
      <span>{text}</span>
    </div>
  );
}
