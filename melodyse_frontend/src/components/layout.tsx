import React, { useState, useEffect } from 'react'
import Head from 'next/head'
import styles from '../styles/Layout.module.scss'
import axios from 'axios'
import { GetStaticProps } from 'next'


export default function Layout({ children, token}) {

    const [selected, setSelected] = useState('Home')

    return (
        <>
        <Head>
            <script src="https://apis.google.com/js/platform.js" async defer></script>
            <meta name="google-signin-client_id" content={process.env.GOOGLE_CLIENT_ID}/>
        </Head>
        <div className={styles.container}>
            <header className={styles.header}>
                <div className={styles.titleContainer}>
                    <img src='/logo.png'/>
                    <h1>MELODYSE</h1>
                </div>

                <button type='button' className={styles.loginBtn}>LOG IN</button>
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

