import styles from './WhiteButton.module.scss'
import { useEffect, useState} from 'react'

export default function WhiteButton({note, select}) {
    const [active, setActive] = useState(false)

    const handleClick = () => {
        setActive(!active)
        select()
    }

  return (
    <>
      <div className={active ? styles.whiteButtonActive : styles.whiteButton} onClick={handleClick}>
        <span>{note}</span>
      </div>
    </>
  )
}
