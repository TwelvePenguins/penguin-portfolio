import { Line } from "@react-three/drei";
import { useFrame } from "@react-three/fiber";
import { useContext, useMemo, useRef } from "react";
import * as THREE from "three";
import { easedIn } from "./animationUtils";
import { AnimationProgressContext } from "../../contexts/AnimationProgressContext";

export default function FlatCircleLine({
    thickness,
    radius,
    segments = 64,
    color,
    intensity = 7,
    opacity = 1,
    position = [0, 0, 0],
    type = "electron",
}) {
    const animationProgress = useContext(AnimationProgressContext);
    if (segments % 4 !== 0) {
        throw new Error("FlatCircleLine: segments must be divisible by 4.");
    }
    const lineRef = useRef();
    const threeColor = new THREE.Color(color);
    const RGBColor = [
        threeColor.r * intensity,
        threeColor.g * intensity,
        threeColor.b * intensity,
    ];

    const { circlePoints, squarePoints } = useMemo(() => {
        const circlePoints = [];
        const squarePoints = [];

        const pointsPerEdge = segments / 4;
        const squareWidth = radius * Math.sin(Math.PI / 4) * 2;
        const squareXYConstants = [
            [0, -1],
            [-1, 0],
            [0, 1],
            [1, 0],
        ];

        for (let i = 0; i < 4; i++) {
            const edgePoints = [];
            const cornerX = radius * Math.sin(Math.PI / 4 + (Math.PI / 2) * i);
            const cornerY = radius * Math.cos(Math.PI / 4 + (Math.PI / 2) * i);
            edgePoints.push([cornerX, cornerY, 0]);

            for (let j = 1; j <= 15; j++) {
                const pointX =
                    cornerX +
                    squareWidth * (j / pointsPerEdge) * squareXYConstants[i][0];
                const pointY =
                    cornerY +
                    squareWidth * (j / pointsPerEdge) * squareXYConstants[i][1];
                edgePoints.push([pointX, pointY, 0]);
            }

            squarePoints.push(...edgePoints);
        }

        squarePoints.push([
            radius * Math.sin(Math.PI / 4),
            radius * Math.cos(Math.PI / 4),
            0,
        ]);

        const angleBetweenSegments = (Math.PI * 2) / segments;
        for (let i = 0; i <= segments; i++) {
            const currentAngle = angleBetweenSegments * i;
            const x = radius * Math.sin(currentAngle);
            const y = radius * Math.cos(currentAngle);

            circlePoints.push([x, y, 0]);
        }
        return { circlePoints, squarePoints };
    }, [radius, segments]);

    useFrame(() => {
        if (!lineRef.current) return;

        if (type === "shell") {
            const pointsRendered = circlePoints.map((coords, index) => {
                const newCoords = [];
                for (let i = 0; i < 2; i++) {
                    newCoords.push(
                        THREE.MathUtils.lerp(
                            coords[i],
                            squarePoints[index][i],
                            easedIn(animationProgress.current.elementMorph),
                        ),
                    );
                }
                newCoords.push(0);
                return newCoords;
            });
            lineRef.current.geometry.setPositions(pointsRendered.flat());
        } else if (type === "electron") {
            const translationProgress = THREE.MathUtils.clamp(
                animationProgress.current.elementMorph * 2,
                0,
                1,
            );

            const translatedX = THREE.MathUtils.lerp(
                position[0],
                0,
                easedIn(translationProgress),
            );

            const translatedY = THREE.MathUtils.lerp(
                position[1],
                0,
                easedIn(translationProgress),
            );

            const opacity = THREE.MathUtils.lerp(
                1,
                0,
                easedIn(translationProgress),
            );

            lineRef.current.position.x = translatedX;
            lineRef.current.position.y = translatedY;
            lineRef.current.material.opacity = opacity;
        }
    });

    return (
        <Line
            ref={lineRef}
            points={circlePoints}
            color={RGBColor}
            lineWidth={thickness}
            transparent
            opacity={opacity}
            position={position}
            toneMapped={false}
        />
    );
}
