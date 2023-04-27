import Head from 'next/head'
import styles from '@/styles/Learning.module.scss'
import { useEffect, useState } from 'react'
import axios from 'axios'

export default function Learning({ skills } : any) {
    const [withInterests, setWithInterests] = useState(true)
    const [selectValue, setSelectValue] = useState('')

    return (
        <div className={styles.container}>
            <h1>LEARNING ASSISTANT</h1>
            <div className={styles.contents}>
                <div className={styles.div1}>
                    <span>I want to learn:</span>
                    <select value={selectValue} onChange={(e) => setSelectValue(e.target.value)}>
                        {skills && skills.map((skill) => (
                            <option value={skill.id}>{skill.name}</option>
                        ))}
                    </select>
                    <div className={styles.useInterests}>
                        <label>
                            Use my interests to improve responses
                        </label>
                        <input type='checkbox' checked={withInterests} onChange={() => setWithInterests(!withInterests)}/>
                    </div>
                </div>
                <div>

                </div>
                <div>

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