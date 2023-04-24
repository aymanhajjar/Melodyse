import styles from './Artist.module.scss'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/router'

export default function Artist({name, pic, route}: any) {
    const [loading, setLoading] = useState(true)

    const router = useRouter()

    return(
        <div className={styles.aibutton} onClick={() => router.push(route)}>
            <img src={pic}/>
            <h2>{name}</h2>
        </div>
    )
}