import Head from 'next/head'
import styles from '@/styles/Learning.module.scss'
import { useEffect, useState } from 'react'
import axios from 'axios'
import AIActionButtonWide from '@/components/AIActionButtonWide/AIActionButtonWide'

export default function Learning({ skills } : any) {
    const [withInterests, setWithInterests] = useState(true)
    const [selectValue, setSelectValue] = useState('')
    const [selectImage, setSelectImage] = useState('')


    useEffect(() => {
        const selectedSkill = skills.find((skill) => skill.name === selectValue)
        setSelectImage(selectedSkill.picture)
    }, [selectValue])

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
                            <AIActionButtonWide name="Suggest songs to learn" pic='/icons/question.png'/>
                            <AIActionButtonWide name="Suggest songs to learn" pic='/icons/question.png'/>
                            <AIActionButtonWide name="Suggest songs to learn" pic='/icons/question.png'/>
                </div>
                <div className={styles.div3}>
                <AIActionButtonWide />

                </div>
            </div>
            
        </div>
    )
}

Learning.getInitialProps = async (ctx) => {
    let data = []
    await axios.get(`${process.env.SERVER_SITE_URL}/getskills`).then(res => {
              data = res.data
          }).catch(err => console.error(err))
    return {skills: data}
  }