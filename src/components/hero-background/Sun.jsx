import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { easedIn, easedOut } from "./animationUtils";

export default function Sun({ texture, animationProgress }) {
    const sun = useRef();
    const sunTexturedMat = useRef();
    const sunGlowOrbMat = useRef();

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

            sunTexturedMat.current.opacity = textureOpacity;
            sunGlowOrbMat.current.opacity = 1 - textureOpacity;
        } else {
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
        }
        sun.current.scale.setScalar(scale);
    });

    return (
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
    );
}
