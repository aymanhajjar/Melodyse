import Head from "next/head";
import styles from "@/styles/Collab.module.scss";
import { useEffect, useState } from "react";
import axios from "axios";
import CollabSearchBar from "@/components/CollabSearchBar/CollabSearchBar";
import { useRouter } from "next/router";
import CheckBox from "@/components/CheckBox/CheckBox";
import SelectBox from "@/components/SelectBox/SelectBox";
import MusicianCard from "@/components/MusicianCard/MusicianCard";
import ProjectCard from "@/components/ProjectCard/ProjectCard";

export default function Collab(props: any) {
  const [musiciansTab, setMusiciansTab] = useState(true);
  const [searchVal, setSearchVal] = useState("");
  const [loading, setLoading] = useState(true);
  const [isVIP, setIsVIP] = useState(false);
  const [isPLUS, setIsPLUS] = useState(false);
  const [page, setPage] = useState(1);
  const [artists, setArtists] = useState([]);
  const [projects, setProjects] = useState([]);
  const [hasMore, setHasMore] = useState(true);
  const [skillValue, setSkillValue] = useState();
  const [ratingValue, setRatingValue] = useState();

  const router = useRouter();

  useEffect(() => {
    if (router.query.skill) {
      setSkillValue(router.query.skill);
    } else getUsers();
  }, []);

  useEffect(() => {
    musiciansTab ? getUsers() : getProjects();
  }, [musiciansTab]);

  useEffect(() => {
    getUsersFilters();
  }, [skillValue, ratingValue, isVIP, isPLUS]);

  const getUsers = () => {
    setLoading(true);
    axios
      .get(`${process.env.SITE_URL}/getmusicians?page=1`, {
        withCredentials: true,
      })
      .then((res) => {
        setLoading(false);
        setArtists(res.data);
      })
      .catch((err) => console.error(err));
  };

  const getProjects = () => {
    setLoading(true);
    axios
      .get(`${process.env.SITE_URL}/getallprojects`, {
        withCredentials: true,
      })
      .then((res) => {
        setLoading(false);
        setProjects(res.data);
      })
      .catch((err) => console.error(err));
  };

  const getUsersFilters = () => {
    if (!skillValue && !ratingValue && !isPLUS && !isVIP && !searchVal) {
      setHasMore(true);
      setPage(1);
    } else {
      setLoading(true);
      axios
        .get(
          `${process.env.SITE_URL}/getmusicians?${
            searchVal ? `q=${searchVal}` : ""
          }${skillValue ? `&&skill=${skillValue}` : ""}${
            ratingValue ? `&&rating=${ratingValue}` : ""
          }${isVIP ? `&&is_vip=true` : ""}${isPLUS ? `&&is_plus=true` : ""}`,
          {
            withCredentials: true,
          }
        )
        .then((res) => {
          setLoading(false);
          setHasMore(false);
          setArtists(res.data);
        })
        .catch((err) => {
          try {
            if (err.response.status === 404) setHasMore(false);
          } catch {
            console.error(err);
          }
        });
    }
  };

  function handleScroll(e) {
    if (
      Math.trunc(e.target.scrollHeight - e.target.scrollTop) ==
      e.target.clientHeight
    ) {
      axios
        .get(`${process.env.SITE_URL}/getmusicians?page=${page + 1}`, {
          withCredentials: true,
        })
        .then((res) => {
          setLoading(false);
          setArtists([...artists, ...res.data]);
          setPage(page + 1);
        })
        .catch((err) => {
          try {
            if (err.response.status === 404) setHasMore(false);
          } catch {
            console.error(err);
          }
        });
    }
  }

  return (
    <>
      <Head>
        <title>Listen | MELODYSE</title>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/logo.ico" />
      </Head>
      <div className={styles.container} onScroll={handleScroll}>
        <div className={styles.tabs}>
          <button
            type="button"
            className={musiciansTab ? styles.tabActive : styles.tabInactive}
            onClick={() => setMusiciansTab(true)}
          >
            MUSICIANS
          </button>
          <button
            type="button"
            className={musiciansTab ? styles.tabInactive : styles.tabActive}
            onClick={() => setMusiciansTab(false)}
          >
            PROJECTS
          </button>
        </div>

        {musiciansTab && (
          <>
            <div className={styles.topBar}>
              <CollabSearchBar
                value={searchVal}
                setValue={(val) => setSearchVal(val)}
                submit={getUsersFilters}
              />
              <div className={styles.filters}>
                <span>FILTER BY:</span>
                <CheckBox
                  text="VIP"
                  value={isVIP}
                  setValue={() => setIsVIP(!isVIP)}
                />
                <CheckBox
                  text="PLUS"
                  value={isPLUS}
                  setValue={() => setIsPLUS(!isPLUS)}
                />
                <SelectBox
                  text="Skill"
                  data={props.skills}
                  value={skillValue}
                  setValue={(val) => setSkillValue(val)}
                />
                <SelectBox
                  text="Min Rating"
                  value={ratingValue}
                  setValue={(val) => setRatingValue(val)}
                />
              </div>
            </div>

            {loading && (
              <div className={styles.loading}>
                <img src="/loading-melodyse.gif" />
              </div>
            )}
            {!loading && artists && (
              <div className={styles.artists}>
                {artists.map((artist, key) => (
                  <MusicianCard key={key} artist={artist} />
                ))}
              </div>
            )}
            {hasMore && !loading && (
              <div className={styles.loading}>
                <img src="/loading-melodyse.gif" />
              </div>
            )}
          </>
        )}

        {!musiciansTab && (
          <>
            {loading && (
              <div className={styles.loading}>
                <img src="/loading-melodyse.gif" />
              </div>
            )}
            {!loading && projects && (
              <div className={styles.projects}>
                {projects.map((prj, key) => (
                  <ProjectCard
                    key={key}
                    project={prj}
                    ongoing={true}
                    browse={true}
                    loggedIn={props.loggedIn}
                  />
                ))}
              </div>
            )}
          </>
        )}
      </div>
    </>
  );
}

Collab.getInitialProps = async (ctx) => {
  let data = [];
  await axios
    .get(`${process.env.SERVER_SITE_URL}/getskills`)
    .then((res) => {
      data = res.data;
    })
    .catch((err) => console.error(err));
  return { skills: data };
};
