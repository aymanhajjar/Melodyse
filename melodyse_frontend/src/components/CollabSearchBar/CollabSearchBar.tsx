import styles from './CollabSearchBar.module.scss'
import { useEffect, useState } from 'react'

export default function CollabSearchBar({ value, setValue }) {

    return(

        <div className={styles.container}>
            <input placeholder='@username...'/>
            <img src='/icons/search.png'/>
        </div>
        
    )
}