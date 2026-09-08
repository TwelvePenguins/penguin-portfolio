export default function Bennu({ texture }) {
    return (
        <mesh position={[7, -6, -10]}>
            <sphereGeometry args={[1, 32, 32]} />
            <meshPhongMaterial map={texture} />
        </mesh>
    );
}
