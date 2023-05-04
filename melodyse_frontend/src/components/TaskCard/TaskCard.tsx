import { useState, useEffect } from "react"
import styles from './TaskCard.module.scss'
import { useSortable } from "@dnd-kit/sortable"
import { CSS } from "@dnd-kit/utilities"

export default function TaskCard({task, id, is_owner, markAsDone}) {
    const {attributes, listeners, setNodeRef, transform, transition} = useSortable({id: id})
    const [showBtn, setShowBtn] = useState(false)

    const style = {
        transform: CSS.Transform.toString(transform),
        transition
    }

    return (
        <div ref={setNodeRef} style={style} className={task.is_completed ? styles.doneContainer : styles.container} {...attributes} {...listeners} onMouseOver={() => setShowBtn(true)} onMouseLeave={() => setShowBtn(false)} onDoubleClick={is_owner ? () => markAsDone(id) : () => {}}>
            <h4>{task.name}</h4>
            <span>{task.description}</span>
            <h6>Assigned to: {task.target_user_name}</h6>
            {task.is_completed && <img src='/icons/done.png' className={styles.check}/>}
        </div>
    )
}