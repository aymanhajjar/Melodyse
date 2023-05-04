import { useState, useEffect } from "react"
import styles from './TaskCard.module.scss'

export default function TaskCard({task, }) {

    return (
        <div className={styles.container}>
            {task.name}
        </div>
    )
}