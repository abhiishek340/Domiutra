"use client";

import { useEffect, useRef } from "react";

type Ripple = { x: number; z: number; t0: number; amp: number };

const BG = "#080b10";
// Height-graded palette: troughs → crests (sky → mint → near-white).
const RAMP = [
  [70, 110, 190],
  [100, 150, 240],
  [141, 180, 255],
  [110, 215, 225],
  [122, 240, 195],
  [185, 247, 223],
  [235, 255, 245],
] as const;
const BUCKETS = RAMP.length;

/**
 * Perspective dot-grid terrain. A rolling wave surface recedes to the
 * horizon; the pointer lifts the surface and leaves ripples, clicks send
 * a shockwave, and idle ripples keep it alive.
 *
 * Performance: 2D canvas only, points batched by color bucket (a handful
 * of fill calls per frame), DPR capped, density reduced on touch devices,
 * paused off-screen/hidden. Reduced motion renders one still frame.
 */
export function WaveField({ className }: { className?: string }) {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = ref.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d", { alpha: false });
    if (!ctx) return;

    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const coarse = window.matchMedia("(pointer: coarse)").matches;
    const dpr = Math.min(window.devicePixelRatio || 1, coarse ? 1.25 : 1.5);
    const COLS = coarse ? 64 : 120;
    const ROWS = coarse ? 30 : 48;
    const SPREAD_X = 7; // world half-width
    const NEAR = 1.4;
    const FAR = 14;
    const CAM_H = 1.25;

    let w = 0;
    let h = 0;
    let focal = 0;
    let horizon = 0;
    let raf = 0;
    let visible = true;
    let time = 0;
    let last = performance.now();
    let lastAuto = 0;
    let lastTrail = 0;
    const ripples: Ripple[] = [];
    const pointer = { x: 0, z: 0, active: false, sx: 0, sy: 0, tilt: 0 };

    // Precomputed fill styles per (color bucket, depth band).
    const DEPTH_BANDS = 6;
    const styles: string[][] = RAMP.map(([r, g, b]) =>
      Array.from({ length: DEPTH_BANDS }, (_, i) => `rgba(${r},${g},${b},${(1 - i * 0.12).toFixed(2)})`),
    );
    const bins: Float32Array[][] = styles.map((row) => row.map(() => new Float32Array(COLS * ROWS * 3)));
    const counts: number[][] = styles.map((row) => row.map(() => 0));
    const rowLine = new Float32Array(COLS * 2);

    const height = (x: number, z: number) => {
      const t = time;
      let y =
        0.3 * Math.sin(x * 0.75 + t * 1.1) +
        0.24 * Math.sin(z * 0.62 - t * 0.85) +
        0.13 * Math.sin((x + z) * 1.45 + t * 1.6) +
        0.07 * Math.sin(x * 2.3 - z * 1.7 + t * 2.2);
      for (const r of ripples) {
        const dx = x - r.x;
        const dz = z - r.z;
        const d = Math.sqrt(dx * dx + dz * dz);
        const age = t - r.t0;
        const front = age * 3.2;
        const fall = Math.exp(-age * 0.9);
        const band = d - front;
        y += r.amp * fall * Math.exp(-band * band * 2.2) * Math.cos(band * 5);
      }
      if (pointer.active) {
        const dx = x - pointer.x;
        const dz = z - pointer.z;
        y += 0.55 * Math.exp(-(dx * dx + dz * dz) * 0.9);
      }
      return y;
    };

    const toWorld = (sx: number, sy: number) => {
      const dy = sy - horizon;
      if (dy <= 4) return null;
      const z = (focal * CAM_H) / dy;
      if (z < NEAR || z > FAR) return null;
      return { x: ((sx - w / 2) * z) / focal, z };
    };

    const addRipple = (x: number, z: number, amp: number) => {
      ripples.push({ x, z, t0: time, amp });
      if (ripples.length > 10) ripples.shift();
    };

    const draw = () => {
      ctx.fillStyle = BG;
      ctx.fillRect(0, 0, w, h);

      for (let b = 0; b < BUCKETS; b++) counts[b]!.fill(0);
      const camTilt = pointer.tilt * 0.12; // subtle parallax from pointer height
      ctx.lineWidth = 1;

      for (let r = ROWS - 1; r >= 0; r--) {
        const depth = r / (ROWS - 1);
        const z = NEAR + depth ** 1.35 * (FAR - NEAR);
        const band = Math.min(DEPTH_BANDS - 1, Math.floor(depth * DEPTH_BANDS));
        const scale = focal / z;
        const size = Math.max(1.1, 4.6 / z ** 0.8);

        for (let c = 0; c < COLS; c++) {
          const x = (c / (COLS - 1) - 0.5) * 2 * SPREAD_X * (0.55 + depth * 0.9);
          const y = height(x, z);
          const sx = w / 2 + x * scale;
          const sy = horizon + (CAM_H + camTilt - y) * scale;
          rowLine[c * 2] = sx;
          rowLine[c * 2 + 1] = sy;
          const bucket = Math.max(0, Math.min(BUCKETS - 1, Math.round(((y + 0.7) / 1.7) * (BUCKETS - 1))));
          const bin = bins[bucket]![band]!;
          const i = counts[bucket]![band]!;
          bin[i] = sx;
          bin[i + 1] = sy;
          bin[i + 2] = size;
          counts[bucket]![band] = i + 3;
        }

        // Faint row line gives the surface its terrain contour.
        ctx.strokeStyle = `rgba(122,240,195,${(0.05 + 0.2 * (1 - depth)).toFixed(3)})`;
        ctx.beginPath();
        ctx.moveTo(rowLine[0]!, rowLine[1]!);
        for (let c = 1; c < COLS; c++) ctx.lineTo(rowLine[c * 2]!, rowLine[c * 2 + 1]!);
        ctx.stroke();
      }

      for (let b = 0; b < BUCKETS; b++) {
        for (let d = 0; d < DEPTH_BANDS; d++) {
          const n = counts[b]![d]!;
          if (!n) continue;
          ctx.fillStyle = styles[b]![d]!;
          const bin = bins[b]![d]!;
          for (let i = 0; i < n; i += 3) {
            const s = bin[i + 2]!;
            ctx.fillRect(bin[i]! - s / 2, bin[i + 1]! - s / 2, s, s);
          }
        }
      }
    };

    const frame = (now: number) => {
      const dt = Math.min(0.05, (now - last) / 1000);
      last = now;
      time += dt;
      // Keep it alive: occasional ripples when idle.
      if (time - lastAuto > 2.6) {
        lastAuto = time;
        addRipple((Math.random() - 0.5) * 8, NEAR + 2 + Math.random() * 6, 0.45);
      }
      while (ripples.length && time - ripples[0]!.t0 > 6) ripples.shift();
      draw();
      raf = requestAnimationFrame(frame);
    };

    const resize = () => {
      const rect = canvas.getBoundingClientRect();
      w = rect.width;
      h = rect.height;
      canvas.width = Math.round(w * dpr);
      canvas.height = Math.round(h * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      focal = Math.max(w, h * 1.2) * 0.52;
      horizon = h * 0.54;
      if (reduce) {
        time = 1.7;
        draw();
      }
    };

    const start = () => {
      if (reduce || raf || !visible || document.hidden) return;
      last = performance.now();
      raf = requestAnimationFrame(frame);
    };
    const stop = () => {
      cancelAnimationFrame(raf);
      raf = 0;
    };

    const onMove = (e: PointerEvent) => {
      const r = canvas.getBoundingClientRect();
      const sx = e.clientX - r.left;
      const sy = e.clientY - r.top;
      pointer.tilt = sy / Math.max(1, h) - 0.5;
      const world = sx >= 0 && sy >= 0 && sx <= w && sy <= h ? toWorld(sx, sy) : null;
      pointer.active = Boolean(world);
      if (!world) return;
      pointer.x = world.x;
      pointer.z = world.z;
      // Leave a ripple trail as the pointer travels.
      const moved = Math.hypot(sx - pointer.sx, sy - pointer.sy);
      if (moved > 40 && time - lastTrail > 0.12) {
        lastTrail = time;
        addRipple(world.x, world.z, 0.28);
      }
      pointer.sx = sx;
      pointer.sy = sy;
    };
    const onLeave = () => {
      pointer.active = false;
    };
    const onDown = (e: PointerEvent) => {
      const r = canvas.getBoundingClientRect();
      const world = toWorld(e.clientX - r.left, e.clientY - r.top);
      if (world) addRipple(world.x, world.z, 1.1);
    };
    const onVisibility = () => (document.hidden ? stop() : start());

    let resizeTimer = 0;
    const ro = new ResizeObserver(() => {
      window.clearTimeout(resizeTimer);
      resizeTimer = window.setTimeout(resize, 100);
    });
    const io = new IntersectionObserver(([entry]) => {
      visible = Boolean(entry?.isIntersecting);
      if (visible) start();
      else stop();
    });

    // Listen on the hero section so the text layer above doesn't block input.
    const host = canvas.parentElement ?? canvas;
    resize();
    ro.observe(canvas);
    io.observe(canvas);
    if (!reduce) {
      host.addEventListener("pointermove", onMove, { passive: true });
      host.addEventListener("pointerleave", onLeave);
      host.addEventListener("pointerdown", onDown);
    }
    document.addEventListener("visibilitychange", onVisibility);
    start();

    return () => {
      stop();
      ro.disconnect();
      io.disconnect();
      window.clearTimeout(resizeTimer);
      host.removeEventListener("pointermove", onMove);
      host.removeEventListener("pointerleave", onLeave);
      host.removeEventListener("pointerdown", onDown);
      document.removeEventListener("visibilitychange", onVisibility);
    };
  }, []);

  return <canvas ref={ref} aria-hidden="true" data-wavefield="" className={className} />;
}
