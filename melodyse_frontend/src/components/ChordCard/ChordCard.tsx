import styles from './ChordCard.module.scss'
import { useEffect, useState} from 'react'

export default function ChordCard({chord, select, selected}) {

  return (
    <>
      <div className={selected ? styles.chordActive : styles.chord} onClick={() => select(chord)}>
        <span>{chord}</span>
      </div>
    </>
  )
}
