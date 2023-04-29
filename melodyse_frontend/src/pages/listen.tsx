import Head from 'next/head'
import styles from '@/styles/Listen.module.scss'
import { useState } from 'react'
import axios from 'axios'

export default function Listen({ data } : any) {
  
  return (
    <>
      <Head>
        <title>Listen | MELODYSE</title>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/logo.ico" />
      </Head>
      <div className={styles.container}>
        <div className={styles.div1}>
            <h2>TRACKS OF THE DAY</h2>
        </div>
        <div className={styles.div2}>
            <h2>TOP ARTISTS</h2>
            
        </div>
      </div>
    </>
  )
}

export async function getServerSideProps(context) {
    let data = {}
    await axios.get(`${process.env.SERVER_SITE_URL}/gettracks`).then(res => data = res.data)
    .catch(err => console.log(err))
  
    return {props: {data : data}}
  }