import Head from 'next/head'
import styles from '@/styles/Assistant.module.scss'
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
        <div className={styles.leftSide}>
            <h2>SONGWRITING ASSISTANT</h2>
            <textarea placeholder='Write Down Your Lyrics...'></textarea>

        </div>
        <div className={styles.rightSide}>
            
        </div>

      </div>
    </>
  )
}