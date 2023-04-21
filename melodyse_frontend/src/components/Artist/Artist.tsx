import styles from './Artist.module.scss'
import { useEffect, useState } from 'react'
import axios from 'axios'

export default function Artist({data, index, checked, addRemove}: any) {
    const [loading, setLoading] = useState(true)

    return(
        <div className={styles.artist} style={{ '--index': index }} onClick={() => addRemove(data)}>
            {checked && <img src={'/icons/check.png'} className={styles.check}/>}
            <img src={data.images[0] ? data.images[0].url : '/icons/avatar.png'}/>
            <span>{data.name}</span>
        </div>
    )
}