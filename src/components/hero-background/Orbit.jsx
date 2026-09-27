import { useEffect, useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

export default function Orbit({ orbitDetails, opacity, index }) {
    const { orbitRadius, planetRadius, planetPositionXY, color } =
        orbitDetails.current[index];
    const planetRef = useRef();
    const orbitRef = useRef();
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
        const current = orbitDetails.current[index];
        const delay = index * 0.12;

        material.opacity = THREE.MathUtils.clamp(
            (opacity.current - delay) / (1 - delay),
            0,
            1,
        );
        const orbitScale = current.orbitRadius / orbitRadius;
        const planetScale = current.planetRadius / planetRadius;
        orbitRef.current.scale.setScalar(orbitScale);
        planetRef.current.scale.setScalar(planetScale);

        planetRef.current.position.x = current.planetPositionXY[0];
        planetRef.current.position.y = current.planetPositionXY[1];
    });

    return (
        <>
            <mesh
                position={[findRingX(RING_Z, -2.5, 3) - 0.5, 0, RING_Z]}
                material={material}
                ref={orbitRef}
            >
                <ringGeometry args={[orbitRadius - 0.02, orbitRadius, 64]} />
            </mesh>
            <mesh
                position={[planetPositionXY[0], planetPositionXY[1], RING_Z]}
                material={material}
                ref={planetRef}
            >
                <ringGeometry args={[planetRadius - 0.02, planetRadius, 64]} />
            </mesh>
        </>
    );
}
