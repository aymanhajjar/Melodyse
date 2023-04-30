import styles from './friendButton.module.scss'
import { useEffect, useState } from 'react'
import FormInput from '../FormInput/FormInput'
import axios from 'axios'
import Cookies from 'js-cookie'

export default function Request({ type, request }) {
    const [accepted, setAccepted] = useState(request.is_accepted)

    const respond = (action) => {
        const data = new FormData()
        data.append('action', action)
        data.append('type', 'friend')
        data.append('id', request.request_id)
        axios.post(`${process.env.SITE_URL}/respond-request`, data, {
            withCredentials: true
        }).then(res => {
            type == 'accept' ? setAccepted(true) : setAccepted(false)
        }).catch(err => console.error(err))
    }

    return(

        <div className={styles.request}>
        {type == 'friend' ?
    
            <div className={request.is_seen ? styles.reqRead :  styles.reqUnread}>
                <img className={styles.profPic} src={process.env.SITE_URL + request.sender_picture}/>

                <div className={styles.details}>
                    <h3>{request.sender_name}   <span className={styles.username}>(@{request.sender_username})</span></h3>
                    {accepted === null? <div className={styles.actions}>
                        <button className={styles.accept} onClick={() => respond('accept')}><img src={'/icons/check.png'}/>Accept</button>
                        <button className={styles.reject} onClick={() => respond('reject')}><img src={'/icons/x.png'} />Reject</button>
                    </div> : accepted ? 'accepted' : 'rejected'}

                </div>

            </div> : 

            <div className={request.is_seen ? styles.reqRead :  styles.reqUnread}>

                <img className={styles.profPic} src={process.env.SITE_URL + request.sender_picture}/>

                <div className={styles.details}>

                    <h3>{request.sender_name}   <span> {request.is_collab ? 'has invited you to a collaboration project!' : 'wants to hire you on a project!'}</span></h3>
                    {!request.is_collab && <span><b>Offered amount: </b>${request.offered_amount}</span>}
                    <span className={styles.moredetails}>More details >></span>
                    <div className={styles.actions}>
                        <button className={styles.accept}><img src={'/icons/check.png'} />Accept</button>
                        <button className={styles.reject}><img src={'/icons/x.png'} />Reject</button>

                    </div>
                </div>
            </div> 
            
            }
        </div>
        
    )
}