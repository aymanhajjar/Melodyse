import React, { useState, useEffect } from 'react'
import Head from 'next/head'
import styles from '../styles/Layout.module.scss'
import axios from 'axios'


export default function Layout({ children }) {

    const [selected, setSelected] = useState('Home')
    const [loggedIn, setLoggedIn] = useState(false)

    useEffect(() => {
        getUserInfo()
    }, [])

    const getUserInfo = () => {
        axios.get(`${process.env.SITE_URL}/getinfo`, {
            withCredentials: true
        }).then(res => {
            console.log(res)
        }).catch(err => {
            if (err.response.status === 403 && err.response.data == 'User not logged in') {
                setLoggedIn(false)
            }
        })
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

                {loggedIn ? 
                <div>
                    loggedin
                </div>
                
                :<button type='button' className={styles.loginBtn}>LOG IN</button>}
            </header>

            <div className={styles.bodyContainer}>
                <nav className={styles.navBar}>
                    <div className={styles.navBtnDiv}>
                    <button type='button' className={styles.navBtn}>HOME</button>
                    <button type='button' className={styles.navBtn}>LISTEN</button>
                    <button type='button' className={styles.navBtn}>COLLAB</button>
                    <button type='button' className={styles.navBtn}>ASSISTANT</button>
                    <button type='button' className={styles.navBtn}>ABOUT</button>
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

