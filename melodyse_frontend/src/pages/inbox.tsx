import Head from 'next/head'
import styles from '@/styles/Home.module.scss'
import { useState } from 'react'
import axios from 'axios'

export default function Inbox(props : any) {
  
  return (
    <>
      <Head>
        <title>Inbox | MELODYSE</title>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/logo.ico" />
      </Head>
      <div className={styles.container}>
        
      </div>
    </>
  )
}

export async function getServerSideProps(context) {
    let inbox = {}
    await axios.get(`${process.env.SERVER_SITE_URL}/getinbox`).then(res => inbox = res.data)
    .catch(err => console.log(err))
  
    return {props: {inbox: inbox}}
  }