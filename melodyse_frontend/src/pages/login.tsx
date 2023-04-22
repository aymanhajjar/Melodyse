import Head from 'next/head'
import styles from '@/styles/Home.module.scss'
import Login from '../components/login/login'
import Register from '../components/register/register'
import { useState } from 'react'
import axios from 'axios'
import FavoriteArtists from '@/components/FavoriteArtists/FavoriteArtists'

export default function Home(props : any) {
  const [loginActive, setLoginActive] = useState(true)
  const [step, setStep] = useState(0)

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
        <div className={step==0 ? styles.leftSide : styles.leftSideExpanded}>
          {loginActive ? <Login active={loginActive} onChangeForm={handleFormChange} token={props.token}/> : 
          (
            step == 0 ? <Register active={loginActive} onChangeForm={handleFormChange} token={props.token} nextStep = {() => setStep(step+1)}/> :
            (step == 1 ? <FavoriteArtists/> :
            step == 2 ? 'songs' : 'info')
          )}
        </div>
        <div className={step==0? styles.rightSide : styles.rightSideHidden}>

          {step == 0 && <img src='/musical.png' className={styles.musicalNotes}></img>}
          {step == 0 && <img className={styles.logoImage} src="/logo.png"/>}
        </div>
      </div>
    </>
  )
}
