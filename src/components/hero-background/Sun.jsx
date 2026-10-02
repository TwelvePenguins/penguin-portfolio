import { useRef } from "react";
import { useFrame } from "@react-three/fiber";

export default function Sun({ texture, scale }) {
    const sun = useRef();

    useFrame(() => {
        sun.current.scale.setScalar(scale.current);
    });

    return (
        <group position={[-2.5, 0, 0]} ref={sun}>
            <mesh>
                <sphereGeometry args={[1, 32, 32]} />
                <meshStandardMaterial
                    color="#ff9632"
                    map={texture}
                    emissive={0xffffff}
                    emissiveMap={texture}
                    // HDR emission lets the sun pass the bloom threshold.
                    emissiveIntensity={3}
                    toneMapped={false}
                />
            </mesh>
        </group>
    );
}
