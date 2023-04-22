import styles from './UserSkills.module.scss'
import { useEffect, useState } from 'react'
import axios from 'axios'
import Artist from '../Artist/Artist'
import SkillCard from '../SkillCard/SkillCard'
import NextButton from '../NextButton/NextButton'
import Song from '../Song/Song'
import ChosenSkill from '../ChosenSkill/ChosenSkill'

export default function UserSkills(props: any) {
    const [loading, setLoading] = useState(true)
    const [skills, setSkills] = useState()
    const [chosenSkills, setChosenSkills] = useState([])
    const [buttonLoading, setButtonLoading] = useState(false)
    const [errorMsg, setErrorMessage] = useState()

    useEffect(() => {
        getChosenSkills()
        getSkills()
    }, [])

    const getSkills = () => {
        axios.get(`${process.env.SITE_URL}/getskills`, {
            withCredentials: true
        }).then(res => {
            console.log('skiiii', res)
            setSkills(res.data)
            setLoading(false)
        }).catch(err => console.log(err))
    }

    const getChosenSkills = () => {
        axios.get(`${process.env.SITE_URL}/getchosenskills`, {
            withCredentials: true
        }).then(res => {
            console.log(res)
            setChosenSkills(res.data)
            setLoading(false)
        }).catch(err => console.log(err))
    }

    const submit = () => {
        setButtonLoading(true)
        const data = new FormData()
        data.append('skills', JSON.stringify(chosenSkills))

        axios.post(`${process.env.SITE_URL}/addskills`, data, {
            withCredentials: true
            }).then((res) => {
            setLoading(false)
            props.nextStep()
        }).catch(err => {
            setLoading(false)
            console.error(err)
            setErrorMessage('Server Error')
        })
    }

    const remove = (skill) => {
        setChosenSkills(chosenSkills.filter(item => item !== skill))
    }

    const addRemoveSkill = (skill) => {
        skill['rating'] = 4
        chosenSkills.includes(skill) ? setChosenSkills(chosenSkills.filter(item => item !== skill))
            : (chosenSkills.length <= 7 && setChosenSkills([...chosenSkills, skill]))
    }

    const updateRating = (name, rating) => {
        const updatedSkills = chosenSkills.map(obj => {
            if (obj.name === name) {
              return { ...obj, rating: rating }
            } else {
              return obj
            }
          });
          setChosenSkills(updatedSkills)
    }

    return(
        <div className={styles.container}>
            <h2>Choose up to 8 skills and talents!</h2>
            <button type='button' className={styles.backbutton}  onClick={() => props.prevStep()}>BACK</button>
            <div className={styles.later}>
                <a >I will finish my profile later >></a>
                <NextButton loading={buttonLoading} submit={submit}/>
                <span className={styles.error}>{errorMsg}</span>
            </div>
                {loading ? <img src={'/loading-melodyse.gif'} className={styles.loading}/> :
                
                skills && 
                <div className={styles.songsContainer}>
                    
                    {chosenSkills.length > 0 && 
                        <div className={styles.chosenSongs}>
                            {chosenSkills.map(skill => (
                            <ChosenSkill name={skill.name} remove={() => remove(skill)} rating={skill['rating']} updateRating={(name, rating) => updateRating(name,rating)}/>))}
                        </div>
                    }
                    
                        <div className={styles.songs}>
                        {skills.map((skill, index) => {
                            if(chosenSkills.includes(skill)) {
                                return <SkillCard skill={skill} index={index} checked={true} addRemove={() => addRemoveSkill(skill)}/>
                            } else {
                                return <SkillCard skill={skill} index={index} checked={false} addRemove={() => addRemoveSkill(skill)}/>
                            }
                           
                        })}
                    </div>
                </div>}
        </div>
    )
}