import Head from 'next/head'
import styles from '@/styles/Profile.module.scss'
import { useEffect, useState } from 'react'
import axios from 'axios'
import AIButton from '@/components/AIButton/AIButton'
import { useRouter } from 'next/router'
import ProfileActionButton from '@/components/ProfileActionButton/ProfileActionButton'
import UserSkillCard from '@/components/UserSkillCard/UserSkillCard'

export default function Profile({data} : any) {

  return (
    <>
      <Head>
        <title>{data.username} | MELODYSE</title>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/logo.ico" />
      </Head>
      <div className={styles.container}>
        <div className={styles.div1}>
          <img src={process.env.SITE_URL + data.picture} className={styles.profilePic}/>

          <div className={styles.info}>
            <h1>{data.full_name}</h1>
            <span>@{data.username}</span>
            <p>{data.description}</p>
          </div>

          <ProfileActionButton name="Add Friend" pic='/icons/add-friend.png'/>
        </div>

        <div className={styles.div2}>
            <div className={styles.skills}>
              {data.skills ? data.skills.map(skill => (
                <UserSkillCard skill={skill}/>
              )): 'No Skills To Show'}
            </div>
        </div>

        <div className={styles.div3}>

        </div>
      </div>
    </>
  )
}

export async function getServerSideProps(context) {
  let data = {}
  const username = context.query.username
  await axios.get(`${process.env.SERVER_SITE_URL}/profile/${username}`).then(res => data = res.data)
  .catch(err => console.log(err))

  return {props: {data : data}}
}