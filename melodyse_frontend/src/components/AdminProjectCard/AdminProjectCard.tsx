import styles from './AdminProjectCard.module.scss'
import { useEffect, useState } from 'react'
import axios from 'axios'

export default function AdminProjectCard({project, done}: any) {

    const modifyProject = (type) => {
        const data = new FormData()
        data.append('type', type)
        data.append('id', project.id)
        axios.post(`${process.env.SITE_URL}/modify-project`, data, {
            withCredentials: true
        }).then(() => done)
        .catch(err => console.error(err))
    }

    return(
        <div className={styles.container}>
            <div className={styles.details}>
                <h3>{project.name}</h3>
                <p>{project.description}</p>
                <span>Members: {project.members.map(member => (
                    <span>{member.username}, </span>
                )
                )}</span>
            </div>
            <div className={styles.actions}>
                <button type='button' onClick={() => modifyProject('end')}>END PROJECT</button>
                <button type='button' onClick={() => modifyProject('delete')}>DELETE PROJECT</button>
            </div>
        </div>
    )
}