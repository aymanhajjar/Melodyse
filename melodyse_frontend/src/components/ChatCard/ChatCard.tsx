import styles from './ChatCard.module.scss'
import { useEffect, useState} from 'react'

export default function ChatCard({chat=null, friend=null, id=null, selected=null, select=null}) {

  console.log(id, selected)
  return (
    <>
    {chat && <div className={styles.container} onClick={() => select(id)}>

        <div className={selected==id ? styles.selected : chat.number_unread > 0 ? styles.chatUnread : styles.chatRead}>

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

      </div>}

      {friend && <div className={styles.container} onClick={() => select(id)}>

        <div className={styles.chatRead}>

            <img className={styles.profPic} src={process.env.SITE_URL + friend.picture}/>
            <div className={styles.details}>
            <h3>{friend.name}</h3>
            <h6>@{friend.username}</h6>
            <span>Start a conversation
            </span>
            </div>

        </div>

        </div>}
      
    </>
  )
}