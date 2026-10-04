// src/components/AmbientCanvas.jsx
import { useEffect, useRef } from "react";

/* ---------- Tweak these ---------- */
const DEFAULT_POS = { x: 0.5, y: 0.47 }; // used if no pos prop is passed
const HOLE_SCALE = 0.085;                // horizon radius vs min(width, height)
const SPIN = 0.55;                       // inner-disk angular speed (rad/s)
const OPACITY = 0.8;                     // lower to calm it behind content
const DISK_COLORS = [                    // inner -> outer
  [235, 244, 255],
  [91, 157, 255],
  [155, 124, 255],
  [62, 54, 170],
];
/* --------------------------------- */

const clamp = (v, a, b) => Math.min(b, Math.max(a, v));

function ramp(t) {
  t = clamp(t, 0, 1);
  const s = t * (DISK_COLORS.length - 1);
  const i = Math.min(DISK_COLORS.length - 2, Math.floor(s));
  const f = s - i;
  const a = DISK_COLORS[i];
  const b = DISK_COLORS[i + 1];
  return `rgb(${a.map((v, k) => Math.round(v + (b[k] - v) * f)).join(",")})`;
}

export default function AmbientCanvas({ pos = DEFAULT_POS }) {
  const ref = useRef(null);
  const posRef = useRef(pos);
  posRef.current = pos; // the loop reads this, so changing pos never restarts the animation

  useEffect(() => {
    const canvas = ref.current;
    const ctx = canvas.getContext("2d");
    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    let W = 0, H = 0, hr = 40, cx = 0, cy = 0;
    let disk = [], infall = [], stars = [], glow = null;
    let tx = 0, ty = 0, sx = 0, sy = 0;
    let mouseX = -9999, mouseY = -9999;
    let raf = 0, last = performance.now(), first = true;

    function buildGlow() {
      const R = Math.ceil(hr * 7);
      glow = document.createElement("canvas");
      glow.width = glow.height = R * 2;
      const g = glow.getContext("2d");
      const grad = g.createRadialGradient(R, R, hr * 0.9, R, R, R);
      grad.addColorStop(0, "rgba(91,157,255,0.5)");
      grad.addColorStop(0.25, "rgba(155,124,255,0.2)");
      grad.addColorStop(0.6, "rgba(62,70,200,0.06)");
      grad.addColorStop(1, "rgba(0,0,0,0)");
      g.fillStyle = grad;
      g.fillRect(0, 0, R * 2, R * 2);
    }

    function makeDisk() {
      const n = clamp(Math.round((W * H) / 1500), 450, 1200);
      const rIn = hr * 1.45;
      const rOut = hr * 5.5;
      disk = Array.from({ length: n }, () => {
        const r = rIn + (rOut - rIn) * Math.pow(Math.random(), 1.6);
        const t = Math.pow((r - rIn) / (rOut - rIn), 0.8);
        return {
          r,
          a: Math.random() * Math.PI * 2,
          w: SPIN * Math.pow(rIn / r, 1.5),
          z: (Math.random() - 0.5) * hr * 0.14,
          size: 0.7 + Math.random() * 1.5,
          alpha: 0.35 + Math.random() * 0.6,
          color: ramp(t),
        };
      });
    }

    function spawnInfall(p, anywhere) {
      const maxR = Math.max(W, H) * (0.55 + Math.random() * 0.25);
      p.r = anywhere ? hr * 1.2 + Math.random() * maxR : maxR;
      p.a = Math.random() * Math.PI * 2;
      p.size = 0.6 + Math.random() * 1.1;
      return p;
    }

    function makeScene() {
      const n = clamp(Math.round((W * H) / 9000), 60, 200);
      infall = Array.from({ length: n }, () => spawnInfall({}, true));
      stars = Array.from({ length: clamp(Math.round((W * H) / 9000), 70, 220) }, () => ({
        x: Math.random() * W,
        y: Math.random() * H,
        s: Math.random() < 0.15 ? 1.6 : 0.9,
        d: 0.3 + Math.random() * 0.7,
        p: Math.random() * 6.28,
      }));
    }

    function resize() {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      W = window.innerWidth;
      H = window.innerHeight;
      canvas.width = Math.round(W * dpr);
      canvas.height = Math.round(H * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      hr = clamp(Math.min(W, H) * HOLE_SCALE, 34, 100);
      cx = W * posRef.current.x;
      cy = H * posRef.current.y;
      buildGlow();
      makeDisk();
      makeScene();
      first = true;
      if (reduceMotion) draw(0, 0);
    }

    function onMove(e) {
      mouseX = e.clientX;
      mouseY = e.clientY;
      tx = e.clientX / W - 0.5;
      ty = e.clientY / H - 0.5;
    }
    function onLeave() {
      mouseX = mouseY = -9999;
      tx = ty = 0;
    }

    function drawDisk(back, ox, oy, tilt) {
      for (const p of disk) {
        const s = Math.sin(p.a);
        if (back ? s >= 0 : s < 0) continue;
        const c = Math.cos(p.a);
        let y = oy + s * p.r * tilt + p.z;
        if (back) {
          // fake gravitational lensing: far side of the disk bends over the hole
          y -= hr * 0.55 * ((hr * 1.45) / p.r) * -s * (1 - 0.6 * Math.abs(c)) * 1.6;
        }
        const beam = 0.65 + 0.35 * c; // approaching side looks brighter
        ctx.globalAlpha = p.alpha * beam * (back ? 0.8 : 1);
        ctx.fillStyle = p.color;
        ctx.fillRect(cx + ox + c * p.r, y, p.size, p.size);
      }
    }

    function draw(t, dt) {
      // glide toward the target position (changes when you switch pages)
      const targetX = W * posRef.current.x;
      const targetY = H * posRef.current.y;
      const k = Math.min(1, dt * 2.5);
      cx += (targetX - cx) * k;
      cy += (targetY - cy) * k;

      // smooth cursor parallax
      sx += (tx - sx) * Math.min(1, dt * 3);
      sy += (ty - sy) * Math.min(1, dt * 3);
      const ox = sx * 22;
      const oy = cy + sy * 16;
      const tilt = 0.3 + sy * 0.12;

      // disk spins faster when the cursor is near the hole
      const d = Math.hypot(mouseX - (cx + ox), mouseY - oy);
      const prox = clamp(1 - d / (Math.min(W, H) * 0.55), 0, 1);
      const speed = 1 + prox * 1.1;

      // fade previous frame (keeps canvas transparent, leaves soft trails)
      ctx.globalCompositeOperation = "destination-out";
      ctx.globalAlpha = 1;
      ctx.fillStyle = `rgba(0,0,0,${first ? 1 : 0.28})`;
      ctx.fillRect(0, 0, W, H);
      first = false;

      // update
      for (const p of disk) p.a += p.w * speed * dt;
      for (const p of infall) {
        const kk = (hr * 3) / p.r;
        p.r -= (60 + 260 * kk * kk) * speed * dt;
        p.a += 0.25 * Math.pow(kk, 1.5) * speed * dt;
        if (p.r < hr * 1.02) spawnInfall(p, false);
      }

      ctx.globalCompositeOperation = "lighter";

      // stars
      for (const s of stars) {
        ctx.globalAlpha = 0.22 + 0.18 * Math.sin(t * 0.9 + s.p);
        ctx.fillStyle = "#cfd8ff";
        ctx.fillRect(s.x - sx * 10 * s.d, s.y - sy * 10 * s.d, s.s, s.s);
      }

      // glow halo
      const R = glow.width / 2;
      ctx.globalAlpha = 0.55 + 0.1 * Math.sin(t * 0.8);
      ctx.drawImage(glow, cx + ox - R, oy - R);

      // matter falling in
      for (const p of infall) {
        const near = 1 - clamp((p.r - hr) / (hr * 7), 0, 1);
        ctx.globalAlpha = (0.25 + 0.65 * near) * clamp((p.r - hr) / (hr * 0.6), 0, 1);
        ctx.fillStyle = ramp(1 - near);
        ctx.fillRect(cx + ox + Math.cos(p.a) * p.r, oy + Math.sin(p.a) * p.r * 0.75, p.size, p.size);
      }

      drawDisk(true, ox, oy, tilt);

      // event horizon
      ctx.globalCompositeOperation = "source-over";
      ctx.globalAlpha = 1;
      ctx.fillStyle = "#01020a";
      ctx.beginPath();
      ctx.arc(cx + ox, oy, hr, 0, Math.PI * 2);
      ctx.fill();

      // photon ring, brighter on the approaching side
      ctx.globalCompositeOperation = "lighter";
      const rg = ctx.createLinearGradient(cx + ox - hr, 0, cx + ox + hr, 0);
      rg.addColorStop(0, "rgba(155,124,255,0.45)");
      rg.addColorStop(1, "rgba(225,238,255,1)");
      ctx.globalAlpha = 0.18;
      ctx.strokeStyle = "rgb(91,157,255)";
      ctx.lineWidth = hr * 0.24;
      ctx.beginPath();
      ctx.arc(cx + ox, oy, hr * 1.06, 0, Math.PI * 2);
      ctx.stroke();
      ctx.globalAlpha = 0.95;
      ctx.strokeStyle = rg;
      ctx.lineWidth = hr * 0.055;
      ctx.beginPath();
      ctx.arc(cx + ox, oy, hr * 1.02, 0, Math.PI * 2);
      ctx.stroke();

      drawDisk(false, ox, oy, tilt);

      ctx.globalAlpha = 1;
      ctx.globalCompositeOperation = "source-over";
    }

    function loop(now) {
      const dt = Math.min(0.05, (now - last) / 1000);
      last = now;
      draw(now / 1000, dt);
      raf = requestAnimationFrame(loop);
    }

    function onVisibility() {
      if (document.hidden) {
        cancelAnimationFrame(raf);
        raf = 0;
      } else if (!reduceMotion && !raf) {
        last = performance.now();
        raf = requestAnimationFrame(loop);
      }
    }

    resize();
    window.addEventListener("resize", resize);
    window.addEventListener("mousemove", onMove, { passive: true });
    document.addEventListener("mouseleave", onLeave);
    document.addEventListener("visibilitychange", onVisibility);
    if (!reduceMotion) raf = requestAnimationFrame(loop);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", resize);
      window.removeEventListener("mousemove", onMove);
      document.removeEventListener("mouseleave", onLeave);
      document.removeEventListener("visibilitychange", onVisibility);
    };
  }, []);

  return (
    <canvas
      ref={ref}
      aria-hidden="true"
      style={{
        position: "fixed",
        inset: 0,
        width: "100%",
        height: "100%",
        zIndex: 0,
        pointerEvents: "none",
        opacity: OPACITY,
      }}
    />
  );
}