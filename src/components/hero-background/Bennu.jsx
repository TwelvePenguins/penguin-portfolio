import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { easedOut } from "./animationUtils";

export default function Bennu({ texture, animationProgress }) {
    const bennu = useRef();
    const bennuTexturedMat = useRef();
    const bennuGlowMat = useRef();

    useFrame((_, delta) => {
        bennu.current.rotation.y += delta;
        bennu.current.rotation.x += delta;

        const scale = THREE.MathUtils.lerp(
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
    });

    return (
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
    );
}
