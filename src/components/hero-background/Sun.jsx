import { useFrame } from "@react-three/fiber";
import { useRef } from "react";

export default function Sun({ texture }) {
    const sun = useRef();

    useFrame((state, delta) => {
        sun.current.rotation.y += delta / 10;
    })

    return (
        <mesh position={[-2.5, 0, 0]} ref={sun}>
            <sphereGeometry args={[1, 32, 32]} />
            <meshStandardMaterial
                map={texture}
                emissive={0xffffff}
                emissiveMap={texture}
                emissiveIntensity={1}
            />
        </mesh>
    );
}
