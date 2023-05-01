import React, { useState, useEffect } from 'react'
import Head from 'next/head'
import styles from '../styles/Layout.module.scss'
import axios from 'axios'
import ProfileButton from './ProfileButton/ProfileButton'
import MessageButton from './MessageButton/MessageButton'
import NotificationButton from './NotificationButton/NotificationButton'
import FriendButton from './FriendButton/FriendButton'
import { useRouter } from 'next/router'


export default function Layout({ children, loggedIn, setLoggedOut, setSubscription, userData, subscription, notfCount, msgCount, reqCount, is_readNotf }) {

    const [selected, setSelected] = useState('home')
    // const [userData, setUserData] = useState({})

    const router = useRouter()
    useEffect(() => {
        console.log('countt', notfCount)
    }, [notfCount])

    useEffect(() => {
        router.asPath == '/' ? setSelected('home')
        : router.asPath == '/listen' ? setSelected('listen')
        : router.asPath =='/collab' ? setSelected('collab')
        : router.asPath == '/assistant' ? setSelected('assistant')
        : router.asPath == '/about' && setSelected('about')
    }, [router])

    const switchPage = (page) => {
        router.push('/' + page)
        page == '' ? setSelected('home') : setSelected(page)
    }

    return (
        <>
        <Head>
            <script src="https://apis.google.com/js/platform.js" async defer></script>
            <meta name="google-signin-client_id" content={process.env.GOOGLE_CLIENT_ID}/>
            <script src="https://apis.google.com/js/api.js"></script>
        </Head>
        <div className={styles.container}>
            <header className={styles.header}>
                <div className={styles.titleContainer}>
                    <img src='/logo.png'/>
                    <h1>MELODYSE</h1>
                </div>

                {loggedIn && userData ? 
                <div className={styles.userbuttons}>
                    <FriendButton unread={reqCount}/>
                    <MessageButton unread={msgCount}/>
                    <NotificationButton unread={notfCount} is_read={is_readNotf}/>
                    <ProfileButton 
                        picture={userData['pic']}
                        username={userData['username']}
                        setSub={(val) => setSubscription(val)}
                        loggedOut = {() => setLoggedOut()}
                        subscription={subscription}/>
                </div>
                
                :<button type='button' className={styles.loginBtn} onClick={() => router.push('/login')}>LOG IN</button>}
            </header>

            <div className={styles.bodyContainer}>
                <nav className={styles.navBar}>
                    <div className={styles.navBtnDiv}>

                    <button type='button' 
                        className={selected == "home" ? styles.navBtnFocus : styles.navBtn} 
                        onClick={() => switchPage('')}>HOME</button>

                    <button type='button'
                        className={selected == "listen" ? styles.navBtnFocus : styles.navBtn} 
                        onClick={() => switchPage('listen')}>LISTEN</button>

                    <button type='button'
                        className={selected == "collab" ? styles.navBtnFocus : styles.navBtn} 
                        onClick={() => switchPage('collab')}>COLLAB</button>

                    <button type='button' className={selected == "assistant" ? styles.navBtnFocus : styles.navBtn} 
                        onClick={() => switchPage('assistant')}>ASSISTANT</button>
                        
                    <button type='button' className={selected == "about" ? styles.navBtnFocus : styles.navBtn} 
                        onClick={() => switchPage('about')}>ABOUT</button>
                    </div>
                    <span>© 2023 MELODYSE</span>
                </nav>
                <div className={styles.page}>
                    {children}
                </div>
            </div>
        </div>
        </>
    )
}

