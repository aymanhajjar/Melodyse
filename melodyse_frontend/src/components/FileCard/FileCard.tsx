import styles from './FileCard.module.scss'
import { useEffect, useState } from 'react'
import axios from 'axios'

export default function FileCard({ file }) {

    const [src, setSrc]= useState('/icons/file.png')
    const imageExtensions = ['jpg', 'jpeg', 'png', 'gif', 'bmp', 'svg', 'webp']
    const audioExtensions = ['.aac', '.aiff', '.amr', '.flac', '.m4a', '.m4b', '.m4p', '.mp3', '.oga', '.ogg', '.opus', '.wav', '.wma']
    const textFileExtensions = ['.txt', '.md', '.markdown','.doc','.docx','.odt','.pdf','.rtf','.tex','.wpd']

    useEffect(()=> {
        let extension = file.extension.substring(1)
        if(imageExtensions.includes(extension)) {
            setSrc('/icons/imagefile.png')
        } else if(audioExtensions.includes(extension)) {
            setSrc('/icons/audiofile.png')
        } else if(textFileExtensions.includes(extension)) {
            setSrc('/icons/textfile.png')
        }
    }, [])

    const downloadFile = () => {
        axios.get(`${process.env.SITE_URL}/downloadfile/${file.id}`, {
            withCredentials: true,
            responseType: 'blob'
          })
          .then(response => {
            const url = window.URL.createObjectURL(new Blob([response.data]))
            const link = document.createElement('a')
            link.href = url
            link.setAttribute('download', file.name + file.extension)
            link.click()
            link.parentNode.removeChild(link)
          })
          .catch(err => console.log(err))
    }

    return(
    
    <div className={styles.container} onClick={downloadFile}>
        <img src={src}/>
        {file.name}
    </div>    
    )
}