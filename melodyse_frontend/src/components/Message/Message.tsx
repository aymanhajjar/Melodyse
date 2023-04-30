import styles from './Message.module.scss'
import { useEffect, useState} from 'react'

export default function Message({message}) {

  return (
    <>
      <div className={styles.container}>
        <h6>{message.date_created}</h6>
        <img src={process.env.SITE_URL + message.author_picture}/>
        <span>{message.content}</span>
      </div>
    </>
  )
}
