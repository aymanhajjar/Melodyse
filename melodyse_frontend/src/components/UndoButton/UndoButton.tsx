import styles from './UndoButton.module.scss'
import { useEffect, useState } from 'react'

export default function UndoButton({type}: any) {

    return(
        <div className={styles.undobutton}>
            <img src='/assistant/undo.png' className={type=='undo'? styles.undo : styles.redo}/>
        </div>
    )
}