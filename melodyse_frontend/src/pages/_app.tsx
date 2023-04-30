import type { AppProps } from 'next/app'
import App from 'next/app';
import Layout from '../components/layout'
import axios from 'axios'
import '../styles/globals.css';
import { useEffect, useState } from 'react';
import Cookies from 'js-cookie';

export default function MyApp({ Component, pageProps } : AppProps) {
  const [loggedIn, setLoggedIn] = useState(false)
  const [subscription, setSubscription] = useState({})
  const [userData , setUserData] = useState({})
  
  useEffect(() => {
    axios.get(`${process.env.SITE_URL}/gettoken`, {
      withCredentials: true
    }).then(res => {
      const csrf = Cookies.get('csrftoken')
      axios.defaults.headers.common['X-CSRFToken'] = csrf
      axios.get(`${process.env.SITE_URL}/getinfo`, {
        withCredentials: true
        }).then(res => {
            setLoggedIn(true)
            setUserData(res.data)
            getSubscription()
        }).catch(err => {
            try {
                if (err.response.status === 403 && err.response.data == 'User not logged in') {
                    setLoggedIn(false)
                }
            } catch {
                console.error(err)
            }
        })
    })
  }, [])

  
  
  const getSubscription = () => {
    axios.get(`${process.env.SITE_URL}/getsubscription`, {
        withCredentials: true
    }).then(res => {
        setSubscription(res.data)
    }).catch(err => {
        try {
            if (err.response.status === 403 && err.response.data == 'User not logged in') {
                setLoggedIn(false)
            }
        } catch {
            console.error(err)
        }
    })
}


  return (

    <Layout {...pageProps} 
      loggedIn={loggedIn} 
      setLoggedIn={() => setLoggedIn(true)} 
      setLoggedOut={() => setLoggedIn(false)} 
      setSubscription={(sub) => setSubscription(sub)}
      userData={userData}
      subscription={subscription}>

      <Component {...pageProps} 
        loggedIn={loggedIn} 
        setLoggedIn={() => setLoggedIn(true)} 
        setLoggedOut={() => setLoggedIn(false)} 
        setSubscription={(sub) => setSubscription(sub)}
        userData={userData}
        subscription={subscription}/>

    </Layout>
  )
}
