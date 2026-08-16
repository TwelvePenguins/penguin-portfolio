import styles from "./NavBar.module.css";
import penguinone from "../../assets/Penguinone.svg"

export default function NavBar() {
    return (
        <nav>
            <p>Du Yuhan</p>
            {/* TODO: Above is a placeholder */}
            <div className={styles.menu}>     
                <div>
                    <img src={penguinone}></img>
                    About
                </div>
                <div>Experience</div>
                <div>Projects</div>
                <div>Contact</div>
            </div>
        </nav>
    )
}