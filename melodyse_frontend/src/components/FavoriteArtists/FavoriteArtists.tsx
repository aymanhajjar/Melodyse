import styles from './FavoriteArtists.module.scss'
import { useEffect, useState } from 'react'
import axios from 'axios'

export default function FavoriteArtists(props: any) {
    const [loading, setLoading] = useState(true)
    const [spotifyToken, setToken] = useState()
    const [artists, setArtists] = useState()

    useEffect(() => {
        !spotifyToken && getToken()
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

    const getArtists = () => {
        axios.get(`https://api.spotify.com/v1/artists/06HL4z0CvFAxyc27GXpf02/related-artists`, {
            headers: {
                "x-csrftoken": null,
                "Authorization": `Bearer ${spotifyToken}`
            }
        }).then(res => {
            setArtists(res.data.artists)
            setLoading(false)
        })
    }

    return(
        <div className={styles.container}>
            <h2>Choose up to 5 of your favorite artists!</h2>
            <button type='button' className={styles.later}>I will finish my profile later >></button>
            <div >
                {loading ? <img src={'/loading-melodyse.gif'} className={styles.loading}/> :
                artists && <div className={styles.artists}>
                        {artists.map(artist => (
                            <Artist/>
                        ))}
                    </div>}
            </div>
        </div>
    )
}