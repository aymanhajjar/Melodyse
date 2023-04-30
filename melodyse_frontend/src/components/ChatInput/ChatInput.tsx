import styles from './ChatInput.module.scss'
import { useEffect, useState } from 'react'

export default function ChatInput({value, setValue}: any) {

    return(
        <div className={styles.container}>
            <input/>
            <button type='button'><img src='/icons/send.png'/></button>
        </div>
    )
}