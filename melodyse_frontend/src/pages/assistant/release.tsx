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
    const [response, setResponse] = useState()
    const [titleLoading, setTitleLoading] = useState(false)
    const [suggCoverLoading, setSuggCoverLoading] = useState(false)
    const [genCoverLoading, setGenCoverLoading] = useState(false)

    const genForm = () => {
        const data = new FormData()
        data.append('lyrics', lyricsVal)
        data.append('genre', genreVal)
        data.append('mood', moodVal)
        data.append('title', titleVal)
        return data
    }

    const findTitle = () => {
        setTitleLoading(true)
        let data = genForm()
        axios.post(`${process.env.SITE_URL}/findtitle`, data, {
            withCredentials: true
        }).then(res => {setResponse(res.data.choices[0].text.replace(/^\s+/, "")); setTitleLoading(false)})
        .catch(err => console.error(err))
    }

    const suggestCover = () => {
        setTitleLoading(true)
        let data = genForm()
        axios.post(`${process.env.SITE_URL}/suggestcover`, data, {
            withCredentials: true
        }).then(res => {setResponse(res.data.choices[0].text.replace(/^\s+/, "")); setTitleLoading(false)})
        .catch(err => console.error(err))
    }

    const genCover = () => {
        setTitleLoading(true)
        let data = genForm()
        axios.post(`${process.env.SITE_URL}/generatecover`, data, {
            withCredentials: true
        }).then(res => {setResponse(res.data.choices[0].text.replace(/^\s+/, "")); setTitleLoading(false)})
        .catch(err => console.error(err))
    }

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

                        <div className={styles.sideInputs}>
                            <ReleaseInput label={'Genre'} value={genreVal} setValue={(val) => setGenreVal(val)}/>
                            <ReleaseInput label={'Mood'} value={moodVal} setValue={(val) => setMoodVal(val)}/>
                            <ReleaseInput label={'Title (optional)'} value={titleVal} setValue={(val) => setTitleVal(val)}/>
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
                    <AIActionButtonWide name="Find a title" pic="/icons/tag.png" submit={findTitle} loading={titleLoading}/>
                    <AIActionButtonWide name="Suggest cover art" pic="/icons/album.png" submit={suggestCover} loading={suggCoverLoading}/>
                    <AIActionButtonWide name="Generate cover art" pic="/icons/picture.png" submit={genCover} subscription={subscriptions.find(sub => sub.level == 2)} loading={genCoverLoading}/>
                    <img className={styles.aiImage} src='/icons/vinyl-record.png'/>
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