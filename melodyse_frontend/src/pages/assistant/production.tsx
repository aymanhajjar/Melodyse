import Head from 'next/head'
import styles from '@/styles/Production.module.scss'
import { useEffect, useState, useRef } from 'react'
import axios from 'axios'
import AIActionButton from '@/components/AIActionButton/AIActionButton'
import Piano from '@/components/Piano/Piano'
const Tonal = require('tonal')

function Production({subscriptions = []}) {
    const [notes, setNotes] = useState([])

    useEffect(() => {
        console.log(notes)
    }, [notes])

  return (
    <>
      <Head>
        <title>Production Assistant | MELODYSE</title>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/logo.ico" />
      </Head>
      <div className={styles.container}>
        <h1>MUSIC PRODUCTION ASSISTANT</h1>
        <div className={styles.UIContainer}>
            <Piano selected={(val) => setNotes(val)} />
            <div className={styles.DIV2}>
                DIV2
            </div>
            <div className={styles.DIV3}>
                DIV3
            </div>
        </div>
      </div>
    </>
  )
}

Production.getInitialProps = async (ctx) => {
  let data = []
  await axios.get(`${process.env.SERVER_SITE_URL}/getsubscriptions`).then(res => {
            data = res.data
        }).catch(err => console.error(err))
  return {subscriptions: data}
};

export default Production