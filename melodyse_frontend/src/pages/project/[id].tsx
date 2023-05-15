import Head from "next/head";
import styles from "@/styles/Project.module.scss";
import { useEffect, useState, useRef } from "react";
import axios from "axios";
import ProjectArtistCard from "@/components/ProjectArtistCard/ProjectArtistCard";
import Message from "@/components/Message/Message";
import ChatInput from "@/components/ChatInput/ChatInput";
import AIActionButtonWide from "@/components/AIActionButtonWide/AIActionButtonWide";
import { DndContext, closestCenter } from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import TaskCard from "@/components/TaskCard/TaskCard";
import AddTask from "@/components/AddTask/AddTask";
import FileCard from "@/components/FileCard/FileCard";
import EndProject from "@/components/EndProject/EndProject";
import CollabPrompt from "@/components/CollabPrompt/CollabPrompt";
import { useRouter } from "next/router";
import LeaveProject from "@/components/LeaveProject/LeaveProject";

export default function Project({
  project,
  messages_list,
  userData,
  notallowed,
}: any) {
  const [moreInfo, setMoreInfo] = useState(false);
  const [messages, setMessages] = useState(messages_list);
  const [loadingMsg, setLoadingMsg] = useState(false);
  const [tasks, setTasks] = useState(project.tasks);
  const [addTaskFormOpen, setAddTaskFormOpen] = useState(false);
  const [chatSocket, setChatSocket] = useState(null);
  const [endOpen, setEndOpen] = useState(false);
  const [leaveOpen, setLeaveOpen] = useState(false);
  const [addOpen, setAddOpen] = useState(false);

  const router = useRouter();

  useEffect(() => {
    if (notallowed) router.push("/");
  }, []);

  useEffect(() => {
    const url = `ws://localhost:8000/ws/socket-server/project/${project.id}`;
    const socket = new WebSocket(url);
    setChatSocket(socket);
    socket.onmessage = (e) => {
      let data = JSON.parse(e.data);
      if (data.type == "chat") {
        setMessages((prevMessages) => [data.message, ...prevMessages]);
      }
    };
  }, []);

  useEffect(() => {
    if (tasks != project.tasks) {
      const data = new FormData();
      data.append("tasks", JSON.stringify(tasks));
      data.append("id", project.id);
      axios
        .post(`${process.env.SITE_URL}/update-tasks`, data, {
          withCredentials: true,
        })
        .catch((err) => console.error(err));
    }
  }, [tasks]);
  const handleScroll = () => {};
  const handleDragEnd = (event) => {
    const { active, over } = event;
    if (active.id !== over.id) {
      setTasks((items) => {
        const activeIndex = tasks.findIndex((task) => task.id === active.id);
        const overIndex = tasks.findIndex((task) => task.id === over.id);
        return arrayMove(items, activeIndex, overIndex);
      });
    }
  };
  const addTask = (task) => {
    const data = new FormData();
    data.append("task", JSON.stringify(task));
    data.append("id", project.id);
    axios
      .post(`${process.env.SITE_URL}/add-task`, data, {
        withCredentials: true,
      })
      .then((res) => {
        setTasks([...tasks, res.data]);
        setAddTaskFormOpen(false);
      })
      .catch((err) => console.error(err));
  };
  const markAsDone = (id) => {
    const updatedTasks = tasks.map((obj) => {
      if (obj.id === id) {
        return { ...obj, is_completed: true };
      }
      return obj;
    });
    setTasks(updatedTasks);
  };
  const sendMsg = (msg) => {
    chatSocket.send(
      JSON.stringify({
        message: msg,
      })
    );
  };
  return (
    <>
      <Head>
        <title>{project.name} | MELODYSE</title>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/logo.ico" />
      </Head>
      <div className={styles.container}>
        <div className={styles.div1}>
          <div className={styles.header}>
            <div className={styles.topInfo}>
              <div className={styles.title}>
                <h1>{project.title}</h1>
                <h4>• Started by {project.owner.name}</h4>
              </div>
              <span
                className={styles.moreInfo}
                onClick={() => setMoreInfo(!moreInfo)}
              >
                {moreInfo ? "Less Info" : "More Info"}
              </span>
            </div>

            {moreInfo && (
              <div className={styles.details}>
                <div className={styles.description}>
                  <h3>Description:</h3>
                  <p>
                    {project.description
                      ? project.description
                      : "No description"}
                  </p>
                </div>
                <div className={styles.artists}>
                  <h3>Members:</h3>
                  <div className={styles.artistList}>
                    {project.members.map((member) => (
                      <ProjectArtistCard
                        key={member.username}
                        artist={member}
                      />
                    ))}
                  </div>
                  {project.owner.username == userData.username && (
                    <h4
                      className={styles.addMembers}
                      onClick={() => setAddOpen(true)}
                    >
                      Add Members
                    </h4>
                  )}
                </div>
              </div>
            )}
          </div>

          <div className={styles.chat}>
            <div className={styles.chatUI}>
              <div className={styles.messagesContainer} onScroll={handleScroll}>
                {loadingMsg ? (
                  <img
                    className={styles.loadingMsg}
                    src="/loading-melodyse.gif"
                  />
                ) : messages.length > 0 ? (
                  messages.map((msg) => (
                    <Message
                      key={msg.id}
                      message={msg}
                      is_mine={msg.author_username == userData.username}
                    />
                  ))
                ) : (
                  <span>Start a conversation</span>
                )}
              </div>
              <ChatInput
                submit={sendMsg}
                project={project}
                user={userData.first_name}
              />
            </div>
          </div>
        </div>

        <div className={styles.div2}>
          <div className={styles.tasks}>
            <h1>Tasks</h1>
            {project.tasks.length > 0 ? (
              <div className={styles.taskslist}>
                <DndContext
                  collisionDetection={closestCenter}
                  onDragEnd={handleDragEnd}
                >
                  <SortableContext
                    items={tasks}
                    strategy={verticalListSortingStrategy}
                  >
                    {tasks.map((task) => (
                      <TaskCard
                        key={task.id}
                        task={task}
                        id={task.id}
                        is_owner={project.owner.username == userData.username}
                        markAsDone={markAsDone}
                      />
                    ))}
                  </SortableContext>
                </DndContext>
              </div>
            ) : (
              <span>No tasks assigned.</span>
            )}
            {project.owner.username == userData.username && (
              <img
                src="/icons/plus.png"
                className={styles.addBtn}
                onClick={() => setAddTaskFormOpen(true)}
              />
            )}
          </div>
          <div className={styles.files}>
            <h1>Files</h1>
            {project.files.length > 0 ? (
              <div className={styles.fileslist}>
                {project.files.map((file) => (
                  <FileCard file={file} />
                ))}
              </div>
            ) : (
              <span>No files uploaded.</span>
            )}
          </div>
          <AIActionButtonWide name="Assistant" pic="/icons/send.png" />
          <div className={styles.actions}>
            {project.owner.username == userData.username ? (
              <button
                className={styles.actionBtn}
                onClick={() => setEndOpen(true)}
              >
                END PROJECT
              </button>
            ) : (
              <button
                className={styles.actionBtn}
                onClick={() => setLeaveOpen(true)}
              >
                LEAVE
              </button>
            )}
          </div>
        </div>
        {addTaskFormOpen && (
          <AddTask
            members={project.members}
            close={() => setAddTaskFormOpen(false)}
            addTask={addTask}
          />
        )}
      </div>
      {endOpen && (
        <EndProject project={project} close={() => setEndOpen(false)} />
      )}
      {leaveOpen && (
        <LeaveProject project={project} close={() => setLeaveOpen(false)} />
      )}
      {addOpen && (
        <CollabPrompt
          project={project}
          type={project.is_collab ? "collabInvite" : "hireInvite"}
          close={() => setAddOpen(false)}
        />
      )}
    </>
  );
}

export async function getServerSideProps(context) {
  let project = {};
  let messages = [];
  let notallowed = false;
  await axios
    .get(`${process.env.SERVER_SITE_URL}/get-project/${context.query.id}`, {
      headers: {
        Cookie: context.req.headers.cookie,
      },
    })
    .then((res) => (project = res.data))
    .catch((err) => {
      if (err.response.status == 403) {
        notallowed = true;
      }
      console.log(err);
    });
  await axios
    .get(`${process.env.SERVER_SITE_URL}/getchat?project=${context.query.id}`, {
      headers: {
        Cookie: context.req.headers.cookie,
      },
    })
    .then((res) => {
      messages = res.data.messages;
    })
    .catch((err) => console.error(err));

  return {
    props: {
      project: project,
      messages_list: messages,
      notallowed: notallowed,
    },
  };
}
