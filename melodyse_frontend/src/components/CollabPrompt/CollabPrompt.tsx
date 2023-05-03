import styles from './CollabPrompt.module.scss'
import { useEffect, useState } from 'react'

export default function CollabPrompt({ type, name, submit }) {

    return(

        <div className={type == 'hire' ? styles.hireContainer : styles.collabContainer}>
            {type == 'hire' && <>
                    <h2>HIRE {name} FOR A PROJECT </h2>
                    <div className={styles.inputDiv}>
                        <label>Project Name:</label>
                        <input/>
                    </div>
                    <div className={styles.inputDiv}>
                        <label>Project Description:</label>
                        <textarea/>
                    </div>
                </>
            }
        </div>
        
    )
}