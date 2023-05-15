import Head from "next/head";
import styles from "@/styles/Login.module.scss";
import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import FavoriteArtists from "@/components/FavoriteArtists/FavoriteArtists";
import FavoriteSongs from "@/components/FavoriteSongs/FavoriteSongs";
import UserSkills from "@/components/UserSkills/UserSkills";

export default function LoginPage(props: any) {
  const router = useRouter();

  useEffect(() => {
    if (!props.loggedIn) {
      router.push("/");
    }
  }, [props.loggedIn]);

  return (
    <>
      <Head>
        <title>Edit Profile | MELODYSE</title>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/logo.ico" />
      </Head>
      <div className={styles.container}>
        {router.query.q == "artists" && (
          <FavoriteArtists edit={true} username={props.userData.username} />
        )}
        {router.query.q == "songs" && (
          <FavoriteSongs edit={true} username={props.userData.username} />
        )}
        {router.query.q == "skills" && (
          <UserSkills edit={true} username={props.userData.username} />
        )}
      </div>
    </>
  );
}
