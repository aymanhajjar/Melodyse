import styles from './profileButton.module.scss'
import { useEffect, useState } from 'react'
import ActionButton from './ActionButton'
import axios from 'axios'

export default function ProfileButton(props: any) {
    const [dropdownOpen, setDropdownOpen] = useState(false)
    const [loading, setLoading] = useState(false)
    const [sub, setChats] = useState()

    const openDropDown = () => {
        if(!dropdownOpen) {
            setLoading(true)
            getSubscription()
        }
        setDropdownOpen(!dropdownOpen)
    }

    const getSubscription = () => {
        axios.get(`${process.env.SITE_URL}/getsubscription`, {
            withCredentials: true
        })
        .then(res => {
            if(res.data.length > 0) {
                setChats(res.data)
            } else {
                setChats('')
            }
            console.log(res)
            setLoading(false)
        }).catch(err => {
            console.error(err)
        })
    }

    return(
        <div className={styles.container}>
            <img className={styles.profileimg} src={`${process.env.SITE_URL + props.picture}`} onClick={openDropDown}/>
            <div className={dropdownOpen ? styles.dropdownOpen : styles.dropdownHidden }>
                <div className={styles.subContainer}>
                    <div className={styles.subPic}></div>
                </div>
                <ActionButton name="My Profile"/>
                <ActionButton name="Log Out"/>
            </div>
        </div>
    )
}