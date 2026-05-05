"use client";

import { useCallback, useEffect, useRef, useState } from "react";

type Particle = {
  x: number;
  y: number;
  px: number;
  py: number;
};

function createParticle(x: number, y: number): Particle {
  return { x, y, px: x, py: y };
}

function integrate(p: Particle, ax: number, ay: number, friction: number) {
  const vx = (p.x - p.px) * friction;
  const vy = (p.y - p.py) * friction;

  p.px = p.x;
  p.py = p.y;
  p.x += vx + ax;
  p.y += vy + ay;
}

function solveConstraint(a: Particle, b: Particle, rest: number) {
  const dx = b.x - a.x;
  const dy = b.y - a.y;
  const d = Math.sqrt(dx * dx + dy * dy);

  if (d < 0.001) return;

  const diff = (d - rest) / d / 2;
  a.x += dx * diff;
  a.y += dy * diff;
  b.x -= dx * diff;
  b.y -= dy * diff;
}

export const BEAD_COUNT = 59;
const CX = 50;
const CY = 45;
const R = 32;

export function useBeadPhysics(
  containerRef: React.RefObject<HTMLDivElement | null>
) {
  const physicsRef = useRef<{
    parts: Particle[];
    pendant: Particle[];
    anchorIndex: number;
  } | null>(null);

  const mouseRef = useRef({
    x: 50,
    y: 50,
    vx: 0,
    vy: 0,
    active: false,
    clicked: 0,
  });

  const hoverRef = useRef(false);
  const rafRef = useRef(0);

  const [tick, setTick] = useState(0);
  const [hoverState, setHoverState] = useState(false);
  const [activeBead, setActiveBead] = useState(0);

  if (physicsRef.current == null) {
    const parts: Particle[] = [];
    const anchorIndex = Math.floor(BEAD_COUNT / 2);

    for (let i = 0; i < BEAD_COUNT; i++) {
      const t = (i / BEAD_COUNT) * Math.PI * 2 - Math.PI / 2;
      parts.push(createParticle(CX + Math.cos(t) * R, CY + Math.sin(t) * R));
    }

    const anchor = parts[anchorIndex];
    const pendant: Particle[] = [];

    for (let i = 0; i < 4; i++) {
      pendant.push(createParticle(anchor.x, anchor.y + (i + 1) * 3));
    }

    physicsRef.current = { parts, pendant, anchorIndex };
  }

  const pointerToViewBox = useCallback(
    (clientX: number, clientY: number): [number, number] => {
      const el = containerRef.current;
      if (!el) return [0, 0];
      const rect = el.getBoundingClientRect();
      return [
        ((clientX - rect.left) / rect.width) * 100,
        ((clientY - rect.top) / rect.height) * 100,
      ];
    },
    [containerRef]
  );

  const handleMove = useCallback(
    (e: React.MouseEvent) => {
      const [x, y] = pointerToViewBox(e.clientX, e.clientY);
      const m = mouseRef.current;

      m.vx = x - m.x;
      m.vy = y - m.y;
      m.x = x;
      m.y = y;
      m.active = true;
    },
    [pointerToViewBox]
  );

  const handleEnter = useCallback(
    (e: React.MouseEvent) => {
      hoverRef.current = true;
      setHoverState(true);
      const [x, y] = pointerToViewBox(e.clientX, e.clientY);
      const m = mouseRef.current;
      m.x = x;
      m.y = y;
      m.vx = 0;
      m.vy = 0;
      m.active = true;
    },
    [pointerToViewBox]
  );

  const handleLeave = useCallback(() => {
    hoverRef.current = false;
    setHoverState(false);
    mouseRef.current.active = false;
  }, []);

  const applyImpulse = useCallback(
    (clientX: number, clientY: number) => {
      const [x, y] = pointerToViewBox(clientX, clientY);
      mouseRef.current.clicked = 1;
      const physics = physicsRef.current!;
      const IMPULSE = 4.5;

      for (const p of [...physics.parts, ...physics.pendant]) {
        const dx = p.x - x;
        const dy = p.y - y;
        const d = Math.sqrt(dx * dx + dy * dy) + 0.01;
        const f = Math.max(0, 1 - d / 45) * IMPULSE;
        p.x += (dx / d) * f;
        p.y += (dy / d) * f;
      }

      setActiveBead((prev) => (prev + 1) % BEAD_COUNT);
    },
    [pointerToViewBox]
  );

  const handleClick = useCallback(
    (e: React.MouseEvent) => applyImpulse(e.clientX, e.clientY),
    [applyImpulse]
  );

  const handleTap = useCallback(
    (e: React.TouchEvent) => {
      const touch = e.changedTouches[0];

      if (touch) applyImpulse(touch.clientX, touch.clientY);
    },
    [applyImpulse]
  );

  useEffect(() => {
    let last = performance.now();
    let frameId = 0;

    const loop = (t: number) => {
      const dt = Math.min(0.05, (t - last) / 1000);
      last = t;

      const physics = physicsRef.current!;

      const { parts, pendant, anchorIndex } = physics;

      const GRAVITY = 0.035;
      const FRICTION = 0.975;
      const REST_LOOP = (2 * Math.PI * R) / BEAD_COUNT;
      const REST_PEND = 3;
      const HOME_STIFF = 0.012;
      const MOUSE_RADIUS = 14;
      const MOUSE_FORCE = 1.2;

      for (let i = 0; i < parts.length; i++) {
        const p = parts[i];
        const ang = (i / BEAD_COUNT) * Math.PI * 2 - Math.PI / 2;
        const hx = CX + Math.cos(ang) * R;
        const hy = CY + Math.sin(ang) * R;

        integrate(p, 0, GRAVITY * 0.3, FRICTION);

        p.x += (hx - p.x) * HOME_STIFF;
        p.y += (hy - p.y) * HOME_STIFF;

        const m = mouseRef.current;

        if (m.active) {
          const dx = p.x - m.x;
          const dy = p.y - m.y;
          const d = Math.sqrt(dx * dx + dy * dy);

          if (d < MOUSE_RADIUS && d > 0.001) {
            const strength = 1 - d / MOUSE_RADIUS;
            p.x += (dx / d) * strength * MOUSE_FORCE + m.vx * strength * 0.35;
            p.y += (dy / d) * strength * MOUSE_FORCE + m.vy * strength * 0.35;
          }
        }
      }

      const anchor = parts[anchorIndex];
      for (const p of pendant) {
        integrate(p, 0, GRAVITY * 2.2, 0.985);
        const m = mouseRef.current;

        if (m.active) {
          const dx = p.x - m.x;
          const dy = p.y - m.y;
          const d = Math.sqrt(dx * dx + dy * dy);
          if (d < MOUSE_RADIUS && d > 0.001) {
            const strength = 1 - d / MOUSE_RADIUS;
            p.x +=
              (dx / d) * strength * MOUSE_FORCE * 0.8 + m.vx * strength * 0.3;
            p.y +=
              (dy / d) * strength * MOUSE_FORCE * 0.8 + m.vy * strength * 0.3;
          }
        }
      }

      for (let it = 0; it < 6; it++) {
        for (let i = 0; i < parts.length; i++) {
          solveConstraint(parts[i], parts[(i + 1) % parts.length], REST_LOOP);
        }
        solveConstraint(anchor, pendant[0], REST_PEND);
        solveConstraint(pendant[0], pendant[1], REST_PEND);
        solveConstraint(pendant[1], pendant[2], REST_PEND);
        solveConstraint(pendant[2], pendant[3], REST_PEND * 1.2);
      }

      mouseRef.current.vx *= 0.7;
      mouseRef.current.vy *= 0.7;

      if (mouseRef.current.clicked > 0) mouseRef.current.clicked -= dt * 1.3;

      setTick(t);
      frameId = requestAnimationFrame(loop);
      rafRef.current = frameId;
    };

    frameId = requestAnimationFrame(loop);
    rafRef.current = frameId;

    const handleVisibility = () => {
      if (document.hidden) {
        cancelAnimationFrame(frameId);
      } else {
        frameId = requestAnimationFrame(loop);
        rafRef.current = frameId;
      }
    };

    document.addEventListener("visibilitychange", handleVisibility);

    return () => {
      cancelAnimationFrame(frameId);
      document.removeEventListener("visibilitychange", handleVisibility);
    };
  }, []);

  return {
    physicsRef,
    mouseRef,
    tick,
    hoverState,
    activeBead,
    handleMove,
    handleEnter,
    handleLeave,
    handleClick,
    handleTap,
  };
}
