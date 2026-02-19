import { useRef, useEffect } from "react";
import * as THREE from "three";

// Tuned for Webiro white background — mix-blend-mode:multiply makes white=transparent
const PARAMS = {
  colorLine: "#3a4dea",       // Webiro primary blue
  colorSignal: "#3a4dea",     // bright blue signal
  colorSignal2: "#c8a800",    // dark gold (saturated so multiply shows on white)
  useColor2: true,
  lineCount: 65,
  spreadHeight: 34,
  spreadDepth: 0,
  curveLength: 60,
  straightLength: 120,
  curvePower: 0.83,
  waveSpeed: 2.0,
  waveHeight: 0.14,
  lineOpacity: 0.35,
  signalCount: 55,
  speedGlobal: 0.4,
  trailLength: 5,
};

const SEGMENT_COUNT = 120;

interface Props {
  className?: string;
}

export function DataTunnel({ className = "" }: Props) {
  const mountRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = mountRef.current;
    if (!el) return;

    const W = el.clientWidth;
    const H = el.clientHeight;

    // ── Scene ─────────────────────────────────────────────────
    const scene = new THREE.Scene();
    // no background — renderer is transparent

    // ── Camera ───────────────────────────────────────────────
    const camera = new THREE.PerspectiveCamera(45, W / H, 1, 1000);
    camera.position.set(0, 0, 90);
    camera.lookAt(0, 0, 0);

    // ── Renderer (transparent — mix-blend-mode handles blending) ─
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setClearColor(0x000000, 0);
    renderer.setSize(W, H);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    el.appendChild(renderer.domElement);

    // ── Group — MIRRORED: scale.x = -1 so fan opens towards text (left) ─
    const contentGroup = new THREE.Group();
    // Center the group the same way as CodePen
    const posX = (PARAMS.curveLength - PARAMS.straightLength) / 2;
    contentGroup.position.set(posX, 0, 0);
    // Mirror: flip X so convergence point faces left (towards hero text)
    contentGroup.scale.x = -1;
    scene.add(contentGroup);

    // ── Path math ────────────────────────────────────────────
    function getPathPoint(t: number, lineIndex: number, time: number): THREE.Vector3 {
      const totalLen = PARAMS.curveLength + PARAMS.straightLength;
      const currentX = -PARAMS.curveLength + t * totalLen;
      let y = 0;
      const spreadFactor = (lineIndex / PARAMS.lineCount - 0.5) * 2;

      if (currentX < 0) {
        const ratio = (currentX + PARAMS.curveLength) / PARAMS.curveLength;
        let shapeFactor = (Math.cos(ratio * Math.PI) + 1) / 2;
        shapeFactor = Math.pow(shapeFactor, PARAMS.curvePower);
        y = spreadFactor * PARAMS.spreadHeight * shapeFactor;
        const wave =
          Math.sin(time * PARAMS.waveSpeed + currentX * 0.1 + lineIndex) *
          PARAMS.waveHeight * shapeFactor;
        y += wave;
      }
      return new THREE.Vector3(currentX, y, 0);
    }

    // ── Background line material ──────────────────────────────
    const bgMaterial = new THREE.LineBasicMaterial({
      color: PARAMS.colorLine,
      transparent: true,
      opacity: PARAMS.lineOpacity,
      depthWrite: false,
    });

    // ── Signal material (additive for glow look) ──────────────
    const signalMaterial = new THREE.LineBasicMaterial({
      vertexColors: true,
      blending: THREE.NormalBlending,
      depthWrite: false,
      depthTest: false,
      transparent: true,
    });

    const color1 = new THREE.Color(PARAMS.colorSignal);
    const color2 = new THREE.Color(PARAMS.colorSignal2);
    function pickColor() {
      return PARAMS.useColor2 && Math.random() > 0.5 ? color2 : color1;
    }

    // ── Build background lines ────────────────────────────────
    const backgroundLines: THREE.Line[] = [];

    for (let i = 0; i < PARAMS.lineCount; i++) {
      const geo = new THREE.BufferGeometry();
      const pos = new Float32Array(SEGMENT_COUNT * 3);
      geo.setAttribute("position", new THREE.BufferAttribute(pos, 3));
      const line = new THREE.Line(geo, bgMaterial);
      line.userData = { id: i };
      line.renderOrder = 0;
      contentGroup.add(line);
      backgroundLines.push(line);
    }

    // ── Signals ───────────────────────────────────────────────
    type Signal = {
      mesh: THREE.Line;
      laneIndex: number;
      speed: number;
      progress: number;
      history: THREE.Vector3[];
      assignedColor: THREE.Color;
    };

    const signals: Signal[] = [];
    const MAX_TRAIL = 150;

    const createSignal = () => {
      const geo = new THREE.BufferGeometry();
      const positions = new Float32Array(MAX_TRAIL * 3);
      const colors = new Float32Array(MAX_TRAIL * 3);
      geo.setAttribute("position", new THREE.BufferAttribute(positions, 3));
      geo.setAttribute("color", new THREE.BufferAttribute(colors, 3));
      const mesh = new THREE.Line(geo, signalMaterial);
      mesh.frustumCulled = false;
      mesh.renderOrder = 1;
      contentGroup.add(mesh);
      signals.push({
        mesh,
        laneIndex: Math.floor(Math.random() * PARAMS.lineCount),
        speed: 0.2 + Math.random() * 0.5,
        progress: Math.random(),
        history: [],
        assignedColor: pickColor(),
      });
    };

    for (let i = 0; i < PARAMS.signalCount; i++) createSignal();

    // ── Animation loop ────────────────────────────────────────
    const clock = new THREE.Clock();
    let rafId: number;
    let alive = true;

    function animate() {
      if (!alive) return;
      rafId = requestAnimationFrame(animate);
      const time = clock.getElapsedTime();

      // Update background lines
      backgroundLines.forEach((line) => {
        const positions = line.geometry.attributes.position.array as Float32Array;
        const id = line.userData.id;
        for (let j = 0; j < SEGMENT_COUNT; j++) {
          const t = j / (SEGMENT_COUNT - 1);
          const v = getPathPoint(t, id, time);
          positions[j * 3] = v.x;
          positions[j * 3 + 1] = v.y;
          positions[j * 3 + 2] = v.z;
        }
        line.geometry.attributes.position.needsUpdate = true;
      });

      // Update signals
      signals.forEach((sig) => {
        sig.progress += sig.speed * 0.005 * PARAMS.speedGlobal;
        if (sig.progress > 1.0) {
          sig.progress = 0;
          sig.laneIndex = Math.floor(Math.random() * PARAMS.lineCount);
          sig.history = [];
          sig.assignedColor = pickColor();
        }

        const pos = getPathPoint(sig.progress, sig.laneIndex, time);
        sig.history.push(pos);
        if (sig.history.length > PARAMS.trailLength + 1) sig.history.shift();

        const positions = sig.mesh.geometry.attributes.position.array as Float32Array;
        const colors = sig.mesh.geometry.attributes.color.array as Float32Array;
        const drawCount = Math.max(1, PARAMS.trailLength);
        const len = sig.history.length;

        for (let i = 0; i < drawCount; i++) {
          let idx = len - 1 - i;
          if (idx < 0) idx = 0;
          const p = sig.history[idx] || new THREE.Vector3();
          positions[i * 3] = p.x;
          positions[i * 3 + 1] = p.y;
          positions[i * 3 + 2] = p.z;
          const alpha = PARAMS.trailLength > 0 ? Math.max(0, 1 - i / PARAMS.trailLength) : 1;
          colors[i * 3] = sig.assignedColor.r * alpha;
          colors[i * 3 + 1] = sig.assignedColor.g * alpha;
          colors[i * 3 + 2] = sig.assignedColor.b * alpha;
        }

        sig.mesh.geometry.setDrawRange(0, drawCount);
        sig.mesh.geometry.attributes.position.needsUpdate = true;
        sig.mesh.geometry.attributes.color.needsUpdate = true;
      });

      renderer.render(scene, camera);
    }

    animate();

    // ── Resize ────────────────────────────────────────────────
    const onResize = () => {
      const w = el.clientWidth;
      const h = el.clientHeight;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };
    window.addEventListener("resize", onResize);

    // ── Cleanup ───────────────────────────────────────────────
    return () => {
      alive = false;
      cancelAnimationFrame(rafId);
      window.removeEventListener("resize", onResize);
      renderer.dispose();
      bgMaterial.dispose();
      signalMaterial.dispose();
      if (el.contains(renderer.domElement)) el.removeChild(renderer.domElement);
    };
  }, []);

  return (
    <div
      ref={mountRef}
      className={`absolute inset-0 w-full h-full ${className}`}
      style={{
        pointerEvents: "none",
        mixBlendMode: "multiply", // white=transparent, colored lines show on white bg
      }}
    />
  );
}
