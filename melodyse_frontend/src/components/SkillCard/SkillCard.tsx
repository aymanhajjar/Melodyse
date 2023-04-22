import styles from './SkillCard.module.scss'
import { useEffect, useState } from 'react'

export default function SkillCard({skill, index, checked, addRemove}: any) {

    return(
        <div className={styles.skill} style={{ '--index': index }} onClick={() => addRemove()}>
            {checked && <img src={'/icons/check.png'} className={styles.check}/>}
            <img src={data.album.images[0] ? data.album.images[0].url : '/icons/avatar.png'}/>
            <span>{data.skills[0].name} - {data.name}</span>
        </div>
    )
}