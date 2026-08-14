import styles from "./NavBar.module.css"

export default function NavBar() {
    return (
        <nav>
            <p>Du Yuhan</p>
            {/* TODO: Above is a placeholder */}
            <div className={styles.menu}>     
                <div>About</div>
                <div>Experience</div>
                <div>Projects</div>
                <div>Contact</div>
            </div>
        </nav>
    )
}