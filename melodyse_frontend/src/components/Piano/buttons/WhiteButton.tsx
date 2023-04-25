import styles from './WhiteButton.module.scss'
import { useEffect, useState} from 'react'

export default function WhiteButton({note}) {
    const [active, setActive] = useState(false)

  return (
    <>
      <div className={active ? styles.whiteButtonActive : styles.whiteButton} onClick={() => setActive(!active)}>
        <span>{note}</span>
      </div>
    </>
  )
}
