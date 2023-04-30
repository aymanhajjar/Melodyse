import styles from './Message.module.scss'
import { useEffect, useState} from 'react'

export default function Message({message, is_mine}) {
    const [hovered, setHovered] = useState(false)

    const date = new Date(message.date_created)

  return (
    <>
      <div className={is_mine ? styles.containerMine : styles.container} onMouseOver={() => setHovered(true)} onMouseLeave={() => setHovered(false)}>

        <img className={styles.profilePic} src={process.env.SITE_URL + message.author_picture}/>

        <span className={is_mine? styles.white : styles.red}> 
        {message.content}

        {is_mine && <img className={styles.checkmark} 
        src={message.is_read ?'/msg-read.png' : '/msg-unread.png'}/>}

        </span>

        {hovered && <h6>{date.toLocaleDateString('en-US', { hour: 'numeric', minute: 'numeric', hour12: true })}</h6>}

      </div>
    </>
  )
}
