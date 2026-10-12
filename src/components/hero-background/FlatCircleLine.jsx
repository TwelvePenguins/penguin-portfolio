import { Line } from "@react-three/drei";

export default function FlatCircleLine({
    thickness,
    radius,
    segments = 64,
    color,
    opacity = 1,
    position = [0, 0, 0]
}) {
    const pointArray = [];

    const angleBetweenSegments = (Math.PI * 2) / segments;
    for (let i = 0; i <= segments; i++) {
        const currentAngle = angleBetweenSegments * i;
        const x = radius * Math.sin(currentAngle);
        const y = radius * Math.cos(currentAngle);

        pointArray.push([x, y, 0]);
    }

    return (
        <Line
            points={pointArray}
            color={color}
            lineWidth={thickness}
            transparent
            opacity={opacity}
            position={position}
        />
    );
}
