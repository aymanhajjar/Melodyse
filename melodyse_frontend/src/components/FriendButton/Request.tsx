import styles from './friendButton.module.scss'
import { useEffect, useState } from 'react'
import FormInput from '../FormInput/FormInput'
import axios from 'axios'
import Cookies from 'js-cookie'

export default function Request({ type, request }) {

    return(

        <div className={styles.request}>
        {type == 'friend' ?
    
            <div className={request.is_seen ? styles.reqRead :  styles.reqUnread}>
                <img className={styles.profPic} src={process.env.SITE_URL + request.sender_picture}/>
                <div className={styles.details}>
                    <h3>{request.sender_name}   <span>(@{request.sender_username})</span></h3>
                    <div className={styles.actions}>
                        <button className={styles.accept}><img src={'/icons/check.png'} />Accept</button>
                        <button className={styles.reject}><img src={'/icons/x.png'} />Reject</button>
                    </div>
                </div>
            </div> : 'ok'}
        </div>
        
    )
}