import * as THREE from "three";
import styles from "./ThreeMolecule.module.css";
import europaMap from "../../assets/Europa_Test.jpg";
import sunMap from "../../assets/Sun_Test_2k.jpg";
import bennuMap from "../../assets/Bennu_Test.jpg";
import { useEffect, useRef } from "react";
import { color } from "three/tsl";

export default function ThreeMolecule() {
    const canvasRef = useRef(null);
    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        const renderer = new THREE.WebGLRenderer({
            antialias: true,
            canvas,
        });

        const camera = new THREE.PerspectiveCamera(
            75,
            canvas.clientWidth / canvas.clientHeight,
            0.1,
            100,
        );

        const resizeObserver = new ResizeObserver(() => {
            renderer.setSize(canvas.clientWidth, canvas.clientHeight, false);
            camera.aspect = canvas.clientWidth / canvas.clientHeight;
            camera.updateProjectionMatrix();
        });

        resizeObserver.observe(canvas);

        const CAMERA_Z = 3;

        camera.position.z = CAMERA_Z;

        const scene = new THREE.Scene();

        const loader = new THREE.TextureLoader();

        const geo = new THREE.SphereGeometry(1, 32, 32);

        const SUN_X = -2.5;

        const sunTexture = loader.load(sunMap);
        sunTexture.colorSpace = THREE.SRGBColorSpace;
        const sunMaterial = new THREE.MeshPhongMaterial({ map: sunTexture });
        const sun = new THREE.Mesh(geo, sunMaterial);
        scene.add(sun);
        sun.position.set(SUN_X, 0, 0);

        const radiusList = [3.75, 5, 6, 7.5, 9.5];
        const colorList = [0x8c8062, 0xb97a57, 0x4f7a5c, 0x824e4f, 0xc99a22];
        const RING_Z = -2.5;

        function findRingX(ringZ, sunX, cameraZ) {
            const lamda = (cameraZ - ringZ) / cameraZ;
            const mu = sunX * lamda;
            return mu;
        }

        for (let i = 0; i < radiusList.length; i++) {
            const radius = radiusList[i];
            const color = colorList[i];

            const ringGeo = new THREE.RingGeometry(radius - 0.02, radius, 64);
            const ringMaterial = new THREE.MeshBasicMaterial({
                color: color,
                opacity: 0,
            });
            const ring = new THREE.Mesh(ringGeo, ringMaterial);
            scene.add(ring);
            ring.position.set(findRingX(RING_Z, SUN_X, CAMERA_Z) - 0.5, 0, RING_Z);
        }

        const europaTexture = loader.load(europaMap);
        europaTexture.colorSpace = THREE.SRGBColorSpace;
        const europaMaterial = new THREE.MeshPhongMaterial({
            map: europaTexture,
        });
        const europa = new THREE.Mesh(geo, europaMaterial);
        scene.add(europa);
        europa.position.set(8, 3, -5);

        const asteroidTexture = loader.load(bennuMap);
        asteroidTexture.colorSpace = THREE.SRGBColorSpace;
        const asteroidMat = new THREE.MeshPhongMaterial({
            map: asteroidTexture,
        });
        const asteroid = new THREE.Mesh(geo, asteroidMat);
        scene.add(asteroid);
        asteroid.position.set(8, -4, -10);

        renderer.setAnimationLoop((time) => {
            time *= 0.001;

            sun.rotation.y = time / 10;
            europa.rotation.y = time;
            asteroid.rotation.x = time;
            asteroid.rotation.y = time * 3;

            renderer.render(scene, camera);
        });

        const light = new THREE.DirectionalLight(0xffffff, 3);
        light.position.set(2, 2, 4);
        scene.add(light);

        return () => {
            resizeObserver.disconnect();
            renderer.setAnimationLoop(null);
            geo.dispose();
            sunMaterial.dispose();
            europaMaterial.dispose();
            renderer.dispose();
        };
    }, []);

    return (
        <canvas
            ref={canvasRef}
            style={{
                width: "100%",
                height: "100%",
                display: "block",
            }}
        />
    );
}
