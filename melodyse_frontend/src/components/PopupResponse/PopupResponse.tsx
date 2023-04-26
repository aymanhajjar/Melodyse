import styles from './PopupResponse.module.scss'
import { useEffect, useState} from 'react'

export default function PopupResponse({response, close}) {

  return (
    <>
      <div className={styles.popup}>
        <span>{response}</span>
        <img src='/icons/close.png' onClick={close}/>
      </div>
    </>
  )
}
