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
            100
        );
        camera.position.z = 3;

        const scene = new THREE.Scene();

        const geo = new THREE.SphereGeometry(1, 12, 12);
        const sunMaterial = new THREE.MeshPhongMaterial({color: 0x44aa88, flatShading: true})

        const sun = new THREE.Mesh(geo, sunMaterial);
        scene.add(sun);
        sun.position.set(-2.5, 0, 0)
        
        const europaMaterial = new THREE.MeshPhongMaterial({color: 0x6e312c, flatShading: true})
        const europa = new THREE.Mesh(geo, europaMaterial);
        scene.add(europa);
        europa.position.set(6, 3, -5);

        const asteroidMat = new THREE.MeshPhongMaterial({color: 0x6b6b6b, flatShading: true})
        const asteroid = new THREE.Mesh(geo, asteroidMat);
        scene.add(asteroid);
        asteroid.position.set(8, -4, -10);

        renderer.setAnimationLoop((time) => {
            time *= 0.001;
           
            sun.rotation.y = time/10;
            europa.rotation.y = time;
            asteroid.rotation.x = time;
            asteroid.rotation.y = time*3;
           
            renderer.render(scene, camera);
        });

        const light = new THREE.DirectionalLight(0xFFFFFF, 3);
        light.position.set(2, 2, 4);
        scene.add(light);

        return () => {
            renderer.setAnimationLoop(null);
            geo.dispose();
            sunMaterial.dispose();
            europaMaterial.dispose();
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