import styles from './SkillCard.module.scss'
import { useEffect, useState } from 'react'

export default function SkillCard({skill, search=null}: any) {

    return(
        <div className={styles.skill} onClick={search}>
            <img src={process.env.SITE_URL +  skill.picture}/>
            <span>{skill.name}</span>
            {[...Array(5)].map((_, index) => (
                <img
                key={index}
                src={index < skill.rating ? '/icons/starEnabled.png' : '/icons/starDisabled.png'}
              />
            ))}
        </div>
    )
}