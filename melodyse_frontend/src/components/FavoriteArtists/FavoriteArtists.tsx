import styles from './FavoriteArtists.module.scss'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/router'
import axios from 'axios'
import Artist from '../Artist/Artist'
import ChosenCard from '../ChosenCard/ChosenCard'
import NextButton from '../NextButton/NextButton'

export default function FavoriteArtists(props: any) {
    const [loading, setLoading] = useState(true)
    const [spotifyToken, setToken] = useState()
    const [artists, setArtists] = useState()
    const [searchVal, setSearchVal] = useState('')
    const [chosenArtists, setChosenArtists] = useState([])
    const [chosenIDs, setChosenIDs] = useState([])
    const [buttonLoading, setButtonLoading] = useState(false)
    const [errorMsg, setErrorMessage] = useState()

    const router = useRouter()

    useEffect(() => {
        !spotifyToken && getToken()
        getFavoriteArtists()
    }, [])

    useEffect(() => {
        spotifyToken && getArtists()
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

    const getFavoriteArtists = () => {
        axios.get(`${process.env.SITE_URL}/getfavoriteartists`, {
            withCredentials: true
        }).then(res => {
            console.log(res)
            res.data && setChosenArtists(res.data)
            const ids = []
            res.data && res.data.forEach(artist => {
                ids.push(artist.id)
            })
            setChosenIDs(ids)
            setLoading(false)
        }).catch(err => console.log(err))
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
        }).catch(err => console.log(err))
    }

    const submit = () => {
        setButtonLoading(true)
        const data = new FormData()
        data.append('artists', JSON.stringify(chosenArtists))

        axios.post(`${process.env.SITE_URL}/addartists`, data, {
            withCredentials: true
            }).then((res) => {
            setLoading(false)
            props.edit ? router.push(`/profile/${props.username}`) : props.nextStep()
        }).catch(err => {
            setLoading(false)
            setErrorMessage('Server Error')
        })
    }

    const search = () => {
        if(searchVal.length > 0) {
            setArtists()
            setLoading(true)
            axios.get(`https://api.spotify.com/v1/search?q=${searchVal}&&type=artist&&limit=21`, {
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
    }

    const handleKeyDown = (e) => {
        if (e.key === 'Enter') {
            search()
          }
    }

    const remove = (artist) => {
        setChosenArtists(chosenArtists.filter(item => item['id'] !== artist['id']))
        setChosenIDs(chosenIDs.filter(id => id !== artist.id))
    }

    const addRemoveArtist = (artist) => {
        chosenIDs.includes(artist.id) ? setChosenArtists(chosenArtists.filter(item => item['id'] !== artist['id']))
            : (chosenArtists.length <= 9 && setChosenArtists([...chosenArtists, artist]))
        chosenIDs.includes(artist.id) ? setChosenIDs(chosenIDs.filter(id => id !== artist.id))
            : (chosenArtists.length <= 9 && setChosenIDs([...chosenIDs, artist.id]))
    }

    return(
        <div className={styles.container}>
            <h2>Choose up to 10 of your favorite artists!</h2>
            <div className={styles.later}>
                {!props.edit && <a onClick={() => router.push('/')}>I will finish my profile later >></a>}
                <NextButton text={props.edit ? 'DONE' : 'NEXT'} loading={buttonLoading} submit={submit}/>
                <span className={styles.error}>{errorMsg}</span>
            </div>
                {loading ? <img src={'/loading-melodyse.gif'} className={styles.loading}/> :
                
                artists && 
                <div className={styles.artistsContainer}>
                    
                    {chosenArtists.length > 0 && 
                        <div className={styles.chosenArtists}>
                            {chosenArtists.map(artist => (
                            <ChosenCard name={artist.name} remove={() => remove(artist)}/>))}
                        </div>
                    }
                    
                    <div className={styles.search}>
                        <input className={styles.artistSearch} placeholder='Search' value={searchVal} onChange={(e) => setSearchVal(e.target.value)} onKeyDown={handleKeyDown}/>
                        <div className={styles.searchBtn}>
                            <img src={'/icons/search.png'} onClick={search}/>
                        </div>
                    </div>
                        <div className={styles.artists}>
                        {artists.map((artist, index) => {
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