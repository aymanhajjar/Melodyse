import Head from 'next/head'
import styles from '@/styles/Listen.module.scss'
import { useEffect, useState, useRef } from 'react'
import axios from 'axios'
import TrackCard from '@/components/TrackCard/TrackCard'

export default function Listen({ track_list, artists_list } : any) {
  const [tracks, setTracks] = useState(track_list)
  const [artists, setArtists] = useState(artists_list)
  const [activeSection, setActiveSection] = useState('1')
  const [loading, setLoading] = useState(false)

  const sections = [
    { id: '1', ref: useRef(null) },
    { id: '2', ref: useRef(null) },
    { id: '3', ref: useRef(null) },
  ]
  const container = useRef(null)


  useEffect(() => {
    sections[0].ref.current.classList.add(styles.visibleFirst)
    const containerRef = container.current
    containerRef.addEventListener('scroll', handleScroll)
    return () => {
        containerRef.removeEventListener('scroll', handleScroll)
    }
  }, [])

  useEffect(() => {
    setLoading(true)
    axios.get(`${process.env.SITE_URL}/gettracks?page=${activeSection}`).then(res => {
        setLoading(false)
        setTracks(res.data)})
    .catch(err => console.log(err))
  }, [activeSection])


  const handleScroll = () => {
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

  const scrollToSection = (id) => {
    const section = sections.find((s) => s.id === id)
    section.ref.current.scrollIntoView({ behavior: 'smooth' })
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
        <div className={styles.navDots}>
            {sections.map(({ id }) => (
                    <button
                    key={id}
                    className={id === activeSection ? styles.dotActive : styles.dotInactive}
                    onClick={() => scrollToSection(id)}
                    />
                ))}
        </div>
            <h2>TRACKS OF THE DAY</h2>
            <div className={styles.sections} ref={container}>
                <section ref={sections[0].ref}>
                    {!loading && tracks && tracks.map(track => (
                        <TrackCard track={track}/>
                    ))}
                    <span></span>
                    {loading && <img className={styles.loading} src='/loading-melodyse.gif'/>}
                </section>
                <section ref={sections[1].ref}>
                    {!loading && tracks && tracks.map(track => (
                        <TrackCard track={track}/>
                    ))}
                    <span></span>
                    {loading && <img className={styles.loading} src='/loading-melodyse.gif'/>}
                </section>
                <section ref={sections[2].ref}>
                    {!loading && tracks && tracks.map(track => (
                        <TrackCard track={track}/>
                    ))}
                    {loading && <img className={styles.loading} src='/loading-melodyse.gif'/>}
                    <span></span>
                </section>
            </div>
            
        </div>
        <div className={styles.div2}>
            <h2>TOP ARTISTS</h2>
            
        </div>
      </div>
    </>
  )
}

export async function getServerSideProps(context) {
    let tracks = {}
    let artists = {}
    await axios.get(`${process.env.SERVER_SITE_URL}/gettracks?page=1`).then(res => tracks = res.data)
    .catch(err => console.log(err))
    await axios.get(`${process.env.SERVER_SITE_URL}/getartists`).then(res => artists = res.data)
    .catch(err => console.log(err))
  
    return {props: {tracks_list: tracks, artists_list: artists}}
  }