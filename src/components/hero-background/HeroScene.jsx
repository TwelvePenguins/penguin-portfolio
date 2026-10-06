import europaMap from "../../assets/Europa_Test.jpg";
import sunMap from "../../assets/Sun_Test_2k.jpg";
import bennuMap from "../../assets/Bennu_Test.jpg";
import { useFrame, useLoader } from "@react-three/fiber";
import { useEffect, useRef } from "react";
import { TextureLoader } from "three";
import Sun from "./Sun";
import Europa from "./Europa";
import Bennu from "./Bennu";
import Orbit from "./Orbit";
import * as THREE from "three";
import CurvedText from "./CurvedText";

export default function HeroScene({ animationMarkerRef }) {
    const [europaTexture, sunTexture, bennuTexture] = useLoader(TextureLoader, [
        europaMap,
        sunMap,
        bennuMap,
    ]);

    const animationStarted = useRef(false);
    const elapsedTime = useRef(0);
    const pastEntries = useRef([]);
    const orbitTransitionStart = 0;
    const orbitTransitionEnd = useRef(486);
    useEffect(() => {
        const callback = (entries) => {
            if (
                pastEntries.current.length === 0 &&
                entries[0].isIntersecting === false
            ) {
                const domRect =
                    animationMarkerRef.current.getBoundingClientRect();
                orbitTransitionEnd.current = domRect.top - window.innerHeight;
                console.log(orbitTransitionEnd.current);
                pastEntries.current.push(entries[0]);
            }
            entries.forEach((entry) => {
                if (entry.isIntersecting && entry.intersectionRatio == 1) {
                    animationStarted.current = true;
                }
            });
        };
        const observer = new IntersectionObserver(callback, {
            rootMargin: "0px 0px 2px 0px",
            scrollMargin: "0px",
            threshold: 1.0,
        });
        observer.observe(animationMarkerRef.current);

        return () => {
            observer.disconnect();
        };
    }, []);

    const initialOrbitDetails = [
        {
            orbitRadius: 3.75,
            planetRadius: 0.15,
            planetPositionXY: [-7, 3.2],
            color: 0x8c8062,
        },
        {
            orbitRadius: 5,
            planetRadius: 0.2,
            planetPositionXY: [-1.1, -3],
            color: 0xb97a57,
        },
        {
            orbitRadius: 6,
            planetRadius: 0.3,
            planetPositionXY: [0.4, 2.4],
            color: 0x4f7a5c,
        },
        {
            orbitRadius: 7.5,
            planetRadius: 0.4,
            planetPositionXY: [1.25, -4],
            color: 0x824e4f,
        },
        {
            orbitRadius: 9.5,
            planetRadius: 1,
            planetPositionXY: [4, 2.3],
            color: 0xc99a22,
        },
    ];
    const animationProgress = useRef({
        collapse: 0,
        collapseRebound: 0,
    });
    const scrollProgress = useRef(0);
    const sunScale = useRef(1);
    const sunOpacity = useRef(1);
    const orbits = [];

    for (let i = 0; i < initialOrbitDetails.length; i++) {
        orbits.push(
            <Orbit
                orbitDetail={initialOrbitDetails[i]}
                key={i}
                index={i}
                scrollProgress={scrollProgress}
                animationProgress={animationProgress}
            />,
        );
    }

    function easedIn(t) {
        return t ** 2;
    }

    function easedOut(t) {
        return 1 - Math.pow(1 - t, 3);
    }

    function calcAnimationProgress(start, end, timerRef) {
        const duration = end - start;
        return THREE.MathUtils.clamp(
            (timerRef.current - start) / duration,
            0,
            1,
        );
    }

    useFrame((_, delta) => {
        //For orbit appearance scroll animation
        scrollProgress.current = THREE.MathUtils.clamp(
            (window.scrollY - orbitTransitionStart) /
                (orbitTransitionEnd.current - orbitTransitionStart),
            0,
            1,
        );

        //For animation triggered after scroll to threshold
        if (!animationStarted.current) return;

        elapsedTime.current += delta;

        animationProgress.current.collapse = calcAnimationProgress(
            0.4,
            1.75,
            elapsedTime,
        );
        animationProgress.current.collapseRebound = calcAnimationProgress(
            0.25,
            0.4,
            elapsedTime,
        );

        sunScale.current = THREE.MathUtils.lerp(
            1,
            0.1,
            easedOut(animationProgress.current.collapse),
        );

        sunOpacity.current = THREE.MathUtils.lerp(
            1,
            0,
            easedOut(animationProgress.current.collapse),
        );
    });

    return (
        <>
            <ambientLight intensity={0.5} />
            <directionalLight
                color="white"
                position={[-2, 0, 0]}
                target-position={[10, 0, 0]}
            />
            <directionalLight
                color="orange"
                position={[-2.5, 0, 0]}
                target-position={[0, 0, 0]}
            />
            <Sun
                texture={sunTexture}
                scale={sunScale}
                textureOpacity={sunOpacity}
            />
            <Europa texture={europaTexture} />
            <Bennu texture={bennuTexture} />
            {orbits}
            <CurvedText
                content={"Sun"}
                position={[-2.75, 1.3, 0]}
                curvature={Math.PI / 10}
                radius={2}
                fontSize={0.2}
                order={0}
            />
            <CurvedText
                content={"Europa"}
                position={[9.4, 4, -5]}
                curvature={Math.PI / 3}
                radius={2}
                fontSize={0.3}
                order={3}
            />
            <CurvedText
                content={"Asteroid Bennu"}
                position={[7, -4.25, -10]}
                curvature={Math.PI / 1.5}
                radius={2}
                fontSize={0.4}
                order={4}
            />
        </>
    );
}
