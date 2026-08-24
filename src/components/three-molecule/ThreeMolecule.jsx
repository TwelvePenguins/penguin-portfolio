import * as THREE from "three";
import styles from "./ThreeMolecule.module.css";
import { useEffect, useRef } from "react";

export default function ThreeMolecule() {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        const renderer = new THREE.WebGLRenderer({
            antialias: true,
            canvas
        })

        const camera = new THREE.PerspectiveCamera(
            75, 
            canvas.clientWidth / canvas.clientHeight,
            0.1, 
            5
        );
        camera.position.z = 2;

        const scene = new THREE.Scene();
    }, [])
}