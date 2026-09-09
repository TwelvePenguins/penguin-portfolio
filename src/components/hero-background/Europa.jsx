import { useFrame } from "@react-three/fiber";
import { useRef } from "react";

export default function Europa({ texture }) {
    const europa = useRef();
    useFrame((state, delta ) => {
        europa.current.rotation.y += delta;
    })

    return (
        <mesh position={[9, 2.5, -5]} ref={europa}>
            <sphereGeometry args={[1, 32, 32]} />
            <meshPhongMaterial map={texture} />
        </mesh>
    );
}
