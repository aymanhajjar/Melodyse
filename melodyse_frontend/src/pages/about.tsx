import Head from "next/head";
import styles from "@/styles/About.module.scss";

export default function About(props: any) {
  return (
    <>
      <Head>
        <title>About | MELODYSE</title>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/logo.ico" />
      </Head>
      <div className={styles.container}>
        <img className={styles.logo} src="/logo.PNG" />
        <h1>MELODYSE</h1>
        <p>
          At Melodyse, our mission is to bring musicians together and foster
          meaningful collaborations. Our platform utilizes cutting-edge AI
          technology to offer musicians a unique and personalized experience.
          <br />
          We take data privacy and security very seriously, and our platform
          complies with all relevant laws and regulations. We do not share your
          personal information with third parties without your consent. Join our
          community of musicians today and start collaborating on your next
          musical project!
        </p>

        <h4>Created by: Ayman Hajjar</h4>
        <h6>© 2023 MELODYSE</h6>
      </div>
    </>
  );
}
