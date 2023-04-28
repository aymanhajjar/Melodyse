import styles from './ProfileActionButton.module.scss'

export default function ProfileActionButton({name, pic, submit, color}: any) {

    return(
        <div className={styles.container} style={{backgroundColor: color}} onClick={submit}>
            <h3>{name}</h3>
            <img src={pic} />
        </div>
    )
}