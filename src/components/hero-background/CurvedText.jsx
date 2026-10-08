import { Text } from "@react-three/drei";
import { useFrame } from "@react-three/fiber";
import { useRef, useState } from "react";
import * as THREE from "three";

export default function CurvedText({
    details,
    animationProgress,
    scrollProgress,
}) {
    //Curvature in radians, up to +/- pi
    //Curvature cannot be 0
    //Content length cannot be 1
    const {
        content,
        position,
        celestialPos,
        curvature,
        radius,
        fontSize,
        order,
    } = details;
    const ringOpacity = useRef(0);
    const groupRef = useRef();
    const letterRefs = useRef([]);
    const opacity = useRef(0);

    useFrame((_, delta) => {
        ringOpacity.current = THREE.MathUtils.damp(
            ringOpacity.current,
            scrollProgress.current,
            10,
            delta,
        );

        const delay = order * 0.12;

        opacity.current = THREE.MathUtils.clamp(
            (ringOpacity.current - delay) / (1 - delay),
            0,
            1,
        );

        if (animationProgress.current.collapse > 0) {
            opacity.current = THREE.MathUtils.lerp(
                1,
                0,
                animationProgress.current.collapse,
            );
        }

        let groupScale = THREE.MathUtils.lerp(
            1,
            0,
            animationProgress.current.collapse,
        );

        let positionX = THREE.MathUtils.lerp(
            position[0],
            celestialPos[0],
            animationProgress.current.collapse,
        );

        let positionY = THREE.MathUtils.lerp(
            position[1],
            celestialPos[1],
            animationProgress.current.collapse,
        );

        groupRef.current.scale.setScalar(groupScale);
        groupRef.current.position.x = positionX;
        groupRef.current.position.y = positionY;
        letterRefs.current.forEach((letter) => {
            if (letter) {
                letter.fillOpacity = opacity.current;
            }
        });
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
                ref={(element) => {
                    letterRefs.current[index] = element;
                }}
            ></Text>
        );
    });

    return (
        <group position={position} ref={groupRef}>
            {letterElements}
        </group>
    );
}
