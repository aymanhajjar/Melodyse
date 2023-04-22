import styles from './NextButton.module.scss'

export default function  NextButton({ loading, submit }: any) {

    return(
        <button type='button' className={styles.nextbutton} onClick={submit}>
            {loading ? <img src={'/loadinggif.gif'}/> : 'NEXT'}</button>
    )
}