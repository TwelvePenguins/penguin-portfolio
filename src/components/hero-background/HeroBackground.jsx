import europaMap from "../../assets/Europa_Test.jpg";
import sunMap from "../../assets/Sun_Test_2k.jpg";
import bennuMap from "../../assets/Bennu_Test.jpg";
import { Canvas, useLoader } from "@react-three/fiber";
import { TextureLoader } from "three";
import Sun from "./Sun";
import Europa from "./Europa";
import Bennu from "./Bennu";

export default function HeroBackground() {
    const [europaTexture, sunTexture, bennuTexture] = useLoader(TextureLoader, [
        europaMap,
        sunMap,
        bennuMap,
    ]);

    return (
        <Canvas
            camera={{ position: [0, 0, 3], fov: 75 }}
        >
            <ambientLight intensity={0.5}/>
            <directionalLight color="white" position={[-2, 0, 0]} target-position={[10, 0, 0]}/>
            <Sun texture={sunTexture} />
            <Europa texture={europaTexture} />
            <Bennu texture={bennuTexture} />
        </Canvas>
    );
}
