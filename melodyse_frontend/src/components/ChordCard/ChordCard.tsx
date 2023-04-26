import styles from './ChordCard.module.scss'
import { useEffect, useState} from 'react'

export default function ChordCard({chord, select}) {
    const [active, setActive] = useState(false)

    const handleClick = () => {
        setActive(!active)
        select(chord)
    }

  return (
    <>
      <div className={active ? styles.chordActive : styles.chord} onClick={handleClick}>
        <span>{chord}</span>
      </div>
    </>
  )
}
