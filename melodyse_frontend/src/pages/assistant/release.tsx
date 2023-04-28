import Head from 'next/head'
import styles from '@/styles/Release.module.scss'
import { useEffect, useState } from 'react'
import axios from 'axios'
import AIActionButtonWide from '@/components/AIActionButtonWide/AIActionButtonWide'
import PopupResponse from '@/components/PopupResponse/PopupResponse'
import ReleaseInput from '@/components/ReleaseInput/ReleaseInput'

export default function Release({ subscriptions } : any) {
    const [withInterests, setWithInterests] = useState(true)
    const [lyricsVal, setLyricsVal] = useState('')
    const [genreVal, setGenreVal] = useState('')
    const [moodVal, setMoodVal] = useState('')
    const [titleVal, setTitleVal] = useState('')

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

                <div className={styles.div1}>
                    <div className={styles.formContainer}>

                        <ReleaseInput textarea={true} label={'Lyrics'} value={lyricsVal} setValue={(val) => setLyricsVal(val)}/>

                        <div>
                            <ReleaseInput textarea={true} label={'Genre'} value={genreVal} setValue={(val) => setGenreVal(val)}/>
                            <ReleaseInput textarea={true} label={'Mood'} value={moodVal} setValue={(val) => setMoodVal(val)}/>
                            <ReleaseInput textarea={true} label={'Title'} value={titleVal} setValue={(val) => setTitleVal(val)}/>
                        </div>
                    </div>
                    <div className={styles.useInterests}>
                        <label>
                            Use my interests to improve responses
                        </label>
                        <input type='checkbox' checked={withInterests} onChange={() => setWithInterests(!withInterests)}/>
                    </div>

                </div>

                <div className={styles.div2}>

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