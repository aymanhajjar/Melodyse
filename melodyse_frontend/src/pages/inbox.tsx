import Head from 'next/head'
import styles from '@/styles/Inbox.module.scss'
import { useState,useEffect, useRef } from 'react'
import axios from 'axios'
import ChatCard from '@/components/ChatCard/ChatCard'
import ChatInput from '@/components/ChatInput/ChatInput'
import Message from '@/components/Message/Message'

export default function Inbox({inbox, userData, chatOpened} : any) {
    const [searchVal, setSearchVal] = useState('')
    const [searchRes, setSearchRes] = useState([])
    const [selectedChat, setSelectedChat] = useState(-1)
    const [messages, setMessages] = useState([])
    const [loadingMsg, setLoadingMsg] = useState(false)
    const [messageValue, setMessageValue] = useState('')
    const [chatSocket, setChatSocket] = useState(null)
    const [page, setPage] = useState(1);
    const [hasMore, setHasMore] = useState(true);

    const messagesContainerRef = useRef(null);
    useEffect(() => {
        if(searchVal.length > 0) {
            axios.get(`${process.env.SITE_URL}/searchfriends?q=${searchVal}`, {
                withCredentials:true
            }).then(res => setSearchRes(res.data.friends))
            .catch(err => console.error(err))
        }
    }, [searchVal])

    const sendMsg = () => {
        setMessageValue('')
        chatSocket.send(JSON.stringify({
            'message': messageValue
        }))
    }

    useEffect(() => {
        const options = {
            root: null,
            rootMargin: '0px',
            threshold: 1.0,
          }
          const observer = new IntersectionObserver(([entry]) => {
            if (entry.isIntersecting) {
              setPage((prevPage) => prevPage + 1);
              console.log('kss')
            }
          }, options);
      
          if (messagesContainerRef.current) {
            observer.observe(messagesContainerRef.current);
          }
      
          return () => {
            if (messagesContainerRef.current) {
              observer.unobserve(messagesContainerRef.current);
            }
          };
        }, [hasMore]);

    useEffect(() => {
        console.log('pagee', page)
        if(selectedChat >= 0) {
            setLoadingMsg(true)
            axios.get(`${process.env.SITE_URL}/getchat?id=${selectedChat}&&page=${page}`, {
                withCredentials:true
            }).then(res => {
                setMessages(res.data)
                setLoadingMsg(false)
            })
            .catch(err => console.error(err))

            const url = `ws://localhost:8000/ws/socket-server/${selectedChat}`
            const socket = new WebSocket(url)
            setChatSocket(socket)
            socket.onmessage = (e) => {
               let data = JSON.parse(e.data)
               if (data.type == 'chat') {
                setMessages((prevMessages) => [data.message, ...prevMessages])
               }
            }
        } 
    }, [selectedChat, page])

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
                    <div className={styles.messagesContainer} ref={messagesContainerRef}>
                        {loadingMsg ? <img className={styles.loadingMsg} src='/loading-melodyse.gif'/> : messages.length > 0 ? messages.map(msg => (
                            <Message message={msg} is_mine={msg.author_username == userData.username}/>
                            
                        )) : <span>Start a conversation</span>}
                        {hasMore && <div className={styles.loadingMore}>Loading more messages...</div>}
                    </div>
                    <ChatInput value={messageValue} setValue={(val) => setMessageValue(val)} submit={sendMsg}/>
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