import Head from 'next/head'
import styles from '@/styles/Collab.module.scss'
import { useState } from 'react'
import axios from 'axios'

export default function Collab(props : any) {
  const [musiciansTab, setMusiciansTab] = useState(true)
  
  return (
    <>
      <Head>
        <title>Listen | MELODYSE</title>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/logo.ico" />
      </Head>
      <div className={styles.container}>
        <div className={styles.tabs}>
          <button type='button' className={musiciansTab ? styles.tabActive : styles.tabInactive}
            onClick={() => setMusiciansTab(true)}>MUSICIANS</button>
          <button type='button' className={musiciansTab ? styles.tabInactive : styles.tabActive}
            onClick={() => setMusiciansTab(false)}>PROJECTS</button>
        </div>
      </div>
    </>
  )
}