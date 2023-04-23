import Head from 'next/head'
import styles from '@/styles/Home.module.scss'
import Login from '../components/login/login'
import Register from '../components/register/register'
import { useState } from 'react'
import axios from 'axios'

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
            <div>
                <h1>STREAMLINE YOUR MUSIC JOURNEY WITH <h1 className={styles.redHeadline}>EASE</h1></h1>
                <p>Collaborate with Musicians Worldwide:
                Find the Perfect Match for Your Musical Projects</p>

            </div>
        </section>
        <section>
            SECC2
            </section>
        <section>
            SECC3
            </section>
      </div>
    </>
  )
}