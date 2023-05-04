import Head from 'next/head'
import styles from '@/styles/Project.module.scss'
import { useEffect, useState, useRef } from 'react'
import axios from 'axios'
import ProjectArtistCard from '@/components/ProjectArtistCard/ProjectArtistCard'
import Message from '@/components/Message/Message'
import ChatInput from '@/components/ChatInput/ChatInput'
import AIActionButtonWide from '@/components/AIActionButtonWide/AIActionButtonWide'
import { DndContext, closestCenter } from "@dnd-kit/core"
import { arrayMove, SortableContext, verticalListSortingStrategy } from "@dnd-kit/sortable"

export default function Project({ project, messages_list, userData} : any) {
    const [moreInfo, setMoreInfo] = useState(false)
    const [messages, setMessages] = useState(messages_list)
    const [loadingMsg, setLoadingMsg] = useState(false)
    const [hasMore, setHasMore] = useState(true)
    const [messageValue, setMessageValue] = useState('')
    
    const messagesContainerRef = useRef(null)
    const loadMoreRef = useRef(null)
  console.log(project, messages_list)
  const handleScroll = () => {

  }
  return (
    <>
      <Head>
        <title>{project.name} | MELODYSE</title>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/logo.ico" />
      </Head>
      <div className={styles.container}>

        <div className={styles.div1}>

            <div className={styles.header}>
                <div className={styles.topInfo}>
                    <div className={styles.title}>
                        <h1>{project.title}</h1>
                        <h4>• Started by {project.owner.name}</h4>
                    </div>
                    <span className={styles.moreInfo} onClick={() => setMoreInfo(!moreInfo)}>More Info</span>
                </div>

                {moreInfo && <div className={styles.details}>
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
                </div>}
            </div>

            <div className={styles.chat}>
                <div className={styles.chatUI}>
                    <div className={styles.messagesContainer} ref={messagesContainerRef} onScroll={handleScroll}>
                        {loadingMsg ? <img className={styles.loadingMsg} src='/loading-melodyse.gif'/> : messages.length > 0 ? messages.map(msg => (
                            <Message message={msg} is_mine={msg.author_username == userData.username}/>
                            
                        )) : <span>Start a conversation</span>}
                        {hasMore && <div className={styles.loadingMore} ref={loadMoreRef}>Loading more messages...</div>}
                    </div>
                    <ChatInput value={messageValue} setValue={(val) => setMessageValue(val)} />
                    </div>
            </div>
        </div>

        <div className={styles.div2}>
            <div className={styles.tasks}>
                <h1>Tasks</h1>
            </div>
            <div className={styles.files}>
                <h1>Files</h1>
            </div>
            <AIActionButtonWide name='Assistant'/>
            <div className={styles.actions}>
                <button className={styles.actionBtn}></button>
                <button className={styles.actionBtn}/>
            </div>
        </div>
      </div>
    </>
  )
}

export async function getServerSideProps(context) {
    let project = {}
    let messages = []
    await axios.get(`${process.env.SERVER_SITE_URL}/get-project/${context.query.id}`, {
        headers: {
            Cookie: context.req.headers.cookie
        },
    }).then(res => project = res.data)
    .catch(err => console.log(err))
    await axios.get(`${process.env.SERVER_SITE_URL}/getchat?project=${context.query.id}&page=1`, {
        headers: {
            Cookie: context.req.headers.cookie
        },
    }).then(res => {
        messages = res.data.messages
    })
    .catch(err => console.error(err))
  
    return {props: {project: project, messages_list: messages}}
  }