import Head from 'next/head'
import styles from '@/styles/MyProjects.module.scss'
import { useEffect } from 'react'
import { useRouter } from 'next/router'
import axios from 'axios'
import ProjectCard from '@/components/ProjectCard/ProjectCard'

export default function MyProjects({loggedIn, projects} : any) {

    const router = useRouter()

    useEffect(() => {
        if(!loggedIn) {
            router.push('/')
        }
        console.log(projects)
    }, [])
  
  return (
    <>
      <Head>
        <title>My Projects | MELODYSE</title>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/logo.ico" />
      </Head>
      <div className={styles.container}>
            <h1>My Projects</h1>
            <h3>Ongoing Projects</h3>
            {projects.ongoing.length > 0 ? <div className={styles.projects}>
                {projects.ongoing.map(prj => (
                    <ProjectCard project={prj} ongoing={true}/>
                ))}
            </div>
            
            : <span>No ongoing projects</span>}
            <h3>Completed Projects</h3>
            {projects.completed.length > 0 ? <div className={styles.projects}>
                {projects.completed.map(prj => (
                    <ProjectCard project={prj} ongoing={false}/>
                ))}
            </div> : <span>No completed projects</span>}
      </div>
    </>
  )
}

export async function getServerSideProps(context) {
    let projects = []
    await axios.get(`${process.env.SERVER_SITE_URL}/getmyprojects`, {
        headers: {
            Cookie: context.req.headers.cookie
        },
    }).then(res => projects = res.data)
    .catch(err => console.log(err))
  
    return {props: {projects : projects}}
  }