import styles from "./text-carousell.module.css";

export default function TextCarousell({elementTiles, texts}) {
    return (
        <div className={styles.textCarousell}>
            <div className={styles.element}>
            </div>
            <div className={styles.text}>
            </div>
        </div>
    )
}