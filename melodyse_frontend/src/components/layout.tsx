import React, { useState, useEffect } from 'react'
import Head from 'next/head'
import styles from '../styles/Layout.module.scss'
import axios from 'axios'
import ProfileButton from './ProfileButton/ProfileButton'
import MessageButton from './MessageButton/MessageButton'
import NotificationButton from './NotificationButton/NotificationButton'
import FriendButton from './FriendButton/FriendButton'
import { useRouter } from 'next/router'


export default function Layout({ children, loggedIn, setLoggedIn, setLoggedOut, setSubscription }) {

    const [selected, setSelected] = useState('home')
    const [userData, setUserData] = useState({})

    const router = useRouter()

    useEffect(() => {
        getUserInfo()
    }, [loggedIn])

    useEffect(() => {
        router.asPath == '/' ? setSelected('home')
        : router.asPath == '/listen' ? setSelected('listen')
        : router.asPath =='/collab' ? setSelected('collab')
        : router.asPath == '/assistant' ? setSelected('assistant')
        : router.asPath == '/about' && setSelected('about')
    }, [router])

    const getUserInfo = () => {
        axios.get(`${process.env.SITE_URL}/getinfo`, {
            withCredentials: true
        }).then(res => {
            setLoggedIn()
            setUserData(res.data)
            getSubscription()
        }).catch(err => {
            try {
                if (err.response.status === 403 && err.response.data == 'User not logged in') {
                    setLoggedOut()
                }
            } catch {
                console.error(err)
            }
        })
        
    }

    const getSubscription = () => {
        axios.get(`${process.env.SITE_URL}/getsubscription`, {
            withCredentials: true
        }).then(res => {
            setSubscription(res.data)
        }).catch(err => {
            try {
                if (err.response.status === 403 && err.response.data == 'User not logged in') {
                    setLoggedOut()
                }
            } catch {
                console.error(err)
            }
        })
    }


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
                    <FriendButton/>
                    <MessageButton/>
                    <NotificationButton/>
                    <ProfileButton 
                        picture={userData['pic']} 
                        setSub={(val) => setSubscription(val)}
                        loggedOut = {() => setLoggedOut()}/>
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

