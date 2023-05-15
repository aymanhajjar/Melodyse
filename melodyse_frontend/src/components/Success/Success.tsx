import styles from "./Success.module.scss";
import { useRouter } from "next/router";

export default function Success(props: any) {
  const router = useRouter();

  return (
    <div className={styles.container}>
      <h2>You're all done!</h2>
      <button
        type="button"
        className={styles.backbutton}
        onClick={() => props.prevStep()}
      >
        BACK
      </button>
      <img src="/success.gif" />
      <button
        type="button"
        className={styles.goHome}
        onClick={() => router.push("/listen")}
      >
        START EXPLORING
      </button>
    </div>
  );
}
