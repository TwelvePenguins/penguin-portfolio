import { useContext, useRef } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";
import { easedIn, easedOut } from "./animationUtils";
import { AnimationProgressContext } from "../../contexts/AnimationProgressContext";
import FlatCircleLine from "./FlatCircleLine";
import { Html } from "@react-three/drei";
import ElementTile from "../element-tile/ElementTile";

const SHELL_RADIUS = 2;
const SQUARE_SIDE = SHELL_RADIUS * Math.SQRT2;
const TILE_SIZE = 100;

export default function Bennu({ texture }) {
    const gl = useThree((state) => state.gl);
    const animationProgress = useContext(AnimationProgressContext);
    const bennu = useRef();
    const bennuBohr = useRef();
    const carbon = useRef();
    const bennuTexturedMat = useRef();
    const bennuGlowMat = useRef();

    useFrame((_, delta) => {
        bennu.current.rotation.y += delta;
        bennu.current.rotation.x += delta;
        let scale = 1;

        if (animationProgress.current.collapse < 1) {
            scale = THREE.MathUtils.lerp(
                1,
                0.4,
                easedOut(animationProgress.current.collapse),
            );

            const textureOpacity = THREE.MathUtils.lerp(
                1,
                0,
                easedOut(animationProgress.current.collapse),
            );

            bennu.current.scale.setScalar(scale);
            bennuTexturedMat.current.opacity = textureOpacity;
            bennuGlowMat.current.opacity = 1 - textureOpacity;
        } else if (animationProgress.current.pulse < 1) {
            if (animationProgress.current.pulse * 2 < 1) {
                scale = THREE.MathUtils.lerp(
                    0.4,
                    0.45,
                    easedOut(animationProgress.current.pulse * 2),
                );
            } else {
                const clampedProgress = THREE.MathUtils.clamp(
                    animationProgress.current.pulse * 2 - 1,
                    0,
                    1,
                );
                scale = THREE.MathUtils.lerp(
                    0.45,
                    0.4,
                    easedIn(clampedProgress),
                );
            }
            bennu.current.scale.setScalar(scale);
        } else if (animationProgress.current.expand < 1) {
            const bohrScale = THREE.MathUtils.lerp(
                0,
                1,
                easedOut(animationProgress.current.expand),
            );

            bennuBohr.current.scale.setScalar(bohrScale);
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

            bennuGlowMat.current.opacity = glowOpacity;
            bennuGlowMat.current.emissiveIntensity = glowIntensity;
        } else if (animationProgress.current.elementAppear < 1) {
            const opacity = THREE.MathUtils.lerp(
                0,
                1,
                easedOut(animationProgress.current.elementAppear),
            );

            carbon.current.style.opacity = opacity;
        }
    });

    return (
        <>
            <group position={[7, -6, -10]} ref={bennu}>
                <mesh>
                    <sphereGeometry args={[1, 32, 32]} />
                    <meshPhongMaterial
                        map={texture}
                        transparent
                        opacity={1}
                        ref={bennuTexturedMat}
                    />
                </mesh>
                <mesh>
                    <sphereGeometry args={[1, 32, 32]} />
                    <meshPhongMaterial
                        emissive={"#755537"}
                        emissiveIntensity={9}
                        transparent
                        opacity={0}
                        ref={bennuGlowMat}
                    />
                </mesh>
            </group>
            <group position={[7, -6, -10]} scale={0} ref={bennuBohr}>
                <FlatCircleLine
                    position={[0, 0, 0]}
                    thickness={1.5}
                    radius={SHELL_RADIUS}
                    color={0x755537}
                    type="shell"
                />
                <FlatCircleLine
                    position={[0, SHELL_RADIUS, 0]}
                    thickness={1.5}
                    radius={0.2}
                    color={0x755537}
                />
                <FlatCircleLine
                    position={[0, -1 * SHELL_RADIUS, 0]}
                    thickness={1.5}
                    radius={0.2}
                    color={0x755537}
                />
                <FlatCircleLine
                    position={[0, 0, 0]}
                    thickness={1.5}
                    radius={SHELL_RADIUS * 1.75}
                    color={0x755537}
                    type="valence"
                />
                <FlatCircleLine
                    position={[0, 3.5, 0]}
                    thickness={1.5}
                    radius={0.2}
                    color={0x755537}
                    type="valence"
                />
                <FlatCircleLine
                    position={[0, -3.5, 0]}
                    thickness={1.5}
                    radius={0.2}
                    color={0x755537}
                    type="valence"
                />
                <FlatCircleLine
                    position={[3.5, 0, 0]}
                    thickness={1.5}
                    radius={0.2}
                    color={0x755537}
                    type="valence"
                />
                <FlatCircleLine
                    position={[-3.5, 0, 0]}
                    thickness={1.5}
                    radius={0.2}
                    color={0x755537}
                    type="valence"
                />
                <Html
                    transform
                    portal={{ current: gl.domElement.parentNode }}
                    distanceFactor={(SQUARE_SIDE * 400) / TILE_SIZE}
                    position={[0, 0, 0]}
                    ref={carbon}
                    style={{
                        opacity: 0,
                        width: TILE_SIZE,
                        height: TILE_SIZE,
                        backgroundColor: "#755537",
                    }}
                >
                    <ElementTile
                        fitContainer
                        elementName={"Carbon"}
                        elementSymbol={"C"}
                        massNum={12.011}
                        protonNum={6}
                    />
                </Html>
            </group>
        </>
    );
}
