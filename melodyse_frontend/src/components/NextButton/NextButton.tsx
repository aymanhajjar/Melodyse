import styles from './NextButton.module.scss'

export default function  NextButton({text, loading, submit }: any) {

    return(
        <button type='button' className={styles.nextbutton} onClick={submit}>
            {loading ? <img src={'/loadinggif.gif'}/> : text}</button>
    )
}