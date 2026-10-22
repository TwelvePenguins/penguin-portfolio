import styles from "./PenguinoneSlots.module.css";

export default function PenguinoneSlots() {
    return (
        <div className={styles.slotBackground}>
            <div className={styles.slotSpot}></div>
            <p>10</p>
            <div className={styles.slotSpot}></div>
            <p>14</p>
            <div className={styles.slotSpot}></div>
        </div>
    )
}