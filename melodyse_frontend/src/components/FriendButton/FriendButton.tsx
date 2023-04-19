import styles from './friendButton.module.scss'
import { useEffect, useState } from 'react'
import FormInput from '../FormInput/FormInput'
import axios from 'axios'
import Request from './Request'
import Cookies from 'js-cookie'

export default function FriendButton(props: any) {
    const [dropdownOpen, setDropdownOpen] = useState(false)
    const [loading, setLoading] = useState(false)
    const [friendsTab, setFriendsTab] = useState(true)
    const [requests, setRequests] = useState()

    const openDropDown = () => {
        if(!dropdownOpen) {
            setLoading(true)
            getRequests()
        }
        setDropdownOpen(!dropdownOpen)
    }

    const getRequests = () => {
        axios.get(`${process.env.SITE_URL}/getrequests`, {
            withCredentials: true
        })
        .then(res => {
            if(res.data.length > 0) {
                setRequests(res.data)
            } else {
                setRequests('')
            }
            console.log(res)
            setLoading(false)
        }).catch(err => {
            console.error(err)
        })
    }

    return(
        <div className={styles.container}>
            <img className={styles.frdimg} src='/friendss.png' onClick={openDropDown}/>
            <div className={dropdownOpen ? styles.dropdownOpen : styles.dropdownHidden }>
                {loading ? <img className={styles.loading} src='/loading-melodyse.gif'/> : 
                <div>
                    <h2>Requests:</h2>
                    <div className={styles.chatsContainer}>
                        <div className={styles.tabs}>
                            <button 
                                type='button' 
                                className={friendsTab ? styles.reqBtnActive : styles.reqBtnInactive}
                                onClick={() => setFriendsTab(!friendsTab)}>Friends</button>
                            <button 
                                type='button' 
                                className={friendsTab ? styles.reqBtnInactive : styles.reqBtnActive}
                                onClick={() => setFriendsTab(!friendsTab)}>Projects</button>
                        </div>

                        { friendsTab && (requests.friends ? requests.friends.map(req => (
                                    <Request type='friend' request={req}/>
                                )) :   <span className={styles.noChat}>You don't have any friend requests</span>)}

                        { !friendsTab && (requests.projects ? requests.projects.map(req => (
                                    <Request type='project' request={req}/>
                                )) :   <span className={styles.noChat}>You don't have any project requests</span>)}
                    </div>
                </div>
                }
                </div>
            </div>
    )
}