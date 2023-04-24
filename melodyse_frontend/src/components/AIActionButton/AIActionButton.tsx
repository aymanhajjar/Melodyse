import styles from './AIActionButton.module.scss'
import { useEffect, useState } from 'react'

export default function AIActionButton({name, pic, route}: any) {

    return(
        <div className={styles.aibutton}>
            <img src={pic}/>
            <h2>{name}</h2>
        </div>
    )
}