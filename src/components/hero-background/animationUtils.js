import * as THREE from "three";

function easedIn(t) {
    return t ** 2;
}

function easedOut(t) {
    return 1 - Math.pow(1 - t, 3);
}

function calcAnimationProgress(start, end, timerRef) {
    const duration = end - start;
    return THREE.MathUtils.clamp((timerRef.current - start) / duration, 0, 1);
}

export { easedIn, easedOut, calcAnimationProgress }