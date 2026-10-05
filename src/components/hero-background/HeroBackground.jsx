import { Canvas } from "@react-three/fiber";
import {
    Bloom,
    EffectComposer,
    ToneMapping,
} from "@react-three/postprocessing";
import { ToneMappingMode } from "postprocessing";
import HeroScene from "./HeroScene";
import CameraRig from "./CameraRig";

export default function HeroBackground({ eventSource, animationMarkerRef }) {
    return (
        <Canvas
            camera={{ position: [0, 0, 3], fov: 75 }}
            eventSource={eventSource}
            eventPrefix="client"
        >
            <CameraRig />
            <HeroScene animationMarkerRef={animationMarkerRef} />
            <EffectComposer>
                <Bloom
                    mipmapBlur
                    luminanceThreshold={1}
                    luminanceSmoothing={0.2}
                    intensity={0.8}
                />
                {/* Map HDR colors to the display after extracting the bloom. */}
                <ToneMapping mode={ToneMappingMode.ACES_FILMIC} />
            </EffectComposer>
        </Canvas>
    );
}
