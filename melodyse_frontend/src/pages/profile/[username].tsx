import Head from 'next/head'
import styles from '@/styles/Assistant.module.scss'
import { useEffect, useState } from 'react'
import axios from 'axios'
import AIButton from '@/components/AIButton/AIButton'
import { useRouter } from 'next/router'

export default function Profile({data} : any) {

    console.log(data)
  return (
    <>
      <Head>
        <title>{data.username} | MELODYSE</title>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/logo.ico" />
      </Head>
      <div className={styles.container}>
      </div>
    </>
  )
}

export async function getServerSideProps(context) {
  let data = {}
  const username = context.query.username
  axios.get(`${process.env.SITE_URL}/profile/${username}`, {
    withCredentials: true
  }).then(res => data = res.data)

  return {props: {data : data}}
}