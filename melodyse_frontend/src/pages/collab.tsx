import Head from 'next/head'
import styles from '@/styles/Collab.module.scss'
import { useEffect, useState } from 'react'
import axios from 'axios'
import CollabSearchBar from '@/components/CollabSearchBar/CollabSearchBar'
import FindMatchButton from '@/components/FindMatchButton/FindMatchButton'
import CheckBox from '@/components/CheckBox/CheckBox'
import SelectBox from '@/components/SelectBox/SelectBox'
import MusicianCard from '@/components/MusicianCard/MusicianCard'

export default function Collab(props : any) {
  const [musiciansTab, setMusiciansTab] = useState(true)
  const [searchVal, setSearchVal] = useState('')
  const [loading, setLoading] = useState(true)
  const [isVIP, setIsVIP] = useState(false)
  const [isPLUS, setIsPLUS] = useState(false)
  const [page, setPage] = useState(1)
  const [artists, setArtists] = useState([])

  useEffect(() => {
    axios.get(`${process.env.SITE_URL}/getmusicians?page=1`, {
      withCredentials: true
    }).then(res => {
      setLoading(false)
      console.log(res.data)
      setArtists(res.data)
    })
    .catch(err=> console.error(err))
    console.log(props.skills)
  }, [])

  
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
          {/* <FindMatchButton name="Find Matches" pic={'/assistant/magic-wand.png'} submit={findMatches} loading={matchesLoading}/> */}
          <div className={styles.filters}>
            <span>FILTER BY:</span>
            <CheckBox text="VIP" value={isVIP} setValue={() => setIsVIP(!isVIP)}/>
            <CheckBox text="PLUS" value={isPLUS} setValue={() => setIsPLUS(!isPLUS)}/>
            <SelectBox text="Skill" data={props.skills}/>
            <SelectBox text="Min Rating"/>
          </div>
        </div>

        {loading && <div className={styles.loading}><img src='/loading-melodyse.gif'/></div>}
        {!loading && artists && <div className={styles.artists}>
          {artists.map((artist, key) => (
          <MusicianCard key={key} artist={artist}/>
        )) }</div>}
      </div>
    </>
  )
}

Collab.getInitialProps = async (ctx) => {
  let data = []
  await axios.get(`${process.env.SERVER_SITE_URL}/getskills`).then(res => {
            data = res.data
            console.log(res)
        }).catch(err => console.error(err))
  return {skills: data}
}