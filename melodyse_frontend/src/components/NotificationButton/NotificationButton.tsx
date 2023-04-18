import styles from './notificationButton.module.scss'
import { useEffect, useState } from 'react'
import FormInput from '../FormInput/FormInput'
import axios from 'axios'
import Cookies from 'js-cookie'

export default function NotificationButton(props: any) {

    console.log(`${process.env.SITE_URL + props.picture}`)
    return(
        <img className={styles.ntfimg} src='/ntf.png'/>
    )
}