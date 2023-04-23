import styles from './HomeButton.module.scss'
import { useRouter } from 'next/router'

export default function  HomeButton({ text, link }: any) {

    const router = useRouter()

    return(
        <button type='button' className={styles.homebutton} onClick={() => router.push(link)}>
            {text}</button>
    )
}