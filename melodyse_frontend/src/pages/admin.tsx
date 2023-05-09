import Head from 'next/head'
import styles from '@/styles/Admin.module.scss'
import { useEffect, useState } from 'react'
import axios from 'axios'
import React from 'react';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js'
import { Pie } from 'react-chartjs-2'
import AdminProjectCard from '@/components/AdminProjectCard/AdminProjectCard';

export default function Admin({ userData, data } : any) {
    ChartJS.register(ArcElement, Tooltip, Legend)
    const pieUserData = {
        labels: ['Male', 'Female'],
        datasets: [
          {
            label: '# of users',
            data: [data.users_count.male, data.users_count.female],
            backgroundColor: ['#AB4967', 'pink'],
            borderWidth: 1,
          },
        ],
      }
    const getProjects = () => {
        axios.get(`${process.env.SERVER_SITE_URL}/getdata`, {
            withCredentials: true
        }).then(res => data = res.data)
          .catch(err => console.error(err))
    }

    const pieProjectData = {
        labels: ['Completed', 'Ongoing'],
        datasets: [
          {
            label: '# of users',
            data: [data.projects_count.completed, data.projects_count.notcompleted],
            backgroundColor: ['#AB4967', 'pink'],
            borderWidth: 1,
          },
        ],
      }
  return (
    <>
      <Head>
        <title>ADMIN | MELODYSE</title>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/logo.ico" />
      </Head>
      <div className={styles.container}>
        {!userData.is_admin && <h1>Not Authorized.
            </h1>}
        {userData.is_admin && <>
        
        <div className={styles.DIV1}>
            <h2>ONGOING PROJECTS:</h2>
            {data.projects.map(prj => (
                <AdminProjectCard project={prj}/>
            ))}
        </div>
        
        
        <div className={styles.DIV2}>

            <div className={styles.chart}>
                <h3>Users:</h3>
                <div className={styles.pieChart}>
                    <Pie data={pieUserData} width={30} options={{ maintainAspectRatio: false }}/>
                </div>
            </div>
            <div className={styles.chart}>
                <h3>Projects:</h3>
                <div className={styles.pieChart}>
                    <Pie data={pieProjectData} width={30} options={{ maintainAspectRatio: false }}/>
                </div>
            </div>
        </div>
        
        </>}
      </div>
    </>
  )
}

export async function getServerSideProps(context) {
    let data = {}
    const username = context.query.username
    await axios.get(`${process.env.SERVER_SITE_URL}/getdata`, {
      headers: {
          Cookie: context.req.headers.cookie
      },
  }).then(res => data = res.data)
    .catch(err => console.error(err))
  
    return {props: {data : data}}
  }