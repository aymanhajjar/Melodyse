import styles from './AIActionButton.module.scss'
import { useEffect, useState } from 'react'

export default function UndoButton({type}: any) {

    return(
        <div className={styles.aibutton}>
            <img src='/assistant/undo.png' className={type=='undo'? styles.undo : styles.redo}/>
        </div>
    )
}