import europaMap from "../../assets/Europa_Test.jpg";
import sunMap from "../../assets/Sun_Test_2k.jpg";
import bennuMap from "../../assets/Bennu_Test.jpg";
import { useFrame, useLoader } from "@react-three/fiber";
import { useEffect, useRef, useState } from "react";
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
    const pastEntries = [];
    let orbitTransitionStart = 0;
    let orbitTransitionEnd = 486;
    let orbitOpacity = useRef(0);
    useEffect(() => {
        const callback = (entries) => {
            if (
                pastEntries.length === 0 &&
                entries[0].isIntersecting === false
            ) {
                const domRect =
                    animationMarkerRef.current.getBoundingClientRect();
                orbitTransitionEnd = domRect.top - window.innerHeight;
                console.log(orbitTransitionEnd);
                pastEntries.push(entries[0]);
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

    const [orbitDetails, setOrbitDetails] = useState([
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
    ]);

    const orbits = [];

    for (let i = 0; i < orbitDetails.length; i++) {
        orbits.push(
            <Orbit
                orbitDetails={orbitDetails[i]}
                key={orbitDetails[i].planetPositionXY.join(",")}
                index={i}
                opacity={orbitOpacity}
            />,
        );
    }

    useFrame((state, delta) => {
        //For the parallax effect as pointer moves
        state.camera.position.x = THREE.MathUtils.lerp(
            state.camera.position.x,
            state.pointer.x * 0.2,
            0.1,
        );

        state.camera.position.y = THREE.MathUtils.lerp(
            state.camera.position.y,
            state.pointer.y * 0.2,
            0.1,
        );

        //For orbit animation
        const fadeProgress = THREE.MathUtils.clamp(
            (window.scrollY - orbitTransitionStart) /
                (orbitTransitionEnd - orbitTransitionStart),
            0,
            1,
        );

        orbitOpacity.current = THREE.MathUtils.lerp(
            orbitOpacity.current,
            fadeProgress,
            0.08,
        );

        //For animation triggered after scroll to threshold
        if (!animationStarted.current) return;

        elapsedTime.current += delta;

        if (elapsedTime.current >= 0.25 && elapsedTime.current <= 1.75) {
            const progress = THREE.MathUtils.clamp(
                (elapsedTime.current - 0.25) / 1.5,
                0,
                1,
            );

            function easedIn(t) {
                return t ** 2.5;
            }

            function easedOut(t) {
                return 1 - Math.pow(1 - t, 3);
            }
            console.log(progress);
            setOrbitDetails(
                orbitDetails.map((orbit) => {
                    let orbitRadius;
                    let planetRadius;
                    let planetPositionX;
                    let planetPositionY;

                    if (progress < 0.15) {
                        orbitRadius = THREE.MathUtils.lerp(
                            orbit.orbitRadius,
                            orbit.orbitRadius + 0.02,
                            easedOut(progress),
                        );
                        planetRadius = orbit.planetRadius;
                        planetPositionX = THREE.MathUtils.lerp(
                            orbit.planetPositionXY[0],
                            orbit.planetPositionXY[0] + 0.02,
                            easedOut(progress),
                        );
                        planetPositionY = orbit.planetPositionXY[1];
                    } else {
                        orbitRadius = THREE.MathUtils.lerp(
                            orbit.orbitRadius,
                            0,
                            easedIn(progress),
                        );
                        planetRadius = THREE.MathUtils.lerp(
                            orbit.planetRadius,
                            0,
                            easedIn(progress),
                        );
                        planetPositionX = THREE.MathUtils.lerp(
                            orbit.planetPositionXY[0],
                            -4,
                            easedIn(progress),
                        );
                        planetPositionY = THREE.MathUtils.lerp(
                            orbit.planetPositionXY[1],
                            0,
                            easedIn(progress),
                        );
                    }

                    return {
                        orbitRadius,
                        planetRadius,
                        planetPositionXY: [planetPositionX, planetPositionY],
                        color: orbit.color,
                    };
                }),
            );
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
            <Sun texture={sunTexture} />
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
