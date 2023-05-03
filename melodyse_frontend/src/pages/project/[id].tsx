import Head from 'next/head'
import styles from '@/styles/Assistant.module.scss'
import { useEffect, useState } from 'react'
import axios from 'axios'
import AIButton from '@/components/AIButton/AIButton'

export default function Listen(props : any) {
  

  return (
    <>
      <Head>
        <title>Project | MELODYSE</title>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/logo.ico" />
      </Head>
      <div className={styles.container}>
        
      </div>
    </>
  )
}

export async function getServerSideProps(context) {
    let project = {}
    await axios.get(`${process.env.SERVER_SITE_URL}/get-project`, {
        headers: {
            Cookie: context.req.headers.cookie
        },
    }).then(res => project = res.data)
    .catch(err => console.log(err))
  
    return {props: {project: project}}
  }