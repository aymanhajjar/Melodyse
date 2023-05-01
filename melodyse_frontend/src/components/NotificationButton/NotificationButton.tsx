import styles from './notificationButton.module.scss'
import { useEffect, useState } from 'react'
import FormInput from '../FormInput/FormInput'
import axios from 'axios'
import Cookies from 'js-cookie'

export default function NotificationButton(props: any) {
    const [dropdownOpen, setDropdownOpen] = useState(false)
    const [loading, setLoading] = useState(false)
    const [notifications, setNotifications] = useState()

    const openDropDown = () => {
        if(!dropdownOpen) {
            setLoading(true)
            getNotfs()
        }
        setDropdownOpen(!dropdownOpen)
    }

    const getNotfs = () => {
        axios.get(`${process.env.SITE_URL}/getnotifications`, {
            withCredentials: true
        })
        .then(res => {
            if(res.data.length > 0) {
                setNotifications(res.data)
                props.is_read()
            } else {
                setNotifications('')
            }
            console.log(res)
            setLoading(false)
        }).catch(err => {
            console.error(err)
        })
    }
    return(
        <div className={styles.container}>
            <img className={styles.ntfimg} src='/ntf.png' onClick={openDropDown}/>
            {props.unread > 0 && <div className={styles.count}>{props.unread}</div>}
            <div className={dropdownOpen ? styles.dropdownOpen : styles.dropdownHidden }>
            {loading ? <img className={styles.loading} src='/loading-melodyse.gif'/> : 

            <div className={styles.notificationsContainer}>

                <h2>Notifications:</h2>
                {notifications ? notifications.map(notf => (
                    <div className={notf.is_read ? styles.notfRead : styles.notfUnread}>
                        <div className={styles.details}>
                        <h3>{notf.title}</h3>
                        <span>{notf.content}</span>
                        </div>
                        {notf.target_user_pic && <img src={process.env.SITE_URL + notf.target_user_pic}/>}
                        {notf.project_pic && <img src={process.env.SITE_URL + notf.project_pic}/>}
                    </div>
                ))
                
                :
                <span className={styles.noNotf}>You don't have any notifications</span>}
                </div>
            }
            </div>
        </div>
    )
}