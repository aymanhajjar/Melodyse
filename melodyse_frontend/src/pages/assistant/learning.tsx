import Head from 'next/head'
import styles from '@/styles/Learning.module.scss'
import { useEffect, useState } from 'react'
import axios from 'axios'
import AIActionButtonWide from '@/components/AIActionButtonWide/AIActionButtonWide'

export default function Learning({ skills } : any) {
    const [withInterests, setWithInterests] = useState(true)
    const [selectValue, setSelectValue] = useState(skills[Math.floor(Math.random() * skills.length)].name)
    const [selectImage, setSelectImage] = useState('')
    const [tips, setTips] = useState()
    const [response, setResponse] = useState()

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
        axios.get(`${process.env.SITE_URL}/songstolearn?with_interests=${withInterests}`, {
            withCredentials: true
        }).then(res => setResponse(res.data.choices[0].text.replace(/^\s+/, "")))
        .catch(err => console.error(err))
    }

    const suggestResources = () => {
        axios.get(`${process.env.SITE_URL}/suggestresources?with_interests=${withInterests}`, {
            withCredentials: true
        }).then(res => setResponse(res.data.choices[0].text.replace(/^\s+/, "")))
        .catch(err => console.error(err))
    }

    const explainMusic = () => {

    }

    return (
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
                            <AIActionButtonWide name="Suggest songs to learn" pic='/icons/question.png' submit={suggestSongs}/>
                            <AIActionButtonWide name="Suggest resources to use" pic='/icons/book.png' submit={suggestResources}/>
                            <AIActionButtonWide name="Explain Music Theory" pic='/icons/theory.png' submit={explainMusic}/>
                </div>
                <div className={styles.div3}>
                    <h3>Tips and Tricks</h3>
                    {!tips ? <div className={styles.loading}>
                            <img src='/loading-melodyse.gif'/>
                        </div> : <span> {tips} </span>}
                </div>
            </div>
            
        </div>
    )
}

Learning.getInitialProps = async (ctx) => {
    let cleanData = []
    await axios.get(`${process.env.SERVER_SITE_URL}/getskills`).then(res => {
              cleanData = res.data.filter(skill => skill.name != 'Record Managing' && skill.name != 'Music Listening' && skill.name != 'Composing')
          }).catch(err => console.error(err))
    return {skills: cleanData}
  }