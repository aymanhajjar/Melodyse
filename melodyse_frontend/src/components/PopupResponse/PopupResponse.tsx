import styles from './PopupResponse.module.scss'
import { useEffect, useState} from 'react'

export default function PopupResponse({response, close, pic=null}) {

  return (
    <>
      <div className={styles.popup}>
        {pic ? <img className={styles.cover} src={pic}/>
        : <span>{response}</span>}
        <img className={styles.close} src='/icons/close.png' onClick={close}/>
      </div>
    </>
  )
}
