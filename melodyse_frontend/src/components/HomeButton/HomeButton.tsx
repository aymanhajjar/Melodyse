import styles from './HomeButton.module.scss'
import { useRouter } from 'next/router'

export default function  HomeButton({ text, link, top }: any) {

    const router = useRouter()

    return(
        <button type='button' className={top ? styles.homebuttonTop : styles.homebutton} onClick={() => router.push(link)}>
            {text}</button>
    )
}