export default function Europa({ texture }) {
    return (
        <mesh position={[9, 2.5, -5]}>
            <sphereGeometry args={[1, 32, 32]} />
            <meshPhongMaterial map={texture} />
        </mesh>
    );
}
