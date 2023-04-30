import styles from './ChatInput.module.scss'
import { useEffect, useState } from 'react'

export default function ChatInput({value, setValue, submit}: any) {

    const handleKeyDown = (e) => {
        if (e.key === 'Enter') {
            submit()
            }
    }

    return(
        <div className={styles.container}>
            <input placeholder='Write a message...' value={value} onChange={(e) => setValue(e.target.value)} onKeyDown={(e) => handleKeyDown(e)}/>
            <button type='button' onClick={submit}><img src='/icons/send.png' /></button>
        </div>
    )
}