import { useState, useEffect } from "react";
import styles from './TrackCard.module.scss'

export default function TrackCard({track}) {
    return (
        <div className={styles.container}>
            {track.name}
        </div>
    )
}