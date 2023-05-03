import Head from 'next/head'
import styles from '@/styles/Profile.module.scss'
import { useEffect, useState } from 'react'
import axios from 'axios'
import { useRouter } from 'next/router'
import ProfileActionButton from '@/components/ProfileActionButton/ProfileActionButton'
import UserSkillCard from '@/components/UserSkillCard/UserSkillCard'
import Artist from '@/components/Artist/Artist'
import Song from '@/components/Song/Song'
import CollabPrompt from '@/components/CollabPrompt/CollabPrompt'

export default function Profile({data} : any) {
  const [picLoading, setPicLoading] = useState(false)
  const [descriptionEdit, setDescriptionEdit] = useState(false)
  const [descriptionVal, setDescriptionVal] = useState(data.description)
  const [usernameEdit, setUsernameEdit] = useState(false)
  const [usernameVal, setUsernameVal] = useState(data.username)
  const [nameEdit, setNameEdit] = useState(false)
  const [nameVal, setNameVal] = useState(data.full_name)
  const [usernameError, setUsernameError] = useState(false)
  const [requested, setRequested] = useState(false)
  const [isFriend, setIsFriend] = useState(false)
  const [hireOpen, setHireOpen] = useState(false)
  const [collabOpen, setCollabOpen] = useState(false)

  const router = useRouter()

  useEffect(() => {
    if(data.requested) setRequested(true)
    if(data.is_friend) setIsFriend(true)
  }, [])

  const pictureChange = (e) => {
    setPicLoading(true)
    const formdata = new FormData()
    formdata.append('picture', e.target.files[0])
    axios.post(`${process.env.SITE_URL}/change-pic`, formdata, {
      withCredentials: true
    }).then(res => {
      setPicLoading(false)
      data.picture = res.data.url
    }).catch(err => console.error(err))
  }

  const handleKeyDownName = (e) => {
    if(e.key === 'Enter') {
      if(nameVal.length > 0) {
        const formdata = new FormData()
        formdata.append('name', nameVal)
        axios.post(`${process.env.SITE_URL}/change-name`, formdata, {
          withCredentials: true
        }).then(res => {
          setNameEdit(false)
          data.full_name = res.data.name
        }).catch(err => console.error(err))
      }
    }
  }

  const handleKeyDownUsername = (e) => {
    if(e.key === 'Enter') {
      if(usernameVal.length > 0) {
        if(usernameVal == data.username) {
          setUsernameEdit(false)
        } else {
          const formdata = new FormData()
          formdata.append('username', usernameVal)
          axios.post(`${process.env.SITE_URL}/change-username`, formdata, {
            withCredentials: true
          }).then(res => {
            setUsernameEdit(false)
            data.username = res.data.username
          }).catch(err => {
            if (err.response.status === 400) setUsernameError(true)
            else console.error(err)
          })
        }
      }
    }
  }

  const handleKeyDownDescription = (e) => {
    if(e.key === 'Enter') {
      const formdata = new FormData()
      formdata.append('description', descriptionVal)
      axios.post(`${process.env.SITE_URL}/change-description`, formdata, {
        withCredentials: true
      }).then(res => {
        setDescriptionEdit(false)
        data.description = res.data.description
      }).catch(err => console.error(err))
    }
  }

  const addRemoveFriendReq = (action) => {
    const formdata = new FormData()
    formdata.append('username', data.username)
    formdata.append('action', action)
    axios.post(`${process.env.SITE_URL}/request-friend`, formdata, {
      withCredentials: true
    }).then(res => {
      if(res.data.status == 'requested') {
        setRequested(true)
      } else setRequested(false)
    }).catch(err => console.error(err))
  }

  const removeFriend = () => {
    const formdata = new FormData()
    formdata.append('username', data.username)
    axios.post(`${process.env.SITE_URL}/remove-friend`, formdata, {
      withCredentials: true
    }).then(res => {
      if(res.data.status == 'removed') {
        setIsFriend(false)
        setRequested(false)
      }
    }).catch(err => console.error(err))
  }


  return (
    <>
      <Head>
        <title>{data.username} | MELODYSE</title>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/logo.ico" />
      </Head>
      <div className={styles.container}>
        <div className={styles.div1}>

          <div className={styles.profileDiv}>
            
            <img src={process.env.SITE_URL + data.picture} className={styles.profilePic}/>

            {data.can_edit && <div className={styles.profileEdit} onClick={() => document.getElementById('profile-upload').click()}>
              {picLoading ? <img className={styles.picLoading} src='/loading-melodyse.gif'/> : <img src='/icons/camera.png' className={styles.camera}/>}
              <input id="profile-upload" type="file" accept="image/*" onChange={pictureChange} hidden/>
            </div>}

          </div>

          <div className={styles.info}>
          
            <div className={styles.full_name}>
              {nameEdit ? <input value={nameVal} onChange={(e) => setNameVal(e.target.value)} onKeyDown={handleKeyDownName}/>
              
              : <><h1>{data.full_name}</h1>
              {data.can_edit && <img src='/icons/edit.png' onClick={() => setNameEdit(true)}/>}</>}
            </div>

            <div className={styles.username}>
              {usernameEdit ? <input className={usernameError ? styles.usernameError : styles.usernameField} value={usernameVal} onChange={(e) => setUsernameVal(e.target.value)} onKeyDown={handleKeyDownUsername}/>

              : <> <span>@{data.username}</span>
              {data.can_edit && <img src='/icons/edit.png' onClick={() => setUsernameEdit(true)}/>}</>}
            </div>

            <div className={styles.description}>
            {descriptionEdit ? <textarea value={descriptionVal} onChange={(e) => setDescriptionVal(e.target.value)} onKeyDown={handleKeyDownDescription}/>

            : <><p>{data.description  ? data.description : data.can_edit && 'Add a description...'}</p>
              {data.can_edit && <img className={styles.editPenDetails} src='/icons/edit.png' onClick={() => setDescriptionEdit(true)}/>}</>}
            </div>

          </div>

          {!data.can_edit && <ProfileActionButton 
          name={isFriend ? 'Friends' : requested ? "Requested" : "Add Friend"} 
          pic={isFriend ? '/icons/friend.png' : requested ? '/icons/request.png' : '/icons/add-friend.png'}
          submit={isFriend ? removeFriend : requested ? () => addRemoveFriendReq('remove') : () => addRemoveFriendReq('add')} />}
        </div>

        <div className={styles.div2}>

            <div className={styles.skillsContainer}>
              <h2>Skills</h2>
              
                {data.can_edit && <img className={styles.editPen} src='/icons/edit.png' onClick={() => router.push({ pathname: '/profile/edit', query: { q: 'skills' }})}/>}

              <div className={styles.skills}>
              {data.skills.length > 0 ? data.skills.map(skill => (
                <UserSkillCard skill={skill}/>
              )): 'No Skills To Show'}
              </div>
            </div>

            <div className={styles.favorite}>
              <h2>Favorite Artists</h2>
              {data.can_edit && <img className={styles.editPen} src='/icons/edit.png' onClick={() => router.push({ pathname: '/profile/edit', query: { q: 'artists' }})}/>}

              <div className={styles.artists}>
                {data.favorite_artists.length > 0 ? data.favorite_artists.map(artist => (
                  <Artist data={artist}/>
                )): 'No Favorite Artists'}
              </div>
            </div>

            <div className={styles.favorite}>
              <h2>Favorite Songs</h2>
              {data.can_edit && <img className={styles.editPen} src='/icons/edit.png' onClick={() => router.push({ pathname: '/profile/edit', query: { q: 'songs' }})}/>}

              <div className={styles.artists}>
                {data.favorite_songs.length > 0 ? data.favorite_songs.map(song => (
                  <Song data={song}/>
                )): 'No Favorite Songs'}
              </div>
            </div>

            <div className={styles.favorite}>
              <h2>Ongoing Projects</h2>
              <div className={styles.artists}>
                {data.ongoing_projects.length > 0 ? data.ongoing_projects.map(prj => (
                  prj.title
                )): 'No Ongoing Projects'}
              </div>
            </div>

            <div className={styles.favorite}>
              <h2>Completed Projects</h2>
              <div className={styles.artists}>
                {data.completed_projects.length > 0 ? data.completed_projects.map(prj => (
                  prj.title
                )): 'No Completed Projects'}
              </div>
            </div>
        </div>

        <div className={styles.div3}>
          {!data.can_edit ? <div className={styles.actions}>
            <ProfileActionButton name="Hire" pic='/icons/briefcase.png' color='#47E5BC' submit={() => setHireOpen(true)}/>
            <ProfileActionButton name="Collab" pic='/icons/handshake.png' color="#FFE8D1" submit={() => setCollabOpen(true)}/>
            <ProfileActionButton name="Message" pic='/icons/email.png' color="#D49BAE"/>
          </div> : <span className={styles.editText}>This is how others see your profile. Hover to edit.</span>}
          
          <div className={styles.additionalInfo}>

            <div className={styles.rating}> 
              <div className={styles.stars}>
                {[...Array(5)].map((_, index) => (
                        <img key={index} src={index < data.rating ? '/icons/starEnabled.png' : '/icons/starDisabled.png'}
                      />
                    ))}
              </div>
              <span>Rated by:</span>
            </div>

            <div className={styles.stats}>
              <img src='/icons/like.png'/>
              <span>{data.likes_count} likes received</span>
            </div>

            <div className={styles.stats}>
              <img src='/icons/friends.png'/>
              <span>{data.friends} friends</span>
            </div>


          </div>
        </div>
            {hireOpen && <CollabPrompt type='hire' name={data.full_name.toUpperCase()} first_name={data.full_name.split(' ')[0]} close={() => setHireOpen(false)}/>}
            {collabOpen && <CollabPrompt type='collab' name={data.full_name.toUpperCase()} first_name={data.full_name.split(' ')[0]} close={() => setHireOpen(false)}/>}
      </div>
    </>
  )
}

export async function getServerSideProps(context) {
  let data = {}
  const username = context.query.username
  await axios.get(`${process.env.SERVER_SITE_URL}/profile/${username}`, {
    headers: {
        Cookie: context.req.headers.cookie
    },
}).then(res => data = res.data)
  .catch(err => console.log(err))

  return {props: {data : data}}
}