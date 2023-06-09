import styles from "./UserSkills.module.scss";
import { useEffect, useState } from "react";
import axios from "axios";
import { useRouter } from "next/router";
import SkillCard from "../SkillCard/SkillCard";
import NextButton from "../NextButton/NextButton";
import ChosenSkill from "../ChosenSkill/ChosenSkill";

export default function UserSkills(props: any) {
  const [loading, setLoading] = useState(true);
  const [skills, setSkills] = useState();
  const [chosenSkills, setChosenSkills] = useState([]);
  const [buttonLoading, setButtonLoading] = useState(false);
  const [errorMsg, setErrorMessage] = useState();

  const router = useRouter();

  useEffect(() => {
    getChosenSkills();
    getSkills();
  }, []);

  const getSkills = () => {
    axios
      .get(`${process.env.SITE_URL}/getskills`, {
        withCredentials: true,
      })
      .then((res) => {
        setSkills(res.data);
        setLoading(false);
      })
      .catch((err) => console.error(err));
  };

  const getChosenSkills = () => {
    axios
      .get(`${process.env.SITE_URL}/getchosenskills`, {
        withCredentials: true,
      })
      .then((res) => {
        res.data && setChosenSkills(res.data);
        setLoading(false);
      })
      .catch((err) => console.error(err));
  };

  const submit = () => {
    setButtonLoading(true);
    const data = new FormData();
    data.append("skills", JSON.stringify(chosenSkills));

    axios
      .post(`${process.env.SITE_URL}/addskills`, data, {
        withCredentials: true,
      })
      .then((res) => {
        setLoading(false);
        props.edit
          ? router.push(`/profile/${props.username}`)
          : props.nextStep();
      })
      .catch((err) => {
        setLoading(false);
        console.error(err);
        setErrorMessage("Server Error");
      });
  };

  const remove = (skill) => {
    setChosenSkills(chosenSkills.filter((item) => item !== skill));
  };

  const addRemoveSkill = (skill) => {
    skill["rating"] = 4;
    chosenSkills.some((chosenSkill) => chosenSkill.name === skill.name)
      ? setChosenSkills(chosenSkills.filter((item) => item.name !== skill.name))
      : chosenSkills.length <= 7 && setChosenSkills([...chosenSkills, skill]);
  };

  const updateRating = (name, rating) => {
    const updatedSkills = chosenSkills.map((obj) => {
      if (obj.name === name) {
        return { ...obj, rating: rating };
      } else {
        return obj;
      }
    });
    setChosenSkills(updatedSkills);
  };

  return (
    <div className={styles.container}>
      <h2>Choose up to 8 skills and talents!</h2>
      {!props.edit && (
        <button
          type="button"
          className={styles.backbutton}
          onClick={() => props.prevStep()}
        >
          BACK
        </button>
      )}
      <div className={styles.later}>
        {!props.edit && (
          <a onClick={() => router.push("/")}>
            I will finish my profile later {">>"}
          </a>
        )}
        <NextButton
          text={props.edit ? "DONE" : "NEXT"}
          loading={buttonLoading}
          submit={submit}
        />
        <span className={styles.error}>{errorMsg}</span>
      </div>
      {loading ? (
        <img src={"/loading-melodyse.gif"} className={styles.loading} />
      ) : (
        skills && (
          <div className={styles.songsContainer}>
            {chosenSkills.length > 0 && (
              <div className={styles.chosenSongs}>
                {chosenSkills.map((skill) => (
                  <ChosenSkill
                    name={skill.name}
                    remove={() => remove(skill)}
                    rating={skill["rating"]}
                    updateRating={(name, rating) => updateRating(name, rating)}
                  />
                ))}
              </div>
            )}

            <div className={styles.songs}>
              {skills.map((skill, index) => {
                if (
                  chosenSkills.some(
                    (chosenSkill) => chosenSkill.name === skill.name
                  )
                ) {
                  return (
                    <SkillCard
                      skill={skill}
                      index={index}
                      checked={true}
                      addRemove={() => addRemoveSkill(skill)}
                    />
                  );
                } else {
                  return (
                    <SkillCard
                      skill={skill}
                      index={index}
                      checked={false}
                      addRemove={() => addRemoveSkill(skill)}
                    />
                  );
                }
              })}
            </div>
          </div>
        )
      )}
    </div>
  );
}
