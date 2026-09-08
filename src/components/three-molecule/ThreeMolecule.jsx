import * as THREE from "three";
import europaMap from "../../assets/Europa_Test.jpg";
import sunMap from "../../assets/Sun_Test_2k.jpg";
import bennuMap from "../../assets/Bennu_Test.jpg";
import { useEffect, useRef } from "react";

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
        const sunMaterial = new THREE.MeshStandardMaterial({
            map: sunTexture,
            emissive: 0xffffff,
            emissiveMap: sunTexture,
            emissiveIntensity: 1,
        });
        const sun = new THREE.Mesh(geo, sunMaterial);
        scene.add(sun);
        sun.position.set(SUN_X, 0, 0);

        const orbitRadiusList = [3.75, 5, 6, 7.5, 9.5];
        const planetRadiusList = [0.15, 0.2, 0.3, 0.4, 1];
        const planetPositionXY = [
            [-7, 3.2],
            [-1.1, -3],
            [0.4, 2.4],
            [1.25, -4],
            [4, 2.3],
        ];
        const colorList = [0x8c8062, 0xb97a57, 0x4f7a5c, 0x824e4f, 0xc99a22];
        const RING_Z = -2.5;
        const ringMaterials = [];

        function findRingX(ringZ, sunX, cameraZ) {
            const lamda = (cameraZ - ringZ) / cameraZ;
            const mu = sunX * lamda;
            return mu;
        }

        for (let i = 0; i < orbitRadiusList.length; i++) {
            const orbitRadius = orbitRadiusList[i];
            const planetRadius = planetRadiusList[i];
            const planetPosition = planetPositionXY[i];
            const color = colorList[i];

            const orbitGeo = new THREE.RingGeometry(
                orbitRadius - 0.02,
                orbitRadius,
                64,
            );
            const planetGeo = new THREE.RingGeometry(
                planetRadius - 0.02,
                planetRadius,
                64,
            );
            const ringMaterial = new THREE.MeshBasicMaterial({
                color: color,
                opacity: 0,
                transparent: true,
            });
            ringMaterials.push(ringMaterial);
            const orbit = new THREE.Mesh(orbitGeo, ringMaterial);
            const planet = new THREE.Mesh(planetGeo, ringMaterial);
            scene.add(orbit);
            orbit.position.set(
                findRingX(RING_Z, SUN_X, CAMERA_Z) - 0.5,
                0,
                RING_Z,
            );
            scene.add(planet);
            planet.position.set(planetPosition[0], planetPosition[1], RING_Z);
        }

        const europaTexture = loader.load(europaMap);
        europaTexture.colorSpace = THREE.SRGBColorSpace;
        const europaMaterial = new THREE.MeshPhongMaterial({
            map: europaTexture,
        });
        const europa = new THREE.Mesh(geo, europaMaterial);
        scene.add(europa);
        europa.position.set(9, 2.5, -5);

        const asteroidTexture = loader.load(bennuMap);
        asteroidTexture.colorSpace = THREE.SRGBColorSpace;
        const asteroidMat = new THREE.MeshPhongMaterial({
            map: asteroidTexture,
        });
        const asteroid = new THREE.Mesh(geo, asteroidMat);
        scene.add(asteroid);
        asteroid.position.set(7, -6, -10);

        let targetRingOpacity = 0;
        let ringOpacity = 0;

        const FADE_START = 0;
        const FADE_END = 486;

        function handleScroll() {
            targetRingOpacity = THREE.MathUtils.clamp(
                (window.scrollY - FADE_START) / (FADE_END - FADE_START),
                0,
                1,
            );
        }

        window.addEventListener("scroll", handleScroll);
        handleScroll();

        let normalisedCursorPos = [0, 0];

        function handlePointerMove(event) {
            normalisedCursorPos = [
                (event.clientX / canvas.clientWidth) * 2 - 1,
                -(event.clientY / canvas.clientHeight) * 2 + 1,
            ];
        }

        window.addEventListener("pointermove", handlePointerMove);

        renderer.setAnimationLoop((time) => {
            time *= 0.001;

            sun.rotation.y = time / 10;
            europa.rotation.y = time;
            asteroid.rotation.x = time;
            asteroid.rotation.y = time * 3;

            camera.position.x = THREE.MathUtils.lerp(
                camera.position.x,
                normalisedCursorPos[0] * 0.2,
                0.1,
            );

            camera.position.y = THREE.MathUtils.lerp(
                camera.position.y,
                normalisedCursorPos[1] * 0.2,
                0.1,
            );

            ringOpacity = THREE.MathUtils.lerp(
                ringOpacity,
                targetRingOpacity,
                0.08,
            );

            ringMaterials.forEach((material, i) => {
                const delay = i * 0.12;

                material.opacity = THREE.MathUtils.clamp(
                    (ringOpacity - delay) / (1 - delay),
                    0,
                    1,
                );
            });

            renderer.render(scene, camera);
        });

        const light = new THREE.DirectionalLight(0xffffff, 3);
        light.position.set(-2, 0, 0);
        light.target.position.set(10, 0, 0);
        scene.add(light);

        return () => {
            resizeObserver.disconnect();
            window.removeEventListener("scroll", handleScroll);
            window.removeEventListener("pointermove", handlePointerMove);
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
