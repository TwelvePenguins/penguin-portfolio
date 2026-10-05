import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

export default function CameraRig() {
    useFrame((state, delta) => {
        state.camera.position.x = THREE.MathUtils.damp(
            state.camera.position.x,
            state.pointer.x * 0.2,
            10,
            delta,
        );

        state.camera.position.y = THREE.MathUtils.damp(
            state.camera.position.y,
            state.pointer.y * 0.2,
            10,
            delta,
        );
    });
    return <></>;
}
