import { useRef } from "react";
import { useFrame } from "@react-three/fiber";

export default function Bennu({ texture }) {
    const bennu = useRef();
    useFrame((state, delta) => {
        bennu.current.rotation.y += delta;
        bennu.current.rotation.x += delta;
    });

    return (
        <mesh position={[7, -6, -10]} ref={bennu}>
            <sphereGeometry args={[1, 32, 32]} />
            <meshPhongMaterial map={texture} />
        </mesh>
    );
}
