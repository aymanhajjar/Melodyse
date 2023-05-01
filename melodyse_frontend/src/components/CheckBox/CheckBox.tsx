import styles from './ChordCard.module.scss'
import { useEffect, useState} from 'react'

export default function ChordCard({text, value, setValue}) {

  return (
    <div className={styles.container}>
      <input className={styles.container} type='checkbox' onClick={(e) => setValue(e.target.value)}/>
      <span>{text}</span>
    </div>
  )
}
