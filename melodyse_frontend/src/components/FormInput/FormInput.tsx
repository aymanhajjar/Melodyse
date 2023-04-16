import styles from './formInput.module.scss'
import { useEffect, useState } from 'react'
import axios  from 'axios'

export default function FromInput(props: any) {
    const [labelVisible, setLabelVisible] = useState(false)
    const [value, setValue] = useState('')
    const [loading, setLoading] = useState(false)
    const [usernameAvailable, setUsernameAvailable] = useState(false)

    const handleUsername = (e : any) => {
        setValue(e.target.value)
        setLoading(true)
        const data = new FormData
        console.log(`${process.env.SITE_URL}/checkusername`)
        data.append('username', e.target.value)
        axios.post(`${process.env.SITE_URL}/checkusername`, data).then((res) => {
            res.data.status == 'available' ? setUsernameAvailable(true) : setUsernameAvailable(false)
            setLoading(false)
        })
    }
    return (
        <div className={styles.inputGroup}>
            <input 
                type={props.type ? props.type : 'text'} 
                className={styles.inputField} 
                onFocus={() => setLabelVisible(true)} onBlur={() => setLabelVisible(false)} placeholder={props.placeholder}
                onChange={props.type == 'username' ? (e) => handleUsername(e) : (e) => setValue(e.target.value)}
                value={value}
            />
            <label className={labelVisible ? styles.visbleLabel : styles.hiddenLabel}>{props.label}</label>
            {props.type == 'username' && (value.length > 0 && <img 
            className={styles.usernameImg}
            src={
                loading ? '/loadinggif.gif' :
                (usernameAvailable ? '/icons/check.png' : '/icons/wrong.png')
            }/>)}
        </div>
    )
}