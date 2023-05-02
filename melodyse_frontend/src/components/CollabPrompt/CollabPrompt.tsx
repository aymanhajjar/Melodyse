import styles from './CollabPrompt.module.scss'
import { useEffect, useState } from 'react'

export default function CollabPrompt({ type, submit }) {

    return(

        <div className={type == 'hire' ? styles.hireContainer : styles.collabContainer}>
            {type == 'hire' && <>
                    HIRE
                </>
            }
        </div>
        
    )
}