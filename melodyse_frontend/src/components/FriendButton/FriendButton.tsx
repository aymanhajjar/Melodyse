import styles from './friendButton.module.scss'
import { useEffect, useState } from 'react'
import FormInput from '../FormInput/FormInput'
import axios from 'axios'
import Cookies from 'js-cookie'

export default function FriendButton(props: any) {

    console.log(`${process.env.SITE_URL + props.picture}`)
    return(
        <div className={styles.container}>
        <img className={styles.frdimg} src='/friendss.png'/>
        </div>
    )
}