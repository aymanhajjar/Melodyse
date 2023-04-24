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
  
  useEffect(() => {
    axios.get(`${process.env.SITE_URL}/gettoken`, {
      withCredentials: true
    }).then(res => {
      const csrf = Cookies.get('csrftoken')
      axios.defaults.headers.common['X-CSRFToken'] = csrf
    })
  }, [])


  return (

    <Layout {...pageProps} 
      loggedIn={loggedIn} 
      setLoggedIn={() => setLoggedIn(true)} 
      setLoggedOut={() => setLoggedIn(false)} 
      setSubscription={(sub) => setSubscription(sub)}
      subscription={subscription}>

      <Component {...pageProps} 
        loggedIn={loggedIn} 
        setLoggedIn={() => setLoggedIn(true)} 
        setLoggedOut={() => setLoggedIn(false)} 
        setSubscription={(sub) => setSubscription(sub)}
        subscription={subscription}/>
        
    </Layout>
  )
}
