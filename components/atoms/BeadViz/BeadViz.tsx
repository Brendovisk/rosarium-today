"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";

interface Particle {
  x: number;
  y: number;
  px: number;
  py: number;
}

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

const BEAD_COUNT = 59;
const CX = 50;
const CY = 45;
const R = 32;

interface BeadVizProps {
  mysteryName: string;
  mysteryDay: string;
  kicker: string;
}

export function BeadViz({ mysteryName, mysteryDay, kicker }: BeadVizProps) {
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  const containerRef = useRef<HTMLDivElement>(null);
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
  const activeBead = tick % BEAD_COUNT;

  if (!physicsRef.current) {
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
    []
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

  const handleClick = useCallback(
    (e: React.MouseEvent) => {
      const [x, y] = pointerToViewBox(e.clientX, e.clientY);
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
    },
    [pointerToViewBox]
  );

  useEffect(() => {
    let last = performance.now();
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
      rafRef.current = requestAnimationFrame(loop);
    };
    rafRef.current = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(rafRef.current);
  }, []);

  const physics = physicsRef.current!;
  const { parts, pendant, anchorIndex } = physics;
  const anchor = parts[anchorIndex];
  const clickedIntensity = Math.max(0, mouseRef.current.clicked);

  const pathD = useMemo(() => {
    let d = `M ${parts[0].x.toFixed(2)} ${parts[0].y.toFixed(2)}`;
    for (let i = 1; i <= parts.length; i++) {
      const a = parts[i - 1];
      const b = parts[i % parts.length];
      const mx = (a.x + b.x) / 2;
      const my = (a.y + b.y) / 2;
      d += ` Q ${a.x.toFixed(2)} ${a.y.toFixed(2)} ${mx.toFixed(
        2
      )} ${my.toFixed(2)}`;
    }
    return d + " Z";
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tick]);

  const pendantPath = useMemo(() => {
    let d = `M ${anchor.x.toFixed(2)} ${anchor.y.toFixed(2)}`;
    for (const p of pendant) d += ` L ${p.x.toFixed(2)} ${p.y.toFixed(2)}`;
    return d;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tick]);

  const crossBead = pendant[pendant.length - 1];
  const crossPrev = pendant[pendant.length - 2];
  const crossAngle =
    (Math.atan2(crossBead.y - crossPrev.y, crossBead.x - crossPrev.x) * 180) /
      Math.PI -
    90;

  return (
    <div
      ref={containerRef}
      className="relative aspect-square w-full max-w-130 ml-auto cursor-grab select-none"
      onMouseMove={handleMove}
      onMouseEnter={handleEnter}
      onMouseLeave={handleLeave}
      onMouseDown={handleClick}
    >
      {!mounted ? null : (
        <svg
          viewBox="0 0 100 100"
          preserveAspectRatio="xMidYMid meet"
          style={{
            display: "block",
            width: "100%",
            height: "100%",
            overflow: "visible",
          }}
        >
          <defs>
            <radialGradient id="bvGlow" cx="50%" cy="45%" r="45%">
              <stop offset="0%" stopColor="var(--gold-soft)" />
              <stop offset="70%" stopColor="color-mix(in oklab, var(--gold) 0%, transparent)" />
            </radialGradient>
            <radialGradient id="bvBead" cx="32%" cy="28%" r="75%">
              <stop
                offset="0%"
                stopColor="color-mix(in oklab, var(--gold) 40%, white)"
              />
              <stop
                offset="28%"
                stopColor="color-mix(in oklab, var(--gold) 72%, white)"
              />
              <stop offset="65%" stopColor="var(--gold)" />
              <stop
                offset="100%"
                stopColor="color-mix(in oklab, var(--gold) 34%, black)"
              />
            </radialGradient>
            <radialGradient id="bvBeadDark" cx="32%" cy="28%" r="75%">
              <stop
                offset="0%"
                stopColor="color-mix(in oklab, var(--gold) 36%, var(--muted))"
              />
              <stop
                offset="45%"
                stopColor="color-mix(in oklab, var(--gold) 18%, var(--ink-3))"
              />
              <stop
                offset="100%"
                stopColor="color-mix(in oklab, var(--gold) 8%, var(--ink))"
              />
            </radialGradient>
            <radialGradient id="bvBeadHover" cx="32%" cy="28%" r="75%">
              <stop
                offset="0%"
                stopColor="color-mix(in oklab, var(--gold) 52%, var(--bone))"
              />
              <stop
                offset="55%"
                stopColor="color-mix(in oklab, var(--gold) 38%, var(--ink-3))"
              />
              <stop
                offset="100%"
                stopColor="color-mix(in oklab, var(--gold) 12%, var(--ink))"
              />
            </radialGradient>
            <filter id="bvGlowF" x="-50%" y="-50%" width="200%" height="200%">
              <feGaussianBlur stdDeviation="0.8" result="b" />
              <feMerge>
                <feMergeNode in="b" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
          </defs>

          <circle cx="50" cy="45" r="44" fill="url(#bvGlow)" />
          <path
            d={pathD}
            fill="none"
            stroke="var(--gold-dim)"
            strokeWidth="0.35"
            strokeLinejoin="round"
          />
          <path
            d={pendantPath}
            fill="none"
            stroke="var(--gold-dim)"
            strokeWidth="0.35"
            strokeLinecap="round"
          />

          {parts.map((p, i) => {
            const big = i % 11 === 10;
            const isActive = i === activeBead;
            const radius = big ? 1.8 : 1.15;
            const fill = isActive
              ? "url(#bvBead)"
              : hoverState
              ? "url(#bvBeadHover)"
              : "url(#bvBeadDark)";
            return (
              <g key={i}>
                <circle
                  cx={p.x}
                  cy={p.y}
                  r={radius}
                  fill={fill}
                  stroke={
                    isActive
                      ? "color-mix(in oklab, var(--gold) 70%, white)"
                      : "none"
                  }
                  strokeWidth="0.3"
                  filter={isActive ? "url(#bvGlowF)" : undefined}
                />
                <ellipse
                  cx={p.x - radius * 0.35}
                  cy={p.y - radius * 0.4}
                  rx={radius * 0.35}
                  ry={radius * 0.22}
                  fill="rgba(255,240,210,0.55)"
                  opacity={isActive ? 1 : hoverState ? 0.55 : 0.3}
                />
              </g>
            );
          })}

          {pendant.slice(0, 3).map((p, i) => {
            const radius = i === 0 ? 1.5 : 0.95;
            return (
              <g key={`p${i}`}>
                <circle
                  cx={p.x}
                  cy={p.y}
                  r={radius}
                  fill={hoverState ? "url(#bvBeadHover)" : "url(#bvBeadDark)"}
                />
                <ellipse
                  cx={p.x - radius * 0.35}
                  cy={p.y - radius * 0.4}
                  rx={radius * 0.35}
                  ry={radius * 0.22}
                  fill="rgba(255,240,210,0.45)"
                />
              </g>
            );
          })}

          <g
            transform={`translate(${crossBead.x} ${crossBead.y}) rotate(${crossAngle})`}
            fill="var(--gold)"
            filter="url(#bvGlowF)"
          >
            <rect x="-0.4" y="-0.2" width="0.8" height="4.4" />
            <rect x="-1.6" y="1.1" width="3.2" height="0.8" />
          </g>

          {clickedIntensity > 0 && (
            <circle
              cx={mouseRef.current.x}
              cy={mouseRef.current.y}
              r={(1 - clickedIntensity) * 30}
              fill="none"
              stroke="var(--gold-dim)"
              strokeWidth={clickedIntensity * 0.6}
            />
          )}
        </svg>
      )}

      <div className="absolute inset-x-0 top-0 h-[90%] grid place-items-center pointer-events-none text-center">
        <div>
          <div className="font-ui text-[0.625rem] font-bold tracking-[0.26em] uppercase text-muted-2">
            {kicker}
          </div>

          <div className="font-display italic font-normal text-[2.5rem] text-gold mt-1 leading-none">
            {mysteryName}
          </div>

          <div className="font-ui text-[0.6875rem] tracking-[0.22em] uppercase text-muted mt-4.5">
            {mysteryDay}
          </div>
        </div>
      </div>
    </div>
  );
}
