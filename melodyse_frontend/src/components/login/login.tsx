import styles from "./login.module.scss";
import { useEffect, useState } from "react";
import FormInput from "../FormInput/FormInput";
import axios from "axios";
import { useRouter } from "next/router";
import Cookies from "js-cookie";

export default function Login(props: any) {
  const [active, setActive] = useState(true);
  const [userEmailValue, setUserEmailValue] = useState("");
  const [passwordValue, setPasswordValue] = useState("");
  const [errormessage, setErrorMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [googleToken, setGoogleToken] = useState();

  const router = useRouter();

  useEffect(() => {
    setActive(props.active);
  }, [props.active]);

  const changeForm = () => {
    setActive(false);
    setTimeout(() => {
      props.onChangeForm();
    }, 300);
  };

  useEffect(() => {
    gapi.load("auth2", () => {
      gapi.auth2.init({
        client_id: process.env.GOOGLE_CLIENT_ID,
        plugin_name: "chat",
      });
    });
  }, []);

  function handleGoogleSignIn() {
    gapi.auth2
      .getAuthInstance()
      .signIn()
      .then((googleUser) => {
        setGoogleToken(googleUser.zc.id_token);
        const data = new FormData();
        data.append("response", JSON.stringify(googleUser));
        axios
          .post(`${process.env.SITE_URL}/google-signin`, data, {
            withCredentials: true,
          })
          .then((response) => {
            setLoading(false);
            const csrf = Cookies.get("csrftoken");
            axios.defaults.headers.common["X-CSRFToken"] = csrf;
            props.setLoggedIn();
            router.push("/");
          })
          .catch((err) => {
            if (err.response.status == 400) {
              setErrorMessage(
                "You seem to already have an account but never used Google Sign In. Enter your password to link your account with Google."
              );
              setUserEmailValue(err.response.data.split(": ")[1]);
            }
            if (err.response.status == 401) {
              setErrorMessage("Failed to verify user.");
            }
            console.error(err);
          });
      });
  }

  const handleSubmit = () => {
    setLoading(true);

    const data = new FormData();
    data.append("username_email", userEmailValue);
    data.append("password", passwordValue);
    googleToken && data.append("google_id_token", googleToken);

    axios
      .post(`${process.env.SITE_URL}/login`, data, {
        withCredentials: true,
      })
      .then((res) => {
        setLoading(false);
        const csrf = Cookies.get("csrftoken");
        axios.defaults.headers.common["X-CSRFToken"] = csrf;
        props.setLoggedIn();
        router.push("/");
      })
      .catch((err) => {
        setLoading(false);
        if (err.response.data == "User not found") {
          setErrorMessage("Invalid username/email or password.");
        }
      });
  };

  return (
    <div className={active ? styles.active : styles.hidden}>
      <h2>LOG IN</h2>

      <FormInput
        label="Username or Email:"
        placeholder="Username or Email"
        onChange={(val) => setUserEmailValue(val)}
      />

      <FormInput
        type="password"
        label="Password:"
        placeholder="Password"
        onChange={(val) => setPasswordValue(val)}
      />

      <span className={styles.forgotPassword}>Forgot your password?</span>

      {errormessage && <span className={styles.errorMsg}>{errormessage}</span>}

      <button type="button" className={styles.loginBtn} onClick={handleSubmit}>
        {loading ? <img src="/loadinggif.gif" /> : "LOG IN"}
      </button>

      <span>
        Don't have an account? <a onClick={() => changeForm()}>Create one</a>
      </span>
      <span>or, sign in using:</span>
      <div className={styles.socialIcons}>
        <img
          src="/icons/google-icon.png"
          alt="Google"
          onClick={handleGoogleSignIn}
        ></img>
        <img src="/icons/twitter-icon.png" alt="Twitter"></img>
        <img src="/icons/facebook-icon.png" alt="Facebook"></img>
      </div>
    </div>
  );
}
