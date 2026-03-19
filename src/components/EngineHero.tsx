import { useRef, useEffect, useCallback } from 'react';
import * as THREE from 'three';
import { useTheme } from '@/contexts/ThemeContext';

function createGearShape(innerR: number, outerR: number, teeth: number, toothDepth: number): THREE.Shape {
  const shape = new THREE.Shape();
  const step = (Math.PI * 2) / teeth;
  const halfTooth = step * 0.3;

  for (let i = 0; i < teeth; i++) {
    const a = step * i;
    // Inner arc
    shape.absarc(0, 0, innerR, a + halfTooth, a + step - halfTooth, false);
    // Tooth outer
    shape.absarc(0, 0, outerR, a + step - halfTooth, a + step + halfTooth, false);
  }
  shape.closePath();

  // Center hole
  const hole = new THREE.Path();
  hole.absarc(0, 0, innerR * 0.3, 0, Math.PI * 2, true);
  shape.holes.push(hole);

  return shape;
}

export function EngineHero({ className = '' }: { className?: string }) {
  const containerRef = useRef<HTMLDivElement>(null);
  const { theme } = useTheme();
  const themeRef = useRef(theme);
  const cleanupRef = useRef<(() => void) | null>(null);

  useEffect(() => { themeRef.current = theme; }, [theme]);

  const init = useCallback(() => {
    if (!containerRef.current) return;
    const container = containerRef.current;
    const w = container.clientWidth;
    const h = container.clientHeight;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(45, w / h, 0.1, 100);
    camera.position.set(0, 0, 8);

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(w, h);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setClearColor(0x000000, 0);
    container.appendChild(renderer.domElement);

    // Primary color: #3A4DEA, accent: #FFD75C, secondary: #8A4FE8
    const primaryColor = new THREE.Color(0x3A4DEA);
    const accentColor = new THREE.Color(0xFFD75C);
    const secondaryColor = new THREE.Color(0x8A4FE8);

    const extrudeSettings = { depth: 0.3, bevelEnabled: true, bevelThickness: 0.05, bevelSize: 0.03, bevelSegments: 2 };

    // Main gear (center)
    const mainGearShape = createGearShape(1.2, 1.6, 12, 0.4);
    const mainGearGeo = new THREE.ExtrudeGeometry(mainGearShape, extrudeSettings);
    const mainGearMat = new THREE.MeshStandardMaterial({
      color: primaryColor,
      metalness: 0.7,
      roughness: 0.3,
      transparent: true,
      opacity: 0.85,
    });
    const mainGear = new THREE.Mesh(mainGearGeo, mainGearMat);
    mainGear.position.set(0, 0, 0);
    scene.add(mainGear);

    // Secondary gear (top-right, meshes with main)
    const secGearShape = createGearShape(0.7, 0.95, 8, 0.25);
    const secGearGeo = new THREE.ExtrudeGeometry(secGearShape, extrudeSettings);
    const secGearMat = new THREE.MeshStandardMaterial({
      color: secondaryColor,
      metalness: 0.6,
      roughness: 0.35,
      transparent: true,
      opacity: 0.8,
    });
    const secGear = new THREE.Mesh(secGearGeo, secGearMat);
    secGear.position.set(2.2, 1.3, 0.1);
    scene.add(secGear);

    // Third gear (bottom-left)
    const thirdGearShape = createGearShape(0.5, 0.72, 6, 0.22);
    const thirdGearGeo = new THREE.ExtrudeGeometry(thirdGearShape, extrudeSettings);
    const thirdGearMat = new THREE.MeshStandardMaterial({
      color: accentColor,
      metalness: 0.5,
      roughness: 0.4,
      transparent: true,
      opacity: 0.75,
    });
    const thirdGear = new THREE.Mesh(thirdGearGeo, thirdGearMat);
    thirdGear.position.set(-1.8, -1.5, -0.1);
    scene.add(thirdGear);

    // Small accent gear (bottom-right)
    const smallGearShape = createGearShape(0.35, 0.5, 5, 0.15);
    const smallGearGeo = new THREE.ExtrudeGeometry(smallGearShape, extrudeSettings);
    const smallGearMat = new THREE.MeshStandardMaterial({
      color: primaryColor,
      metalness: 0.6,
      roughness: 0.3,
      transparent: true,
      opacity: 0.6,
    });
    const smallGear = new THREE.Mesh(smallGearGeo, smallGearMat);
    smallGear.position.set(1.5, -1.8, 0.2);
    scene.add(smallGear);

    // Floating particles (data points around the engine)
    const particleCount = 60;
    const particleGeo = new THREE.BufferGeometry();
    const positions = new Float32Array(particleCount * 3);
    for (let i = 0; i < particleCount; i++) {
      const theta = Math.random() * Math.PI * 2;
      const r = 2.5 + Math.random() * 2;
      positions[i * 3] = Math.cos(theta) * r;
      positions[i * 3 + 1] = Math.sin(theta) * r;
      positions[i * 3 + 2] = (Math.random() - 0.5) * 2;
    }
    particleGeo.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    const particleMat = new THREE.PointsMaterial({
      color: primaryColor,
      size: 0.06,
      transparent: true,
      opacity: 0.6,
    });
    const particles = new THREE.Points(particleGeo, particleMat);
    scene.add(particles);

    // Orbital ring
    const ringGeo = new THREE.TorusGeometry(3, 0.015, 8, 100);
    const ringMat = new THREE.MeshBasicMaterial({ color: primaryColor, transparent: true, opacity: 0.2 });
    const ring = new THREE.Mesh(ringGeo, ringMat);
    ring.rotation.x = Math.PI / 6;
    scene.add(ring);

    const ring2Geo = new THREE.TorusGeometry(3.5, 0.01, 8, 100);
    const ring2Mat = new THREE.MeshBasicMaterial({ color: secondaryColor, transparent: true, opacity: 0.12 });
    const ring2 = new THREE.Mesh(ring2Geo, ring2Mat);
    ring2.rotation.x = -Math.PI / 5;
    ring2.rotation.z = Math.PI / 4;
    scene.add(ring2);

    // Lighting
    const ambient = new THREE.AmbientLight(0xffffff, 0.5);
    scene.add(ambient);

    const dirLight = new THREE.DirectionalLight(0xffffff, 1.2);
    dirLight.position.set(3, 4, 5);
    scene.add(dirLight);

    const pointLight = new THREE.PointLight(0x3A4DEA, 1.5, 15);
    pointLight.position.set(-2, 2, 3);
    scene.add(pointLight);

    const accentLight = new THREE.PointLight(0xFFD75C, 0.8, 10);
    accentLight.position.set(2, -2, 2);
    scene.add(accentLight);

    // Mouse interaction
    const mouse = { x: 0, y: 0, tx: 0, ty: 0 };
    const onMouseMove = (e: MouseEvent) => {
      const rect = container.getBoundingClientRect();
      mouse.tx = ((e.clientX - rect.left) / rect.width - 0.5) * 2;
      mouse.ty = ((e.clientY - rect.top) / rect.height - 0.5) * 2;
    };
    container.addEventListener('mousemove', onMouseMove);

    const clock = new THREE.Clock(true);
    let animId = 0;

    const animate = () => {
      animId = requestAnimationFrame(animate);
      const t = clock.getElapsedTime();

      // Smooth mouse follow
      mouse.x += (mouse.tx - mouse.x) * 0.05;
      mouse.y += (mouse.ty - mouse.y) * 0.05;

      // Gears rotate (interlocking directions)
      mainGear.rotation.z = t * 0.3;
      secGear.rotation.z = -t * 0.3 * (12 / 8); // ratio match teeth
      thirdGear.rotation.z = t * 0.3 * (12 / 6);
      smallGear.rotation.z = -t * 0.3 * (12 / 5);

      // Slight tilt from mouse
      scene.rotation.y = mouse.x * 0.15;
      scene.rotation.x = -mouse.y * 0.1;

      // Particles orbit
      particles.rotation.z = t * 0.08;
      particles.rotation.y = t * 0.05;

      // Rings rotate
      ring.rotation.z = t * 0.1;
      ring2.rotation.z = -t * 0.07;

      // Breathing scale on main gear
      const breath = 1 + Math.sin(t * 0.8) * 0.02;
      mainGear.scale.set(breath, breath, 1);

      // Point light pulses
      pointLight.intensity = 1.5 + Math.sin(t * 1.5) * 0.5;

      renderer.render(scene, camera);
    };
    animate();

    const onResize = () => {
      const nw = container.clientWidth;
      const nh = container.clientHeight;
      camera.aspect = nw / nh;
      camera.updateProjectionMatrix();
      renderer.setSize(nw, nh);
    };
    window.addEventListener('resize', onResize);

    cleanupRef.current = () => {
      cancelAnimationFrame(animId);
      container.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('resize', onResize);
      renderer.dispose();
      [mainGearGeo, secGearGeo, thirdGearGeo, smallGearGeo, particleGeo, ringGeo, ring2Geo].forEach(g => g.dispose());
      [mainGearMat, secGearMat, thirdGearMat, smallGearMat, particleMat, ringMat, ring2Mat].forEach(m => m.dispose());
      if (container.contains(renderer.domElement)) container.removeChild(renderer.domElement);
    };
  }, []);

  useEffect(() => {
    init();
    return () => { cleanupRef.current?.(); };
  }, [init]);

  return (
    <div
      ref={containerRef}
      className={`w-full h-full ${className}`}
    />
  );
}

export default EngineHero;
