"use client";

import { useLayoutEffect, useMemo, useRef, useState } from "react";

import { useBeadPhysics } from "./useBeadPhysics";

type BeadVizProps = {
  mysteryName: string;
  mysteryDay: string;
  kicker: string;
};

export function BeadViz({ mysteryName, mysteryDay, kicker }: BeadVizProps) {
  const [mounted, setMounted] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => setMounted(true), []);

  const {
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
  } = useBeadPhysics(containerRef);

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
      suppressHydrationWarning
      className="relative mx-auto aspect-square w-full max-w-100 cursor-grab select-none sm:max-w-130 xl:ml-auto xl:mr-0"
      onMouseMove={handleMove}
      onMouseEnter={handleEnter}
      onMouseLeave={handleLeave}
      onMouseDown={handleClick}
      onTouchEnd={handleTap}
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

              <stop
                offset="70%"
                stopColor="color-mix(in oklab, var(--gold) 0%, transparent)"
              />
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

          <div className="mt-1 font-display text-[clamp(2rem,8vw,2.5rem)] font-normal italic leading-none text-gold">
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
