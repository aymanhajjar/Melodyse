import styles from './friendButton.module.scss'
import { useEffect, useState } from 'react'
import FormInput from '../FormInput/FormInput'
import axios from 'axios'
import Cookies from 'js-cookie'

export default function FriendButton(props: any) {
    const [dropdownOpen, setDropdownOpen] = useState(false)
    const [loading, setLoading] = useState(false)
    const [friendsTab, setFriendsTab] = useState(true)
    const [requests, setRequests] = useState()

    const openDropDown = () => {
        if(!dropdownOpen) {
            setLoading(true)
            getRequests()
        }
        setDropdownOpen(!dropdownOpen)
    }

    const getRequests = () => {
        axios.get(`${process.env.SITE_URL}/getrequests`, {
            withCredentials: true
        })
        .then(res => {
            if(res.data.length > 0) {
                setRequests(res.data)
            } else {
                setRequests('')
            }
            console.log(res)
            setLoading(false)
        }).catch(err => {
            console.error(err)
        })
    }

    return(
        <div className={styles.container}>
            <img className={styles.frdimg} src='/friendss.png' onClick={openDropDown}/>
            <div className={dropdownOpen ? styles.dropdownOpen : styles.dropdownHidden }>
                {loading ? <img className={styles.loading} src='/loading-melodyse.gif'/> : 
                <div>
                    <h2>Requests:</h2>
                    <div className={styles.chatsContainer}>
                        <div className={styles.tabs}>
                            <button 
                                type='button' 
                                className={friendsTab ? styles.reqBtnActive : styles.reqBtnInactive}
                                onClick={() => setFriendsTab(!friendsTab)}>Friends</button>
                            <button 
                                type='button' 
                                className={friendsTab ? styles.reqBtnInactive : styles.reqBtnActive}
                                onClick={() => setFriendsTab(!friendsTab)}>Projects</button>
                        </div>
                        {requests ? requests.map(chat => (
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
                        <span className={styles.noChat}>You don't have any friend requests</span>}
                    </div>
                </div>
                }
                </div>
            </div>
    )
}