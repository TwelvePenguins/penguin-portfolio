import { useRef, useMemo } from "react";
import * as THREE from "three";

export default function Sun({ texture }) {
    const sun = useRef();
    const glowTexture = useMemo(() => {
        const canvas = document.createElement("canvas");
        canvas.width = 256;
        canvas.height = 256;

        const ctx = canvas.getContext("2d");

        const gradient = ctx.createRadialGradient(128, 128, 0, 128, 128, 128);

        gradient.addColorStop(0, "rgba(255, 200, 100, 1)");
        gradient.addColorStop(0.2, "rgba(255, 150, 50, 0.6)");
        gradient.addColorStop(1, "rgba(255, 100, 0, 0)");

        ctx.fillStyle = gradient;
        ctx.fillRect(0, 0, 256, 256);

        return new THREE.CanvasTexture(canvas);
    }, []);

    return (
        <>
            <mesh position={[-2.5, 0, 0]} ref={sun}>
                <sphereGeometry args={[1, 32, 32]} />
                <meshStandardMaterial
                    map={texture}
                    emissive={0xffffff}
                    emissiveMap={texture}
                    emissiveIntensity={1}
                />
            </mesh>
            <sprite position={[-2.75, 0, 0]} scale={[4, 4, 1]}>
                <spriteMaterial
                    map={glowTexture}
                    transparent={true}
                    blending={THREE.AdditiveBlending}
                    depthWrite={false}
                />
            </sprite>
        </>
    );
}
