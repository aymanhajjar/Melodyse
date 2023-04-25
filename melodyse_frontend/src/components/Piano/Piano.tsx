import styles from './Piano.module.scss'
import { useEffect, useState, useRef } from 'react'
import axios from 'axios'
import WhiteButton from './buttons/WhiteButton'
import BlackButton from './buttons/BlackButton'

export default function Piano({selected}) {
    const [notes, setNotes] = useState([])

    useState(() => {
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
