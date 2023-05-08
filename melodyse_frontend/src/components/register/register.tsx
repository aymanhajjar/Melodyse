import { useEffect, useState } from 'react'
import styles from './register.module.scss'
import FormInput from '../FormInput/FormInput'
import PasswordStrengthBar from 'react-password-strength-bar'
import axios from 'axios'
import Cookies from 'js-cookie'
import { useRouter } from 'next/router'

export default function Register(props : any) {
    const [active, setActive] = useState(false)
    const [usernameAvailable, setUsernameAvailable] = useState(false)
    const [errormessage, setErrorMessage] = useState('')
    const [passwordFocus, setPasswordFocus] = useState(false)
    const [genderValue, setGenderValue] = useState('M')
    const [firstNameValue, setFirstNameValue] = useState('')
    const [lastNameValue, setLastNameValue] = useState('')
    const [usernameValue, setUsernameValue] = useState('')
    const [emailValue, setEmailValue] = useState('')
    const [passwordValue, setPasswordValue] = useState('')
    const [confPasswordValue, setConfPasswordValue] = useState('')
    const [dateValue, setDateValue] = useState('')
    const [loading, setLoading] = useState(false)

    const [firstNameError, setFirstNameError] = useState(false)
    const [lastNameError, setLastNameError] = useState(false)
    const [usernameError, setUsernameError] = useState(false)
    const [emailError, setEmailError] = useState(false)
    const [passwordError, setPasswordError] = useState(false)
    const [confPasswordError, setConfPasswordError] = useState(false)
    const [dateError, setDateError] = useState(false)

    const router = useRouter()
    
    useEffect(() => {
        gapi.load('auth2', () => {
            gapi.auth2.init({
              client_id: process.env.GOOGLE_CLIENT_ID,
              plugin_name: "chat"
            })
          })
    }, [])

    function handleGoogleSignIn() {
        gapi.auth2.getAuthInstance().signIn().then(googleUser => {
            console.log(googleUser)
            const data = new FormData()
            data.append('response', JSON.stringify(googleUser))
            axios.post(`${process.env.SITE_URL}/google-signin`, data, {
                withCredentials: true
            }).then(response => {
                    setLoading(false)
                    const csrf = Cookies.get('csrftoken')
                    axios.defaults.headers.common['X-CSRFToken'] = csrf
                    props.setLoggedIn()
                    router.push('/')
                }).catch(err => {
                    if(err.response.status == 400) {
                        router.push('/login')
                    }
                    if(err.response.status == 401) {
                        setErrorMessage('Failed to verify user.')
                    }
                    console.error(err)})
        })
      }

    useEffect(() => {
        setActive(!props.active)
    }, [props.active])

    const changeForm = () => {
        setActive(false)
        setTimeout(() => {
            props.onChangeForm()
        }, 300)
    }

    const handleSubmit = () => {
        if(validateForm()) {
            setLoading(true)

            const data = new FormData
            data.append('first_name', firstNameValue)
            data.append('last_name', lastNameValue)
            data.append('username', usernameValue)
            data.append('email', emailValue)
            data.append('password', passwordValue)
            data.append('gender', genderValue)
            data.append('date_of_birth', dateValue)

            axios.post(`${process.env.SITE_URL}/register`, data, {
                withCredentials: true
              }).then((res) => {
                setLoading(false)
                const csrf = Cookies.get('csrftoken')
                axios.defaults.headers.common['X-CSRFToken'] = csrf   
                props.setLoggedIn()
                props.nextStep()
                props.signUp()
            }).catch(err => {
                setLoading(false)
                if(err.response.data == 'failed to validate password') {
                    setErrorMessage('Failed to validate password. Please make sure your password meets the requirements.')
                }
                if(err.response.data == 'username already exists') {
                    setErrorMessage('Username already exists. Please choose another one.')
                }
                if(err.response.data == 'email already exists') {
                    setErrorMessage('An account with this email address already exists. Please choose another one, or log in instead.')
                }
                console.error(err)
            })
        }
    }

    const validateForm = () => {
        if(firstNameValue.length == 0) {
            setFirstNameError(true)
            setErrorMessage('Please provide a valid first name!')
            return false
        } else setFirstNameError(false)
        if(lastNameValue.length == 0) {
            setLastNameError(true)
            setErrorMessage('Please provide a valid last name!')
            return false
        } else setLastNameError(false)
        if(usernameValue.length == 0) {
            setUsernameError(true)
            setErrorMessage('Please choose a username!')
            return false
        } else setUsernameError(false)
        if(passwordValue.length == 0) {
            setPasswordError(true)
            setErrorMessage('Please choose a password!')
            return false
        } else setPasswordError(false)
        if(confPasswordValue.length == 0) {
            setConfPasswordError(true)
            setErrorMessage('Please confirm your password!')
            return false
        } else setConfPasswordError(false)
        if(emailValue.length == 0) {
            setEmailError(true)
            setErrorMessage('Please enter your email address!')
            return false
        } else setEmailError(false)
        if(dateValue.length == 0) {
            setDateError(true)
            setErrorMessage('Please enter your date of birth!')
            return false
        } else setDateError(false)

        if(!usernameAvailable) {
            setUsernameError(true)
            setErrorMessage('This username is not available. Choose another one!')
            return false
        } else setUsernameError(false)

        if(!emailValue.match(/^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/)) {
            setEmailError(true)
            setErrorMessage('Please enter a valid email address!')
            return false
        } else setEmailError(false)

        if(passwordValue.length < 6) {
            setPasswordError(true)
            setErrorMessage('Passwords must have at least 6 characters!')
            return false
        } else setPasswordError(false)

        if(passwordValue != confPasswordValue) {
            setPasswordError(true)
            setConfPasswordError(true)
            setErrorMessage('Passwords do not match!')
            return false
        } else  {
            setPasswordError(false)
            setConfPasswordError(false)
        }

        const twelveYearsAgo = new Date()
        twelveYearsAgo.setFullYear(twelveYearsAgo.getFullYear() - 12)
        var userDate = new Date(dateValue)

        if (userDate > twelveYearsAgo) {
            setDateError(true)
            setErrorMessage('You must be at least 12 years old to sign up!')
            return false
          } else setDateError(false)

        return true
    }

  return (
    <div className={active ? styles.active : styles.hidden}>
        <h2>Register</h2>
        <div className={styles.fullName}>
            <input className={firstNameError ? styles.inputErrorName : styles.inputName} 
                placeholder='First Name' 
                value={firstNameValue} 
                onChange={(e) => setFirstNameValue(e.target.value)}
                autoComplete="new-password"/>
            <input 
                className={lastNameError ? styles.inputErrorName : styles.inputName} 
                placeholder='Last Name'
                value={lastNameValue} 
                onChange={(e) => setLastNameValue(e.target.value)}
                autoComplete="new-password"/>
        </div>
        <FormInput 
            type="username" 
            label="Username:" 
            placeholder="Username" 
            onChange={(val) =>setUsernameValue(val)}
            onCheck={(available) => setUsernameAvailable(available)}
            error={usernameError} />
        <FormInput 
            type="email" 
            label="Email:" 
            placeholder="Email" 
            onChange={(val) => setEmailValue(val)}
            error={emailError}/>
        <FormInput 
            type="password" 
            label="Password:" 
            placeholder="Password" 
            onFocus={(focused) => setPasswordFocus(focused)}
            onChange={(val) => setPasswordValue(val)}
            error={passwordError}/>
            {passwordFocus && <PasswordStrengthBar password={passwordValue} className={styles.strengthBar} minLength={6}/>}
        <FormInput 
            type="password" 
            label="Confirm Password:" 
            placeholder="Confirm Password" 
            onChange={(val) => setConfPasswordValue(val)}
            error={confPasswordError}/>
        <div className={styles.fullName}>
            <select 
                className={styles.selectField} 
                value={genderValue} 
                onChange={(e) => setGenderValue(e.target.value)}>
                <option disabled>Gender</option>
                <option value={'M'}>Male</option>
                <option value={'F'}>Female</option>
                <option value={'O'}>Other</option>
            </select>
            <input 
                className={styles.selectField} 
                type='date' 
                placeholder='Date of Birth' 
                value={dateValue} 
                onChange={(e) => setDateValue(e.target.value)}/>
        </div>
        {errormessage && <span className={styles.errorMsg}>{errormessage}</span>}
        <button type='button' className={styles.loginBtn} onClick={handleSubmit}>{loading ? <img src='/loadinggif.gif'/> : 'SIGN UP'}</button>
        <span>Already have an account? <a onClick={() => changeForm()}>Log In</a></span>
        <span>or, sign up using:</span>
        <div className={styles.socialIcons}>
        <img src='/icons/google-icon.png' alt='Google' onClick={handleGoogleSignIn}></img>
        <img src='/icons/twitter-icon.png' alt='Twitter'></img>
        <img src='/icons/facebook-icon.png' alt='Facebook'></img>
        </div>
    </div>
  )}

  