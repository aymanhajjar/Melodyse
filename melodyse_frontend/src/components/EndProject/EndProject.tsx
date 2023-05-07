import styles from './EndProject.module.scss'
import { useEffect, useState } from 'react'
import axios from 'axios'
import { useRouter } from 'next/router'

export default function EndProject({ project, close }) {

    const router = useRouter()

    const endproject = () => {
        const data = new FormData()
        data.append('id', project.id)
        axios.post(`${process.env.SITE_URL}/endproject`, data, {
            withCredentials: true
        }).then(res => router.push('/') )
        .catch(err => console.error(err))
    }

    const handleUpload = (e) => {
        const data = new FormData()
        data.append('id', project.id)
        data.append('file', e.target.files[0])
        axios.post(`${process.env.SITE_URL}/uploadproject`, data, {
            withCredentials: true
          }).then(res => {
            router.push('/')
          }).catch(err => {
            console.error(err)})
    }

    return(<>
    
    <div className={!project.is_collab ? styles.hireContainer : styles.collabContainer}>
            {!project.is_collab && <>
                    <h2>END PROJECT</h2>
                    <div className={styles.inputDiv}>
                        <span>Are you sure you want to end this project? You won't be able to access it after it ends.</span>
                        <span>You will have to pay: ${project.payout}</span>
                    </div>
                    
                    <button type='button' className={styles.sendBtnHire} onClick={() => endproject()}>PAY AND END PROJECT</button>

                    <button type='button' className={styles.sendBtnHire} onClick={() => document.getElementById('song-upload').click()}>UPLOAD SONG, PAY AND END PROJECT</button>
                    <input id="song-upload" type="file" accept="image/*" onChange={handleUpload} hidden/>
                    <div className={styles.close} onClick={close}>
                        <img src='/icons/close.png'/>
                    </div>
                </>
            }
            {project.is_collab && <>
                    <h2>END PROJECT</h2>
                    <div className={styles.inputDiv}>
                        <span>Are you sure you want to end this project? You won't be able to access it after it ends.</span>
                    </div>
                    
                    <button type='button' className={styles.sendBtnHire} onClick={() => endproject()}>END PROJECT</button>
                    <button type='button' className={styles.sendBtnHire} onClick={() => document.getElementById('song-upload').click()}>UPLOAD SONG AND END PROJECT</button>
                    <input id="song-upload" type="file" accept="image/*" onChange={handleUpload} hidden/>
                    <div className={styles.close} onClick={close}>
                        <img src='/icons/close.png'/>
                    </div>
                </>
            }
        </div>
        <div className={styles.overlay}></div>
    </>

        
    )
}