import styles from './login.module.scss'
import { useEffect, useState } from 'react'
import FormInput from '../FormInput/FormInput'
import axios from 'axios'
import { useRouter } from 'next/router'
import Cookies from 'js-cookie'

export default function Login(props: any) {
    const [active, setActive] = useState(true)
    const [userEmailValue, setUserEmailValue] = useState('')
    const [passwordValue, setPasswordValue] = useState('')
    const [errormessage, setErrorMessage] = useState('')
    const [loading, setLoading] = useState(false)

    const router = useRouter()

    useEffect(() => {
        setActive(props.active)
    }, [props.active])

    const changeForm = () => {
        setActive(false)
        setTimeout(() => {
            props.onChangeForm()
        }, 300)
    }
    
    const handleSubmit = () => {
        setLoading(true)

        const data = new FormData
        data.append('username_email', userEmailValue)
        data.append('password', passwordValue)

        axios.post(`${process.env.SITE_URL}/login`, data, {
            withCredentials: true
            }).then((res) => {
            setLoading(false)
            const csrf = Cookies.get('csrftoken')
            axios.defaults.headers.common['X-CSRFToken'] = csrf
            props.setLoggedIn()
            router.push('/')
        }).catch(err => {
            setLoading(false)
            if(err.response.data == 'User not found') {
                setErrorMessage('Invalid username/email or password.')
            }
        })
    }
    
    
  return (
    <div className={active ? styles.active : styles.hidden}>
        <h2>LOG IN</h2>

        <FormInput 
            label="Username or Email:" 
            placeholder="Username or Email" 
            onChange={(val) => setUserEmailValue(val)}/>

        <FormInput 
            type="password" 
            label="Password:" 
            placeholder="Password" 
            onChange={(val) => setPasswordValue(val)}/>

        <span className={styles.forgotPassword}>Forgot your password?</span>

        {errormessage && <span className={styles.errorMsg}>{errormessage}</span>}

        <button type='button' className={styles.loginBtn} onClick={handleSubmit}>{loading ? <img src='/loadinggif.gif'/> : 'LOG IN'}</button>

        <span>Don't have an account? <a onClick={() => changeForm()}>Create one</a></span>
        <span>or, sign in using:</span>
        <div className={styles.socialIcons}>
        <img src='/icons/google-icon.png' alt='Google'></img>
        <img src='/icons/twitter-icon.png' alt='Twitter'></img>
        <img src='/icons/facebook-icon.png' alt='Facebook'></img>
        </div>
    </div>
  )}