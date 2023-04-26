import Head from 'next/head'
import styles from '@/styles/Production.module.scss'
import { useEffect, useState, useRef } from 'react'
import axios from 'axios'
import AIActionButton from '@/components/AIActionButton/AIActionButton'
import Piano from '@/components/Piano/Piano'
import { Scale } from "@tonaljs/tonal"
import * as Scales from "tonal-scale"
import ChordCard from '@/components/ChordCard/ChordCard'
import { Chord } from "tonal";

function Production({subscriptions = []}) {
    const [notes, setNotes] = useState([])
    const [scale, setScale] = useState([])
    const [chords, setChords] = useState([])
    const [chordNotes, setChordNotes] = useState([])
    const [selectedChord, setSelectedChord] = useState('')

    useEffect(() => {
        setScale(Scale.detect(notes))
    }, [notes])

    useEffect(() => {
        const new_chords = Scales.chords(scale[0])
        setChords(new_chords)
    }, [scale])

    const handleChord = (chord) => {
        const chordObj = Chord.getChord('m7', notes[Math.floor(Math.random() * notes.length)])
        setChordNotes(chordObj.notes)
        setNotes(chordObj.notes)
        setSelectedChord(chord)
    }

  return (
    <>
      <Head>
        <title>Production Assistant | MELODYSE</title>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/logo.ico" />
      </Head>
      <div className={styles.container}>
        <h1>MUSIC PRODUCTION ASSISTANT</h1>
        <div className={styles.UIContainer}>
            <Piano selected={(val) => setNotes(val)} chordNotes={chordNotes}/>
            <div className={styles.DIV2}>
                <div className={styles.scalesNotes}>
                    <div>
                        <h4>Notes Selected: </h4> 
                        {notes.length > 0 && notes.join(", ")}
                    </div>
                    <div>
                        <h4>Scale(s): </h4> 
                        {scale.length > 0 && scale.slice(0, 2).join(", ")}
                    </div>
                    <div>
                        <h4>Chords in this scale: </h4> <br/>
                        <div className={styles.chords}>
                        {chords.length > 0 && chords.map(chord => (
                            <ChordCard chord={chord} select={(chord) => handleChord(chord)} selected={chord == selectedChord}/>
                        ))}
                        </div>
                    </div>
                </div>
            </div>
            <div className={styles.DIV3}>
                DIV3
            </div>
        </div>
      </div>
    </>
  )
}

Production.getInitialProps = async (ctx) => {
  let data = []
  await axios.get(`${process.env.SERVER_SITE_URL}/getsubscriptions`).then(res => {
            data = res.data
        }).catch(err => console.error(err))
  return {subscriptions: data}
};

export default Production