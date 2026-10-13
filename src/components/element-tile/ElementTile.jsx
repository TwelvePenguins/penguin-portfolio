import styles from "./ElementTile.module.css";

export default function ElementTile({ elementName, elementSymbol, massNum, protonNum}) {
    return (
        <div className={styles.element}>
            <p className={styles.atomic}>{protonNum}</p>
            <h1>{elementSymbol}</h1>
            <div className={styles.reveal}>
                <div>
                    <p className={styles.fullName}>{elementName}</p>
                    <p className={styles.mass}>{massNum}</p>
                </div>
            </div>
        </div>
    );
}
