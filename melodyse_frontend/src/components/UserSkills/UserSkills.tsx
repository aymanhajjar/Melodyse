import styles from './UserSkills.module.scss'
import { useEffect, useState } from 'react'
import axios from 'axios'
import Artist from '../Artist/Artist'
import SkillCard from '../SkillCard/SkillCard'
import NextButton from '../NextButton/NextButton'
import Song from '../Song/Song'

export default function UserSkills(props: any) {
    const [loading, setLoading] = useState(true)
    const [spotifyToken, setToken] = useState()
    const [skills, setSkills] = useState()
    const [chosenSkills, setChosenSkills] = useState([])
    const [buttonLoading, setButtonLoading] = useState(false)
    const [errorMsg, setErrorMessage] = useState()

    useEffect(() => {
        !spotifyToken && getToken()
        getFavoriteSongs()
    }, [])

    useEffect(() => {
        spotifyToken && getSkills()
    }, [spotifyToken])

    const getToken = () => {
        const client_id = process.env.SPOTIFY_CLIENT_ID
        const client_secret = process.env.SPOTIFY_CLIENT_SECRET
        console.log(client_id, client_secret)
        axios.post(
            'https://accounts.spotify.com/api/token',
            new URLSearchParams({
              'grant_type': 'client_credentials',
              'client_id': client_id.toString(),
              'client_secret': client_secret.toString()
            }), {
                headers: {
                    "Content-Type": "application/x-www-form-urlencoded",
                    "x-csrftoken": null,
                }
            }
          ).then(res => setToken(res.data.access_token))
    }

    const getSkills = () => {
        axios.get(`${process.env.SITE_URL}/getskills`, {
            withCredentials: true
        }).then(res => {
            console.log('skiiii', res)
            setSkills(res.data)
            setLoading(false)
        }).catch(err => console.log(err))
    }

    const getFavoriteSongs = () => {
        axios.get(`${process.env.SITE_URL}/getfavoritesongs`, {
            withCredentials: true
        }).then(res => {
            console.log(res)
            setChosenSongs(res.data)
            const ids = []
            res.data.forEach(song => {
                ids.push(song.id)
            })
            setChosenIDs(ids)
            setLoading(false)
        }).catch(err => console.log(err))
    }

    const submit = () => {
        setButtonLoading(true)
        const data = new FormData()
        data.append('songs', JSON.stringify(chosenSongs))

        axios.post(`${process.env.SITE_URL}/addsongs`, data, {
            withCredentials: true
            }).then((res) => {
            setLoading(false)
            props.nextStep()
        }).catch(err => {
            setLoading(false)
            console.error(err)
            setErrorMessage('Server Error')
        })
    }

    const search = () => {
        if(searchVal.length > 0) {
            setSongs()
            setLoading(true)
            axios.get(`https://api.spotify.com/v1/search?q=${searchVal}&&type=track&&limit=14`, {
                headers: {
                    "x-csrftoken": null,
                    "Authorization": `Bearer ${spotifyToken}`
                }
            }).then(res => {
                console.log(res)
                setSongs(res.data.tracks.items)
                setLoading(false)
            })
        }
    }

    const handleKeyDown = (e) => {
        if (e.key === 'Enter') {
            search()
          }
    }

    const remove = (song) => {
        setChosenSongs(chosenSongs.filter(item => item['id'] !== song['id']))
        setChosenIDs(chosenIDs.filter(id => id !== song.id))
    }

    const addRemoveSkill = (song) => {
        delete song['available_markets']
        delete song['preview_url']
        delete song['album'].available_markets
        delete song['album'].artists
        delete song['album'].external_urls
        chosenIDs.includes(song.id) ? setChosenSongs(chosenSongs.filter(item => item['id'] !== song['id']))
            : (chosenSongs.length <= 9 && setChosenSongs([...chosenSongs, song]))
        chosenIDs.includes(song.id) ? setChosenIDs(chosenIDs.filter(id => id !== song.id))
            : (chosenSongs.length <= 9 && setChosenIDs([...chosenIDs, song.id]))
    }

    return(
        <div className={styles.container}>
            <h2>Choose up to 8 skills and talents!</h2>
            <button type='button' className={styles.backbutton}  onClick={() => props.prevStep()}>BACK</button>
            <div className={styles.later}>
                <a >I will finish my profile later >></a>
                <NextButton loading={buttonLoading} submit={submit}/>
                <span className={styles.error}>{errorMsg}</span>
            </div>
                {loading ? <img src={'/loading-melodyse.gif'} className={styles.loading}/> :
                
                skills && 
                <div className={styles.songsContainer}>
                    
                    {chosenSkills.length > 0 && 
                        <div className={styles.chosenSongs}>
                            {chosenSongs.map(song => (
                            <ChosenCard name={song.name} remove={() => remove(song)}/>))}
                        </div>
                    }
                    
                        <div className={styles.songs}>
                        {skills.map((skill, index) => {
                            if(chosenSkills.includes(skill)) {
                                return <SkillCard skill={skill} index={index} checked={true} addRemove={() => addRemoveSkill(skill)}/>
                            } else {
                                return <SkillCard skill={skill} index={index} checked={false} addRemove={() => addRemoveSkill(skill)}/>
                            }
                           
                        })}
                    </div>
                </div>}
        </div>
    )
}