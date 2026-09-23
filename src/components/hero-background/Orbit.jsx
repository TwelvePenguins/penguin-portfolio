import { useEffect, useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

export default function Orbit({
    orbitRadius,
    planetRadius,
    planetPosition,
    color,
    opacity,
    index,
}) {
    const RING_Z = -2.5;

    function findRingX(ringZ, sunX, cameraZ) {
        const lamda = (cameraZ - ringZ) / cameraZ;
        const mu = sunX * lamda;
        return mu;
    }

    const material = useMemo(() => {
        return new THREE.MeshBasicMaterial({
            color,
            opacity: 1,
            transparent: true,
        });
    }, [color]);

    useFrame(() => {
        const delay = index * 0.12;

        material.opacity = THREE.MathUtils.clamp(
            (opacity.current - delay) / (1 - delay),
            0,
            1,
        );
    });

    return (
        <>
            <mesh
                position={[findRingX(RING_Z, -2.5, 3) - 0.5, 0, RING_Z]}
                material={material}
            >
                <ringGeometry args={[orbitRadius - 0.02, orbitRadius, 64]} />
            </mesh>
            <mesh
                position={[planetPosition[0], planetPosition[1], RING_Z]}
                material={material}
            >
                <ringGeometry args={[planetRadius - 0.02, planetRadius, 64]} />
            </mesh>
        </>
    );
}
