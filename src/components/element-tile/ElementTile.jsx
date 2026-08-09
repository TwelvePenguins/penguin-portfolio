import styles from "./ElementTile.module.css"

export default function ElementTile() {
    return (
        <div className={styles.element}>
            <p className={styles.atomic}>39</p>
            <h1>Y</h1> 
            <p className={styles.fullName}>Yttrium</p>
            <p className={styles.mass}>88.905</p>
        </div>
    )
}