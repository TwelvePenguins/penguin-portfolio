import styles from "./NavBar.module.css";
import penguinone from "../../assets/Penguinone.svg"

export default function NavBar() {
    return (
        <nav>
            <h1>Du Yuhan</h1>
            {/* TODO: Above is a placeholder */}
            <div className={styles.menu}>     
                <div className={styles.menuText}>
                    <span>About</span>
                </div>
                <div className={styles.menuText}>
                    <span>Experience</span>
                </div>
                <div className={styles.menuText}>
                    <span>Projects</span>
                </div>
                <div className={styles.menuText}>
                    <span>Contact</span>
                </div>
            </div>
        </nav>
    )
}