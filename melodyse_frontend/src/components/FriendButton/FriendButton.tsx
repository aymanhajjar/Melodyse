import styles from './friendButton.module.scss'
import { useEffect, useState } from 'react'
import FormInput from '../FormInput/FormInput'
import axios from 'axios'
import Cookies from 'js-cookie'

export default function FriendButton(props: any) {
    const [dropdownOpen, setDropdownOpen] = useState(false)
    const [loading, setLoading] = useState(false)
    const [chats, setChats] = useState()

    const openDropDown = () => {
        if(!dropdownOpen) {
            setLoading(true)
            getChats()
        }
        setDropdownOpen(!dropdownOpen)
    }

    const getChats = () => {
        axios.get(`${process.env.SITE_URL}/getchats`, {
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
    
    console.log(`${process.env.SITE_URL + props.picture}`)
    return(
        <div className={styles.container}>
        <img className={styles.frdimg} src='/friendss.png'/>
        </div>
    )
}