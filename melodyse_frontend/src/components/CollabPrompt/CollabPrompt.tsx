import styles from './CollabPrompt.module.scss'
import { useEffect, useState } from 'react'
import axios from 'axios'

export default function CollabPrompt({ type, name=null, username=null, first_name=null, close, done=null, project=null }) {

    const [prjNameVal, setPrjNameVal] = useState('')
    const [prjDescVal, setPrjDescVal] = useState('')
    const [offeredAmountVal, setOfferedAmountVal] = useState('')
    const [messageVal, setMessageVal] = useState('')
    const [usernameHireVal, setUsernameHireVal] = useState('')
    const [errMsg, setErrMsg] = useState()

    const sendInvite = (type) => {
        const data = new FormData()
        data.append('type', type)
        data.append('username', username)
        data.append('project_name', prjNameVal)
        data.append('project_description', prjDescVal)
        data.append('offered_amount', offeredAmountVal),
        data.append('message', messageVal)
        axios.post(`${process.env.SITE_URL}/send-invite`, data, {
            withCredentials: true
        }).then(res => {done(); close()})
        .catch(err => console.error(err))
    }

    const sendInviteProject = () => {
        const data = new FormData()
        data.append('type', type == 'hireInvite' ? 'hire' : 'collab')
        data.append('username', usernameHireVal)
        data.append('project_name', project.name)
        data.append('project_description', project.description)
        data.append('offered_amount', offeredAmountVal),
        data.append('message', messageVal)
        data.append('id', project.id)
        axios.post(`${process.env.SITE_URL}/send-invite`, data, {
            withCredentials: true
        }).then(res => {close()})
        .catch(err => {
            if(err.response.status == 404) {
                setErrMsg('User not found')
            }
            console.error(err)
        })
    }

    return(<>
    
    <div className={type == 'hire' || 'hireInvite' ? styles.hireContainer : styles.collabContainer}>
            {type == 'hire' && <>
                    <h2>HIRE {name} FOR A PROJECT</h2>
                    <div className={styles.inputDiv}>
                        <label>Project Name:</label>
                        <input placeholder='Wake Me Up...' value={prjNameVal} onChange={(e) => setPrjNameVal(e.target.value)}/>
                    </div>
                    <div className={styles.inputDiv}>
                        <label>Project Description:</label>
                        <textarea placeholder='Project description...' value={prjDescVal} onChange={(e) => setPrjDescVal(e.target.value)}/>
                    </div>
                    <div className={styles.payDiv}>
                        <label>Offered Amout:</label>
                        $<input type='number' placeholder='0.00' value={offeredAmountVal} onChange={(e) => setOfferedAmountVal(e.target.value)}/>
                    </div>
                    <div className={styles.inputDiv}>
                        <label>Message to {first_name.charAt(0).toUpperCase()+ first_name.slice(1).toLowerCase()} (optional):</label>
                        <textarea placeholder={`Hey ${first_name.charAt(0).toUpperCase()+ first_name.slice(1).toLowerCase()}!...`} value={messageVal} onChange={(e) => setMessageVal(e.target.value)}/>
                    </div>
                    <button type='button' className={styles.sendBtnHire} onClick={() => sendInvite('hire')}>SEND INVITE</button>
                    <div className={styles.close} onClick={close}>
                        <img src='/icons/close.png'/>
                    </div>
                </>
            }
            {type == 'collab' && <>
                    <h2>COLLAB WITH {name} ON A PROJECT</h2>
                    <div className={styles.inputDiv}>
                        <label>Project Name:</label>
                        <input placeholder='Wake Me Up...' value={prjDescVal} onChange={(e) => setPrjDescVal(e.target.value)}/>
                    </div>
                    <div className={styles.inputDiv}>
                        <label>Project Description:</label>
                        <textarea placeholder='Project description...' value={offeredAmountVal} onChange={(e) => setOfferedAmountVal(e.target.value)}/>
                    </div>
                    <div className={styles.inputDiv}>
                        <label>Message to {first_name.charAt(0).toUpperCase()+ first_name.slice(1).toLowerCase()} (optional):</label>
                        <textarea placeholder={`Hey ${first_name.charAt(0).toUpperCase()+ first_name.slice(1).toLowerCase()}!...`} value={messageVal} onChange={(e) => setMessageVal(e.target.value)}/>
                    </div>
                    <button type='button' className={styles.sendBtnCollab} onClick={() => sendInvite('collab')}>SEND INVITE</button>
                    <div className={styles.close} onClick={close}>
                        <img src='/icons/close.png'/>
                    </div>
                </>
            }

            {type == 'hireInvite' && <>
                    <h2>INVITE PEOPLE TO THIS PROJECT</h2>
                    <div className={styles.inputDivSearch}>
                        <label>Username:</label>
                        <input placeholder='Username' value={usernameHireVal} onChange={(e) => setUsernameHireVal(e.target.value)}/>
                    </div>
                    <div className={styles.payDiv}>
                        <label>Offered Amout:</label>
                        $<input type='number' placeholder='0.00' value={offeredAmountVal} onChange={(e) => setOfferedAmountVal(e.target.value)}/>
                    </div>
                    <div className={styles.inputDiv}>
                        <label>Message to invited people (optional):</label>
                        <textarea value={messageVal} onChange={(e) => setMessageVal(e.target.value)}/>
                    </div>
                    {errMsg && <span>{errMsg}</span>}
                    <button type='button' className={styles.sendBtnHire} onClick={() => sendInviteProject()}>SEND INVITE</button>
                    <div className={styles.close} onClick={close}>
                        <img src='/icons/close.png'/>
                    </div>
                </>}

                {type == 'collabInvite' && <>
                    <h2>INVITE PEOPLE TO THIS PROJECT</h2>
                    <div className={styles.inputDivSearch}>
                        <label>Username:</label>
                        <input placeholder='Username' value={usernameHireVal} onChange={(e) => setUsernameHireVal(e.target.value)}/>
                    </div>
                    <div className={styles.inputDiv}>
                        <label>Message to invited people (optional):</label>
                        <textarea value={messageVal} onChange={(e) => setMessageVal(e.target.value)}/>
                    </div>
                    {errMsg && <span>{errMsg}</span>}
                    <button type='button' className={styles.sendBtnCollab} onClick={() => sendInviteProject()}>SEND INVITE</button>
                    <div className={styles.close} onClick={close}>
                        <img src='/icons/close.png'/>
                    </div>
                </>}
        </div>
        <div className={styles.overlay}></div>
    </>

        
    )
}