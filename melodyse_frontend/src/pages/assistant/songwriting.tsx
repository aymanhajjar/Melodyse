import Head from 'next/head'
import styles from '@/styles/Songwriting.module.scss'
import { useEffect, useState, useRef } from 'react'
import axios from 'axios'
import AIActionButton from '@/components/AIActionButton/AIActionButton'
import UndoButton from '@/components/UndoButton/UndoButton'

function Songwriting({subscriptions = []}) {

  const [lyrics, setLyrics] = useState('')
  const [useInterests, setUseInterests] = useState(true)
  const [undoEnabled, setUndoEnabled] = useState(false)
  const [redoEnabled, setRedoEnabled] = useState(false)
  const historyRef = useRef({ past: [], present: lyrics, future: [] })

  useEffect(() => {
    const { past, present, future } = historyRef.current
    past.length > 0 ? setUndoEnabled(true) : setUndoEnabled(false)
    future.length > 0 ? setRedoEnabled(true) : setRedoEnabled(false)
  }, [historyRef.current])

  function handleUndo() {
    const { past, present, future } = historyRef.current
    if (past.length > 0) {
      const previous = past[past.length - 1]
      historyRef.current = {
        past: past.slice(0, past.length - 1),
        present: previous,
        future: [present, ...future],
      }
    console.log(historyRef.current)
    setLyrics(previous)
    }
  }

  function handleRedo() {
    const { past, present, future } = historyRef.current
    if (future.length > 0) {
      const next = future[0]
      historyRef.current = {
        past: [...past, present],
        present: next,
        future: future.slice(1),
      }
      setLyrics(next)
    }
  }

  function handleChange(value) {
    const { past, present, future } = historyRef.current
    historyRef.current = {
      past: past.length > 14 ? [...historyRef.current.past.slice(1), historyRef.current.present] : [...historyRef.current.past, historyRef.current.present],
      present: value,
      future: [],
    }
    console.log(historyRef.current)
    setLyrics(value)
  }

  return (
    <>
      <Head>
        <title>Assistant | MELODYSE</title>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/logo.ico" />
      </Head>
      <div className={styles.container}>
        <div className={styles.leftSide}>
            <h1>SONGWRITING ASSISTANT</h1>
            <textarea placeholder='Write down your lyrics...' value={lyrics} onChange={(e) => handleChange(e.target.value)}></textarea>
            <div className={styles.belowText}>
            <AIActionButton name="Help with Melody" pic='/assistant/music.png'/>
            <div className={styles.useInterests}>
                <label>
                        Use my interests to improve responses
                    </label>
                    <input type='checkbox' checked={useInterests} onChange={() => setUseInterests(!useInterests)}/>
                </div>
            </div>
        </div>
        <div className={styles.rightSide}>
            <div className={styles.undobuttons}>
                <UndoButton type='undo' enabled={undoEnabled} undo={handleUndo} />
                <UndoButton type='redo' enabled={redoEnabled} redo={handleRedo}/>
            </div>

            <AIActionButton 
                name="Improve Lyrics" 
                pic='/assistant/composing.png' 
                subscription={subscriptions.find(sub => sub.level == 1)}/>

            <AIActionButton 
                name="Feedback" 
                pic='/assistant/feedback.png'/>

            <AIActionButton 
                name="Fix Grammar" 
                pic='/assistant/grammar.png'/>

            <AIActionButton 
                name="Generate New Lyrics" 
                pic='/assistant/magic-wand.png'/>

            <img className={styles.aiImage} src='/icons/writing.png'/>
        </div>

      </div>
    </>
  )
}

Songwriting.getInitialProps = async (ctx) => {
  let data = []
  await axios.get(`${process.env.SERVER_SITE_URL}/getsubscriptions`, {
            withCredentials: true
        }).then(res => {
            data = res.data
        }).catch(err => console.error(err))
  return {subscriptions: data}
};

export default Songwriting