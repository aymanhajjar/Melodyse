import Head from 'next/head'
import styles from '@/styles/Release.module.scss'
import { useEffect, useState } from 'react'
import axios from 'axios'
import AIActionButtonWide from '@/components/AIActionButtonWide/AIActionButtonWide'
import PopupResponse from '@/components/PopupResponse/PopupResponse'

export default function Release({ subscriptions } : any) {
    const [withInterests, setWithInterests] = useState(true)

    return (
        <>
        <Head>
            <title>Release Assistant | MELODYSE</title>
            <meta name="viewport" content="width=device-width, initial-scale=1" />
            <link rel="icon" href="/logo.ico" />
        </Head>
        <div className={styles.container}>
            <h1>RELEASE ASSISTANT</h1>
            <div className={styles.content}>
                <div>

                </div>
                <div className={styles.useInterests}>
                    <label>
                        Use my interests to improve responses
                    </label>
                    <input type='checkbox' checked={withInterests} onChange={() => setWithInterests(!withInterests)}/>
                </div>
            </div>
        </div>

        </>
        
    )
}

Release.getInitialProps = async (ctx) => {
    let data = []
    await axios.get(`${process.env.SERVER_SITE_URL}/getsubscriptions`).then(res => {
              data = res.data
          }).catch(err => console.error(err))
    return {subscriptions: data}
  };