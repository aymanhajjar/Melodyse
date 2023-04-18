import styles from './notificationButton.module.scss'
import { useEffect, useState } from 'react'
import FormInput from '../FormInput/FormInput'
import axios from 'axios'
import Cookies from 'js-cookie'

export default function NotificationButton(props: any) {
    const [dropdownOpen, setDropdownOpen] = useState(false)

    return(
        <div className={styles.container}>
            <img className={styles.ntfimg} src='/ntf.png' onClick={() => setDropdownOpen(!dropdownOpen)}/>
            <div className={dropdownOpen ? styles.dropdownHidden : styles.dropdownOpen}>
            <img className={styles.loading} src='/loading-melodyse.gif'/>
            </div>
        </div>
    )
}