import Head from 'next/head'
import styles from '@/styles/Inbox.module.scss'
import { useState,useEffect } from 'react'
import axios from 'axios'
import ChatCard from '@/components/ChatCard/ChatCard'
import { w3cwebsocket as W3CWebSocket } from "websocket";

export default function Inbox({inbox} : any) {
    const [searchVal, setSearchVal] = useState('')
    const [searchRes, setSearchRes] = useState([])

    useEffect(() => {
        if(searchVal.length > 0) {
            axios.get(`${process.env.SITE_URL}/searchfriends`, {
                withCredentials:true
            }).then(res => setSearchRes(res.data))
            .catch(err => console.error(err))
        }
    }, [searchVal])



  useEffect(() => {
    
  }, []);

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

            {searchVal.length > 0 ? (searchRes.length > 0 ?  searchRes.map(friend => (
                <span>{friend.name}</span>
            ))
            
            : <span>No Results</span>
            )
            :    inbox && inbox.map(chat => (
                    <ChatCard chat={chat}/>
                ))}
        </div>
        <div className={styles.chat}>

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