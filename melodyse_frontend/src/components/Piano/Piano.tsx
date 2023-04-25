import styles from './Piano.module.scss'
import { useEffect, useState, useRef } from 'react'
import axios from 'axios'
import WhiteButton from './buttons/WhiteButton'
import BlackButton from './buttons/BlackButton'

export default function Piano({selected}) {
    const [notes, setNotes] = useState([])

    useEffect(() => {
        selected(notes)
    }, [notes])

    const handleSelect = (note) => {
        const index = notes.indexOf(note)
        index >= 0 ? setNotes(notes.filter((n) => n !== note)) : setNotes([...notes, note])
    }

  return (
    <>
      <div className={styles.container}>
        <WhiteButton note='B' select={() => handleSelect('B')}/>
        <WhiteButton note='A' select={() => handleSelect('A')}/>
        <WhiteButton note='G' select={() => handleSelect('G')}/>
        <WhiteButton note='F' select={() => handleSelect('F')}/>
        <WhiteButton note='E' select={() => handleSelect('E')}/>
        <WhiteButton note='D' select={() => handleSelect('D')}/>
        <WhiteButton note='C' select={() => handleSelect('C')}/>
        <div className={styles.blackButtons}>
            <BlackButton select={() => handleSelect('A#')}/>
            <BlackButton select={() => handleSelect('G#')}/>
            <BlackButton select={() => handleSelect('F#')}/>
        </div>
        <div className={styles.blackButtonsBottom}>
            <BlackButton select={() => handleSelect('D#')}/>
            <BlackButton select={() => handleSelect('C#')}/>
        </div>
      </div>
    </>
  )
}
