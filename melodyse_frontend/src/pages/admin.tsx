import Head from 'next/head'
import styles from '@/styles/About.module.scss'
import { useEffect, useState } from 'react'
import axios from 'axios'

export default function Admin({ userData } : any) {
  
  return (
    <>
      <Head>
        <title>ADMIN | MELODYSE</title>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/logo.ico" />
      </Head>
      <div className={styles.container}>
        {!userData.is_admin && <h1>Not Authorized.
            </h1>}
      </div>
    </>
  )
}