import styles from './BlackButton.module.scss'
import { useEffect, useState} from 'react'

export default function BlackButton({select}) {
    const [active, setActive] = useState(false)

    const handleClick = () => {
        setActive(!active)
        select()
    }

  return (
    <>
      <div className={active ? styles.blackButtonActive : styles.blackButton} onClick={handleClick}>
      </div>
    </>
  )
}
