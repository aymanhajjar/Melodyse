import styles from './Piano.module.scss'
import { useEffect, useState, useRef } from 'react'
import axios from 'axios'
import WhiteButton from './buttons/WhiteButton'
import BlackButton from './buttons/BlackButton'

export default function Piano() {

  return (
    <>
      <div className={styles.container}>
        <WhiteButton note='B'/>
        <WhiteButton note='A'/>
        <WhiteButton note='G'/>
        <WhiteButton note='F'/>
        <WhiteButton note='E'/>
        <WhiteButton note='D'/>
        <WhiteButton note='C'/>
        <div className={styles.blackButtons}>
            <BlackButton/>
            <BlackButton/>
            <BlackButton/>
        </div>
        <div className={styles.blackButtonsBottom}>
            <BlackButton/>
            <BlackButton/>
        </div>
      </div>
    </>
  )
}
