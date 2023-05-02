import styles from './ProfileActionButton.module.scss'

export default function ProfileActionButton({name, pic, submit, color, loading}: any) {

    return(
        <div className={styles.container} style={{backgroundColor: color}} onClick={submit}>
            {loading ? <img className={styles.loading} src='/loading-melodyse.gif'/> : <>
            <h3 className={color ? styles.black : ''}>{name}</h3>
            <img src={pic} /></>}
        </div>
    )
}