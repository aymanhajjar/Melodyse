import styles from './AIButton.module.scss'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/router'

export default function AIButton({name, pic, route}: any) {

    const router = useRouter()

    return(
        <div className={styles.aibutton} onClick={() => router.push(route)}>
            <img src={pic}/>
            <h2>{name}</h2>
        </div>
    )
}