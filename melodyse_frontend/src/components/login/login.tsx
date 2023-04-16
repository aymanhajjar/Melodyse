import styles from './login.module.scss'
import { useEffect, useState } from 'react'
import FormInput from '../FormInput/FormInput'

export default function Login(props: any) {
    const [active, setActive] = useState(true)

    useEffect(() => {
        setActive(props.active)
    }, [props.active])

    const changeForm = () => {
        setActive(false)
        setTimeout(() => {
            props.onChangeForm()
        }, 300)
    }
    
  return (
    <div className={active ? styles.active : styles.hidden}>
        <h2>LOG IN</h2>
        <FormInput label="Username or Email:" placeholder="Username or Email"/>
        <FormInput type="password" label="Password:" placeholder="Password"/>
        <span className={styles.forgotPassword}>Forgot your password?</span>
        <button type='button' className={styles.loginBtn}>LOG IN</button>
        <span>Don't have an account? <a onClick={() => changeForm()}>Create one</a></span>
        <span>or, log in using:</span>
        <div className={styles.socialIcons}>
        <img src='/icons/google-icon.png' alt='Google'></img>
        <img src='/icons/twitter-icon.png' alt='Twitter'></img>
        <img src='/icons/facebook-icon.png' alt='Facebook'></img>
        </div>
    </div>
  )}