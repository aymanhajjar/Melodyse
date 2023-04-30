import Head from 'next/head'
import styles from '@/styles/Inbox.module.scss'
import { useState,useEffect } from 'react'
import axios from 'axios'
import ChatCard from '@/components/ChatCard/ChatCard'
import { w3cwebsocket as W3CWebSocket } from "websocket";

export default function Inbox({inbox} : any) {

const [filledForm, setFilledForm] = useState(false)
const [socket, setSocket] = useState(null);
const [username, setUsername] = useState("");
const [message, setMessage] = useState("");
const [messages, setMessages] = useState([]);

  useEffect(() => {
    
    //   const input = prompt("Enter your username:");
    //   if (input) {
    //     setUsername(input);
    //     localStorage.setItem("username", input);
    //   }

    // Connect to the WebSocket server with the username as a query parameter
    const newSocket = new WebSocket(`ws://localhost:8000/ws/chat/`);
    setSocket(newSocket);

    newSocket.onopen = () => console.log("WebSocket connected");
    newSocket.onclose = () => console.log("WebSocket disconnected");

    // Clean up the WebSocket connection when the component unmounts
    return () => {
      newSocket.close();
    };
  }, []);

        // client.send(
        //   JSON.stringify({
        //     type: "message",
        //     text: 'heeeey finla',
        //     sender: 'sassf',
        //   })
        // );
        // setValue("");
//   }, [])

  return (
    <>
      <Head>
        <title>Inbox | MELODYSE</title>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/logo.ico" />
      </Head>
      <div className={styles.container}>
        <div className={styles.chats}>
            {inbox && inbox.map(chat => (
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