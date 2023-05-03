import styles from './ProjectArtistCard.module.scss'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/router';

export default function ProjectArtistCard({artist, remove}: any) {

    const router = useRouter()

    return(
        <div className={styles.container} onClick={() => router.push(`/profile/${artist.username}`)}>
            <img src={process.env.SITE_URL + artist.picture}/>
            <span>{artist.name}</span>
        </div>
    )
}