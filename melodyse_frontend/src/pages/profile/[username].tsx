import Head from 'next/head'
import styles from '@/styles/Profile.module.scss'
import { useEffect, useState } from 'react'
import axios from 'axios'
import AIButton from '@/components/AIButton/AIButton'
import { useRouter } from 'next/router'
import ProfileActionButton from '@/components/ProfileActionButton/ProfileActionButton'
import UserSkillCard from '@/components/UserSkillCard/UserSkillCard'
import Artist from '@/components/Artist/Artist'
import Song from '@/components/Song/Song'

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

            <div className={styles.skillsContainer}>
              <h2>Skills</h2>
              <div className={styles.skills}>
              {data.skills.length > 0 ? data.skills.map(skill => (
                <UserSkillCard skill={skill}/>
              )): 'No Skills To Show'}
              </div>
            </div>

            <div className={styles.favorite}>
              <h2>Favorite Artists</h2>
              <div className={styles.artists}>
                {data.favorite_artists.length > 0 ? data.favorite_artists.map(artist => (
                  <Artist data={artist}/>
                )): 'No Favorite Artists'}
              </div>
            </div>

            <div className={styles.favorite}>
              <h2>Favorite Songs</h2>
              <div className={styles.artists}>
                {data.favorite_songs.length > 0 ? data.favorite_songs.map(song => (
                  <Song data={song}/>
                )): 'No Favorite Songs'}
              </div>
            </div>

            <div className={styles.favorite}>
              <h2>Ongoing Projects</h2>
              <div className={styles.artists}>
                {data.ongoing_projects.length > 0 ? data.ongoing_projects.map(prj => (
                  <Song data={prj}/>
                )): 'No Ongoing Projects'}
              </div>
            </div>

            <div className={styles.favorite}>
              <h2>Completed Projects</h2>
              <div className={styles.artists}>
                {data.completed_projects.length > 0 ? data.completed_projects.map(prj => (
                  <Song data={prj}/>
                )): 'No Completed Projects'}
              </div>
            </div>
        </div>

        <div className={styles.div3}>
          <div className={styles.actions}>
            <ProfileActionButton name="Hire" pic='/icons/briefcase.png' color='#47E5BC'/>
            <ProfileActionButton name="Collab" pic='/icons/handshake.png' color="#FFE8D1"/>
            <ProfileActionButton name="Message" pic='/icons/email.png' color="#D49BAE"/>
          </div>
          
          <div className={styles.additionalInfo}>

            <div className={styles.rating}> 
              <div className={styles.stars}>
                {[...Array(5)].map((_, index) => (
                        <img
                        key={index}
                        src={index < data.rating ? '/icons/starEnabled.png' : '/icons/starDisabled.png'}
                      />
                    ))}
              </div>
              <span>Rated by:</span>
            </div>

            <div className={styles.stats}>
              <img src='/icons/like.png'/>
              <span>{} likes recieved</span>
            </div>

            <div className={styles.stats}>
              <img src='/icons/friends.png'/>
              <span>{data.friends} friends</span>
            </div>

          </div>
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