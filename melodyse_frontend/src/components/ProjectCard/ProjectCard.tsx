import styles from './ProjectCard.module.scss'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/router';
import axios from 'axios'
import JoinPrompt from '../JoinPrompt/JoinPrompt';

export default function ProjectCard({project, ongoing, browse=false, loggedIn}: any) {
    const [promptOpen, setPromptOpen] = useState(false)
    const router = useRouter()

    return(<>
        <div className={ongoing ? styles.ongoing : styles.completed} 
        onClick={() => loggedIn ? (browse ? setPromptOpen(true) : router.push(`/project/${project.id}`)) : router.push('/login')}>
            <h3>{project.title}</h3>
            <h5>Started by {project.owner.name}</h5>
            <p>{project.description}</p>
            <h6 className={styles.members}>Members: {project.members.map(member => member.name).join(', ')} </h6>
        </div>
        {promptOpen && <JoinPrompt close={() => setPromptOpen(false)} project={project}/>}
        </>
    )
}