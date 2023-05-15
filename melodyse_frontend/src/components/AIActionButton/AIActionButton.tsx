import styles from "./AIActionButton.module.scss";

export default function AIActionButton({
  name,
  pic,
  subscription,
  submit,
  disabled,
}: any) {
  return (
    <div
      className={disabled ? styles.disabled : styles.aibutton}
      onClick={submit}
    >
      <h3>{name}</h3>
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
