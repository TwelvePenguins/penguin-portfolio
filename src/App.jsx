import ElementTile from "./components/element-tile/ElementTile";
import NavBar from "./components/nav-bar/NavBar";
import "./App.css";
import HeroBackground from "./components/hero-background/HeroBackground";
import { ChevronDown } from "lucide-react";
import { useEffect, useLayoutEffect, useRef, useState } from "react";
import Lenis from "lenis";
import "lenis/dist/lenis.css";

function App() {
    const scrollIndicatorRef = useRef();
    const mainRef = useRef(null);
    const contentRef = useRef();

    const SCROLL_FADE_START = 0;
    const SCROLL_FADE_END = 50;
    const [heroPhase, setHeroPhase] = useState("initial");

    const animationMarkerRef = useRef();

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
            lerp: 0.1,
            wheelMultiplier: 0.8,
        });

        return () => {
            window.removeEventListener("scroll", handleScroll);
            lenis.destroy();
        };
    }, []);

    useLayoutEffect(() => {
        if (heroPhase === "animating") {
            contentRef.current.style.opacity = 0;
            const oldHeight = mainRef.current.getBoundingClientRect().height;
            const oldScrollY = window.scrollY;
            mainRef.current.style.height = "100vh";
            const newHeight = mainRef.current.getBoundingClientRect().height;
            const removedHeight = oldHeight - newHeight;

            window.scrollTo({
                top: oldScrollY - removedHeight,
                behavior: "instant",
            });
        }
    }, [heroPhase]);

    return (
        <>
            <NavBar></NavBar>
            <main ref={mainRef}>
                <div id="overlay">
                    <div id="content" ref={contentRef}>
                        <header>
                            <h2>Hi, I'm</h2>
                            <div className="name">
                                <ElementTile
                                    elementName={"Yttrium"}
                                    elementSymbol={"Y"}
                                    massNum={88.905}
                                    protonNum={39}
                                ></ElementTile>
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
                    <HeroBackground
                        eventSource={mainRef}
                        animationMarkerRef={animationMarkerRef}
                        setHeroPhase={setHeroPhase}
                    />
                </div>
            </main>
            <div ref={animationMarkerRef} className="animation-marker"></div>
        </>
    );
}

export default App;
