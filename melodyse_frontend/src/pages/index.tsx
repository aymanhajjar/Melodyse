import Head from 'next/head'
import styles from '@/styles/Home.module.scss'
import Login from '../components/login/login'
import Register from '../components/register/register'
import { useState } from 'react'

export default function Home() {
  const [loginActive, setLoginActive] = useState(true)

  function handleFormChange() {
    setLoginActive(!loginActive)
  }

  return (
    <>
      <Head>
        <title>Home | MELODYSE</title>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/logo.ico" />
      </Head>
      <div className={styles.container}>
        <div className={styles.leftSide}>
          {loginActive ? <Login active={loginActive} onChangeForm={handleFormChange}/> : <Register active={loginActive} onChangeForm={handleFormChange}/>}
        </div>
        <div className={styles.rightSide}>

          <img src='/musical.png' className={styles.musicalNotes}></img>
          <img className={styles.logoImage} src="/logo.png"/>
        </div>
      </div>
    </>
  )
}
