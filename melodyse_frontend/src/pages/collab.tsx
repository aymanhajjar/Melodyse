import Head from 'next/head'
import styles from '@/styles/Collab.module.scss'
import { useState } from 'react'
import axios from 'axios'
import CollabSearchBar from '@/components/CollabSearchBar/CollabSearchBar'
import FindMatchButton from '@/components/FindMatchButton/FindMatchButton'

export default function Collab(props : any) {
  const [musiciansTab, setMusiciansTab] = useState(true)
  const [searchVal, setSearchVal] = useState('')
  const [matchesLoading, setMatchesLoading] = useState(false)

  const findMatches = () => {
    setMatchesLoading(true)
  }
  
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

        <div className={styles.topBar}>
          <CollabSearchBar value={searchVal} setValue={(val) => setSearchVal(val)}/>
          <FindMatchButton name="Find Matches" pic={'/assistant/magic-wand.png'} submit={findMatches} loading={matchesLoading}/>
          <div>
            <span>FILTER BY:</span>
            <input type="checkbox"/>
          </div>
        </div>
      </div>
    </>
  )
}