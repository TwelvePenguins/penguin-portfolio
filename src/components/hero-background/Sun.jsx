import { useContext, useEffect, useRef } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";
import { easedIn, easedOut } from "./animationUtils";
import FlatCircleLine from "./FlatCircleLine";
import { AnimationProgressContext } from "../../contexts/AnimationProgressContext";
import { Html } from "@react-three/drei";
import ElementTile from "../element-tile/ElementTile";

const SHELL_RADIUS = 0.5;
const SQUARE_SIDE = SHELL_RADIUS * Math.SQRT2;
const TILE_SIZE = 100;

export default function Sun({ texture }) {
    const gl = useThree((state) => state.gl);
    const animationProgress = useContext(AnimationProgressContext);
    const sun = useRef();
    const sunBohr = useRef();
    const hydrogen = useRef();
    const sunTexturedMat = useRef();
    const sunGlowOrbMat = useRef();

    useEffect(() => {
        sunBohr.current.scale.setScalar(0);
    }, []);

    useFrame(() => {
        let scale = 1;
        if (animationProgress.current.collapse < 1) {
            scale = THREE.MathUtils.lerp(
                1,
                0.1,
                easedOut(animationProgress.current.collapse),
            );

            const textureOpacity = THREE.MathUtils.lerp(
                1,
                0,
                easedOut(animationProgress.current.collapse),
            );

            sun.current.scale.setScalar(scale);
            sunTexturedMat.current.opacity = textureOpacity;
            sunGlowOrbMat.current.opacity = 1 - textureOpacity;
        } else if (animationProgress.current.pulse < 1) {
            if (animationProgress.current.pulse * 2 < 1) {
                scale = THREE.MathUtils.lerp(
                    0.1,
                    0.15,
                    easedOut(animationProgress.current.pulse * 2),
                );
            } else {
                const clampedProgress = THREE.MathUtils.clamp(
                    animationProgress.current.pulse * 2 - 1,
                    0,
                    1,
                );
                scale = THREE.MathUtils.lerp(
                    0.15,
                    0.1,
                    easedIn(clampedProgress),
                );
            }
            sun.current.scale.setScalar(scale);
        } else if (animationProgress.current.expand < 1) {
            const bohrScale = THREE.MathUtils.lerp(
                0,
                1,
                easedOut(animationProgress.current.expand),
            );

            sunBohr.current.scale.setScalar(bohrScale);
        } else if (animationProgress.current.elementMorph < 1) {
            const glowIntensity = THREE.MathUtils.lerp(
                7,
                0,
                easedIn(animationProgress.current.elementMorph),
            );

            const glowOpacity = THREE.MathUtils.lerp(
                1,
                0,
                easedIn(animationProgress.current.elementMorph),
            );

            sunGlowOrbMat.current.opacity = glowOpacity;
            sunGlowOrbMat.current.emissiveIntensity = glowIntensity;
        } else if (animationProgress.current.elementAppear < 1) {
            const opacity = THREE.MathUtils.lerp(
                0,
                1,
                easedOut(animationProgress.current.elementAppear),
            );

            hydrogen.current.style.opacity = opacity;
        }
    });

    return (
        <>
            <group position={[-2.5, 0, 0]} ref={sun}>
                <mesh>
                    <sphereGeometry args={[1, 32, 32]} />
                    <meshStandardMaterial
                        color="#ffddbe"
                        map={texture}
                        emissive={0xffddbe}
                        emissiveMap={texture}
                        emissiveIntensity={3}
                        toneMapped={false}
                        transparent
                        opacity={1}
                        ref={sunTexturedMat}
                    />
                </mesh>
                <mesh>
                    <sphereGeometry args={[1, 32, 32]} />
                    <meshStandardMaterial
                        emissive={"#ff7c02"}
                        emissiveIntensity={7}
                        toneMapped={false}
                        transparent
                        opacity={0}
                        ref={sunGlowOrbMat}
                    />
                </mesh>
            </group>
            <group position={[-2.5, 0, 0]} scale={0} ref={sunBohr}>
                <FlatCircleLine
                    position={[0, 0, 0]}
                    thickness={1.5}
                    radius={SHELL_RADIUS}
                    color={0xff7c02}
                    type="shell"
                />
                <FlatCircleLine
                    position={[0, SHELL_RADIUS, 0]}
                    thickness={1.5}
                    radius={0.05}
                    color={0xff7c02}
                />
                <Html
                    transform
                    portal={{ current: gl.domElement.parentNode }}
                    distanceFactor={(SQUARE_SIDE * 400) / TILE_SIZE}
                    position={[0, 0, 0]}
                    ref={hydrogen}
                    style={{
                        opacity: 0,
                        width: TILE_SIZE,
                        height: TILE_SIZE,
                        backgroundColor: "#c05d00",
                    }}
                >
                    <ElementTile
                        fitContainer
                        elementName={"Hydrogen"}
                        elementSymbol={"H"}
                        massNum={1.008}
                        protonNum={1}
                    />
                </Html>
            </group>
        </>
    );
}
