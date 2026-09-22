import { Text } from "@react-three/drei";
import { useFrame } from "@react-three/fiber";
import { useRef, useState } from "react";
import * as THREE from "three";

export default function CurvedText({
    position,
    curvature,
    radius,
    content,
    fontSize,
    order,
}) {
    //Curvature in radians, up to +/- pi
    //Curvature cannot be 0
    //Content length cannot be 1

    let ringOpacity = useRef(0);
    const FADE_START = 0;
    const FADE_END = 486;
    const [opacity, setOpacity] = useState(0);

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

        const delay = order * 0.12;

        setOpacity(
            THREE.MathUtils.clamp(
                (ringOpacity.current - delay) / (1 - delay),
                0,
                1,
            ),
        );
    });

    const textArray = content.split("");
    const midpoint = (textArray.length - 1) / 2;
    const curvatureUnit = curvature / (textArray.length - 1);

    const letterElements = textArray.map((letter, index) => {
        const angleToPoint = curvatureUnit * (midpoint - index) * -1;
        const xOffset = radius * Math.sin(angleToPoint);
        const yOffset = radius * (1 - Math.cos(angleToPoint)) * -1;

        return (
            <Text
                text={letter}
                color="white"
                position={[xOffset, yOffset, 0]}
                fontSize={fontSize}
                key={index}
                rotation={[0, 0, -angleToPoint]}
                anchorX={"center"}
                anchorY={"middle"}
                fillOpacity={opacity}
            ></Text>
        );
    });

    return <group position={position}>{letterElements}</group>;
}
