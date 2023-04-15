import Head from 'next/head'
import Image from 'next/image'
import { Inter } from 'next/font/google'
import styles from '@/styles/Home.module.scss'

const inter = Inter({ subsets: ['latin'] })

export default function Login() {
  return (
    <>
        <h2>LOG IN</h2>
        <input className={styles.inputField} placeholder='Username or Email'/>
        <input className={styles.inputField} type="password" placeholder='Password'/>
        <span className={styles.forgotPassword}>Forgot your password?</span>
        <button type='button' className={styles.loginBtn}>LOG IN</button>
        <span>Don't have an account? <a>Create one</a></span>
        <span>or, log in using:</span>
        <div className={styles.socialIcons}>
        <img src='/icons/google-icon.png' alt='Google'></img>
        <img src='/icons/twitter-icon.png' alt='Twitter'></img>
        <img src='/icons/facebook-icon.png' alt='Facebook'></img>
        </div>
    </>
  )}