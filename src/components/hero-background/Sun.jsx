import { useEffect, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { easedIn, easedOut } from "./animationUtils";

export default function Sun({ texture, animationProgress }) {
    const sun = useRef();
    const sunBohr = useRef();
    const sunTexturedMat = useRef();
    const sunGlowOrbMat = useRef();

    useEffect(() => {
        sunBohr.current.scale.setScalar(0);
    }, [])

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
            const bohrOpacity = THREE.MathUtils.lerp(
                0, 
                1, 
                easedOut(animationProgress.current.expand)
            )

            const bohrScale = THREE.MathUtils.lerp(
                0, 
                1, 
                easedOut(animationProgress.current.expand)
            )

            sunBohr.current.opacity = bohrOpacity;
            sunBohr.current.scale.setScalar(bohrScale);
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
            <group position={[-2.5, 0, 0]} ref={sunBohr} opacity={0} transparent>
                <mesh>
                    <meshBasicMaterial color={"#ff9640"} opacity={0.3} transparent />
                    <ringGeometry args={[0.49, 0.5, 64]} />
                </mesh>
                <mesh position={[0, 0.49, 0]}>
                    <meshBasicMaterial color={"#ff9640"} opacity={0.3} transparent />
                    <ringGeometry args={[0.04, 0.05, 64]} />
                </mesh>
            </group>
        </>
    );
}
