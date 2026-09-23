"use client";

import { useEffect, useRef } from "react";

/**
 * A slow-rotating neon wireframe room — bed, dresser, nightstands, paintings,
 * rug, floor lamp, and window — lit only by unlit neon line materials in the
 * site's gold/teal accent colors. Sits absolutely behind hero copy, never
 * captures pointer events, respects reduced-motion.
 */
export default function NeonRoomBackground({
  className = "",
}: {
  className?: string;
}) {
  const containerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    let renderer: import("three").WebGLRenderer | undefined;
    let animationId = 0;
    let disposed = false;
    let cleanupResize: (() => void) | undefined;

    const prefersReducedMotion =
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    (async () => {
      const THREE = await import("three");
      const container = containerRef.current;
      if (disposed || !container) return;

      const GOLD = 0xdcba66;
      const TEAL = 0x2bb3a3;

      const width = container.clientWidth || 1;
      const height = container.clientHeight || 1;

      // ─────────── Scene setup ───────────
      const scene = new THREE.Scene();
      const camera = new THREE.PerspectiveCamera(50, width / height, 0.1, 100);
      camera.position.set(0.6, 0.9, 5.4);
      camera.lookAt(0, 0.1, 0);

      renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
      renderer.setSize(width, height);
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
      container.appendChild(renderer.domElement);

      const room = new THREE.Group();
      scene.add(room);

      // Track disposables
      const disposables: { dispose: () => void }[] = [];
      const track = <T extends { dispose: () => void }>(x: T): T => {
        disposables.push(x);
        return x;
      };

      // ─────────── Materials ───────────
      const goldLine = () =>
        track(
          new THREE.LineBasicMaterial({
            color: GOLD,
            transparent: true,
            opacity: 0.55,
          }),
        );
      const tealLine = () =>
        track(
          new THREE.LineBasicMaterial({
            color: TEAL,
            transparent: true,
            opacity: 0.45,
          }),
        );
      const dimGold = () =>
        track(
          new THREE.LineBasicMaterial({
            color: GOLD,
            transparent: true,
            opacity: 0.22,
          }),
        );

      // ─────────── Helper: box edges ───────────
      const addBox = (
        w: number,
        h: number,
        d: number,
        x: number,
        y: number,
        z: number,
        mat: THREE.LineBasicMaterial,
        parent: THREE.Object3D = room,
      ) => {
        const geo = track(new THREE.BoxGeometry(w, h, d));
        const edges = track(new THREE.EdgesGeometry(geo));
        const mesh = new THREE.LineSegments(edges, mat);
        mesh.position.set(x, y, z);
        parent.add(mesh);
        return mesh;
      };

      // ─────────── Room shell ───────────
      // Wider than before so furniture has space; room spans roughly
      // x: -2.5..2.5, y: -1..1.5, z: -2.5..2.5
      const roomW = 5;
      const roomH = 2.5;
      const roomD = 5;

      addBox(roomW, roomH, roomD, 0, 0.25, 0, goldLine());

     

      // ─────────── Ceiling grid ───────────
      const ceiling = new THREE.GridHelper(roomW, 10, GOLD, GOLD);
      ceiling.position.y = 1.5;
      (ceiling.material as THREE.Material).transparent = true;
      (ceiling.material as THREE.Material).opacity = 0.14;
      track(ceiling.material as THREE.Material);
      room.add(ceiling);

      // ═══════════════════════════════════════════
      //  BED  (head against back wall, centered-left)
      // ═══════════════════════════════════════════
      const bedX = -0.9;
      const bedZ = -1.3;

      // Mattress
      addBox(2.2, 0.5, 2.0, bedX, -0.65, bedZ, tealLine());

      // Headboard (tall, thin, against wall)
      addBox(2.2, 1.1, 0.12, bedX, -0.15, bedZ - 1.0, goldLine());

      // Pillow left
      addBox(0.75, 0.18, 0.5, bedX - 0.55, -0.31, bedZ - 0.7, dimGold());

      // Pillow right
      addBox(0.75, 0.18, 0.5, bedX + 0.55, -0.31, bedZ - 0.7, dimGold());

      // Blanket fold (a thin strip across the foot of the bed)
      addBox(2.25, 0.03, 0.5, bedX, -0.4, bedZ + 0.65, goldLine());

      // ═══════════════════════════════════════════
      //  NIGHTSTAND left
      // ═══════════════════════════════════════════
      const nsLeftX = bedX - 1.55;
      addBox(0.6, 0.6, 0.55, nsLeftX, -0.7, bedZ - 0.7, goldLine());
      // Drawer line
      addBox(0.55, 0.01, 0.02, nsLeftX, -0.7, bedZ - 0.42, tealLine());

      // Table lamp on top (small base + conical shade as a wireframe box)
      addBox(0.08, 0.18, 0.08, nsLeftX, -0.31, bedZ - 0.7, tealLine());
      addBox(0.28, 0.22, 0.28, nsLeftX, -0.11, bedZ - 0.7, goldLine());

      // ═══════════════════════════════════════════
      //  NIGHTSTAND right
      // ═══════════════════════════════════════════
      const nsRightX = bedX + 1.55;
      addBox(0.6, 0.6, 0.55, nsRightX, -0.7, bedZ - 0.7, goldLine());
      addBox(0.55, 0.01, 0.02, nsRightX, -0.7, bedZ - 0.42, tealLine());

      // Stack of two small books
      addBox(0.3, 0.06, 0.22, nsRightX, -0.37, bedZ - 0.7, dimGold());
      addBox(0.28, 0.05, 0.2, nsRightX, -0.31, bedZ - 0.68, dimGold());

      // ═══════════════════════════════════════════
      //  DRESSER (against left wall)
      // ═══════════════════════════════════════════
      const dresserX = -2.15;
      const dresserZ = 0.6;
      addBox(0.7, 1.4, 2.0, dresserX, -0.3, dresserZ, goldLine());

      // Three drawer dividers
      for (let i = 0; i < 3; i++) {
        addBox(
          0.72,
          0.02,
          1.9,
          dresserX,
          -0.3 + (i - 1) * 0.45,
          dresserZ,
          tealLine(),
        );
      }

      // Small vase / object on top
      addBox(0.18, 0.28, 0.18, dresserX, 0.54, dresserZ - 0.4, tealLine());

      // ═══════════════════════════════════════════
      //  PAINTINGS  (on the wall behind the bed)
      // ═══════════════════════════════════════════
      const wallZ = bedZ - 1.0 - 0.06; // slightly in front of headboard

      // Large center painting
      addBox(1.1, 0.75, 0.04, bedX, 0.65, wallZ, goldLine());
      // Inner canvas border
      addBox(1.0, 0.65, 0.02, bedX, 0.65, wallZ + 0.01, tealLine());

      // Two smaller paintings flanking it
      addBox(0.45, 0.6, 0.04, bedX - 0.9, 0.65, wallZ, dimGold());
      addBox(0.45, 0.6, 0.04, bedX + 0.9, 0.65, wallZ, dimGold());

      // ═══════════════════════════════════════════
      

      // ─────────── Window frame (right wall) ───────────
      const winX = 2.45;
      const winY = 0.4;
      const winZ = -0.5;

      // Outer window
      addBox(0.06, 1.2, 1.6, winX, winY, winZ, goldLine());
      // Cross mullions
      addBox(0.03, 1.2, 0.03, winX, winY, winZ, tealLine()); // horizontal split
      addBox(0.03, 0.03, 1.6, winX, winY, winZ, tealLine()); // vertical split

      // ─────────── Floor lamp (corner) ───────────
      const lampX = 2.0;
      const lampZ = 1.7;
      // Base
      addBox(0.28, 0.03, 0.28, lampX, -0.98, lampZ, tealLine());
      // Pole
      addBox(0.04, 1.6, 0.04, lampX, -0.18, lampZ, goldLine());
      // Shade
      addBox(0.32, 0.28, 0.32, lampX, 0.72, lampZ, goldLine());

      // ─────────── Floating inner frame (depth anchor) ───────────
      addBox(1.4, 0.9, 1.4, 0.1, 0.2, 0.8, dimGold());

      // ═══════════════════════════════════════════
      //  Animation
      // ═══════════════════════════════════════════
      const clock = new THREE.Clock();

      const animate = () => {
        if (disposed || !renderer) return;
        const t = clock.getElapsedTime();
        if (!prefersReducedMotion) {
          room.rotation.y = t * 0.12;
          room.rotation.x = Math.sin(t * 0.1) * 0.04;
        }
        renderer.render(scene, camera);
        animationId = requestAnimationFrame(animate);
      };
      animate();

      // ═══════════════════════════════════════════
      //  Resize
      // ═══════════════════════════════════════════
      const handleResize = () => {
        const el = containerRef.current;
        if (!el || !renderer) return;
        const w = el.clientWidth || 1;
        const h = el.clientHeight || 1;
        camera.aspect = w / h;
        camera.updateProjectionMatrix();
        renderer.setSize(w, h);
      };
      window.addEventListener("resize", handleResize);

      // ═══════════════════════════════════════════
      //  Cleanup
      // ═══════════════════════════════════════════
      cleanupResize = () => {
        window.removeEventListener("resize", handleResize);
        disposables.forEach((d) => d.dispose());
      };
    })();

    return () => {
      disposed = true;
      cancelAnimationFrame(animationId);
      cleanupResize?.();
      if (renderer) {
        renderer.dispose();
        renderer.domElement.remove();
      }
    };
  }, []);

  return (
    <div
      ref={containerRef}
      aria-hidden
      className={`pointer-events-none absolute inset-0 opacity-70 [filter:drop-shadow(0_0_18px_rgba(220,186,102,0.35))_drop-shadow(0_0_26px_rgba(43,179,163,0.3))] ${className}`}
    />
  );
}