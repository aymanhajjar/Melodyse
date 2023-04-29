import { useState, useEffect } from "react";
import styles from './TrackCard.module.scss'
import { useRouter } from "next/router";

export default function TrackCard({track}) {
    const router = useRouter()

    return (
        <div className={styles.container}>
            <img className={styles.cover} src={process.env.SITE_URL + track.cover}/>
            <div className={styles.details}>
                <div className={styles.title}>
                    <h2>{track.name}</h2> by <h5>{track.owner.name}</h5>
                </div>
                <span>{track.description}</span>
                <audio controls={true} preload="none">
                    <source src={process.env.SITE_URL + track.track} type="audio/mpeg"/>
                </audio>
                <h6>Credits: {track.project_members.map(member => (
                    <span className={styles.member} onClick={() => router.push(`/profile/${member.username}`)}>
                        {member.name}
                    </span>
                )).reduce((prev, curr) => [prev, ', ', curr])}</h6>
            </div>
        </div>
    )
}