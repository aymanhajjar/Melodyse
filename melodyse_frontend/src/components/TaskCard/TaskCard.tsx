import { useState, useEffect } from "react"
import styles from './TaskCard.module.scss'
import { useSortable } from "@dnd-kit/sortable"
import { CSS } from "@dnd-kit/utilities"

export default function TaskCard({task, id}) {
    const {attributes, listeners, setNodeRef, transform, transition} = useSortable({id: id})

    const style = {
        transform: CSS.Transform.toString(transform),
        transition
    }
    
    return (
        <div ref={setNodeRef} style={style} className={styles.container} {...attributes} {...listeners}>
            {task.name}
        </div>
    )
}