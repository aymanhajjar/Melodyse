import styles from './Piano.module.scss'
import { useEffect, useState, useRef } from 'react'
import axios from 'axios'
import WhiteButton from './buttons/WhiteButton'
import BlackButton from './buttons/BlackButton'

export default function Piano({selected, chordNotes}) {
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
        <WhiteButton note='B' select={() => handleSelect('B')} selected={chordNotes.includes('B') || chordNotes.includes('Cb')}/>
        <WhiteButton note='A' select={() => handleSelect('A')} selected={chordNotes.includes('A')}/>
        <WhiteButton note='G' select={() => handleSelect('G')} selected={chordNotes.includes('G')}/>
        <WhiteButton note='F' select={() => handleSelect('F')} selected={chordNotes.includes('F')}/>
        <WhiteButton note='E' select={() => handleSelect('E')} selected={chordNotes.includes('E') || chordNotes.includes('Fb')}/>
        <WhiteButton note='D' select={() => handleSelect('D')} selected={chordNotes.includes('D')}/>
        <WhiteButton note='C' select={() => handleSelect('C')} selected={chordNotes.includes('C')}/>
        <div className={styles.blackButtons}>
            <BlackButton select={() => handleSelect('A#')} selected={chordNotes.includes('A#') || chordNotes.includes('Bb')}/>
            <BlackButton select={() => handleSelect('G#')} selected={chordNotes.includes('G#') || chordNotes.includes('Ab')}/>
            <BlackButton select={() => handleSelect('F#')} selected={chordNotes.includes('F#') || chordNotes.includes('Gb')}/>
        </div>
        <div className={styles.blackButtonsBottom}>
            <BlackButton select={() => handleSelect('D#')} selected={chordNotes.includes('D#') || chordNotes.includes('Eb')}/>
            <BlackButton select={() => handleSelect('C#')} selected={chordNotes.includes('C#') || chordNotes.includes('Db')}/>
        </div>
      </div>
    </>
  )
}
