import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { RoomEnvironment } from 'three/addons/environments/RoomEnvironment.js';
import { RotateCcw } from 'lucide-react';

type SkillMode = 'coding' | 'design';

function createBracketShape(isLeft: boolean): THREE.Shape {
  const s = new THREE.Shape();
  if (isLeft) {
    s.moveTo(0.25, 0.65);
    s.lineTo(-0.45, 0.0);
    s.lineTo(0.25, -0.65);
    s.lineTo(0.42, -0.48);
    s.lineTo(-0.1, 0.0);
    s.lineTo(0.42, 0.48);
    s.closePath();
  } else {
    s.moveTo(-0.25, 0.65);
    s.lineTo(0.45, 0.0);
    s.lineTo(-0.25, -0.65);
    s.lineTo(-0.42, -0.48);
    s.lineTo(0.1, 0.0);
    s.lineTo(-0.42, 0.48);
    s.closePath();
  }
  return s;
}

function createSlashShape(): THREE.Shape {
  const s = new THREE.Shape();
  s.moveTo(-0.22, -0.72);
  s.lineTo(0.12, 0.72);
  s.lineTo(0.32, 0.66);
  s.lineTo(-0.02, -0.78);
  s.closePath();
  return s;
}

export const TactileSkillsSection: React.FC = () => {
  const [mode, setMode] = useState<SkillMode>('coding');
  const [expanded, setExpanded] = useState(false);
  const [fallback, setFallback] = useState(false);
  const mountRef = useRef<HTMLDivElement | null>(null);
  const expandedRef = useRef(false);

  useEffect(() => {
    expandedRef.current = expanded;
  }, [expanded]);

  useEffect(() => {
    const prefersReduced =
      typeof window !== 'undefined' &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReduced) {
      setFallback(true);
      return;
    }

    const container = mountRef.current;
    if (!container) return;

    let isSoftwareGl = false;
    try {
      const probe = document.createElement('canvas');
      const gl = probe.getContext('webgl2') || probe.getContext('webgl');
      if (!gl) {
        setFallback(true);
        return;
      }
      const ext = gl.getExtension('WEBGL_debug_renderer_info');
      const param = ext ? ext.UNMASKED_RENDERER_WEBGL : gl.RENDERER;
      const gpu = String(gl.getParameter(param));
      gl.getExtension('WEBGL_lose_context')?.loseContext();
      isSoftwareGl = /SwiftShader|llvmpipe|softpipe|Software|Basic Render/i.test(gpu);
    } catch {
      setFallback(true);
      return;
    }

    let renderer: THREE.WebGLRenderer;
    try {
      renderer = new THREE.WebGLRenderer({
        antialias: !isSoftwareGl,
        alpha: true,
        powerPreference: 'high-performance',
      });
    } catch {
      setFallback(true);
      return;
    }

    const width = container.clientWidth || 420;
    const height = container.clientHeight || 280;
    renderer.setSize(width, height);
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.1;
    renderer.setPixelRatio(isSoftwareGl ? 1 : Math.min(window.devicePixelRatio, 2));

    container.innerHTML = '';
    container.appendChild(renderer.domElement);

    const scene = new THREE.Scene();
    const pmremGenerator = new THREE.PMREMGenerator(renderer);
    const envTarget = pmremGenerator.fromScene(new RoomEnvironment(), 0.04);
    scene.environment = envTarget.texture;
    pmremGenerator.dispose();

    const isNarrow = width < 420;
    const camera = new THREE.PerspectiveCamera(isNarrow ? 44 : 38, width / height, 0.1, 30);
    camera.position.set(0, 0.35, isNarrow ? 4.3 : 3.8);
    camera.lookAt(0, 0, 0);

    const hemi = new THREE.HemisphereLight(0xf3f1ec, 0x151513, 0.85);
    scene.add(hemi);

    const keyLight = new THREE.DirectionalLight(0xfff5e6, 2.3);
    keyLight.position.set(3.5, 4.5, 4.0);
    scene.add(keyLight);

    const rimLight = new THREE.PointLight(
      mode === 'coding' ? 0xe04f2e : 0xc8a96e,
      3.4,
      8
    );
    rimLight.position.set(-2.2, 1.2, 2.2);
    scene.add(rimLight);

    const rootGroup = new THREE.Group();
    scene.add(rootGroup);

    const gridHelper = new THREE.GridHelper(
      4.2,
      12,
      mode === 'coding' ? 0xe04f2e : 0xc8a96e,
      0x242320
    );
    gridHelper.position.y = -0.9;
    rootGroup.add(gridHelper);

    const extrudeSettings = {
      steps: 1,
      depth: 0.22,
      bevelEnabled: true,
      bevelThickness: 0.05,
      bevelSize: 0.04,
      bevelSegments: 3,
    };

    const movableParts: THREE.Object3D[] = [];

    if (mode === 'coding') {
      const vermilionMat = new THREE.MeshPhysicalMaterial({
        color: 0xe04f2e,
        roughness: 0.22,
        metalness: 0.55,
        clearcoat: 0.6,
      });

      const titaniumMat = new THREE.MeshPhysicalMaterial({
        color: 0xe6e2d8,
        roughness: 0.18,
        metalness: 0.88,
        clearcoat: 0.4,
      });

      const leftGeo = new THREE.ExtrudeGeometry(createBracketShape(true), extrudeSettings);
      leftGeo.center();
      const leftBracket = new THREE.Mesh(leftGeo, titaniumMat);
      leftBracket.position.set(-0.88, 0.08, 0.15);
      rootGroup.add(leftBracket);
      movableParts.push(leftBracket);

      const slashGeo = new THREE.ExtrudeGeometry(createSlashShape(), extrudeSettings);
      slashGeo.center();
      const slashMesh = new THREE.Mesh(slashGeo, vermilionMat);
      slashMesh.position.set(0.0, 0.08, 0.28);
      rootGroup.add(slashMesh);
      movableParts.push(slashMesh);

      const rightGeo = new THREE.ExtrudeGeometry(createBracketShape(false), extrudeSettings);
      rightGeo.center();
      const rightBracket = new THREE.Mesh(rightGeo, titaniumMat);
      rightBracket.position.set(0.88, 0.08, 0.15);
      rootGroup.add(rightBracket);
      movableParts.push(rightBracket);
    } else {
      const smokedGlassMat = new THREE.MeshPhysicalMaterial({
        color: 0xf3f1ec,
        roughness: 0.12,
        metalness: 0.08,
        transmission: isSoftwareGl ? 0 : 0.88,
        transparent: true,
        opacity: isSoftwareGl ? 0.85 : 1.0,
        ior: 1.52,
        thickness: 1.0,
        clearcoat: 1.0,
      });

      const warmBrassMat = new THREE.MeshPhysicalMaterial({
        color: 0xc8a96e,
        roughness: 0.2,
        metalness: 0.88,
        clearcoat: 0.65,
      });

      const wireframeMat = new THREE.MeshBasicMaterial({
        color: 0xe04f2e,
        wireframe: true,
        transparent: true,
        opacity: 0.5,
      });

      const sphereGeo = new THREE.SphereGeometry(0.52, 32, 32);
      const sphereMesh = new THREE.Mesh(sphereGeo, smokedGlassMat);
      sphereMesh.position.set(-0.32, 0.1, 0.2);
      rootGroup.add(sphereMesh);
      movableParts.push(sphereMesh);

      const torusGeo = new THREE.TorusGeometry(0.64, 0.12, 24, 64);
      const torusMesh = new THREE.Mesh(torusGeo, warmBrassMat);
      torusMesh.position.set(0.3, 0.05, 0.0);
      torusMesh.rotation.set(0.5, 0.6, 0.2);
      rootGroup.add(torusMesh);
      movableParts.push(torusMesh);

      const icoGeo = new THREE.IcosahedronGeometry(0.84, 0);
      const wireCage = new THREE.Mesh(icoGeo, wireframeMat);
      wireCage.position.set(0.0, 0.08, 0.05);
      rootGroup.add(wireCage);
      movableParts.push(wireCage);
    }

    let targetRotX = 0;
    let targetRotY = 0;
    const onPointerMove = (e: PointerEvent) => {
      const rect = container.getBoundingClientRect();
      const nx = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      const ny = ((e.clientY - rect.top) / rect.height) * 2 - 1;
      targetRotY = nx * 0.55;
      targetRotX = ny * 0.32;
    };
    const onPointerLeave = () => {
      targetRotX = 0;
      targetRotY = 0;
    };
    container.addEventListener('pointermove', onPointerMove);
    container.addEventListener('pointerleave', onPointerLeave);

    const clock = new THREE.Clock();
    let frameId = 0;
    let spreadFactor = 0;

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
      const t = clock.getElapsedTime();

      spreadFactor = THREE.MathUtils.damp(
        spreadFactor,
        expandedRef.current ? 1 : 0,
        6,
        dt
      );

      if (mode === 'coding' && movableParts.length === 3) {
        movableParts[0].position.x = -0.88 - spreadFactor * 0.32;
        movableParts[1].position.z = 0.28 + spreadFactor * 0.38;
        movableParts[2].position.x = 0.88 + spreadFactor * 0.32;
      } else if (mode === 'design' && movableParts.length === 3) {
        movableParts[0].position.x = -0.32 - spreadFactor * 0.35;
        movableParts[1].position.x = 0.3 + spreadFactor * 0.35;
        movableParts[2].scale.setScalar(1 + spreadFactor * 0.18);
      }

      rootGroup.position.y = Math.sin(t * 1.3) * 0.04;
      const baseRotY = Math.sin(t * 0.5) * 0.24 + targetRotY;
      const baseRotX = Math.cos(t * 0.4) * 0.06 + targetRotX;
      rootGroup.rotation.y = THREE.MathUtils.damp(rootGroup.rotation.y, baseRotY, 5, dt);
      rootGroup.rotation.x = THREE.MathUtils.damp(rootGroup.rotation.x, baseRotX, 5, dt);

      renderer.render(scene, camera);

      if (isSoftwareGl) {
        afterDraw(tick);
      } else {
        frameId = requestAnimationFrame(tick);
      }
    }

    tick();

    const handleResize = () => {
      if (!container) return;
      const w = container.clientWidth || 420;
      const h = container.clientHeight || 280;
      const narrow = w < 420;
      camera.fov = narrow ? 44 : 38;
      camera.position.z = narrow ? 4.3 : 3.8;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };
    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
      container.removeEventListener('pointermove', onPointerMove);
      container.removeEventListener('pointerleave', onPointerLeave);
      cancelAnimationFrame(frameId);
      clearTimeout(frameId);
      envTarget.dispose();
      renderer.dispose();
    };
  }, [mode]);

  const skillItems =
    mode === 'coding'
      ? [
          {
            name: 'React & TypeScript',
            desc: 'Chia nhỏ giao diện dễ bảo trì, tách riêng file dữ liệu để dễ đổi nội dung.',
          },
          {
            name: 'HTML5 & Tailwind CSS',
            desc: 'Căn chỉnh chuẩn từ màn hình điện thoại 320px đến màn hình máy tính 1440px.',
          },
          {
            name: 'Kết nối dữ liệu & Tối ưu tải',
            desc: 'Tải 3D theo nhu cầu (lazy-load), giữ tốc độ mở trang nhanh từ Messenger/Zalo.',
          },
        ]
      : [
          {
            name: 'Bố cục Biên tập (Editorial UI)',
            desc: 'Ưu tiên chữ dễ đọc, khoảng thở rộng, không lạm dụng hiệu ứng màu mè.',
          },
          {
            name: 'Three.js / WebGL 3D',
            desc: 'Dựng vật thể 3D tương tác nhẹ nhàng, có sẵn bản vẽ tĩnh dự phòng cho máy yếu.',
          },
          {
            name: 'Chuyển động Tinh tế',
            desc: 'Phản hồi mượt theo thao tác chạm hoặc rê chuột, không làm kẹt cuộn trang.',
          },
        ];

  return (
    <div className="rounded-2xl bg-[#161614] border border-[#F3F1EC]/10 p-5 sm:p-7 space-y-5">
      {/* Top Mode Switcher */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="text-xs font-mono-tabular text-[#8E8B82]">
          KỸ NĂNG & CÔNG CỤ 3D
        </div>

        <div className="flex items-center gap-1 p-1 rounded-lg bg-[#111110] border border-[#F3F1EC]/10">
          <button
            type="button"
            onClick={() => setMode('coding')}
            className={`px-3 py-1.5 rounded-md text-xs font-medium transition-colors cursor-pointer ${
              mode === 'coding'
                ? 'bg-[#F3F1EC] text-[#111110] font-semibold'
                : 'text-[#8E8B82] hover:text-[#F3F1EC]'
            }`}
          >
            01. Lập trình Web
          </button>
          <button
            type="button"
            onClick={() => setMode('design')}
            className={`px-3 py-1.5 rounded-md text-xs font-medium transition-colors cursor-pointer ${
              mode === 'design'
                ? 'bg-[#F3F1EC] text-[#111110] font-semibold'
                : 'text-[#8E8B82] hover:text-[#F3F1EC]'
            }`}
          >
            02. Thiết kế & 3D
          </button>
        </div>
      </div>

      {/* Interactive 3D Stage */}
      {fallback ? (
        <div className="w-full h-56 rounded-xl bg-[#111110] border border-[#F3F1EC]/10 flex items-center justify-center p-4 text-center text-xs text-[#8E8B82]">
          Đang hiển thị chế độ tĩnh tiết kiệm năng lượng
        </div>
      ) : (
        <div className="relative w-full h-56 sm:h-64 rounded-xl bg-[#111110] border border-[#F3F1EC]/10 overflow-hidden">
          <div
            ref={mountRef}
            className="w-full h-full cursor-grab active:cursor-grabbing"
          />
          <button
            type="button"
            onClick={() => setExpanded((prev) => !prev)}
            className="absolute bottom-3 right-3 z-10 inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#161614]/95 border border-[#F3F1EC]/15 text-xs font-medium text-[#F3F1EC] hover:border-[#E04F2E] transition-colors cursor-pointer"
          >
            <RotateCcw className="w-3.5 h-3.5 text-[#E04F2E]" />
            <span>{expanded ? 'Thu gọn khối 3D' : 'Tách khối 3D'}</span>
          </button>
        </div>
      )}

      {/* Concise 3-Row Skill Breakdown */}
      <div className="divide-y divide-[#F3F1EC]/10 border-t border-[#F3F1EC]/10 pt-1">
        {skillItems.map((item) => (
          <div key={item.name} className="py-3 flex flex-col sm:flex-row sm:items-baseline justify-between gap-1 sm:gap-4">
            <span className="font-display text-sm font-semibold text-[#F3F1EC] shrink-0">
              {item.name}
            </span>
            <span className="text-xs text-[#8E8B82] sm:text-right">{item.desc}</span>
          </div>
        ))}
      </div>
    </div>
  );
};
