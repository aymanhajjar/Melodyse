import Head from 'next/head'
import styles from '@/styles/Listen.module.scss'
import { useEffect, useState, useRef } from 'react'
import axios from 'axios'
import TrackCard from '@/components/TrackCard/TrackCard'
import ArtistCard from '@/components/ArtistCard/ArtistCard'
import ActionButton from '@/components/ProfileButton/ActionButton'

export default function Listen({ track_list, artists_list } : any) {
  const [tracks, setTracks] = useState(track_list)
  const [activeSection, setActiveSection] = useState('1')
  const [searchValue, setSearchValue] = useState('')
  const [loading, setLoading] = useState(false)
  const [searchLoading, setSearchLoading] = useState(false)
  const [searchRes, setSearchRes] = useState()

  const sections = [
    { id: '1', ref: useRef(null) },
    { id: '2', ref: useRef(null) },
    { id: '3', ref: useRef(null) },
  ]
  const container = useRef(null)

  useEffect(() => {
    !searchLoading && !searchRes && sections[0].ref.current.classList.add(styles.visibleFirst)
    const containerRef = container.current
    containerRef.addEventListener('scroll', handleScroll)
    return () => {
        containerRef.removeEventListener('scroll', handleScroll)
    }
  }, [])

  useEffect(() => {
    if(searchValue.length == 0) {
        setSearchRes()
        setSearchLoading(false)
        setActiveSection('1')
    }
  }, [searchValue])

  useEffect(() => {
    !searchRes && sections[0].ref.current.classList.add(styles.visibleFirst)
  }, [searchRes])

  useEffect(() => {
    setLoading(true)
    console.log(`${process.env.SITE_URL}/gettracks?page=${activeSection}`)
    axios.get(`${process.env.SITE_URL}/gettracks?page=${activeSection}`, {
        withCredentials: true
    }).then(res => {
        setLoading(false)
        setTracks(res.data)})
    .catch(err => console.log(err))
  }, [activeSection])


  const handleScroll = () => {
    if(!searchRes && !searchLoading) {
        const { scrollTop, clientHeight } = document.documentElement
        sections.forEach(({ id, ref }) => {
            const { top, height } = ref.current.getBoundingClientRect()
            const sectionElement = ref.current
            if (top < clientHeight / 2 && top + height > clientHeight / 2) {
                setActiveSection(id)
                sectionElement.classList.add(styles.visible)
            } else {
                sectionElement.classList.remove(styles.visible)
                sectionElement.classList.remove(styles.visibleFirst)
            }
        })
    }
}

  const scrollToSection = (id) => {
    const section = sections.find((s) => s.id === id)
    section.ref.current.scrollIntoView({ behavior: 'smooth' })
  }

  const search = () => {
    if(searchValue.length > 0) {
        setSearchLoading(true)
        axios.get(`${process.env.SITE_URL}/search?q=${searchValue}`).then(res => {
            setSearchLoading(false)
            setSearchRes(res.data)})
        .catch(err => console.log(err))
    }
  }

  return (
    <>
      <Head>
        <title>Listen | MELODYSE</title>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/logo.ico" />
      </Head>
      <div className={styles.container}>
        <div className={styles.div1}>
        
            <h2>TRACKS OF THE DAY</h2>
            <div className={styles.sections} ref={container}>

                {!searchLoading ? !searchRes && <>
                    <div className={styles.navDots}>
                        {sections.map(({ id }) => (
                                <button
                                key={id}
                                className={id === activeSection ? styles.dotActive : styles.dotInactive}
                                onClick={() => scrollToSection(id)}
                                />
                            ))}
                    </div>
                <section id={sections[0].id} ref={sections[0].ref}>
                    {!loading && tracks && tracks.map(track => (
                        <TrackCard track={track}/>
                    ))}
                    <span></span>
                    {loading && <img className={styles.loading} src='/loading-melodyse.gif'/>}
                </section>
                <section id={sections[1].id} ref={sections[1].ref}>
                    {!loading && tracks && tracks.map(track => (
                        <TrackCard track={track}/>
                    ))}
                    <span></span>
                    {loading && <img className={styles.loading} src='/loading-melodyse.gif'/>}
                </section>
                <section id={sections[2].id} ref={sections[2].ref}>
                    {!loading && tracks && tracks.map(track => (
                        <TrackCard track={track}/>
                    ))}
                    {loading && <img className={styles.loading} src='/loading-melodyse.gif'/>}
                    <span></span>
                </section> </> : <img className={styles.loading} src='/loading-melodyse.gif'/>}

                {searchRes && 
                    searchRes.tracks.map(track => (
                        <TrackCard track={track}/>
                    ))
                }

            </div>
            
        </div>
        <div className={styles.div2}>
            <h2>TOP ARTISTS</h2>
            <div className={styles.div2Content}>
                <div className={searchValue.length > 0 ? styles.artistsBottom : styles.artists}>
                {!searchLoading ? !searchRes && <>
                    {artists_list && artists_list.map(artist => (
                        <ArtistCard data={artist} />
                    ))}
                    </> : <img className={styles.loading} src='/loading-melodyse.gif'/>}

                {searchRes && searchRes.artists.map(artist => (
                        <ArtistCard data={artist} />
                    ))}
                </div>
                <div className={searchValue.length > 0 ? styles.searchTop : styles.search}>
                    <input placeholder='Search'
                     value={searchValue} onChange={(e) => setSearchValue(e.target.value)}/>
                    <ActionButton name="SEARCH" onClick={search}/>
                </div>
            </div>
        </div>
      </div>
    </>
  )
}

export async function getServerSideProps(context) {
    let tracks = {}
    let artists = {}
    await axios.get(`${process.env.SERVER_SITE_URL}/gettracks?page=1`, {
        headers: {
            Cookie: context.req.headers.cookie
        },
    }).then(res => tracks = res.data)
    .catch(err => console.log(err))
    await axios.get(`${process.env.SERVER_SITE_URL}/getartists`).then(res => artists = res.data)
    .catch(err => console.log(err))
  
    return {props: {tracks_list: tracks, artists_list: artists}}
  }