import styles from "./formInput.module.scss";
import { useEffect, useState } from "react";
import axios from "axios";
import { setFips } from "crypto";

export default function FromInput(props: any) {
  const [labelVisible, setLabelVisible] = useState(false);
  const [value, setValue] = useState("");
  const [loading, setLoading] = useState(false);
  const [focus, setFocus] = useState(false);
  const [usernameAvailable, setUsernameAvailable] = useState(false);

  useEffect(() => {
    if (props.onChange) {
      props.onChange(value);
    }
  }, [value]);

  useEffect(() => {
    if (props.onCheck) {
      props.onCheck(usernameAvailable);
    }
  }, [usernameAvailable]);

  useEffect(() => {
    if (props.onFocus) {
      props.onFocus(focus);
    }
  }, [focus]);

  const handleUsername = (e: any) => {
    setValue(e.target.value);
    setLoading(true);
    const data = new FormData();
    data.append("username", e.target.value);
    axios
      .post(`${process.env.SITE_URL}/checkusername`, data, {
        withCredentials: true,
      })
      .then((res) => {
        res.data.status == "available"
          ? setUsernameAvailable(true)
          : setUsernameAvailable(false);
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
      });
  };
  return (
    <div className={styles.inputGroup}>
      <input
        type={props.type ? props.type : "text"}
        className={props.error ? styles.inputError : styles.inputField}
        onFocus={() => {
          setLabelVisible(true);
          setFocus(true);
        }}
        onBlur={() => {
          setLabelVisible(false);
          setFocus(false);
        }}
        placeholder={props.placeholder}
        onChange={
          props.type == "username"
            ? (e) => handleUsername(e)
            : (e) => setValue(e.target.value)
        }
        value={value}
        autoComplete="new-password"
      />
      <label className={labelVisible ? styles.visbleLabel : styles.hiddenLabel}>
        {props.label}
      </label>
      {props.type == "username" && value.length > 0 && (
        <img
          className={styles.usernameImg}
          src={
            loading
              ? "/loadinggif.gif"
              : usernameAvailable
              ? "/icons/check.png"
              : "/icons/wrong.png"
          }
        />
      )}
    </div>
  );
}
