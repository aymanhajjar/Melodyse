import styles from './Piano.module.scss'
import { useEffect, useState, useRef } from 'react'
import axios from 'axios'

export default function Piano() {

  return (
    <>
      <div className={styles.container}>
        <div className={styles.whiteButton}></div>
      </div>
    </>
  )
}
