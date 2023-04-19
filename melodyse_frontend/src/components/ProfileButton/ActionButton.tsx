import styles from './profileButton.module.scss'
import { useEffect, useState } from 'react'
import axios from 'axios'

export default function ActionButton({ name }: any) {
    const [dropdownOpen, setDropdownOpen] = useState(false)

    return(
        <button className={styles.actionbutton}>
            {name}
        </button>
    )
}