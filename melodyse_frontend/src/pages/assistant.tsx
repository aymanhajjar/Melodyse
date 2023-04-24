import Head from 'next/head'
import styles from '@/styles/Assistant.module.scss'
import Login from '../components/login/login'
import Register from '../components/register/register'
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
        <div className={styles.header}>
            <h1>AI ASSISTANT</h1>
            <h4>An AI-powered assistant for all your musical needs!</h4>
        </div>

        <div className={styles.aiButtons}>
            
        </div>
      </div>
    </>
  )
}