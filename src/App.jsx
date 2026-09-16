import ElementTile from "./components/element-tile/ElementTile";
import NavBar from "./components/nav-bar/NavBar";
import "./App.css";
import HeroBackground from "./components/hero-background/HeroBackground";
import { ChevronDown } from "lucide-react";
import { useEffect, useRef } from "react";
import Lenis from "lenis";
import "lenis/dist/lenis.css";

function App() {
    const scrollIndicatorRef = useRef();
    const heroRef = useRef(null);

    const SCROLL_FADE_START = 0;
    const SCROLL_FADE_END = 50;

    useEffect(() => {
        function handleScroll() {
            const progress = Math.min(
                Math.max(
                    (window.scrollY - SCROLL_FADE_END) /
                        (SCROLL_FADE_END - SCROLL_FADE_START),
                    0,
                ),
                1,
            );
            scrollIndicatorRef.current.style.opacity = 1 - progress;
        }

        window.addEventListener("scroll", handleScroll);
        handleScroll();

        const lenis = new Lenis({
            autoRaf: true,
            smoothWheel: true,
            lerp: 0.10,
            wheelMultiplier: 0.8,
        });

        return () => {
            window.removeEventListener("scroll", handleScroll);
            lenis.destroy();
        };
    }, []);

    return (
        <>
            <NavBar></NavBar>
            <main ref={heroRef}>
                <div id="overlay">
                    <div id="content">
                        <header>
                            <h2>Hi, I'm</h2>
                            <div className="name">
                                <ElementTile></ElementTile>
                                <h1>uhan.</h1>
                            </div>
                        </header>
                        <p className="subtitle">
                            "We are made of star stuff" - Carl Sagan
                        </p>
                    </div>
                    <div id="scroll-indication" ref={scrollIndicatorRef}>
                        <p className="subtitle">Scroll to see more</p>
                        <ChevronDown color="gray" />
                    </div>
                </div>
                <div id="background">
                    <HeroBackground eventSource={heroRef} />
                </div>
            </main>
        </>
    );
}

export default App;
