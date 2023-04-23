import Head from 'next/head'
import styles from '@/styles/Home.module.scss'
import Login from '../components/login/login'
import Register from '../components/register/register'
import { useState } from 'react'
import axios from 'axios'
import HomeButton from '@/components/HomeButton/HomeButton'

export default function Home(props : any) {
  
  return (
    <>
      <Head>
        <title>Home | MELODYSE</title>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/logo.ico" />
      </Head>
      <div className={styles.container}>
        <section>
            <img className={styles.pic1} src='/home/pic1.png'/>
            <div className={styles.textSectionLeft}>
                <h1>STREAMLINE YOUR MUSIC JOURNEY WITH <span className={styles.redHeadline}>EASE</span></h1>
                <p>Collaborate with Musicians Worldwide:
                Find the Perfect Match for Your Musical Projects</p>

                <HomeButton text={'GET STARTED'} link='/login'/>
            </div>
        </section>
        <section>
        <img className={styles.pic2} src='/home/pic2.png'/>
            <div className={styles.textSectionLeft}>
                <h1>DISCOVER THE <br/><span className={styles.redHeadline}>HOTTEST</span> <br/>NEW <span className={styles.redHeadline}>MUSIC</span></h1>
                <p>Listen to the Latest Tracks Created on Our Platform</p>

                <HomeButton text={'DISCOVER'} link='/listen'/>
            </div>
            </section>
        <section>
            <img className={styles.pic3} src='/home/pic3.png'/>
            <div className={styles.textSectionTop}>
                <h1>CONNECT WITH YOUR MUSICAL DREAM <span className={styles.redHeadline}>TEAM</span></h1>
                <p>Find Your Perfect Musical Match! Organize Your Team and Assign Tasks with Ease. Chat, Share Files, and Make Payments</p>

                <HomeButton text={'COLLAB'} link='/listen' top={true}/>
            </div>
            </section>
      </div>
    </>
  )
}