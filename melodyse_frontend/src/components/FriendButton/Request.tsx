import styles from './friendButton.module.scss'
import { useEffect, useState } from 'react'
import FormInput from '../FormInput/FormInput'
import { useRouter } from 'next/router'
import axios from 'axios'
import Cookies from 'js-cookie'
import RequestDetails from '../RequestDetails/RequestDetails'

export default function Request({ type, request }) {
    const [accepted, setAccepted] = useState(request.is_accepted)
    const [detailsOpen, setDetailsOpen] = useState(false)

    const router = useRouter()

    const respond = (action) => {
        const data = new FormData()
        data.append('action', action)
        data.append('type', 'friend')
        data.append('id', request.request_id)
        axios.post(`${process.env.SITE_URL}/respond-request`, data, {
            withCredentials: true
        }).then(res => {
            action == 'accept' ? setAccepted(true) : setAccepted(false)
        }).catch(err => console.error(err))
    }

    const respondJoin = (action) => {
        const data = new FormData()
        data.append('id', request.request_id)
        data.append('username', request.sender_username)
        data.append('action', action)
        axios.post(`${process.env.SITE_URL}/accept-request`, data, {
            withCredentials: true
        }).then(res => {action == 'accept' ? setAccepted(true) : setAccepted(false)})
        .catch(err => console.error(err))
    }

    const respondInvite = (action) => {
        const data = new FormData()
        data.append('id', request.request_id)
        data.append('action', action)
        axios.post(`${process.env.SITE_URL}/accept-invite`, data, {
            withCredentials: true
        }).then(res => {action == 'accept' ? setAccepted(true) : setAccepted(false)})
        .catch(err => console.error(err))
    }

    return(

        <div className={styles.request}>
        {type == 'friend' ?
    
            <div className={request.is_seen ? styles.reqRead :  styles.reqUnread}>
                <img className={styles.profPic} src={process.env.SITE_URL + request.sender_picture}/>

                <div className={styles.details}>
                    <h3 onClick={() => router.push(`/profile/${request.sender_username}`)}>{request.sender_name}   <span className={styles.username}>(@{request.sender_username})</span></h3>
                    {accepted === null? <div className={styles.actions}>
                        <button className={styles.accept} onClick={() => respond('accept')}><img src={'/icons/check.png'}/>Accept</button>
                        <button className={styles.reject} onClick={() => respond('reject')}><img src={'/icons/x.png'} />Reject</button>
                    </div> : accepted ? <h6 className={styles.accepted}> <img src={'/icons/check.png'}/> accepted</h6> :  <h6 className={styles.rejected}><img src={'/icons/x.png'} />rejected</h6>}

                </div>

            </div> : 
            
            type == 'project' ? <div className={request.is_seen ? styles.reqRead :  styles.reqUnread}>

                <img className={styles.profPic} src={process.env.SITE_URL + request.sender_picture}/>

                <div className={styles.details}>

                    <h3 onClick={() => setDetailsOpen(true)}>{request.sender_name}   <span> {request.is_collab ? 'has invited you to a collaboration project!' : 'wants to hire you on a project!'}</span></h3>
                    {!request.is_collab && <span><b>Offered amount: </b>${request.offered_amount}</span>}
                    <span className={styles.moredetails} onClick={() => setDetailsOpen(true)}>More details >></span>
                    {accepted === null? <div className={styles.actions}>
                        <button className={styles.accept} onClick={() => respondInvite('accept')}><img src={'/icons/check.png'} />Accept</button>
                        <button className={styles.reject} onClick={() => respondInvite('reject')}><img src={'/icons/x.png'} />Reject</button> 

                    </div> : accepted ? <h6 className={styles.accepted}> <img src={'/icons/check.png'}/> accepted</h6> :  <h6 className={styles.rejected}><img src={'/icons/x.png'} />rejected</h6>}
                </div>
                {detailsOpen && <RequestDetails request={request} type={'invite'} close={() => setDetailsOpen(false)}/>}
            </div> 

            :
            <div className={request.is_seen ? styles.reqRead :  styles.reqUnread}>

                <img className={styles.profPic} src={process.env.SITE_URL + request.sender_picture}/>

                <div className={styles.details}>

                    <h3 onClick={() => setDetailsOpen(true)}>{request.sender_name}   <span> wants to join you on your project {request.project_name}</span></h3>
                    <span className={styles.moredetails} onClick={() => setDetailsOpen(true)}>More details >></span>
                    {accepted === null? <div className={styles.actions}>
                        <button className={styles.accept} onClick={() => respondJoin('accept')}><img src={'/icons/check.png'} />Accept</button>
                        <button className={styles.reject} onClick={() => respondJoin('reject')}><img src={'/icons/x.png'} />Reject</button>

                    </div> : accepted ? <h6 className={styles.accepted}> <img src={'/icons/check.png'}/> accepted</h6> :  <h6 className={styles.rejected}><img src={'/icons/x.png'} />rejected</h6>}
                </div>
                {detailsOpen && <RequestDetails request={request} type={'join'} close={() => setDetailsOpen(false)}/>}
            </div>
            
            }
        </div>
        
    )
}