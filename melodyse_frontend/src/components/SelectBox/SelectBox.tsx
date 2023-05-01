import styles from './SelectBox.module.scss'
import { useEffect, useState} from 'react'

export default function SelectBox({text, value, setValue, data}) {

  return (
    <select className={styles.select}>
      <option selected>{text}</option>
    </select>
  )
}
