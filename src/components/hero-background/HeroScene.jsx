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
    let orbitTransitionStart = 0;
    let orbitTransitionEnd = 486;
    let orbitOpacity = useRef(0);
    useEffect(() => {
        const callback = (entries) => {
            if (
                pastEntries.current.length === 0 &&
                entries[0].isIntersecting === false
            ) {
                const domRect =
                    animationMarkerRef.current.getBoundingClientRect();
                orbitTransitionEnd = domRect.top - window.innerHeight;
                console.log(orbitTransitionEnd);
                pastEntries.current.push(entries[0]);
            }
            entries.forEach((entry) => {
                if (entry.isIntersecting && entry.intersectionRatio == 1) {
                    animationStarted.current = true;
                }
            });
        };
        const observer = new IntersectionObserver(callback, {
            rootMargin: "0px",
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
    const orbitDetails = useRef(initialOrbitDetails);
    const sunScale = useRef(1);
    const orbits = [];

    for (let i = 0; i < orbitDetails.current.length; i++) {
        orbits.push(
            <Orbit
                orbitDetails={orbitDetails}
                key={i}
                index={i}
                opacity={orbitOpacity}
            />,
        );
    }

    function easedIn(t) {
        return t ** 2;
    }

    function easedOut(t) {
        return 1 - Math.pow(1 - t, 3);
    }

    function animationProgress(start, end, timerRef) {
        const duration = end - start;
        return THREE.MathUtils.clamp(
            (timerRef.current - start) / duration,
            0,
            1,
        );
    }

    useFrame((state, delta) => {
        //For the parallax effect as pointer moves
        state.camera.position.x = THREE.MathUtils.damp(
            state.camera.position.x,
            state.pointer.x * 0.2,
            10,
            delta,
        );

        state.camera.position.y = THREE.MathUtils.damp(
            state.camera.position.y,
            state.pointer.y * 0.2,
            10,
            delta,
        );

        //For orbit animation
        const fadeProgress = THREE.MathUtils.clamp(
            (window.scrollY - orbitTransitionStart) /
                (orbitTransitionEnd - orbitTransitionStart),
            0,
            1,
        );

        orbitOpacity.current = THREE.MathUtils.damp(
            orbitOpacity.current,
            fadeProgress,
            10,
            delta
        );

        //For animation triggered after scroll to threshold
        if (!animationStarted.current) return;

        elapsedTime.current += delta;

        if (elapsedTime.current >= 0.25) {
            const reboundProgress = animationProgress(0.25, 0.4, elapsedTime);
            const collapseProgress = animationProgress(0.4, 1.75, elapsedTime);

            const easeInProgress = easedIn(collapseProgress);
            const easeOutProgress = easedOut(reboundProgress);

            orbitDetails.current = initialOrbitDetails.map((orbit) => {
                let orbitRadius;
                let planetRadius;
                let planetPositionX;
                let planetPositionY;
                let orbitTranslationX = 0;

                if (reboundProgress < 1) {
                    orbitRadius = THREE.MathUtils.lerp(
                        orbit.orbitRadius,
                        orbit.orbitRadius + 0.02,
                        easeOutProgress,
                    );
                    planetRadius = orbit.planetRadius;
                    planetPositionX = THREE.MathUtils.lerp(
                        orbit.planetPositionXY[0],
                        orbit.planetPositionXY[0] + 0.02,
                        easeOutProgress,
                    );
                    planetPositionY = orbit.planetPositionXY[1];
                } else {
                    orbitRadius = THREE.MathUtils.lerp(
                        orbit.orbitRadius + 0.02,
                        0,
                        easeInProgress,
                    );
                    planetRadius = THREE.MathUtils.lerp(
                        orbit.planetRadius,
                        0,
                        easeInProgress,
                    );
                    planetPositionX = THREE.MathUtils.lerp(
                        orbit.planetPositionXY[0] + 0.02,
                        -4,
                        easeInProgress,
                    );
                    planetPositionY = THREE.MathUtils.lerp(
                        orbit.planetPositionXY[1],
                        0,
                        easeInProgress,
                    );
                    orbitTranslationX = THREE.MathUtils.lerp(
                        0,
                        0.5,
                        easeInProgress,
                    )
                }

                return {
                    orbitRadius,
                    planetRadius,
                    planetPositionXY: [planetPositionX, planetPositionY],
                    color: orbit.color,
                    orbitTranslationX,
                };
            });

            sunScale.current = THREE.MathUtils.lerp(
                1, 
                0.1, 
                easedOut(collapseProgress),
            )
        }
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
            <Sun texture={sunTexture} scale={sunScale}/>
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
