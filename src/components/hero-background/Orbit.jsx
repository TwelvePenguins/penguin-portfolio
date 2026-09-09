import { MeshBasicMaterial, RingGeometry } from "three";

export default function Orbit({
    orbitRadius,
    planetRadius,
    planetPosition,
    material,
}) {
    const RING_Z = -2.5;

    function findRingX(ringZ, sunX, cameraZ) {
        const lamda = (cameraZ - ringZ) / cameraZ;
        const mu = sunX * lamda;
        return mu;
    }

    return (
        <>
            <mesh position={[findRingX(RING_Z, -2.5, 3) - 0.5, 0, RING_Z]} material={material}>
                <ringGeometry args={[orbitRadius - 0.02, orbitRadius, 64]} />
            </mesh>
            <mesh position={[planetPosition[0], planetPosition[1], RING_Z]} material={material}>
                <ringGeometry args={[planetRadius - 0.02, planetRadius, 64]} />
            </mesh>
        </>
    );
}
