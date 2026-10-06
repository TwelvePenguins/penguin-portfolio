import { useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

export default function Orbit({
    orbitDetail,
    scrollProgress,
    index,
    animationProgress,
}) {
    const { orbitRadius, planetRadius, planetPositionXY, color } = orbitDetail;
    const planetRef = useRef();
    const orbitRef = useRef();
    const groupRef = useRef();
    const orbitOpacity = useRef(0);
    const RING_Z = -2.5;

    let currentOrbitRadius = orbitRadius;
    let currentPlanetRadius = planetRadius;
    let currentPlanetPositionX = planetPositionXY[0];
    let currentPlanetPositionY = planetPositionXY[1];
    let currentOrbitTranslationX = 0;

    function findRingX(ringZ, sunX, cameraZ) {
        const lamda = (cameraZ - ringZ) / cameraZ;
        const mu = sunX * lamda;
        return mu;
    }

    function easedIn(t) {
        return t ** 2;
    }

    function easedOut(t) {
        return 1 - Math.pow(1 - t, 3);
    }

    const material = useMemo(() => {
        return new THREE.MeshBasicMaterial({
            color,
            opacity: 1,
            transparent: true,
        });
    }, [color]);

    useFrame((_, delta) => {
        const delay = index * 0.12;

        orbitOpacity.current = THREE.MathUtils.damp(
            orbitOpacity.current,
            scrollProgress.current,
            10,
            delta,
        );

        material.opacity = THREE.MathUtils.clamp(
            (orbitOpacity.current - delay) / (1 - delay),
            0,
            1,
        );
        if (animationProgress.current.collapseRebound < 1) {
            currentOrbitRadius = THREE.MathUtils.lerp(
                orbitRadius,
                orbitRadius + 0.02,
                easedOut(animationProgress.current.collapseRebound),
            );
            currentPlanetPositionX = THREE.MathUtils.lerp(
                planetPositionXY[0],
                planetPositionXY[0] + 0.02,
                easedOut(animationProgress.current.collapseRebound),
            );
        } else {
            currentOrbitRadius = THREE.MathUtils.lerp(
                orbitRadius + 0.02,
                0,
                easedIn(animationProgress.current.collapse),
            );
            currentPlanetRadius = THREE.MathUtils.lerp(
                planetRadius,
                0,
                easedIn(animationProgress.current.collapse),
            );
            currentPlanetPositionX = THREE.MathUtils.lerp(
                planetPositionXY[0],
                -4,
                easedIn(animationProgress.current.collapse),
            );
            currentPlanetPositionY = THREE.MathUtils.lerp(
                planetPositionXY[1],
                0,
                easedIn(animationProgress.current.collapse),
            );
            currentOrbitTranslationX = THREE.MathUtils.lerp(
                0,
                0.5,
                easedIn(animationProgress.current.collapse),
            );
        }
        const orbitScale = currentOrbitRadius / orbitRadius;
        const planetScale = currentPlanetRadius / planetRadius;
        orbitRef.current.scale.setScalar(orbitScale);
        planetRef.current.scale.setScalar(planetScale);

        planetRef.current.position.x = currentPlanetPositionX;
        planetRef.current.position.y = currentPlanetPositionY;

        groupRef.current.position.x = currentOrbitTranslationX ?? 0;
    });

    return (
        <group ref={groupRef}>
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
        </group>
    );
}
