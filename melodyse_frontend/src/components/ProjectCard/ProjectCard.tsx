import styles from './ProjectCard.module.scss'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/router';
import axios from 'axios'

export default function ProjectCard({project, ongoing}: any) {

    const router = useRouter()


    return(
        <div className={ongoing ? styles.ongoing : styles.completed} onClick={() => router.push(`/project/${project.id}`)}>
            <h3>{project.title}</h3>
            <h5>Started by {project.owner.name}</h5>
            <p>{project.description}</p>
            <h6 className={styles.members}>Members: {project.members.map(member => member.name).join(', ')} </h6>
        </div>
    )
}