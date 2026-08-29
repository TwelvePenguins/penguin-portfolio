import * as THREE from "three";
import styles from "./ThreeMolecule.module.css";
import europaMap from "../../assets/Europa_Test.jpg"
import sunMap from "../../assets/Sun_Test_2k.jpg"
import bennuMap from "../../assets/Bennu_Test.jpg"
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

        const loader = new THREE.TextureLoader();

        const geo = new THREE.SphereGeometry(1, 32, 32);
        
        const sunTexture = loader.load(sunMap);
        sunTexture.colorSpace = THREE.SRGBColorSpace;
        const sunMaterial = new THREE.MeshPhongMaterial({map: sunTexture})

        const sun = new THREE.Mesh(geo, sunMaterial);
        scene.add(sun);
        sun.position.set(-2.5, 0, 0)
        
        const europaTexture = loader.load(europaMap);
        europaTexture.colorSpace = THREE.SRGBColorSpace;
        const europaMaterial = new THREE.MeshPhongMaterial({map: europaTexture})

        const europa = new THREE.Mesh(geo, europaMaterial);
        scene.add(europa);
        europa.position.set(6, 3, -5);

        const asteroidTexture = loader.load(bennuMap);
        asteroidTexture.colorSpace = THREE.SRGBColorSpace;
        const asteroidMat = new THREE.MeshPhongMaterial({map: asteroidTexture})

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