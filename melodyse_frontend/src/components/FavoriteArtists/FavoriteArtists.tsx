import styles from './FavoriteArtists.module.scss'
import { useEffect, useState } from 'react'
import axios from 'axios'
import Artist from '../Artist/Artist'

export default function FavoriteArtists(props: any) {
    const [loading, setLoading] = useState(true)
    const [spotifyToken, setToken] = useState()
    const [artists, setArtists] = useState()
    const [searchVal, setSearchVal] = useState()
    const [chosenArtists, setChosenArtists] = useState([])
    const [chosenIDs, setChosenIDs] = useState([])

    useEffect(() => {
        !spotifyToken && getToken()
    }, [])

    useEffect(() => {
        spotifyToken && getArtists()
    }, [spotifyToken])

    useEffect(() => {
        console.log('chos', chosenArtists)
    }, [chosenArtists])

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

    const getArtists = () => {
        axios.get(`https://api.spotify.com/v1/artists/06HL4z0CvFAxyc27GXpf02/related-artists`, {
            headers: {
                "x-csrftoken": null,
                "Authorization": `Bearer ${spotifyToken}`
            }
        }).then(res => {
            console.log(res)
            setArtists(res.data.artists)
            setLoading(false)
        })
    }

    const search = () => {
        setArtists()
        setLoading(true)
        axios.get(`https://api.spotify.com/v1/search?q=${searchVal}&&type=artist`, {
            headers: {
                "x-csrftoken": null,
                "Authorization": `Bearer ${spotifyToken}`
            }
        }).then(res => {
            console.log(res)
            setArtists(res.data.artists.items)
            setLoading(false)
        })
    }

    const handleKeyDown = (e) => {
        if (e.key === 'Enter') {
            search()
          }
    }

    const addRemoveArtist = (artist) => {
        chosenArtists.includes(artist) ? setChosenArtists(chosenArtists.filter(item => item !== artist))
            : setChosenArtists([...chosenArtists, artist])
        chosenIDs.includes(artist.id) ? setChosenIDs(chosenIDs.filter(id => id !== artist.id))
            : setChosenIDs([...chosenIDs, artist.id])
    }

    return(
        <div className={styles.container}>
            <h2>Choose up to 5 of your favorite artists!</h2>
            <button type='button' className={styles.later}>I will finish my profile later >></button>
                {loading ? <img src={'/loading-melodyse.gif'} className={styles.loading}/> :
                artists && 
                <div className={styles.artistsContainer}>
                    <div className={styles.search}>
                        <input className={styles.artistSearch} placeholder='Search' value={searchVal} onChange={(e) => setSearchVal(e.target.value)} onKeyDown={handleKeyDown}/>
                        <div className={styles.searchBtn}>
                            <img src={'/icons/search.png'}/>
                        </div>
                    </div>
                        <div className={styles.artists}>
                        {artists.map((artist, index) => {
                            if(chosenIDs.includes(artist.id)) {
                                return <Artist data={artist} index={index} checked={true} addRemove={addRemoveArtist}/>
                            } else {
                                return <Artist data={artist} index={index} checked={false} addRemove={addRemoveArtist}/>
                            }
                           
                        })}
                    </div>
                </div>}
        </div>
    )
}