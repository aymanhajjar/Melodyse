import Head from 'next/head'
import styles from '@/styles/Home.module.scss'
import { useState } from 'react'
import axios from 'axios'

export default function Collab(props : any) {
  
  return (
    <>
      <Head>
        <title>Listen | MELODYSE</title>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/logo.ico" />
      </Head>
      <div className={styles.container}>
        COLLAB
      </div>
    </>
  )
}