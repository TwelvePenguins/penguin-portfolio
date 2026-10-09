import { useFrame } from "@react-three/fiber";
import { useRef } from "react";
import * as THREE from "three";
import { easedOut } from "./animationUtils";

export default function Europa({ texture, animationProgress }) {
    const europa = useRef();
    const europaTexturedMat = useRef();
    const europaGlowMat = useRef();

    useFrame((_, delta) => {
        europa.current.rotation.y += delta;

        const scale = THREE.MathUtils.lerp(
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
    });

    return (
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
    );
}
