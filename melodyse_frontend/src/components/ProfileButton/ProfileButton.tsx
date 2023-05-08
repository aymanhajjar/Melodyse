import styles from './profileButton.module.scss'
import { useEffect, useState, useRef } from 'react'
import { useRouter } from 'next/router';
import ActionButton from './ActionButton'
import Cookies from 'js-cookie';
import axios from 'axios'

export default function ProfileButton(props: any) {
    const [dropdownOpen, setDropdownOpen] = useState(false)
    const [loading, setLoading] = useState(false)
    const [sub, setSub] = useState()
    const dropdownRef = useRef(null)
  
    const router = useRouter()

    useEffect(() => {
      function handleClickOutside(event) {
        if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
          setDropdownOpen(false)
        }
      }
      document.addEventListener("mousedown", handleClickOutside);
      return () => {
        document.removeEventListener("mousedown", handleClickOutside);
      }
    }, [dropdownRef])

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
                setSub(res.data)
                props.setSub(res.data)
            }
            console.log(res)
            setLoading(false)
        }).catch(err => {
            console.error(err)
        })
    }

    const logout = () => {
        const csrf = Cookies.get('csrftoken')
        axios.post(`${process.env.SITE_URL}/logout`, 'ok', {
            withCredentials: true
        })
        .then(res => {
            props.loggedOut()
            router.push('/')
        }).catch(err => {
            console.error(err)
        })
    }

    return(
        <div className={styles.container} ref={dropdownRef}>
            <img className={styles.profileimg} src={`${process.env.SITE_URL + props.picture}`} onClick={openDropDown}/>
            <div className={dropdownOpen ? styles.dropdownOpen : styles.dropdownHidden }>
                <div className={styles.subContainer}>
                    <div className={styles.subPic}></div>
                </div>
                
                <ActionButton name="My Profile" onClick={() => {
                    router.push(`/profile/${props.username}`)
                    setDropdownOpen(false)
                }}/>
                <ActionButton name="My Projects" onClick={() => {
                    router.push(`/myprojects`)
                    setDropdownOpen(false)
                }}/>
                <ActionButton name="Settings" onClick={() => {
                    router.push(`/profile/${props.username}`)
                    setDropdownOpen(false)
                }}/>
                <ActionButton name="Log Out" onClick={logout}/>
            </div>
        </div>
    )
}