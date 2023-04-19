import styles from './messageButton.module.scss'
import { useEffect, useState } from 'react'
import FormInput from '../FormInput/FormInput'
import axios from 'axios'
import Cookies from 'js-cookie'

export default function MessageButton(props: any) {
    const [dropdownOpen, setDropdownOpen] = useState(false)
    const [loading, setLoading] = useState(false)
    const [chats, setChats] = useState()

    const openDropDown = () => {
        if(!dropdownOpen) {
            setLoading(true)
            getChats()
        }
        setDropdownOpen(!dropdownOpen)
    }

    const getChats = () => {
        axios.get(`${process.env.SITE_URL}/getchats`, {
            withCredentials: true
        })
        .then(res => {
            if(res.data.length > 0) {
                setChats(res.data)
            } else {
                setChats('')
            }
            console.log(res)
            setLoading(false)
        }).catch(err => {
            console.error(err)
        })
    }

    return(
        <div className={styles.container}>
            <img className={styles.msgimg} src='/msg.png' onClick={openDropDown}/>
            <div className={dropdownOpen ? styles.dropdownOpen : styles.dropdownHidden }>
                {loading ? <img className={styles.loading} src='/loading-melodyse.gif'/> : 
                <div>
                    <h2>Inbox:</h2>
                <div className={styles.chatsContainer}>
                    {chats ? chats.map(chat => (
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
                    ))
                    
                    :
                    <span className={styles.noChat}>You don't have any chats yet</span>}
                    </div>
                </div>
                }
                </div>
            </div>
    )
}