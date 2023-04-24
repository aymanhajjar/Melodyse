import styles from './AIActionButton.module.scss'
import { useEffect, useState } from 'react'

export default function AIActionButton({name, pic, route}: any) {

    return(
        <div className={styles.aibutton}>
            <h3>{name}</h3>
            <img src={pic}/>
        </div>
    )
}