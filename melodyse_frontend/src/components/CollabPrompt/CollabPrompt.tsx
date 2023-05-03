import styles from './CollabPrompt.module.scss'
import { useEffect, useState } from 'react'

export default function CollabPrompt({ type, name, first_name, close, submit }) {

    return(<>
    
    <div className={type == 'hire' ? styles.hireContainer : styles.collabContainer}>
            {type == 'hire' && <>
                    <h2>HIRE {name} FOR A PROJECT </h2>
                    <div className={styles.inputDiv}>
                        <label>Project Name:</label>
                        <input placeholder='Wake Me Up...'/>
                    </div>
                    <div className={styles.inputDiv}>
                        <label>Project Description:</label>
                        <textarea placeholder='Project description...'/>
                    </div>
                    <div className={styles.payDiv}>
                        <label>Offered Amout:</label>
                        $<input type='number' placeholder='0.00'/>
                    </div>
                    <div className={styles.inputDiv}>
                        <label>Message to {first_name.charAt(0).toUpperCase()+ first_name.slice(1).toLowerCase()} (optional):</label>
                        <textarea placeholder={`Hey ${first_name.charAt(0).toUpperCase()+ first_name.slice(1).toLowerCase()}!...`}/>
                    </div>
                    <button type='button' className={styles.sendBtn}>SEND INVITE</button>
                    <div className={styles.close} onClick={close}>
                        <img src='/icons/close.png'/>
                    </div>
                </>
            }
            {type == 'collab' && <>
                    <h2>COLLAB WITH {name} ON A PROJECT </h2>
                    <div className={styles.inputDiv}>
                        <label>Project Name:</label>
                        <input placeholder='Wake Me Up...'/>
                    </div>
                    <div className={styles.inputDiv}>
                        <label>Project Description:</label>
                        <textarea placeholder='Project description...'/>
                    </div>
                    <div className={styles.inputDiv}>
                        <label>Message to {first_name.charAt(0).toUpperCase()+ first_name.slice(1).toLowerCase()} (optional):</label>
                        <textarea placeholder={`Hey ${first_name.charAt(0).toUpperCase()+ first_name.slice(1).toLowerCase()}!...`}/>
                    </div>
                    <button type='button' className={type=='hire' ? styles.sendBtnHire : styles.sendBtnCollab}>SEND INVITE</button>
                    <div className={styles.close} onClick={close}>
                        <img src='/icons/close.png'/>
                    </div>
                </>
            }
        </div>
        <div className={styles.overlay}></div>
    </>

        
    )
}