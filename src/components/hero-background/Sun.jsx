import { useRef } from "react";
import GlowSprite from "./GlowSprite";
import { useFrame } from "@react-three/fiber";

export default function Sun({ texture, scale }) {
    const sun = useRef();
    const colorStops = [
        {pos: 0, color: "rgba(255, 200, 100, 1)"}, 
        {pos: 0.2, color: "rgba(255, 150, 50, 0.6)"}, 
        {pos: 1, color: "rgba(255, 100, 0, 0)"}
    ]

    useFrame(() => {
        sun.current.scale.setScalar(scale.current);
    })

    return (
        <group position={[-2.5, 0, 0]} ref={sun}>
            <mesh>
                <sphereGeometry args={[1, 32, 32]} />
                <meshStandardMaterial
                    map={texture}
                    emissive={0xffffff}
                    emissiveMap={texture}
                    emissiveIntensity={1}
                />
            </mesh>
            <GlowSprite scale={[5, 4, 1]} offset={[-0.2, 0, -0.01]} colorStops={colorStops}/>
        </group>
    );
}
