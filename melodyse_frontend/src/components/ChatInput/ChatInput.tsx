import styles from './ChatInput.module.scss'
import { useEffect, useState } from 'react'

export default function ChatInput({submit}: any) {
    const [messageValue, setMessageValue] = useState('')

    const handleKeyDown = (e) => {
        if (e.key === 'Enter') {
            submit(messageValue)
            setMessageValue('')
            }
    }

    return(
        <div className={styles.container}>
            <input placeholder='Write a message...' value={messageValue} onChange={(e) => setMessageValue(e.target.value)} onKeyDown={(e) => handleKeyDown(e)}/>
            <button type='button' onClick={() => {setMessageValue(''); submit(messageValue)}}><img src='/icons/send.png' /></button>
        </div>
    )
}