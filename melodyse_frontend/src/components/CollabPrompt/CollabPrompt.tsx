import styles from './CollabPrompt.module.scss'
import { useEffect, useState } from 'react'
import axios from 'axios'

export default function CollabPrompt({ type, name, first_name, close, done }) {

    const [prjNameVal, setPrjNameVal] = useState()
    const [prjDescVal, setPrjDescVal] = useState()
    const [offeredAmountVal, setOfferedAmountVal] = useState()
    const [messageVal, setMessageVal] = useState()

    const sendInvite = (type) => {
        const data = new FormData()
        data.append('type', type)
        data.append('project_name', prjNameVal)
        data.append('project_description', prjDescVal)
        data.append('offeredAmountVal', offeredAmountVal),
        data.append('message', messageVal)
        axios.post(`${process.env.SITE_URL}/send-invite`, data, {
            withCredentials: true
        }).then(res => done())
        .catch(err => console.error(err))
    }

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
                    <button type='button' className={styles.sendBtnHire} onClick={() => sendInvite('hire')}>SEND INVITE</button>
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
                    <button type='button' className={styles.sendBtnCollab} onClick={() => sendInvite('collab')}>SEND INVITE</button>
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