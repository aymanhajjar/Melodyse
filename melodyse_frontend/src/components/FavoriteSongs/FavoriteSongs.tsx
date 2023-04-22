import styles from './FavoriteSongs.module.scss'
import { useEffect, useState } from 'react'
import axios from 'axios'
import Artist from '../Artist/Artist'
import ChosenArtistCard from '../ChosenArtistCard/ChosenArtistCard'
import NextButton from '../NextButton/NextButton'

export default function FavoriteSongs(props: any) {
    const [loading, setLoading] = useState(true)
    const [spotifyToken, setToken] = useState()
    const [songs, setSongs] = useState()
    const [searchVal, setSearchVal] = useState('')
    const [chosenSongs, setChosenSongs] = useState([])
    const [chosenIDs, setChosenIDs] = useState([])
    const [buttonLoading, setButtonLoading] = useState(false)
    const [errorMsg, setErrorMessage] = useState()

    useEffect(() => {
        !spotifyToken && getToken()
    }, [])

    useEffect(() => {
        spotifyToken && getSongs()
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

    const getSongs = () => {
        axios.get(`https://api.spotify.com/v1/recommendations?seed_genres=pop,country&&min_popularity=80`, {
            headers: {
                "x-csrftoken": null,
                "Authorization": `Bearer ${spotifyToken}`
            }
        }).then(res => {
            console.log(res)
            setSongs(res.data.artists)
            setLoading(false)
        })
    }

    const submit = () => {
        setButtonLoading(true)
        const data = new FormData()
        data.append('artists', chosenArtists)

        axios.post(`${process.env.SITE_URL}/addartists`, data, {
            withCredentials: true
            }).then((res) => {
            setLoading(false)
            props.nextStep()
        }).catch(err => {
            setLoading(false)
            setErrorMessage('Server Error')
        })
    }

    // const search = () => {
    //     if(searchVal.length > 0) {
    //         setArtists()
    //         setLoading(true)
    //         axios.get(`https://api.spotify.com/v1/search?q=${searchVal}&&type=artist&&limit=21`, {
    //             headers: {
    //                 "x-csrftoken": null,
    //                 "Authorization": `Bearer ${spotifyToken}`
    //             }
    //         }).then(res => {
    //             console.log(res)
    //             setArtists(res.data.artists.items)
    //             setLoading(false)
    //         })
    //     }
    // }

    const handleKeyDown = (e) => {
        if (e.key === 'Enter') {
            search()
          }
    }

    // const remove = (artist) => {
    //     setChosenArtists(chosenArtists.filter(item => item['id'] !== artist['id']))
    //     setChosenIDs(chosenIDs.filter(id => id !== artist.id))
    // }

    // const addRemoveArtist = (artist) => {
    //     chosenIDs.includes(artist.id) ? setChosenArtists(chosenArtists.filter(item => item['id'] !== artist['id']))
    //         : (chosenArtists.length <= 10 && setChosenArtists([...chosenArtists, artist]))
    //     chosenIDs.includes(artist.id) ? setChosenIDs(chosenIDs.filter(id => id !== artist.id))
    //         : (chosenArtists.length <= 10 && setChosenIDs([...chosenIDs, artist.id]))
    // }

    return(
        <div className={styles.container}>
            <h2>Choose up to 10 of your favorite songs!</h2>
            <div className={styles.later}>
                <a >I will finish my profile later >></a>
                <NextButton loading={buttonLoading} submit={submit}/>
                <span className={styles.error}>{errorMsg}</span>
            </div>
                {loading ? <img src={'/loading-melodyse.gif'} className={styles.loading}/> :
                
                songs && 
                <div className={styles.artistsContainer}>
                    
                    {chosenSongs.length > 0 && 
                        <div className={styles.chosenArtists}>
                            {chosenSongs.map(artist => (
                            <ChosenArtistCard name={artist.name} remove={() => remove(artist)}/>))}
                        </div>
                    }
                    
                    <div className={styles.search}>
                        <input className={styles.artistSearch} placeholder='Search' value={searchVal} onChange={(e) => setSearchVal(e.target.value)} onKeyDown={handleKeyDown}/>
                        <div className={styles.searchBtn}>
                            <img src={'/icons/search.png'} onClick={search}/>
                        </div>
                    </div>
                        <div className={styles.artists}>
                        {songs.map((artist, index) => {
                            if(chosenIDs.includes(artist.id)) {
                                return <Artist data={artist} index={index} checked={true} addRemove={() => addRemoveArtist(artist)}/>
                            } else {
                                return <Artist data={artist} index={index} checked={false} addRemove={() => addRemoveArtist(artist)}/>
                            }
                           
                        })}
                    </div>
                </div>}
        </div>
    )
}