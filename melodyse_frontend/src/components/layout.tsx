import React, { useState, useEffect } from 'react'
import { Inter } from '@next/font/google';
import styles from '../styles/Layout.module.scss'

const Layout = ({children}: any) => {

    const [selected, setSelected] = useState('Home')

    return (
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
    )
}

export default Layout