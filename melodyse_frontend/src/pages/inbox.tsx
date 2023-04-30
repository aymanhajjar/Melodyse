import Head from 'next/head'
import styles from '@/styles/Inbox.module.scss'
import { useState,useEffect } from 'react'
import axios from 'axios'
import ChatCard from '@/components/ChatCard/ChatCard'
import ChatInput from '@/components/ChatInput/ChatInput'

export default function Inbox({inbox} : any) {
    const [searchVal, setSearchVal] = useState('')
    const [searchRes, setSearchRes] = useState([])
    const [selectedChat, setSelectedChat] = useState(-1)
    const [messages, setMessages] = useState([])
    const [loadingMsg, setLoadingMsg] = useState(false)

    useEffect(() => {
        if(searchVal.length > 0) {
            axios.get(`${process.env.SITE_URL}/searchfriends?q=${searchVal}`, {
                withCredentials:true
            }).then(res => setSearchRes(res.data.friends))
            .catch(err => console.error(err))
        }
    }, [searchVal])

    useEffect(() => {
        const url = `ws://localhost:8000/ws/socket-server/`
        const chatSocket = new WebSocket(url)
        chatSocket.onmessage = (e) => {
            console.log(JSON.parse(e.data))
        }
    })

    useEffect(() => {
        if(selectedChat >= 0) {
            setLoadingMsg(true)
            axios.get(`${process.env.SITE_URL}/getchat?id=${selectedChat}`, {
                withCredentials:true
            }).then(res => {
                setMessages(res.data)
                setLoadingMsg(false)
            })
            .catch(err => console.error(err))
        } 
    }, [selectedChat])

  return (
    <>
      <Head>
        <title>Inbox | MELODYSE</title>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/logo.ico" />
      </Head>
      <div className={styles.container}>
        <div className={styles.chats}>
            <input placeholder='Search Friends' value={searchVal} onChange={(e) => setSearchVal(e.target.value)}/>

            {searchVal.length > 0 ? (searchRes.length > 0 ?  searchRes.map((friend, index) => (
                <ChatCard friend={friend} selected={selectedChat} select={(id) => setSelectedChat(id)}/>
            ))
            
            : <span>No Results</span>
            )
            :    inbox && inbox.map((chat, index) => (
                    <ChatCard chat={chat} id={chat.chat_id} selected={selectedChat} select={(id) => setSelectedChat(id)}/>
                ))}
        </div>
        <div className={styles.chat}>
                {selectedChat < 0 && <span className={styles.empty}>Select a conversation</span>}
                {selectedChat >= 0 &&  <div className={styles.chatUI}>
                    <div className={styles.messagesContainer}>
                        {loadingMsg ? <img className={styles.loadingMsg} src='/loading-melodyse.gif'/> : messages.length > 0 ? messages.map(msg => (
                            <span>{msg.content}</span>
                        )) : <span>Start a conversation</span>}
                    </div>
                    <ChatInput/>
                    </div>}
        </div>
      </div>
    </>
  )
}

export async function getServerSideProps(context) {
    let inbox = {}
    await axios.get(`${process.env.SERVER_SITE_URL}/getchats`, {
        headers: {
            Cookie: context.req.headers.cookie
        },
    }).then(res => inbox = res.data)
    .catch(err => console.log(err))
  
    return {props: {inbox: inbox}}
  }