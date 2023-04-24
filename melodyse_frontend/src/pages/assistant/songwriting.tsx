import Head from 'next/head'
import styles from '@/styles/Songwriting.module.scss'
import { useState } from 'react'
import axios from 'axios'
import AIActionButton from '@/components/AIActionButton/AIActionButton'

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
            <h1>SONGWRITING ASSISTANT</h1>
            <textarea placeholder='Write Down Your Lyrics...'></textarea>
            <div className={styles.belowText}>
                <button>Hey</button>
                <label>
                    Use my interests to improve responses
                </label>
            </div>
        </div>
        <div className={styles.rightSide}>
            <AIActionButton name="Improve Lyrics" pic='/assistant/composing.png'/>
            <AIActionButton name="Feedback" pic='/assistant/feedback.png'/>
            <AIActionButton name="Fix Grammar" pic='/assistant/grammar.png'/>
            <AIActionButton name="Generate New Lyrics" pic='/assistant/magic-wand.png'/>
        </div>

      </div>
    </>
  )
}