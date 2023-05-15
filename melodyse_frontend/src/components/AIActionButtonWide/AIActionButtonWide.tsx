import styles from "./AIActionButtonWide.module.scss";

export default function AIActionButtonWide({
  name,
  pic,
  subscription,
  submit,
  disabled,
  bright = null,
  loading,
}: any) {
  return (
    <div
      className={
        disabled
          ? styles.disabled
          : bright
          ? `${styles.aibutton} ${styles.bright}`
          : styles.aibutton
      }
      onClick={submit}
    >
      {loading ? (
        <img className={styles.loading} src="/loadinggif.gif" />
      ) : (
        <h3>{name}</h3>
      )}
      <img src={pic} />

      {subscription && (
        <div
          style={{ backgroundColor: subscription.card_color }}
          className={styles.subscription}
        >
          {subscription.tag_on_profile}
        </div>
      )}
    </div>
  );
}
