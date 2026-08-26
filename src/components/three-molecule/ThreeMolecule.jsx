import * as THREE from "three";
import styles from "./ThreeMolecule.module.css";
import { useEffect, useRef } from "react";

export default function ThreeMolecule() {
    const canvasRef = useRef(null);
    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        const renderer = new THREE.WebGLRenderer({
            antialias: true,
            canvas
        });
        renderer.setSize(canvas.clientWidth, canvas.clientHeight, false);

        const camera = new THREE.PerspectiveCamera(
            75, 
            canvas.clientWidth / canvas.clientHeight,
            0.1, 
            10
        );
        camera.position.z = 3;

        const scene = new THREE.Scene();

        const geo = new THREE.SphereGeometry(1, 12, 12);
        const material = new THREE.MeshPhongMaterial({color: 0x44aa88, flatShading: true})
        const sphere = new THREE.Mesh(geo, material);
        scene.add(sphere);
        sphere.position.set(-2, 0, 0)

        renderer.setAnimationLoop((time) => {
            time *= 0.001;
           
            sphere.rotation.x = time;
            sphere.rotation.y = time;
           
            renderer.render(scene, camera);
        });

        const light = new THREE.DirectionalLight(0xFFFFFF, 3);
        light.position.set(2, 2, 4);
        scene.add(light);

        return () => {
            renderer.setAnimationLoop(null);
            geo.dispose();
            material.dispose();
            renderer.dispose();
        }
    }, [])

    return (
        <canvas
            ref={canvasRef}
            style={{
                width: "100%",
                height: "100%",
                display: "block",
            }}
        />
    )
}