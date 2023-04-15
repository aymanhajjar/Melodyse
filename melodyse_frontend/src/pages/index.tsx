import Head from 'next/head'
import Image from 'next/image'
import { Inter } from 'next/font/google'
import styles from '@/styles/Home.module.scss'

const inter = Inter({ subsets: ['latin'] })

export default function Home() {
  return (
    <>
      <Head>
        <title>Home | MELODYSE</title>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/logo.ico" />
      </Head>
      <div className={styles.container}>
        <div className={styles.leftSide}>
          <h2>LOG IN</h2>
          <input className={styles.inputField} placeholder='Username or Email'/>
          <input className={styles.inputField} type="password" placeholder='Password'/>
          <button type='button' className={styles.loginBtn}>LOG IN</button>
          <span>Don't have an account? <a>Create one</a></span>
          <span>or, log in using:</span>
        </div>
        <div className={styles.rightSide}>
          <img className={styles.logoImage} src="/logo.png"/>
        </div>
      </div>
    </>
  )
}
