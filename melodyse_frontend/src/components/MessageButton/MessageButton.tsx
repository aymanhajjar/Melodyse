import styles from './messageButton.module.scss'
import { useEffect, useState, useRef } from 'react'
import axios from 'axios'
import { useRouter } from 'next/router'

export default function MessageButton(props: any) {
    const [dropdownOpen, setDropdownOpen] = useState(false)
    const [loading, setLoading] = useState(false)
    const [chats, setChats] = useState()
    const dropdownRef = useRef(null)
  
    useEffect(() => {
      function handleClickOutside(event) {
        if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
          setDropdownOpen(false)
        }
      }
      document.addEventListener("mousedown", handleClickOutside);
      return () => {
        document.removeEventListener("mousedown", handleClickOutside);
      }
    }, [dropdownRef])

    const router = useRouter()

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
            setLoading(false)
        }).catch(err => {
            console.error(err)
        })
    }

    return(
        <div className={styles.container} ref={dropdownRef}>
            <img className={styles.msgimg} src='/msg.png' onClick={openDropDown}/>
            <div className={dropdownOpen ? styles.dropdownOpen : styles.dropdownHidden }>
                {loading ? <img className={styles.loading} src='/loading-melodyse.gif'/> : 
                <div className={styles.messages}>
                    <div className={styles.topActions}>
                        <img src={'/icons/compose.png'}/>
                        <img src={'/icons/inbox.png'} onClick={() => {router.push('/inbox'); setDropdownOpen(false)}}/>
                    </div>
                    <h2>Inbox:</h2>
                <div className={styles.chatsContainer}>
                    {chats ? chats.map(chat => (
                        <div className={chat.number_unread > 0 ? styles.chatUnread : styles.chatRead} onClick={() => {
                            setDropdownOpen(false)
                            router.push({ pathname: '/inbox', query: { chatOpened: chat.chat_id }})
                            }}>
                            <img className={styles.profPic} src={process.env.SITE_URL + chat.participant_img}/>
                            <div className={styles.details}>
                            <h3>{chat.participant}</h3>

                            {chat.latest_message && 
                                <span> {chat.user_id == chat.latest_message.author_id 

                                    && (chat.latest_message.is_read ? 
                                        <img className={styles.checkMark} src={'/msg-read.png'}/> : <img className={styles.checkMark} src={'/msg-unread.png'}/>) }
                                    {chat.latest_message.content}

                                    </span>}

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