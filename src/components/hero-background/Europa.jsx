import { useFrame, useThree } from "@react-three/fiber";
import { useContext, useRef } from "react";
import * as THREE from "three";
import { easedOut, easedIn } from "./animationUtils";
import { AnimationProgressContext } from "../../contexts/AnimationProgressContext";
import FlatCircleLine from "./FlatCircleLine";
import { Html } from "@react-three/drei";
import ElementTile from "../element-tile/ElementTile";

const SHELL_RADIUS = 1.2;
const SQUARE_SIDE = SHELL_RADIUS * Math.SQRT2;
const TILE_SIZE = 100;

export default function Europa({ texture }) {
    const gl = useThree((state) => state.gl);
    const animationProgress = useContext(AnimationProgressContext);
    const europa = useRef();
    const europaTexturedMat = useRef();
    const europaGlowMat = useRef();
    const europaBohr = useRef();
    const oxygen = useRef();

    useFrame((_, delta) => {
        europa.current.rotation.y += delta;

        let scale = 1;

        if (animationProgress.current.collapse < 1) {
            scale = THREE.MathUtils.lerp(
                1,
                0.2,
                easedOut(animationProgress.current.collapse),
            );

            const textureOpacity = THREE.MathUtils.lerp(
                1,
                0,
                easedOut(animationProgress.current.collapse),
            );

            europa.current.scale.setScalar(scale);
            europaTexturedMat.current.opacity = textureOpacity;
            europaGlowMat.current.opacity = 1 - textureOpacity;
        } else if (animationProgress.current.pulse < 1) {
            if (animationProgress.current.pulse * 2 < 1) {
                scale = THREE.MathUtils.lerp(
                    0.2,
                    0.25,
                    easedOut(animationProgress.current.pulse * 2),
                );
            } else {
                const clampedProgress = THREE.MathUtils.clamp(
                    animationProgress.current.pulse * 2 - 1,
                    0,
                    1,
                );
                scale = THREE.MathUtils.lerp(
                    0.25,
                    0.2,
                    easedIn(clampedProgress),
                );
            }
            europa.current.scale.setScalar(scale);
        } else if (animationProgress.current.expand < 1) {
            const bohrScale = THREE.MathUtils.lerp(
                0,
                1,
                easedOut(animationProgress.current.expand),
            );

            europaBohr.current.scale.setScalar(bohrScale);
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

            europaGlowMat.current.opacity = glowOpacity;
            europaGlowMat.current.emissiveIntensity = glowIntensity;
        } else if (animationProgress.current.elementAppear < 1) {
            const opacity = THREE.MathUtils.lerp(
                0,
                1,
                easedOut(animationProgress.current.elementAppear),
            );

            oxygen.current.style.opacity = opacity;
        }
    });

    return (
        <>
            <group position={[9, 2.5, -5]} ref={europa}>
                <mesh>
                    <sphereGeometry args={[1, 32, 32]} />
                    <meshPhongMaterial
                        map={texture}
                        transparent
                        opacity={1}
                        ref={europaTexturedMat}
                    />
                </mesh>
                <mesh>
                    <sphereGeometry args={[1, 32, 32]} />
                    <meshStandardMaterial
                        emissive={"#2c78be"}
                        emissiveIntensity={6}
                        transparent
                        opacity={0}
                        ref={europaGlowMat}
                    />
                </mesh>
            </group>
            <group position={[9, 2.5, -5]} scale={0} ref={europaBohr}>
                <FlatCircleLine
                    position={[0, 0, 0]}
                    thickness={1.5}
                    radius={SHELL_RADIUS}
                    color={0x2c78be}
                    intensity={10}
                    type="shell"
                />
                <FlatCircleLine
                    position={[0, SHELL_RADIUS, 0]}
                    thickness={1.5}
                    radius={0.12}
                    intensity={10}
                    color={0x2c78be}
                />
                <FlatCircleLine
                    position={[0, -1 * SHELL_RADIUS, 0]}
                    thickness={1.5}
                    radius={0.12}
                    intensity={10}
                    color={0x2c78be}
                />
                <FlatCircleLine
                    position={[0, 0, 0]}
                    thickness={1.5}
                    radius={SHELL_RADIUS * 1.75}
                    color={0x2c78be}
                    intensity={10}
                    type="valence"
                />
                <FlatCircleLine
                    position={[0.175, 2.09, 0]}
                    thickness={1.5}
                    radius={0.12}
                    color={0x2c78be}
                    intensity={10}
                    type="valence"
                />
                <FlatCircleLine
                    position={[-0.175, 2.09, 0]}
                    thickness={1.5}
                    radius={0.12}
                    color={0x2c78be}
                    intensity={10}
                    type="valence"
                />
                <FlatCircleLine
                    position={[0.175, -2.09, 0]}
                    thickness={1.5}
                    radius={0.12}
                    color={0x2c78be}
                    intensity={10}
                    type="valence"
                />
                <FlatCircleLine
                    position={[-0.175, -2.09, 0]}
                    thickness={1.5}
                    radius={0.12}
                    color={0x2c78be}
                    intensity={10}
                    type="valence"
                />
                <FlatCircleLine
                    position={[2.1, 0 , 0]}
                    thickness={1.5}
                    radius={0.12}
                    color={0x2c78be}
                    intensity={10}
                    type="valence"
                />
                <FlatCircleLine
                    position={[-2.1, 0, 0]}
                    thickness={1.5}
                    radius={0.12}
                    color={0x2c78be}
                    intensity={10}
                    type="valence"
                /> 
                <Html
                    transform
                    portal={{ current: gl.domElement.parentNode }}
                    distanceFactor={(SQUARE_SIDE * 400) / TILE_SIZE}
                    position={[0, 0, 0]}
                    ref={oxygen}
                    style={{
                        opacity: 0,
                        width: TILE_SIZE,
                        height: TILE_SIZE,
                        backgroundColor: "#2c78be",
                    }}
                >
                    <ElementTile
                        fitContainer
                        elementName={"Oxygen"}
                        elementSymbol={"O"}
                        massNum={15.999}
                        protonNum={8}
                    />
                </Html>
            </group>
        </>
    );
}
