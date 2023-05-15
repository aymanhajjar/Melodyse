import styles from "./AddTask.module.scss";
import { useEffect, useState } from "react";

export default function AddTask({ members, close, addTask }) {
  const [taskName, setTaskName] = useState("");
  const [taskDescription, setTaskDescription] = useState("");
  const [targetUser, setTargetUser] = useState("");

  const addTaskFunc = () => {
    let task = {
      name: taskName,
      description: taskDescription,
      target_username: targetUser,
    };
    addTask(task);
  };

  return (
    <>
      <div className={styles.taskContainer}>
        <h2>ADD TASK</h2>
        <div className={styles.inputDiv}>
          <label>Task Name:</label>
          <input
            placeholder="Task Name"
            value={taskName}
            onChange={(e) => setTaskName(e.target.value)}
          />
        </div>
        <div className={styles.inputDiv}>
          <label>Task Description:</label>
          <textarea
            placeholder="Task description..."
            value={taskDescription}
            onChange={(e) => setTaskDescription(e.target.value)}
          />
        </div>
        <div className={styles.inputDiv}>
          <label>Assigned To:</label>
          <select
            value={targetUser}
            onChange={(e) => setTargetUser(e.target.value)}
            className={styles.selectMember}
          >
            {members.map((member) => (
              <option value={member.username}>{member.name}</option>
            ))}
          </select>
        </div>
        <button
          type="button"
          className={styles.sendBtnHire}
          onClick={addTaskFunc}
        >
          ADD TASK
        </button>
        <div className={styles.close} onClick={close}>
          <img src="/icons/close.png" />
        </div>
      </div>
      <div className={styles.overlay}></div>
    </>
  );
}
