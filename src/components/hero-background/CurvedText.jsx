import { Text } from "@react-three/drei";

export default function CurvedText({ position, curvature, radius, content, fontSize }) {
    //Curvature in radians, up to +/- pi
    //Curvature cannot be 0
    //Content length cannot be 1

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
                color="ffffff"
                position={[xOffset, yOffset, 0]}
                fontSize={fontSize}
                key={index}
                rotation={[0, 0, -angleToPoint]}
                anchorX={"center"}
                anchorY={"middle"}
            ></Text>
        );
    });

    return <group position={position}>{letterElements}</group>;
}
