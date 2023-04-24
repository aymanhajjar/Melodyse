import Head from 'next/head'
import styles from '@/styles/Home.module.scss'
import { useState, useRef, useEffect } from 'react'
import axios from 'axios'
import HomeButton from '@/components/HomeButton/HomeButton'

export default function Home(props : any) {
    const [activeSection, setActiveSection] = useState('section1')

    const sections = [
        { id: 'section1', ref: useRef(null) },
        { id: 'section2', ref: useRef(null) },
        { id: 'section3', ref: useRef(null) },
        { id: 'section4', ref: useRef(null) },
      ]

      const container = useRef(null)
    
    useEffect(() => {
        sections[0].ref.current.classList.add(styles.visibleFirst)
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
        const containerRef = container.current
        containerRef.addEventListener('scroll', handleScroll)
        return () => {
            containerRef.removeEventListener('scroll', handleScroll)
        }
    }, [])

    const scrollToSection = (id) => {
        const section = sections.find((s) => s.id === id)
        section.ref.current.scrollIntoView({ behavior: 'smooth' })
      }

  return (
    <>
      <Head>
        <title>Home | MELODYSE</title>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/logo.ico" />
      </Head>
        
      <div className={styles.container} ref={container}>
        <div className={styles.navDots}>
            {sections.map(({ id }) => (
                    <button
                    key={id}
                    className={id === activeSection ? styles.dotActive : styles.dotInactive}
                    onClick={() => scrollToSection(id)}
                    />
                ))}
        </div>
        <section ref={sections[0].ref} id={sections[0].id}>
            <img className={styles.pic1} src='/home/pic1.png'/>
            <div className={styles.textSectionLeft}>
                <h1>STREAMLINE YOUR MUSIC JOURNEY WITH <span className={styles.redHeadline}>EASE</span></h1>
                <p>Collaborate with Musicians Worldwide:
                Find the Perfect Match for Your Musical Projects</p>

                <HomeButton text={'GET STARTED'} link='/login'/>
            </div>
        </section>
        <section ref={sections[1].ref} id={sections[1].id}>
        <img className={styles.pic2} src='/home/pic2.png'/>
            <div className={styles.textSectionLeft}>
                <h1>DISCOVER THE <br/><span className={styles.redHeadline}>HOTTEST</span> <br/>NEW <span className={styles.redHeadline}>MUSIC</span></h1>
                <p>Listen to the Latest Tracks Created on Our Platform</p>

                <HomeButton text={'DISCOVER'} link='/listen'/>
            </div>
            </section>
        <section ref={sections[2].ref} id={sections[2].id}>
            <img className={styles.pic3} src='/home/pic3.png'/>
            <div className={styles.textSectionTop}>
                <h1>CONNECT WITH YOUR MUSICAL DREAM <span className={styles.redHeadline}>TEAM</span></h1>
                <p>Find Your Perfect Musical Match! Organize Your Team and Assign Tasks with Ease. Chat, Share Files, and Make Payments</p>

                <HomeButton text={'COLLAB'} link='/collab' top={true}/>
            </div>
            </section>
        <section ref={sections[3].ref} id={sections[3].id}>
            <img className={styles.pic4} src='/home/pic4.png'/>
            <div className={styles.textSectionLeft}>
                <h1>REVOLUTIONIZE YOUR MUSIC WITH <span className={styles.redHeadline}>AI</span></h1>
                <p>Get Songwriting Help, Learn Music Theory and More!</p>

                <HomeButton text={'ASSISTANT'} link='/assistant'/>
            </div>
        </section>
      </div>

    </>
  )
}