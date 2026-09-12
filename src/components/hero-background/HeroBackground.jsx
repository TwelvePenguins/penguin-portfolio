import { Canvas } from "@react-three/fiber";
import HeroScene from "./HeroScene";

export default function HeroBackground() {
    return (
        <Canvas camera={{ position: [0, 0, 3], fov: 75 }}>
            <HeroScene/>
        </Canvas>
    );
}
