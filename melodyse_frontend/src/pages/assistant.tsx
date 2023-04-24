import Head from 'next/head'
import styles from '@/styles/Assistant.module.scss'
import { useState } from 'react'
import axios from 'axios'
import AIButton from '@/components/AIButton/AIButton'

export default function Listen(props : any) {
  
  return (
    <>
      <Head>
        <title>Assistant | MELODYSE</title>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/logo.ico" />
      </Head>
      <div className={styles.container}>
        <span className={styles.points}>{props.loggedIn ? 'logs' : 'You Must Be Logged In to Use Assistant'}</span>
        <div className={styles.header}>
            <h1>AI ASSISTANT</h1>
            <h4>An AI-powered assistant for all your musical needs!</h4>
        </div>

        <div className={styles.aiButtons}>
            <AIButton name="SONGWRITING ASSISTANT" pic='/icons/writing.png' route={props.loggedIn ?  "/assistant/songwriting" : '/login'}/>
            <AIButton name="PRODUCTION ASSISTANT" pic='/icons/producer.png' route={props.loggedIn ?  "/assistant/production" : '/login'}/>
            <AIButton name="LEARNING ASSISTANT" pic='/icons/guitar.png' route={props.loggedIn ?  "/assistant/learning" : '/login'}/>
            <AIButton name="RELEASE ASSISTANT" pic='/icons/vinyl-record.png' route={props.loggedIn ?  "/assistant/release" : '/login'}/>
        </div>
      </div>
    </>
  )
}