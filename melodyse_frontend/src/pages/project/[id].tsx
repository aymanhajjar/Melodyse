import Head from 'next/head'
import styles from '@/styles/Project.module.scss'
import { useEffect, useState, useRef } from 'react'
import axios from 'axios'
import AIButton from '@/components/AIButton/AIButton'
import ProjectArtistCard from '@/components/ProjectArtistCard/ProjectArtistCard'
import Message from '@/components/Message/Message'

export default function Project({ project, userData } : any) {
    const [moreInfo, setMoreInfo] = useState(false)
    
    const messagesContainerRef = useRef(null)
  console.log(project)
  const handleScroll = () => {

  }
  return (
    <>
      <Head>
        <title>Project | MELODYSE</title>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/logo.ico" />
      </Head>
      <div className={styles.container}>

        <div className={styles.div1}>

            <div className={moreInfo ? styles.detailsClosed : styles.detailsOpen}>
                <div className={styles.title}>
                    <h1>{project.title}</h1>
                    <h4>• Started by {project.owner.name}</h4>
                </div>
                <span className={styles.moreInfo} onClick={() => setMoreInfo(!moreInfo)}>More Info</span>

                {moreInfo && <>
                <div className={styles.description}>
                    <h3>Description:</h3>
                    <p>{project.description ? project.description : 'No description'}</p>
                </div>
                <div className={styles.artists}>
                    <h3>Members:</h3>
                    <div className={styles.artistList}>
                        {project.members.map(member => (
                            <ProjectArtistCard artist={member}/>
                        ))}
                    </div>
                </div>
                </>}
            </div>

            <div className={styles.chat}>
                {/* <div className={styles.chatUI}>
                    <div className={styles.messagesContainer} ref={messagesContainerRef} onScroll={handleScroll}>
                        {loadingMsg ? <img className={styles.loadingMsg} src='/loading-melodyse.gif'/> : messages.length > 0 ? messages.map(msg => (
                            <Message message={msg} is_mine={msg.author_username == userData.username}/>
                            
                        )) : <span>Start a conversation</span>}
                        {hasMore && <div className={styles.loadingMore} ref={loadMoreRef}>Loading more messages...</div>}
                    </div>
                    <ChatInput value={messageValue} setValue={(val) => setMessageValue(val)} submit={sendMsg}/>
                    </div> */}
            </div>
        </div>

        <div className={styles.div2}>
            
        </div>
      </div>
    </>
  )
}

export async function getServerSideProps(context) {
    let project = {}
    await axios.get(`${process.env.SERVER_SITE_URL}/get-project/${context.query.id}`, {
        headers: {
            Cookie: context.req.headers.cookie
        },
    }).then(res => project = res.data)
    .catch(err => console.log(err))
  
    return {props: {project: project}}
  }