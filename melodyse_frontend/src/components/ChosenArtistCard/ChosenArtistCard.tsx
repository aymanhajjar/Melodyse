import styles from './ChosenArtistCard.module.scss'
import { useEffect, useState } from 'react'

export default function ChosenArtistCard({name, remove}: any) {

    return(
        <div className={styles.artistCard}>
            <span>{name}</span>
            <img src={'/icons/x.png'} onClick={remove}/>
        </div>
    )
}