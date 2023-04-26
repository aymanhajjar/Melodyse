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
import AIActionButtonWide from '@/components/AIActionButtonWide/AIActionButtonWide'
import PopupResponse from '@/components/PopupResponse/PopupResponse'

function Production({subscriptions = []}) {
    const [notes, setNotes] = useState([])
    const [scale, setScale] = useState([])
    const [chords, setChords] = useState([])
    const [chordNotes, setChordNotes] = useState([])
    const [selectedChord, setSelectedChord] = useState('')
    const [soundValue, setSoundValue] = useState('')
    const [pluginValue, setPluginValue] = useState('')
    const [soundResponse, setSoundResponse] = useState()
    const [bassResponse, setBassResponse] = useState()
    const [soundLoading, setSoundLoading] = useState(false)
    const [bassLoading, setBassLoading] = useState(false)
    const [withInterests, setWithInterests] = useState(true)

    useEffect(() => {
        setScale(Scale.detect(notes))
    }, [notes])

    useEffect(() => {
        const new_chords = Scales.chords(scale[0])
        setChords(new_chords.splice(0, 8))
    }, [scale])

    const handleChord = (chord) => {
        const chordObj = Chord.getChord('m7', notes[Math.floor(Math.random() * notes.length)])
        setChordNotes(chordObj.notes)
        setNotes(chordObj.notes)
        setSelectedChord(chord)
    }

    const buildSound = () => {
        if(soundValue.length > 0) {
            setSoundLoading(true)
            const data = new FormData()
            data.append('sound', soundValue)
            data.append('plugin', pluginValue)
            axios.post(`${process.env.SITE_URL}/buildsound`, data, {
                withCredentials: true
            }).then((res) => {
                setSoundLoading(false)
                const cleanText = res.data.choices[0].text.replace(/^\s+/, "")
                setSoundResponse(cleanText)
            }).catch(err => {
                setSoundLoading(false)
                console.error(err)
            })
        }
    }

    const findBassline = () => {
        if(scale.length > 0) {
            setBassLoading(true)
            const data = new FormData()
            data.append('scale', scale[0])
            axios.post(`${process.env.SITE_URL}/findbass`, data, {
                withCredentials: true
            }).then((res) => {
                setBassLoading(false)
                const cleanText = res.data.choices[0].text.replace(/^\s+/, "")
                setBassResponse(cleanText)
            }).catch(err => {
                setBassLoading(false)
                console.error(err)
            })
        }
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
                        {notes.length > 0 ? notes.join(", ") : 'No notes selected'}
                    </div>
                    <div>
                        <h4>Scale(s): </h4> 
                        {scale.length > 0 ? scale.slice(0, 2).join(", ") : 'Select notes to show scales'}
                    </div>
                    <div>
                        <h4>Chords in this scale: </h4> <br/>
                        <div className={styles.chords}>
                        {chords.length > 0 ? chords.map(chord => (
                            <ChordCard chord={chord} select={(chord) => handleChord(chord)} selected={chord == selectedChord}/>
                        )): 'Select notes to show chords'}
                        </div>
                    </div>
                </div>

                <AIActionButtonWide name="Find Bassline" pic='/icons/bass.png' submit={findBassline} loading={bassLoading}/>

            </div>

            <div className={styles.DIV3}>
                <div className={styles.soundLab}>
                    <h2>Sound Lab</h2>
                    <div className={styles.inputGroup}>
                        <label>I want to build a sound similar to:</label>
                        <input placeholder='Synth used in A Sky Full Of Stars...' value={soundValue} onChange={(e) => setSoundValue(e.target.value)}/>
                    </div>
                    <div className={styles.inputGroup}>
                        <label>Using the plugin:</label>
                        <input placeholder='Sylenth1, Serum, Nexus, Massive...' value={pluginValue} onChange={(e) => setPluginValue(e.target.value)}/>
                    </div>
                    <AIActionButtonWide name="Go" pic='/icons/send.png' bright={true} submit={buildSound} loading={soundLoading}/>
                </div>
                <img src='/icons/producer.png' className={styles.aiImage}/>
            </div>
        </div>
        {soundResponse && <PopupResponse response={soundResponse} close={() => setSoundResponse()}/>}
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