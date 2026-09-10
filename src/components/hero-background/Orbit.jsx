import { MeshBasicMaterial, RingGeometry } from "three";
import { useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

export default function Orbit({
    orbitRadius,
    planetRadius,
    planetPosition,
    color,
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
    let ringOpacity = useRef(0);

    const FADE_START = 0;
    const FADE_END = 486;

    useFrame(() => {
        const fadeProgress = THREE.MathUtils.clamp(
            (window.scrollY - FADE_START) / (FADE_END - FADE_START),
            0,
            1,
        );

        ringOpacity.current = THREE.MathUtils.lerp(
            ringOpacity.current,
            fadeProgress,
            0.08,
        );

        const delay = index * 0.12;

        material.opacity = THREE.MathUtils.clamp(
            (ringOpacity.current - delay) / (1 - delay),
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
