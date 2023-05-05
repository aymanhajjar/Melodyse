import Head from 'next/head'
import styles from '@/styles/Inbox.module.scss'
import { useState,useEffect, useRef } from 'react'
import axios from 'axios'
import ChatCard from '@/components/ChatCard/ChatCard'
import ChatInput from '@/components/ChatInput/ChatInput'
import Message from '@/components/Message/Message'
import { useRouter } from 'next/router'

export default function Inbox({inbox, userData, chatOpened, username} : any) {
    const [searchVal, setSearchVal] = useState('')
    const [searchRes, setSearchRes] = useState([])
    const [selectedChat, setSelectedChat] = useState(-1)
    const [messages, setMessages] = useState([])
    const [loadingMsg, setLoadingMsg] = useState(false)
    const [chats, setChats] = useState(inbox)
    const [chatSocket, setChatSocket] = useState(null)
    const [page, setPage] = useState(1);
    const [hasMore, setHasMore] = useState(true)

    const messagesContainerRef = useRef(null)
    const loadMoreRef = useRef(null)
    const router = useRouter()

    useEffect(() => {
        setSelectedChat(router.query.chatOpened)
    }, [chatOpened])

    useEffect(() => {
        if(router.query.username) {
            axios.get(`${process.env.SITE_URL}/getchat?username=${router.query.username}&&page=1`, {
                withCredentials:true
            }).then(res => {
                setSelectedChat(res.data.chat_id)
                setMessages(res.data.messages)
                if(res.data.chat) setChats([...chats, res.data.chat])
                setLoadingMsg(false)
                setSearchVal('')
            })
            .catch(err => console.error(err))
        }
    }, [username])

    useEffect(() => {
        if(searchVal.length > 0) {
            axios.get(`${process.env.SITE_URL}/searchfriends?q=${searchVal}`, {
                withCredentials:true
            }).then(res => setSearchRes(res.data.friends))
            .catch(err => console.error(err))
        }
    }, [searchVal])

    const sendMsg = (msg) => {
        chatSocket.send(JSON.stringify({
            'message': msg
        }))
    }

    const selectFriend = (username) => {
        axios.get(`${process.env.SITE_URL}/getchat?username=${username}&&page=1`, {
            withCredentials:true
        }).then(res => {
            setSelectedChat(res.data.chat_id)
            setMessages(res.data.messages)
            if(res.data.chat) setChats([...chats, res.data.chat])
            setLoadingMsg(false)
            setSearchVal('')
        })
        .catch(err => console.error(err))
    }

    useEffect(() => {
        setPage(1)
        if(selectedChat >= 0) {
            setLoadingMsg(true)
            axios.get(`${process.env.SITE_URL}/getchat?id=${selectedChat}&&page=1`, {
                withCredentials:true
            }).then(res => {
                setMessages(res.data.messages)
                setLoadingMsg(false)
                res.data.messages.length < 19 ? setHasMore(false) : setHasMore(true)
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
    }, [selectedChat])

    const handleScroll = () => {
        const messagesContainer = messagesContainerRef.current;
        const loadingMore = loadMoreRef.current;

        if (loadingMore) {
        const containerRect = messagesContainer.getBoundingClientRect();
        const loadingMoreRect = loadingMore.getBoundingClientRect();

        if (loadingMoreRect.top >= containerRect.top && hasMore) {
            setHasMore(false)
            axios.get(`${process.env.SITE_URL}/getchat?id=${selectedChat}&&page=${page+1}`, {
                withCredentials:true
            }).then(res => {
                setMessages([...messages, ...res.data.messages])
                setLoadingMsg(false)
                setHasMore(true)
            })
            .catch(err => {
                try {
                    if (err.response.status === 404) setHasMore(false)
                } catch {
                    console.error(err)
                }
            })
            setPage(page+1)
        }
        }
      }


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
                <ChatCard friend={friend} selected={selectedChat} select={(username) => selectFriend(username)}/>
            ))
            
            : <span>No Results</span>
            )
            :    chats && chats.map((chat, index) => (
                    <ChatCard chat={chat} id={chat.chat_id} selected={selectedChat} select={(id) => setSelectedChat(id)}/>
                ))}
        </div>
        <div className={styles.chat}>
                {selectedChat < 0 && <span className={styles.empty}>Select a conversation</span>}

                {selectedChat >= 0 &&  <div className={styles.chatUI}>
                    <div className={styles.messagesContainer} ref={messagesContainerRef} onScroll={handleScroll}>
                        {loadingMsg ? <img className={styles.loadingMsg} src='/loading-melodyse.gif'/> : messages.length > 0 ? messages.map(msg => (
                            <Message message={msg} is_mine={msg.author_username == userData.username}/>
                            
                        )) : <span>Start a conversation</span>}
                        {hasMore && <div className={styles.loadingMore} ref={loadMoreRef}>Loading more messages...</div>}
                    </div>
                    <ChatInput submit={sendMsg}/>
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