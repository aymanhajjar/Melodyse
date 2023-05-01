import styles from './FindMatchButton.module.scss'

export default function FindMatchButton({name, pic, submit, loading}: any) {

    return(
        <div className={styles.aibutton} onClick={submit}>
        {loading ? <img className={styles.loading} src='/loading-melodyse.gif'/>
        :   <> <h3>{name}</h3> 
            <img className={styles.icon} src={pic}/></>}
        </div>
    )
}