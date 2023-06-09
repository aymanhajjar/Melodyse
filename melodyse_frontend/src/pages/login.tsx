import Head from "next/head";
import styles from "@/styles/Login.module.scss";
import Login from "../components/login/login";
import Register from "../components/register/register";
import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import FavoriteArtists from "@/components/FavoriteArtists/FavoriteArtists";
import FavoriteSongs from "@/components/FavoriteSongs/FavoriteSongs";
import UserSkills from "@/components/UserSkills/UserSkills";
import Success from "@/components/Success/Success";

export default function LoginPage(props: any) {
  const router = useRouter();
  const [loginActive, setLoginActive] = useState(true);
  const [step, setStep] = useState(0);
  const [signUp, setSignUp] = useState(false);

  function handleFormChange() {
    setLoginActive(!loginActive);
  }

  useEffect(() => {
    if (props.loggedIn && !signUp) {
      router.push("/");
    }
  }, [props.loggedIn]);

  return (
    <>
      <Head>
        <title>Log In | MELODYSE</title>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/logo.ico" />
      </Head>
      <div className={styles.container}>
        <div className={step == 0 ? styles.leftSide : styles.leftSideExpanded}>
          {loginActive ? (
            <Login
              active={loginActive}
              onChangeForm={handleFormChange}
              token={props.token}
              setLoggedIn={() => props.setLoggedIn()}
            />
          ) : step == 0 ? (
            <Register
              active={loginActive}
              onChangeForm={handleFormChange}
              token={props.token}
              nextStep={() => setStep(step + 1)}
              setLoggedIn={() => props.setLoggedIn()}
              signUp={() => setSignUp(true)}
            />
          ) : step == 1 ? (
            <FavoriteArtists
              nextStep={() => setStep(step + 1)}
              prevStep={() => setStep(step - 1)}
            />
          ) : step == 2 ? (
            <FavoriteSongs
              nextStep={() => setStep(step + 1)}
              prevStep={() => setStep(step - 1)}
            />
          ) : step == 3 ? (
            <UserSkills
              nextStep={() => setStep(step + 1)}
              prevStep={() => setStep(step - 1)}
            />
          ) : (
            <Success prevStep={() => setStep(step - 1)} />
          )}
        </div>
        <div className={step == 0 ? styles.rightSide : styles.rightSideHidden}>
          {step == 0 && (
            <img src="/musical.png" className={styles.musicalNotes}></img>
          )}
          {step == 0 && <img className={styles.logoImage} src="/logo.png" />}
        </div>
      </div>
    </>
  );
}
