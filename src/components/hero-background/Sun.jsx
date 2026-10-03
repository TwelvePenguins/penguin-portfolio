import { useRef } from "react";
import { useFrame } from "@react-three/fiber";

export default function Sun({ texture, scale, textureOpacity }) {
    const sun = useRef();
    const sunTexturedMat = useRef();
    const sunGlowOrbMat = useRef();

    useFrame(() => {
        sun.current.scale.setScalar(scale.current);
        sunTexturedMat.current.opacity = textureOpacity.current;
        sunGlowOrbMat.current.opacity = 1 - textureOpacity.current;
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
                    emissiveIntensity={4}
                    toneMapped={false}
                    transparent
                    opacity={0}
                    ref={sunGlowOrbMat}
                />
            </mesh>
        </group>
    );
}
