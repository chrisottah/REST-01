"use client";

import { useEffect, useRef } from "react";

/**
 * A slow-rotating wireframe "room" — floor grid, ceiling grid, outer shell,
 * and a floating inner frame — lit only by unlit neon line materials in the
 * site's gold/teal accent colors. Meant to sit absolutely behind hero copy,
 * so it never captures pointer events and respects reduced-motion.
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

      const scene = new THREE.Scene();
      const camera = new THREE.PerspectiveCamera(50, width / height, 0.1, 100);
      camera.position.set(0.6, 0.5, 4.4);
      camera.lookAt(0, -0.1, 0);

      renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
      renderer.setSize(width, height);
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
      container.appendChild(renderer.domElement);

      const room = new THREE.Group();

      // Outer shell — the "room" walls, seen as edges only
      const shellEdges = new THREE.EdgesGeometry(new THREE.BoxGeometry(3, 2, 3));
      const shell = new THREE.LineSegments(
        shellEdges,
        new THREE.LineBasicMaterial({ color: GOLD, transparent: true, opacity: 0.5 }),
      );
      room.add(shell);

      // Floor grid — synthwave-style
      const floor = new THREE.GridHelper(3, 10, TEAL, TEAL);
      floor.position.y = -1;
      (floor.material as THREE.Material).transparent = true;
      (floor.material as THREE.Material).opacity = 0.4;
      room.add(floor);

      // Ceiling grid — dimmer, opposite accent
      const ceiling = new THREE.GridHelper(3, 6, GOLD, GOLD);
      ceiling.position.y = 1;
      (ceiling.material as THREE.Material).transparent = true;
      (ceiling.material as THREE.Material).opacity = 0.16;
      room.add(ceiling);

      // Floating inner frame for depth
      const innerEdges = new THREE.EdgesGeometry(new THREE.BoxGeometry(1.5, 1, 1.5));
      const inner = new THREE.LineSegments(
        innerEdges,
        new THREE.LineBasicMaterial({ color: TEAL, transparent: true, opacity: 0.45 }),
      );
      inner.position.y = -0.15;
      room.add(inner);

      scene.add(room);

      const clock = new THREE.Clock();

      const animate = () => {
        if (disposed || !renderer) return;
        const t = clock.getElapsedTime();
        if (!prefersReducedMotion) {
          room.rotation.y = t * 0.15;
          room.rotation.x = Math.sin(t * 0.12) * 0.06;
        }
        renderer.render(scene, camera);
        animationId = requestAnimationFrame(animate);
      };
      animate();

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
      cleanupResize = () => window.removeEventListener("resize", handleResize);

      // dispose geometries/materials on unmount
      cleanupResize = (() => {
        const removeListener = cleanupResize;
        return () => {
          removeListener?.();
          shellEdges.dispose();
          innerEdges.dispose();
          (shell.material as THREE.Material).dispose();
          (inner.material as THREE.Material).dispose();
          (floor.material as THREE.Material).dispose();
          (ceiling.material as THREE.Material).dispose();
        };
      })();
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