import Head from 'next/head'
import styles from '@/styles/Collab.module.scss'
import { useState } from 'react'
import axios from 'axios'

export default function About(props : any) {
  
  return (
    <>
      <Head>
        <title>About | MELODYSE</title>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/logo.ico" />
      </Head>
      <div className={styles.container}>

      </div>
    </>
  )
}