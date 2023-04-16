import { useEffect, useState } from 'react'
import styles from './register.module.scss'
import FormInput from '../FormInput/FormInput'

export default function Register(props : any) {
    const [active, setActive] = useState(false)

    useEffect(() => {
        setActive(!props.active)
    }, [props.active])

    const changeForm = () => {
        setActive(false)
        setTimeout(() => {
            props.onChangeForm()
        }, 300)
    }

  return (
    <div className={active ? styles.active : styles.hidden}>
        <h2>Register</h2>
        <div className={styles.fullName}>
            <input className={styles.inputName} placeholder='First Name'/>
            <input className={styles.inputName} placeholder='Last Name'/>
        </div>
        <FormInput type="username" label="Username:" placeholder="Username"/>
        <FormInput type="email" label="Email:" placeholder="Email"/>
        <FormInput type="password" label="Password:" placeholder="Password"/>
        <FormInput type="password" label="Confirm Password:" placeholder="Confirm Password"/>
        <div className={styles.fullName}>
            <select className={styles.selectField}>
                <option disabled selected>Gender</option>
                <option value={'M'}>Male</option>
                <option value={'F'}>Female</option>
                <option value={'O'}>Other</option>
            </select>
            <input className={styles.selectField} type='date' placeholder='Date of Birth'/>
        </div>
        <button type='button' className={styles.loginBtn}>SIGN UP</button>
        <span>Already have an account? <a onClick={() => changeForm()}>Log In</a></span>
        <span>or, sign up using:</span>
        <div className={styles.socialIcons}>
        <img src='/icons/google-icon.png' alt='Google'></img>
        <img src='/icons/twitter-icon.png' alt='Twitter'></img>
        <img src='/icons/facebook-icon.png' alt='Facebook'></img>
        </div>
    </div>
  )}