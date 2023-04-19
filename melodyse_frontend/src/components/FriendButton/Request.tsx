import styles from './friendButton.module.scss'
import { useEffect, useState } from 'react'
import FormInput from '../FormInput/FormInput'
import axios from 'axios'
import Cookies from 'js-cookie'

export default function Request(props: any) {

    return(
            <div className={chat.number_unread > 0 ? styles.chatUnread : styles.chatRead}>
                <img className={styles.profPic} src={process.env.SITE_URL + chat.participant_img}/>
                <div className={styles.details}>
                <h3>{chat.participant}</h3>
                <span>{chat.user_id == chat.latest_message.author_id 
                        && (chat.latest_message.is_read ? <img className={styles.checkMark} src={'/msg-read.png'}/> : <img className={styles.checkMark} src={'/msg-unread.png'}/>) }
                        {chat.latest_message.content}
                        </span>
                </div>
                {chat.number_unread > 0 && <div className={styles.unreadNumber}>
                    {chat.number_unread}
                </div>}
            </div>
        
    )
}