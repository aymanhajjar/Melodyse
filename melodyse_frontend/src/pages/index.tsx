import Head from 'next/head'
import Image from 'next/image'
import { Inter } from 'next/font/google'
import styles from '@/styles/Home.module.scss'
import Login from '../components/login/login'

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
          <Login/>
        </div>
        <div className={styles.rightSide}>

          <img src='/musical.png' className={styles.musicalNotes}></img>
          <img className={styles.logoImage} src="/logo.png"/>
        </div>
      </div>
    </>
  )
}
