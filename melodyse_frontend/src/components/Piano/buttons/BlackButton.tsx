import styles from './BlackButton.module.scss'
import { useEffect, useState} from 'react'

export default function BlackButton() {
    const [active, setActive] = useState(false)

  return (
    <>
      <div className={active ? styles.blackButtonActive : styles.blackButton} onClick={() => setActive(!active)}>
      </div>
    </>
  )
}
