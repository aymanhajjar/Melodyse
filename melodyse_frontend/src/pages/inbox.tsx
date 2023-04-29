import Head from 'next/head'
import styles from '@/styles/Home.module.scss'
import { useState } from 'react'
import axios from 'axios'

export default function Inbox({inbox} : any) {
  console.log(inbox)
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
    await axios.get(`${process.env.SERVER_SITE_URL}/getchats`, {
        headers: {
            Cookie: context.req.headers.cookie
        },
    }).then(res => inbox = res.data)
    .catch(err => console.log(err))
    console.log(context.req.cookies)
  
    return {props: {inbox: inbox}}
  }