import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { RoomEnvironment } from 'three/addons/environments/RoomEnvironment.js';
import { ChevronDown, ChevronUp, Layers, Eye, SlidersHorizontal, Hand } from 'lucide-react';

// Pre-allocated math helpers at module scope to prevent GC in render loop
const _targetCamPos = new THREE.Vector3();
const _targetLookAt = new THREE.Vector3();
const _currentLookAt = new THREE.Vector3(0, 0.1, 0);
const _dummy = new THREE.Object3D();
const _color = new THREE.Color();

type CameraPreset = 'studio' | 'exploded' | 'top';
type FinishPreset = 'vermilion' | 'titanium' | 'architect';

function createDraftingCanvasTexture(maxAnisotropy: number): THREE.CanvasTexture {
  const canvas = document.createElement('canvas');
  canvas.width = 512;
  canvas.height = 512;
  const ctx = canvas.getContext('2d');
  if (ctx) {
    ctx.fillStyle = '#181816';
    ctx.fillRect(0, 0, 512, 512);

    // Subtle warm architectural drafting grid
    ctx.strokeStyle = 'rgba(244, 241, 234, 0.08)';
    ctx.lineWidth = 1;
    for (let i = 0; i <= 512; i += 32) {
      ctx.beginPath();
      ctx.moveTo(i, 0);
      ctx.lineTo(i, 512);
      ctx.stroke();

      ctx.beginPath();
      ctx.moveTo(0, i);
      ctx.lineTo(512, i);
      ctx.stroke();
    }

    // Precision crop frame
    ctx.strokeStyle = 'rgba(235, 77, 40, 0.45)';
    ctx.lineWidth = 1.5;
    ctx.strokeRect(44, 44, 424, 424);

    ctx.fillStyle = 'rgba(244, 241, 234, 0.65)';
    ctx.font = '600 13px monospace';
    ctx.fillText('NHAT MINH · STUDIO WORKBENCH', 60, 74);
    ctx.fillStyle = 'rgba(200, 169, 110, 0.75)';
    ctx.fillText('MOBILE 375PX · DESKTOP 1440PX', 60, 448);
  }
  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  texture.anisotropy = maxAnisotropy;
  texture.needsUpdate = true;
  return texture;
}

function createRadialShadowTexture(): THREE.CanvasTexture {
  const canvas = document.createElement('canvas');
  canvas.width = 256;
  canvas.height = 256;
  const ctx = canvas.getContext('2d');
  if (ctx) {
    const grad = ctx.createRadialGradient(128, 128, 12, 128, 128, 120);
    grad.addColorStop(0, 'rgba(0, 0, 0, 0.72)');
    grad.addColorStop(0.55, 'rgba(0, 0, 0, 0.28)');
    grad.addColorStop(1, 'rgba(0, 0, 0, 0)');
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, 256, 256);
  }
  const tex = new THREE.CanvasTexture(canvas);
  tex.colorSpace = THREE.SRGBColorSpace;
  return tex;
}

function createRoundedRectShape(width: number, height: number, radius: number): THREE.Shape {
  const shape = new THREE.Shape();
  const x = -width / 2;
  const y = -height / 2;
  shape.moveTo(x + radius, y);
  shape.lineTo(x + width - radius, y);
  shape.quadraticCurveTo(x + width, y, x + width, y + radius);
  shape.lineTo(x + width, y + height - radius);
  shape.quadraticCurveTo(x + width, y + height, x + width - radius, y + height);
  shape.lineTo(x + radius, y + height);
  shape.quadraticCurveTo(x, y + height, x, y + height - radius);
  shape.lineTo(x, y + radius);
  shape.quadraticCurveTo(x, y, x + radius, y);
  return shape;
}

export const HeroAtelier3D: React.FC = () => {
  const canvasMountRef = useRef<HTMLDivElement | null>(null);
  const [webglSupported, setWebglSupported] = useState(true);
  const [staticFallbackMode, setStaticFallbackMode] = useState(false);
  const [dockCollapsed, setDockCollapsed] = useState(false);
  const [explodedRatio, setExplodedRatio] = useState(0.42);
  const [cameraPreset, setCameraPreset] = useState<CameraPreset>('studio');
  const [finishPreset, setFinishPreset] = useState<FinishPreset>('vermilion');
  const [mobileTouchRotate, setMobileTouchRotate] = useState(false);

  const stateRef = useRef({
    exploded: 0.42,
    cameraPreset: 'studio' as CameraPreset,
    finishPreset: 'vermilion' as FinishPreset,
    userInteracting: false,
    presetTransitionActive: false,
    isMobile: false,
  });

  useEffect(() => {
    const prefersReduced =
      typeof window !== 'undefined' &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReduced) {
      setStaticFallbackMode(true);
    }
  }, []);

  useEffect(() => {
    stateRef.current.exploded = explodedRatio;
  }, [explodedRatio]);

  useEffect(() => {
    stateRef.current.cameraPreset = cameraPreset;
    stateRef.current.presetTransitionActive = true;
  }, [cameraPreset]);

  useEffect(() => {
    stateRef.current.finishPreset = finishPreset;
  }, [finishPreset]);

  useEffect(() => {
    if (staticFallbackMode) return;
    const container = canvasMountRef.current;
    if (!container) return;

    let isSoftwareGl = false;
    try {
      const probeCanvas = document.createElement('canvas');
      const gl = probeCanvas.getContext('webgl2') || probeCanvas.getContext('webgl');
      if (!gl) {
        setWebglSupported(false);
        return;
      }
      const ext = gl.getExtension('WEBGL_debug_renderer_info');
      const param = ext ? ext.UNMASKED_RENDERER_WEBGL : gl.RENDERER;
      const gpu = String(gl.getParameter(param));
      gl.getExtension('WEBGL_lose_context')?.loseContext();
      isSoftwareGl = /SwiftShader|llvmpipe|softpipe|Software|Basic Render/i.test(gpu);
    } catch {
      setWebglSupported(false);
      return;
    }

    let renderer: THREE.WebGLRenderer;
    try {
      renderer = new THREE.WebGLRenderer({
        antialias: !isSoftwareGl,
        powerPreference: 'high-performance',
      });
    } catch {
      setWebglSupported(false);
      return;
    }

    const width = container.clientWidth || 560;
    const height = container.clientHeight || 460;
    const isMobileViewport = width < 520;
    stateRef.current.isMobile = isMobileViewport;

    renderer.setSize(width, height);
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.08;
    renderer.setPixelRatio(isSoftwareGl ? 1 : Math.min(window.devicePixelRatio, 2));
    renderer.shadowMap.enabled = !isSoftwareGl;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;

    container.innerHTML = '';
    container.appendChild(renderer.domElement);

    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x131311);
    scene.fog = new THREE.FogExp2(0x131311, 0.042);

    // Studio Environment Reflection (RoomEnvironment)
    const pmremGenerator = new THREE.PMREMGenerator(renderer);
    const envTarget = pmremGenerator.fromScene(new RoomEnvironment(), 0.04);
    scene.environment = envTarget.texture;
    pmremGenerator.dispose();

    const camera = new THREE.PerspectiveCamera(
      isMobileViewport ? 46 : 40,
      width / height,
      0.1,
      60
    );
    camera.position.set(
      isMobileViewport ? 3.5 : 3.1,
      isMobileViewport ? 2.2 : 1.95,
      isMobileViewport ? 4.8 : 4.25
    );

    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = !isSoftwareGl;
    controls.dampingFactor = 0.06;
    controls.enablePan = false;
    controls.enableZoom = false; // Prevent scroll-hijacking when wheeling page
    controls.minDistance = 2.6;
    controls.maxDistance = 8.5;
    controls.maxPolarAngle = Math.PI / 2 - 0.04;
    controls.target.set(0, 0.12, 0);

    controls.addEventListener('start', () => {
      stateRef.current.userInteracting = true;
      stateRef.current.presetTransitionActive = false;
    });
    controls.addEventListener('end', () => {
      stateRef.current.userInteracting = false;
    });

    // Warm Industrial Studio Lighting (Warm Key + Alabaster Hemisphere + Brass Rim)
    const hemiLight = new THREE.HemisphereLight(0xf4f1ea, 0x1a1917, 0.72);
    hemiLight.position.set(0, 10, 0);
    scene.add(hemiLight);

    const keyLight = new THREE.DirectionalLight(0xfff3e0, 2.35);
    keyLight.position.set(4.5, 6.5, 4.0);
    keyLight.castShadow = !isSoftwareGl;
    const d = 3.5;
    keyLight.shadow.camera.left = -d;
    keyLight.shadow.camera.right = d;
    keyLight.shadow.camera.top = d;
    keyLight.shadow.camera.bottom = -d;
    keyLight.shadow.camera.near = 0.5;
    keyLight.shadow.camera.far = 18;
    keyLight.shadow.mapSize.width = 1024;
    keyLight.shadow.mapSize.height = 1024;
    keyLight.shadow.bias = -0.0005;
    keyLight.shadow.normalBias = 0.02;
    scene.add(keyLight);

    const rimLight = new THREE.DirectionalLight(0xc8a96e, 1.35);
    rimLight.position.set(-4.5, 3.2, -3.8);
    scene.add(rimLight);

    const maxAniso = renderer.capabilities.getMaxAnisotropy();
    const draftingTexture = createDraftingCanvasTexture(maxAniso);
    const shadowTexture = createRadialShadowTexture();

    // Ground platform & Contact Shadow (pivoted flush at bottom y = -1.25)
    const groundY = -1.25;
    const studioPlatformGeo = new THREE.CylinderGeometry(3.2, 3.4, 0.08, 48);
    const studioPlatformMat = new THREE.MeshStandardMaterial({
      color: 0x181715,
      roughness: 0.82,
      metalness: 0.18,
    });
    const studioPlatform = new THREE.Mesh(studioPlatformGeo, studioPlatformMat);
    studioPlatform.position.set(0, groundY - 0.04, 0);
    studioPlatform.receiveShadow = true;
    scene.add(studioPlatform);

    const contactShadowGeo = new THREE.PlaneGeometry(4.6, 4.6);
    const contactShadowMat = new THREE.MeshBasicMaterial({
      map: shadowTexture,
      transparent: true,
      depthWrite: false,
      opacity: 0.62,
      polygonOffset: true,
      polygonOffsetFactor: -1,
      polygonOffsetUnits: -1,
    });
    const contactShadow = new THREE.Mesh(contactShadowGeo, contactShadowMat);
    contactShadow.rotation.x = -Math.PI / 2;
    contactShadow.position.set(0, groundY + 0.02, 0);
    scene.add(contactShadow);

    // =========================================================================
    // COMPOSITE 9-PART PROCEDURAL MODEL: INDUSTRIAL WEB ARCHITECT SCULPTURE
    // =========================================================================
    const atelierGroup = new THREE.Group();
    atelierGroup.position.set(0, groundY, 0);
    scene.add(atelierGroup);

    const chassisMat = new THREE.MeshStandardMaterial({
      color: 0x22211e,
      roughness: 0.48,
      metalness: 0.65,
    });

    const anodizedVermilionMat = new THREE.MeshPhysicalMaterial({
      color: 0xeb4d28,
      roughness: 0.22,
      metalness: 0.55,
      clearcoat: 0.65,
      clearcoatRoughness: 0.2,
    });

    const brushedTitaniumMat = new THREE.MeshStandardMaterial({
      color: 0xd8d4cc,
      roughness: 0.24,
      metalness: 0.85,
    });

    const screenDraftingMat = new THREE.MeshStandardMaterial({
      map: draftingTexture,
      roughness: 0.6,
      metalness: 0.12,
    });

    const glassViewportMat = new THREE.MeshPhysicalMaterial({
      color: 0xf4f1ea,
      roughness: 0.08,
      metalness: 0.05,
      transmission: isSoftwareGl ? 0 : 0.88,
      transparent: true,
      opacity: isSoftwareGl ? 0.24 : 1.0,
      ior: 1.52,
      thickness: 0.55,
      clearcoat: 1.0,
      depthWrite: false,
    });

    // PART 1: Lathe-turned Precision Pedestal Base
    const lathePoints = [
      new THREE.Vector2(0.0, 0.0),
      new THREE.Vector2(0.95, 0.0),
      new THREE.Vector2(0.82, 0.12),
      new THREE.Vector2(0.42, 0.22),
      new THREE.Vector2(0.35, 0.52),
      new THREE.Vector2(0.52, 0.6),
      new THREE.Vector2(0.0, 0.6),
    ];
    const pedestalGeo = new THREE.LatheGeometry(lathePoints, 36);
    const pedestalMesh = new THREE.Mesh(pedestalGeo, chassisMat);
    pedestalMesh.castShadow = true;
    pedestalMesh.receiveShadow = true;
    atelierGroup.add(pedestalMesh);

    const draftingStage = new THREE.Group();
    draftingStage.position.set(0, 1.38, 0);
    draftingStage.rotation.x = -0.22;
    atelierGroup.add(draftingStage);

    // PART 2: Beveled Main Browser Chassis Frame
    const mainChassisShape = createRoundedRectShape(2.5, 1.65, 0.12);
    const mainChassisGeo = new THREE.ExtrudeGeometry(mainChassisShape, {
      steps: 1,
      depth: 0.1,
      bevelEnabled: true,
      bevelThickness: 0.03,
      bevelSize: 0.03,
      bevelSegments: 3,
    });
    mainChassisGeo.center();
    const mainChassisMesh = new THREE.Mesh(mainChassisGeo, chassisMat);
    mainChassisMesh.castShadow = true;
    mainChassisMesh.receiveShadow = true;
    draftingStage.add(mainChassisMesh);

    // PART 3: Drafting Viewport Display Surface
    const screenPlaneGeo = new THREE.PlaneGeometry(2.26, 1.42);
    const screenPlaneMesh = new THREE.Mesh(screenPlaneGeo, screenDraftingMat);
    screenPlaneMesh.position.set(0, 0, 0.082);
    draftingStage.add(screenPlaneMesh);

    // PART 4: Floating Hero UI Header Bar (Anodized Vermilion)
    const headerBarShape = createRoundedRectShape(2.08, 0.22, 0.04);
    const headerBarGeo = new THREE.ExtrudeGeometry(headerBarShape, {
      steps: 1,
      depth: 0.045,
      bevelEnabled: true,
      bevelThickness: 0.012,
      bevelSize: 0.012,
      bevelSegments: 2,
    });
    headerBarGeo.center();
    const headerBarMesh = new THREE.Mesh(headerBarGeo, anodizedVermilionMat);
    headerBarMesh.position.set(0, 0.48, 0.22);
    headerBarMesh.castShadow = true;
    draftingStage.add(headerBarMesh);

    // PART 5: Left Editorial Story Block (Matte Carbon)
    const storyCardShape = createRoundedRectShape(1.18, 0.82, 0.05);
    const storyCardGeo = new THREE.ExtrudeGeometry(storyCardShape, {
      steps: 1,
      depth: 0.055,
      bevelEnabled: true,
      bevelThickness: 0.015,
      bevelSize: 0.015,
      bevelSegments: 2,
    });
    storyCardGeo.center();
    const storyCardMesh = new THREE.Mesh(storyCardGeo, chassisMat);
    storyCardMesh.position.set(-0.44, -0.14, 0.34);
    storyCardMesh.castShadow = true;
    draftingStage.add(storyCardMesh);

    // PART 6: Right Interactive Feature Module (Brushed Titanium)
    const featureCardShape = createRoundedRectShape(0.78, 0.82, 0.05);
    const featureCardGeo = new THREE.ExtrudeGeometry(featureCardShape, {
      steps: 1,
      depth: 0.06,
      bevelEnabled: true,
      bevelThickness: 0.015,
      bevelSize: 0.015,
      bevelSegments: 2,
    });
    featureCardGeo.center();
    const featureCardMesh = new THREE.Mesh(featureCardGeo, brushedTitaniumMat);
    featureCardMesh.position.set(0.64, -0.14, 0.46);
    featureCardMesh.castShadow = true;
    draftingStage.add(featureCardMesh);

    // PART 7: Smoked Optical Glass Protective Lens Layer
    const glassFrameShape = createRoundedRectShape(2.22, 1.38, 0.08);
    const glassFrameGeo = new THREE.ExtrudeGeometry(glassFrameShape, {
      steps: 1,
      depth: 0.03,
      bevelEnabled: true,
      bevelThickness: 0.01,
      bevelSize: 0.01,
      bevelSegments: 2,
    });
    glassFrameGeo.center();
    const glassLayerMesh = new THREE.Mesh(glassFrameGeo, glassViewportMat);
    glassLayerMesh.renderOrder = 10;
    glassLayerMesh.position.set(0, 0, 0.62);
    draftingStage.add(glassLayerMesh);

    // PART 8: Precision Machined Frame Rail (TubeGeometry)
    const splineCurve = new THREE.CatmullRomCurve3([
      new THREE.Vector3(-1.35, -0.65, -0.15),
      new THREE.Vector3(-1.52, 0.0, 0.22),
      new THREE.Vector3(-1.25, 0.72, 0.4),
      new THREE.Vector3(0.0, 0.92, 0.32),
      new THREE.Vector3(1.25, 0.72, 0.4),
      new THREE.Vector3(1.52, 0.0, 0.22),
      new THREE.Vector3(1.35, -0.65, -0.15),
    ]);
    const conduitGeo = new THREE.TubeGeometry(splineCurve, 48, 0.024, 12, false);
    const conduitMesh = new THREE.Mesh(conduitGeo, brushedTitaniumMat);
    draftingStage.add(conduitMesh);

    // PART 9: Precision Gimbal Ring & InstancedMesh Markers (24 instances)
    const orbitalRingGeo = new THREE.TorusGeometry(1.72, 0.014, 12, 64);
    const orbitalRingMesh = new THREE.Mesh(orbitalRingGeo, brushedTitaniumMat);
    orbitalRingMesh.rotation.x = Math.PI / 2.3;
    draftingStage.add(orbitalRingMesh);

    const nodeCount = 24;
    const nodeGeo = new THREE.BoxGeometry(0.055, 0.055, 0.055);
    const nodeMat = new THREE.MeshStandardMaterial({
      color: 0xffffff,
      roughness: 0.25,
      metalness: 0.8,
    });
    const instancedNodes = new THREE.InstancedMesh(nodeGeo, nodeMat, nodeCount);
    for (let i = 0; i < nodeCount; i++) {
      const angle = (i / nodeCount) * Math.PI * 2;
      const radius = 1.72 + (i % 2 === 0 ? 0.12 : -0.1);
      const yOffset = Math.sin(angle * 3) * 0.14;
      _dummy.position.set(Math.cos(angle) * radius, yOffset, Math.sin(angle) * radius);
      _dummy.rotation.set(angle, angle * 0.5, 0);
      const scale = 0.85 + (i % 3) * 0.15;
      _dummy.scale.setScalar(scale);
      _dummy.updateMatrix();
      instancedNodes.setMatrixAt(i, _dummy.matrix);

      _color.setHex(i % 4 === 0 ? 0xeb4d28 : i % 2 === 0 ? 0xd8d4cc : 0xc8a96e);
      instancedNodes.setColorAt(i, _color);
    }
    instancedNodes.instanceMatrix.needsUpdate = true;
    if (instancedNodes.instanceColor) instancedNodes.instanceColor.needsUpdate = true;
    instancedNodes.computeBoundingSphere();
    draftingStage.add(instancedNodes);

    if (!isSoftwareGl) {
      renderer.compile(scene, camera);
    }

    // IntersectionObserver so 3D pauses when scrolled out of view
    let isVisible = true;
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          isVisible = entry.isIntersecting;
        });
      },
      { threshold: 0.05 }
    );
    observer.observe(container);

    const handleResize = () => {
      if (!container) return;
      const w = container.clientWidth || 560;
      const h = container.clientHeight || 460;
      stateRef.current.isMobile = w < 520;
      camera.fov = stateRef.current.isMobile ? 46 : 40;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };
    window.addEventListener('resize', handleResize);

    const clock = new THREE.Clock();
    let frameId = 0;
    let currentExploded = stateRef.current.exploded;

    function afterDraw(cb: () => void) {
      const gl = renderer.getContext() as WebGL2RenderingContext;
      if (gl && typeof gl.fenceSync === 'function') {
        const sync = gl.fenceSync(gl.SYNC_GPU_COMMANDS_COMPLETE, 0);
        gl.flush();
        const poll = () => {
          const state = sync && gl.getSyncParameter(sync, gl.SYNC_STATUS);
          if (state === gl.UNSIGNALED) {
            frameId = window.setTimeout(poll, 5);
          } else {
            if (sync) gl.deleteSync(sync);
            frameId = window.setTimeout(cb, 80);
          }
        };
        frameId = window.setTimeout(poll, 5);
      } else {
        frameId = window.setTimeout(cb, 80);
      }
    }

    function tick() {
      const dt = Math.min(clock.getDelta(), 0.1);
      const elapsed = clock.getElapsedTime();

      if (isVisible) {
        currentExploded = THREE.MathUtils.damp(
          currentExploded,
          stateRef.current.exploded,
          6.5,
          dt
        );

        headerBarMesh.position.z = 0.16 + currentExploded * 0.42;
        headerBarMesh.position.y = 0.48 + currentExploded * 0.08;

        storyCardMesh.position.z = 0.22 + currentExploded * 0.68;
        storyCardMesh.position.x = -0.44 - currentExploded * 0.12;

        featureCardMesh.position.z = 0.28 + currentExploded * 0.92;
        featureCardMesh.position.x = 0.64 + currentExploded * 0.14;

        glassLayerMesh.position.z = 0.36 + currentExploded * 1.18;

        const finish = stateRef.current.finishPreset;
        if (finish === 'vermilion') {
          chassisMat.color.setHex(0x22211e);
          anodizedVermilionMat.color.setHex(0xeb4d28);
          brushedTitaniumMat.color.setHex(0xd8d4cc);
        } else if (finish === 'titanium') {
          chassisMat.color.setHex(0x33312e);
          anodizedVermilionMat.color.setHex(0xc8a96e);
          brushedTitaniumMat.color.setHex(0xf4f1ea);
        } else {
          chassisMat.color.setHex(0x181816);
          anodizedVermilionMat.color.setHex(0xf4f1ea);
          brushedTitaniumMat.color.setHex(0xc8a96e);
        }

        draftingStage.position.y = 1.38 + Math.sin(elapsed * 1.2) * 0.03;
        orbitalRingMesh.rotation.z = elapsed * 0.14;
        instancedNodes.rotation.y = -elapsed * 0.11;

        if (!stateRef.current.userInteracting && !isSoftwareGl) {
          atelierGroup.rotation.y = Math.sin(elapsed * 0.38) * 0.24;
        }

        if (stateRef.current.presetTransitionActive && !stateRef.current.userInteracting) {
          const preset = stateRef.current.cameraPreset;
          const distScale = stateRef.current.isMobile ? 1.14 : 1.0;
          if (preset === 'studio') {
            _targetCamPos.set(3.1 * distScale, 1.95 * distScale, 4.25 * distScale);
            _targetLookAt.set(0, 0.12, 0);
          } else if (preset === 'exploded') {
            _targetCamPos.set(4.0 * distScale, 1.6 * distScale, 3.1 * distScale);
            _targetLookAt.set(0, 0.16, 0.28);
          } else {
            _targetCamPos.set(0.0, 3.6 * distScale, 3.4 * distScale);
            _targetLookAt.set(0, 0.05, 0);
          }

          const alpha = 1 - Math.exp(-5.0 * dt);
          camera.position.lerp(_targetCamPos, alpha);
          _currentLookAt.lerp(_targetLookAt, alpha);
          controls.target.copy(_currentLookAt);

          if (camera.position.distanceTo(_targetCamPos) < 0.03) {
            stateRef.current.presetTransitionActive = false;
          }
        }

        controls.update();
        renderer.render(scene, camera);
      }

      if (isSoftwareGl) {
        afterDraw(tick);
      } else {
        frameId = requestAnimationFrame(tick);
      }
    }

    tick();

    return () => {
      observer.disconnect();
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(frameId);
      clearTimeout(frameId);
      controls.dispose();
      draftingTexture.dispose();
      shadowTexture.dispose();
      envTarget.dispose();
      renderer.dispose();
    };
  }, [staticFallbackMode]);

  return (
    <div className="relative w-full h-[400px] sm:h-[460px] lg:h-[510px] rounded-2xl bg-[#131311] border border-[#F4F1EA]/12 overflow-hidden flex flex-col justify-between">
      {/* Top Bar inside 3D Stage */}
      <div className="relative z-10 flex flex-wrap items-center justify-between gap-2 px-3.5 py-3 pointer-events-none">
        <div className="flex items-center gap-2 text-xs font-mono-tabular text-[#A39E93] bg-[#0D0D0C]/95 px-3 py-1.5 rounded-lg border border-[#F4F1EA]/12 pointer-events-auto">
          <span className="text-[#EB4D28] font-semibold">MÔ HÌNH 3D BỐ CỤC WEB</span>
          <span className="hidden sm:inline" aria-hidden="true">
            ·
          </span>
          <span className="hidden sm:inline">Xoay hoặc kéo thanh tách lớp</span>
        </div>

        <div className="flex items-center gap-1.5 pointer-events-auto">
          {/* Mobile scroll-safe touch toggle */}
          <button
            type="button"
            onClick={() => setMobileTouchRotate((prev) => !prev)}
            className={`md:hidden inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs font-medium border transition-colors ${
              mobileTouchRotate
                ? 'bg-[#EB4D28] text-[#F4F1EA] border-[#EB4D28]'
                : 'bg-[#0D0D0C]/95 text-[#A39E93] border-[#F4F1EA]/15'
            }`}
          >
            <Hand className="w-3.5 h-3.5" />
            <span>{mobileTouchRotate ? 'Đang xoay 3D' : 'Chạm xoay 3D'}</span>
          </button>

          <button
            type="button"
            onClick={() => setStaticFallbackMode((prev) => !prev)}
            className="px-2.5 py-1.5 rounded-lg text-xs font-medium bg-[#0D0D0C]/95 text-[#A39E93] hover:text-[#F4F1EA] border border-[#F4F1EA]/15 transition-colors whitespace-nowrap shrink-0"
          >
            {staticFallbackMode ? 'Bật 3D' : 'Bản vẽ 2D'}
          </button>
        </div>
      </div>

      {/* Main WebGL Mount Container or Static Architectural Drawing */}
      {!webglSupported || staticFallbackMode ? (
        <div className="relative flex-1 flex flex-col items-center justify-center p-5 text-center bg-[#131311]">
          <div className="w-full max-w-md rounded-xl border border-[#F4F1EA]/15 bg-[#1B1A18] p-5 text-left space-y-4">
            <div className="flex items-center justify-between text-xs font-mono-tabular text-[#EB4D28] border-b border-[#F4F1EA]/10 pb-2.5">
              <span>BẢN VẼ CẤU TRÚC TĨNH</span>
              <span>375PX · 1440PX</span>
            </div>
            <div className="space-y-2.5">
              <div className="h-6 rounded bg-[#EB4D28]/20 border border-[#EB4D28]/50 px-2.5 flex items-center text-xs font-mono-tabular text-[#F4F1EA]">
                01. Thanh điều hướng & Nhận diện
              </div>
              <div className="grid grid-cols-5 gap-2.5">
                <div className="col-span-3 h-24 rounded bg-[#131311] border border-[#F4F1EA]/15 p-3 flex flex-col justify-between">
                  <span className="text-xs font-mono-tabular text-[#A39E93]">Lớp nội dung chính</span>
                  <span className="text-sm font-semibold text-[#F4F1EA]">
                    Bạn có ý tưởng. Mình dựng thành web.
                  </span>
                </div>
                <div className="col-span-2 h-24 rounded bg-[#C8A96E]/15 border border-[#C8A96E]/40 p-3 flex flex-col justify-between">
                  <span className="text-xs font-mono-tabular text-[#C8A96E]">Khối tương tác</span>
                  <span className="text-xs text-[#F4F1EA]">Tối ưu Mobile & PC</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div
          ref={canvasMountRef}
          className={`absolute inset-0 w-full h-full ${
            mobileTouchRotate ? ' pointer-events-auto' : 'pointer-events-none md:pointer-events-auto'
          } md:cursor-grab md:active:cursor-grabbing`}
          aria-label="Mô hình 3D minh họa cấu trúc các lớp giao diện website"
        />
      )}

      {/* Unified Collapsible Bottom Control Dock (Works on both Mobile & PC without blocking scroll) */}
      {webglSupported && !staticFallbackMode && (
        <div className="relative z-10 mx-auto mb-3 w-[94%] max-w-[490px] pointer-events-auto">
          <div className="flex justify-center mb-1">
            <button
              type="button"
              onClick={() => setDockCollapsed((prev) => !prev)}
              className="inline-flex items-center gap-1.5 px-3 py-1 rounded-t-lg bg-[#1C1B18] border border-b-0 border-[#F4F1EA]/15 text-xs font-medium text-[#A39E93] hover:text-[#F4F1EA] transition-colors whitespace-nowrap shrink-0"
            >
              {dockCollapsed ? (
                <>
                  <ChevronUp className="w-3.5 h-3.5 text-[#EB4D28]" />
                  <span>Mở thanh điều khiển 3D</span>
                </>
              ) : (
                <>
                  <ChevronDown className="w-3.5 h-3.5 text-[#EB4D28]" />
                  <span>Thu gọn điều khiển</span>
                </>
              )}
            </button>
          </div>

          {!dockCollapsed && (
            <div className="rounded-xl bg-[#181715] border border-[#F4F1EA]/15 p-3 space-y-2.5 shadow-xl">
              {/* Row 1: Exploded View Slider */}
              <div className="flex items-center gap-3">
                <label
                  htmlFor="exploded-layer-slider"
                  className="inline-flex items-center gap-1.5 text-xs font-medium text-[#F4F1EA] whitespace-nowrap shrink-0"
                >
                  <Layers className="w-3.5 h-3.5 text-[#EB4D28]" />
                  <span>Tách lớp UI:</span>
                </label>
                <input
                  id="exploded-layer-slider"
                  type="range"
                  min={0}
                  max={1}
                  step={0.02}
                  value={explodedRatio}
                  onChange={(e) => setExplodedRatio(parseFloat(e.target.value))}
                  className="w-full accent-[#EB4D28] h-1.5 bg-[#0D0D0C] rounded-lg cursor-pointer"
                />
                <span className="text-xs font-mono-tabular text-[#EB4D28] w-9 text-right shrink-0">
                  {Math.round(explodedRatio * 100)}%
                </span>
              </div>

              {/* Row 2: Camera Presets & Material Finish Switcher */}
              <div className="flex flex-wrap items-center justify-between gap-2 pt-1.5 border-t border-[#F4F1EA]/10">
                <div className="flex items-center gap-1">
                  <Eye className="w-3.5 h-3.5 text-[#A39E93] mr-1 shrink-0" aria-hidden="true" />
                  {(
                    [
                      { id: 'studio', label: 'Góc nghiêng' },
                      { id: 'exploded', label: 'Cắt lớp' },
                      { id: 'top', label: 'Trực diện' },
                    ] as const
                  ).map((cam) => (
                    <button
                      key={cam.id}
                      type="button"
                      onClick={() => setCameraPreset(cam.id)}
                      className={`px-2 py-1 rounded text-xs font-medium transition-colors whitespace-nowrap shrink-0 ${
                        cameraPreset === cam.id
                          ? 'bg-[#EB4D28] text-[#F4F1EA] font-semibold'
                          : 'bg-[#0D0D0C] text-[#A39E93] hover:text-[#F4F1EA]'
                      }`}
                    >
                      {cam.label}
                    </button>
                  ))}
                </div>

                <div className="flex items-center gap-1">
                  <SlidersHorizontal
                    className="w-3.5 h-3.5 text-[#A39E93] mr-1 shrink-0"
                    aria-hidden="true"
                  />
                  {(
                    [
                      { id: 'vermilion', label: 'Vermilion' },
                      { id: 'titanium', label: 'Titanium' },
                      { id: 'architect', label: 'Monochrome' },
                    ] as const
                  ).map((fin) => (
                    <button
                      key={fin.id}
                      type="button"
                      onClick={() => setFinishPreset(fin.id)}
                      className={`px-2 py-1 rounded text-xs font-medium transition-colors whitespace-nowrap shrink-0 ${
                        finishPreset === fin.id
                          ? 'bg-[#F4F1EA] text-[#141413] font-semibold'
                          : 'bg-[#0D0D0C] text-[#A39E93] hover:text-[#F4F1EA]'
                      }`}
                    >
                      {fin.label}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
