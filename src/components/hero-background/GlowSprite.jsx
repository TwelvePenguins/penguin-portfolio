import * as THREE from "three";
import { useMemo } from "react";

export default function GlowSprite({ scale, offset, colorStops }) {
    const glowTexture = useMemo(() => {
        const canvas = document.createElement("canvas");
        canvas.width = 256;
        canvas.height = 256;

        const ctx = canvas.getContext("2d");

        const gradient = ctx.createRadialGradient(128, 128, 0, 128, 128, 128);

        for (const colorStop of colorStops) {
            console.log(colorStop)
            gradient.addColorStop(colorStop.pos, colorStop.color);
        }
        
        ctx.fillStyle = gradient;
        ctx.fillRect(0, 0, 256, 256);

        return new THREE.CanvasTexture(canvas);
    }, []);

    return (
        <sprite position={offset} scale={scale}>
            <spriteMaterial
                map={glowTexture}
                transparent={true}
                blending={THREE.AdditiveBlending}
                depthWrite={false}
            />
        </sprite>
    );
}
