import Head from 'next/head'
import styles from '@/styles/Assistant.module.scss'
import Login from '../components/login/login'
import { useState } from 'react'
import axios from 'axios'

export default function Listen(props : any) {
  
  return (
    <>
      <Head>
        <title>Assistant | MELODYSE</title>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/logo.ico" />
      </Head>
      <div className={styles.container}>
        SONGWRIT

      </div>
    </>
  )
}