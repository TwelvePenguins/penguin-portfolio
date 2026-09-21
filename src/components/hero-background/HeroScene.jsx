import europaMap from "../../assets/Europa_Test.jpg";
import sunMap from "../../assets/Sun_Test_2k.jpg";
import bennuMap from "../../assets/Bennu_Test.jpg";
import { useFrame, useLoader } from "@react-three/fiber";
import { TextureLoader } from "three";
import Sun from "./Sun";
import Europa from "./Europa";
import Bennu from "./Bennu";
import Orbit from "./Orbit";
import * as THREE from "three";
import CurvedText from "./CurvedText";

export default function HeroScene() {
    const [europaTexture, sunTexture, bennuTexture] = useLoader(TextureLoader, [
        europaMap,
        sunMap,
        bennuMap,
    ]);

    useFrame((state) => {
        state.camera.position.x = THREE.MathUtils.lerp(
            state.camera.position.x,
            state.pointer.x * 0.2,
            0.1,
        );

        state.camera.position.y = THREE.MathUtils.lerp(
            state.camera.position.y,
            state.pointer.y * 0.2,
            0.1,
        );
    });

    const orbitRadiusList = [3.75, 5, 6, 7.5, 9.5];
    const planetRadiusList = [0.15, 0.2, 0.3, 0.4, 1];
    const planetPositionXY = [
        [-7, 3.2],
        [-1.1, -3],
        [0.4, 2.4],
        [1.25, -4],
        [4, 2.3],
    ];
    const colorList = [0x8c8062, 0xb97a57, 0x4f7a5c, 0x824e4f, 0xc99a22];

    const orbits = [];

    for (let i = 0; i < orbitRadiusList.length; i++) {
        const orbitRadius = orbitRadiusList[i];
        const planetRadius = planetRadiusList[i];
        const planetPosition = planetPositionXY[i];
        const color = colorList[i];

        orbits.push(
            <Orbit
                orbitRadius={orbitRadius}
                planetRadius={planetRadius}
                planetPosition={planetPosition}
                color={color}
                key={planetPosition.join(",")}
                index={i}
            />,
        );
    }

    return (
        <>
            <ambientLight intensity={0.5} />
            <directionalLight
                color="white"
                position={[-2, 0, 0]}
                target-position={[10, 0, 0]}
            />
            <Sun texture={sunTexture} />
            <Europa texture={europaTexture} />
            <Bennu texture={bennuTexture} />
            {orbits}
            <CurvedText content={"Sun"} position={[-2.75, 1.3, 0]} curvature={Math.PI / 10} radius={2} fontSize={0.2} order={0}/>
            <CurvedText content={"Europa"} position={[9.4, 4, -5]} curvature={Math.PI / 3} radius={2} fontSize={0.3} order={3}/>
            <CurvedText content={"Asteroid Bennu"} position={[7, -4.25, -10]} curvature={Math.PI / 1.5} radius={2} fontSize={0.4} order={4}/>
        </>
    );
}
