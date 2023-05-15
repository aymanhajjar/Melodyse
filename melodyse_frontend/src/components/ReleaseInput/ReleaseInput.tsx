import styles from "./ReleaseInput.module.scss";

export default function ReleaseInput({
  label,
  textarea = false,
  value,
  setValue,
}) {
  return (
    <>
      <div className={styles.container}>
        <label>{label}:</label>
        {textarea ? (
          <textarea
            value={value}
            onChange={(e) => setValue(e.target.value)}
          ></textarea>
        ) : (
          <input value={value} onChange={(e) => setValue(e.target.value)} />
        )}
      </div>
    </>
  );
}
