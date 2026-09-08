export default function Sun({ texture }) {
    return (
        <mesh position={[-2.5, 0, 0]}>
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
