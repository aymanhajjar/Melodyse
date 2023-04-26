import styles from './BlackButton.module.scss'
import { useEffect, useState} from 'react'

export default function BlackButton({select, selected}) {
    const [active, setActive] = useState(false)

    useEffect(() => {
        setActive(selected)
    }, [selected])

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
