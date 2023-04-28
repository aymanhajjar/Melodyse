import Head from 'next/head'
import styles from '@/styles/Learning.module.scss'
import { useEffect, useState } from 'react'
import axios from 'axios'
import AIActionButtonWide from '@/components/AIActionButtonWide/AIActionButtonWide'
import PopupResponse from '@/components/PopupResponse/PopupResponse'

export default function Learning({ skills } : any) {
    const [withInterests, setWithInterests] = useState(true)
    const [selectValue, setSelectValue] = useState(skills[Math.floor(Math.random() * skills.length)].name)
    const [selectImage, setSelectImage] = useState('')
    const [tips, setTips] = useState()
    const [response, setResponse] = useState()
    const [songsLoading, setSongsLoading] = useState(false)
    const [resourcesLoading, setResourcesLoading] = useState(false)
    const [theoryLoading, setTheoryLoading] = useState(false)

    useEffect(() => {
        if(selectValue) {
            const selectedSkill = skills.find((skill) => skill.name === selectValue)
            setSelectImage(selectedSkill.picture)
            setTips()
            axios.get(`${process.env.SITE_URL}/gettips?skill=${selectValue}`, {
                withCredentials: true
            }).then(res => setTips(res.data.choices[0].text.replace(/^\s+/, "")))
            .catch(err => console.error(err))
        }
    }, [selectValue])

    const suggestSongs = () => {
        setSongsLoading(true)
        axios.get(`${process.env.SITE_URL}/songstolearn?skill=${selectValue}&&with_interests=${withInterests}`, {
            withCredentials: true
        }).then(res => {setResponse(res.data.choices[0].text.replace(/^\s+/, "")); setSongsLoading(false)})
        .catch(err => console.error(err))
    }

    const suggestResources = () => {
        setResourcesLoading(true)
        axios.get(`${process.env.SITE_URL}/suggestresources?skill=${selectValue}&&with_interests=${withInterests}`, {
            withCredentials: true
        }).then(res => {setResponse(res.data.choices[0].text.replace(/^\s+/, "")); setResourcesLoading(false)})
        .catch(err => console.error(err))
    }

    const explainMusic = () => {
        setTheoryLoading(true)
        axios.get(`${process.env.SITE_URL}/explainmusic?skill=${selectValue}&&with_interests=${withInterests}`, {
            withCredentials: true
        }).then(res => {setResponse(res.data.choices[0].text.replace(/^\s+/, "")); setTheoryLoading(false)})
        .catch(err => console.error(err))
    }

    return (
        <>
        <Head>
            <title>Learning Assistant | MELODYSE</title>
            <meta name="viewport" content="width=device-width, initial-scale=1" />
            <link rel="icon" href="/logo.ico" />
        </Head>
        <div className={styles.container}>
            <h1>LEARNING ASSISTANT</h1>
            <div className={styles.contents}>
                <div className={styles.div1}>
                    <label>I want to learn:</label>
                    <select value={selectValue} onChange={(e) => setSelectValue(e.target.value)}>
                        {skills && skills.map((skill) => (
                            <option value={skill.name}>{skill.name}</option>
                        ))}
                    </select>

                    <img src={process.env.SITE_URL +  selectImage}/>
                    <div className={styles.useInterests}>
                        <label>
                            Use my interests to improve responses
                        </label>
                        <input type='checkbox' checked={withInterests} onChange={() => setWithInterests(!withInterests)}/>
                    </div>
                </div>
                <div className={styles.div2}>
                            <AIActionButtonWide name="Suggest songs to learn" pic='/icons/question.png' submit={suggestSongs} loading={songsLoading}/>
                            <AIActionButtonWide name="Suggest resources to use" pic='/icons/book.png' submit={suggestResources} loading={resourcesLoading}/>
                            <AIActionButtonWide name="Explain Music Theory" pic='/icons/theory.png' submit={explainMusic} loading={theoryLoading}/>
                </div>
                <div className={styles.div3}>
                    <h3>Tips and Tricks</h3>
                    {!tips ? <div className={styles.loading}>
                            <img src='/loading-melodyse.gif'/>
                        </div> : <span> {tips} </span>}
                </div>
            </div>
            {response && <PopupResponse response={response} close={() => setResponse()}/>}
        </div>

        </>
        
    )
}

Learning.getInitialProps = async (ctx) => {
    let cleanData = []
    await axios.get(`${process.env.SERVER_SITE_URL}/getskills`).then(res => {
              cleanData = res.data.filter(skill => skill.name != 'Record Managing' && skill.name != 'Music Listening' && skill.name != 'Composing')
          }).catch(err => console.error(err))
    return {skills: cleanData}
  }