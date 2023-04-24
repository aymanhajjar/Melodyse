import styles from './UndoButton.module.scss'
import { useEffect, useState } from 'react'

export default function UndoButton({type, enabled, undo, redo}: any) {

    return(
        <div className={enabled ? styles.undobutton : styles.undodisabled} onClick={type=='undo' ? undo : redo}>
            <img src='/assistant/undo.png' className={type=='undo'? styles.undo : styles.redo}/>
        </div>
    )
}