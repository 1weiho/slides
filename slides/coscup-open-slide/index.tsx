import React from 'react';
import type { DesignSystem, Page, SlideMeta, SlideTransition } from '@open-slide/core';
import { useIsActivePage } from '@open-slide/core';
import avatar from '@assets/avatar.jpg';
import geistFont from '@assets/geist.woff2';
import openSlide from './assets/open-slide.png';
import cursorMeetup from './assets/cursor-meetup.webp';

// Register Geist once, idempotently — keyed to this slide's id so other
// slides' fonts aren't suppressed on the home page.
const FONT_STYLE_ID = 'osd-webfont-coscup-open-slide';
if (typeof document !== 'undefined' && !document.getElementById(FONT_STYLE_ID)) {
  const style = document.createElement('style');
  style.id = FONT_STYLE_ID;
  style.textContent = `
@font-face {
  font-family: 'Geist';
  src: url('${geistFont}') format('woff2');
  font-weight: 100 900;
  font-display: swap;
}`;
  document.head.appendChild(style);
}



export const design: DesignSystem = {
  palette: { bg: '#000000', text: '#f5f5f7', accent: '#2997ff' },
  fonts: {
    display: '"Geist", "PingFang TC", "Noto Sans TC", system-ui, sans-serif',
    body: '"Geist", "PingFang TC", "Noto Sans TC", system-ui, sans-serif',
  },
  typeScale: { hero: 176, body: 40 },
  radius: 24,
};

// Extra tokens outside the DesignSystem shape.
const muted = '#86868b';

const EASE_OUT = 'cubic-bezier(0, 0, 0.2, 1)';
const EASE_IN = 'cubic-bezier(0.4, 0, 1, 1)';
// Strong ease-out for in-page entrances — starts fast, settles gracefully.
const EASE_ENTRANCE = 'cubic-bezier(0.23, 1, 0.32, 1)';

// In-page entrance keyframes, injected once. Applied only on the active
// page instance (thumbnails / overview render the settled state).
const entranceCss = `
@keyframes coscup-rise {
  from { opacity: 0; transform: translateY(28px); filter: blur(10px); }
  to   { opacity: 1; transform: translateY(0);    filter: blur(0); }
}
@keyframes coscup-bloom {
  from { opacity: 0; transform: scale(0.95); filter: blur(12px); }
  to   { opacity: 1; transform: scale(1);    filter: blur(0); }
}
@keyframes coscup-draw {
  from { stroke-dashoffset: 1; }
  to   { stroke-dashoffset: 0; }
}
@keyframes coscup-fade {
  from { opacity: 0; }
  to   { opacity: 1; }
}
.coscup-rise  { animation: coscup-rise  1200ms ${EASE_ENTRANCE} both; }
.coscup-bloom { animation: coscup-bloom 1400ms ${EASE_ENTRANCE} both; }
.coscup-draw  { animation: coscup-draw  1800ms ${EASE_OUT} 600ms both; }
.coscup-fade  { animation: coscup-fade  600ms ${EASE_OUT} both; }
@media (prefers-reduced-motion: reduce) {
  .coscup-rise, .coscup-bloom, .coscup-draw, .coscup-fade { animation: none; }
}
`;

const fill = {
  width: '100%',
  height: '100%',
  background: 'var(--osd-bg)',
  color: 'var(--osd-text)',
  fontFamily: 'var(--osd-font-body)',
  position: 'relative',
} as const;

const Cover: Page = () => {
  const animate = useIsActivePage();
  const rise = animate ? 'coscup-rise' : undefined;

  return (
    <div
      style={{
        ...fill,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        textAlign: 'center',
        padding: '0 160px',
      }}
    >
      <style>{entranceCss}</style>
      <div style={{ position: 'relative' }}>
        <div
          className={rise}
          style={{
            fontSize: 26,
            fontWeight: 600,
            letterSpacing: '0.28em',
            color: muted,
            animationDelay: '0ms',
          }}
        >
          COSCUP 2026
        </div>

        <h1
          className={rise}
          style={{
            fontFamily: 'var(--osd-font-display)',
            fontSize: 'var(--osd-size-hero)',
            fontWeight: 700,
            letterSpacing: '-0.02em',
            lineHeight: 1.05,
            margin: '36px 0 0',
            color: 'var(--osd-text)',
            animationDelay: '200ms',
          }}
        >
          open-slide
        </h1>

        <p
          className={rise}
          style={{
            fontFamily: 'var(--osd-font-display)',
            fontSize: 54,
            fontWeight: 600,
            letterSpacing: '-0.01em',
            lineHeight: 1.3,
            margin: '32px 0 0',
            color: 'var(--osd-text)',
            animationDelay: '440ms',
          }}
        >
          從騎車時的靈感到衝上 GitHub Trending
        </p>

        <div
          className={rise}
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 28,
            marginTop: 96,
            animationDelay: '700ms',
          }}
        >
          <div
            style={{
              width: 112,
              height: 112,
              borderRadius: '50%',
              overflow: 'hidden',
              flexShrink: 0,
              boxShadow: '0 0 0 1px rgba(255, 255, 255, 0.12)',
            }}
          >
            <img src={avatar} alt='講者大頭照（Avatar）' style={{ width: 112, height: 112, objectFit: 'cover', objectPosition: '50% 50%' }} />
          </div>
          <div style={{ fontSize: 40, fontWeight: 500, color: 'var(--osd-text)' }}>Yiwei Ho</div>
        </div>
      </div>
    </div>
  );
};

const Logo: Page = () => {
  const animate = useIsActivePage();

  return (
    <div
      style={{
        ...fill,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        textAlign: 'center',
        padding: '0 160px',
      }}
    >
      <style>{entranceCss}</style>
      <div
        className={animate ? 'coscup-bloom' : undefined}
        style={{
          width: 300,
          height: 300,
          borderRadius: 72,
          overflow: 'hidden',
          boxShadow: '0 0 0 1px rgba(255, 255, 255, 0.12)',
          animationDelay: '0ms',
        }}
      >
        <img src={openSlide} alt='open-slide logo' style={{ width: 300, height: 300, objectFit: 'cover', objectPosition: '50% 50%' }} />
      </div>

      <h2
        className={animate ? 'coscup-rise' : undefined}
        style={{
          fontFamily: 'var(--osd-font-display)',
          fontSize: 120,
          fontWeight: 700,
          letterSpacing: '-0.02em',
          lineHeight: 1.1,
          margin: '72px 0 0',
          color: 'var(--osd-text)',
          animationDelay: '400ms',
        }}
      >
        open-slide
      </h2>
    </div>
  );
};

// Cumulative GitHub stars per day, 2026-04-30 → 2026-07-31 (fetched 2026-08-01).
const STAR_SERIES = [
  2, 2, 41, 445, 901, 1345, 1758, 2258, 2576, 2735, 2859, 2999, 3094, 3169, 3216, 3238, 3287,
  3315, 3348, 3417, 3470, 3503, 3519, 3537, 3600, 3646, 3694, 3727, 3789, 3879, 3934, 3974,
  4237, 4555, 4623, 4670, 4693, 4708, 4737, 4763, 4783, 5004, 5140, 5209, 5249, 5286, 5310,
  5326, 5364, 5391, 5401, 5417, 5429, 5445, 5462, 5488, 5505, 5519, 5528, 5534, 5545, 5567,
  5577, 5590, 5598, 5601, 5609, 5635, 5649, 5658, 5676, 5690, 5708, 5713, 5730, 5743, 5758,
  5778, 5803, 5830, 5874, 5905, 5925, 5936, 5957, 5975, 5982, 6003, 6022, 6027, 6041, 6053,
  6058,
];
const STAR_TOTAL = 6058;
const TRENDING_INDEX = 7; // 2026-05-07 — the GitHub Trending spike (+500 that day)

const CHART_W = 1600;
const CHART_H = 400;
const CHART_TOP = 24;
const CHART_BASE = CHART_H - 4;

const chartX = (i: number) => (i / (STAR_SERIES.length - 1)) * CHART_W;
const chartY = (v: number) => CHART_TOP + (1 - v / STAR_TOTAL) * (CHART_BASE - CHART_TOP);
const starPath = STAR_SERIES.map(
  (v, i) => `${i === 0 ? 'M' : 'L'}${chartX(i).toFixed(1)},${chartY(v).toFixed(1)}`,
).join(' ');

const easeOutQuint = (t: number) => 1 - Math.pow(1 - t, 5);

// Counts 0 → target in sync with the line draw (same delay + duration).
const useCountUp = (target: number, active: boolean, delay: number, duration: number) => {
  const [value, setValue] = React.useState(active ? 0 : target);
  React.useEffect(() => {
    if (!active || window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      setValue(target);
      return;
    }
    let raf = 0;
    const start = performance.now() + delay;
    const tick = (now: number) => {
      const t = Math.min(Math.max((now - start) / duration, 0), 1);
      setValue(Math.round(target * easeOutQuint(t)));
      if (t < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [target, active, delay, duration]);
  return value;
};

const Stars: Page = () => {
  const animate = useIsActivePage();
  const rise = animate ? 'coscup-rise' : undefined;
  const count = useCountUp(STAR_TOTAL, animate, 600, 1800);

  return (
    <div
      style={{
        ...fill,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        textAlign: 'center',
        padding: '0 160px',
      }}
    >
      <style>{entranceCss}</style>

      <div
        className={rise}
        style={{
          fontSize: 26,
          fontWeight: 600,
          letterSpacing: '0.28em',
          color: muted,
          animationDelay: '0ms',
        }}
      >
        GITHUB STARS
      </div>

      <div
        className={rise}
        style={{
          fontFamily: 'var(--osd-font-display)',
          fontSize: 168,
          fontWeight: 700,
          letterSpacing: '-0.02em',
          lineHeight: 1.1,
          marginTop: 12,
          color: 'var(--osd-text)',
          fontVariantNumeric: 'tabular-nums',
          animationDelay: '160ms',
        }}
      >
        {count.toLocaleString('en-US')}
      </div>

      <div className={rise} style={{ marginTop: 56, animationDelay: '350ms' }}>
        <svg
          width={CHART_W}
          height={CHART_H}
          viewBox={`0 0 ${CHART_W} ${CHART_H}`}
          style={{ overflow: 'visible' }}
        >
          <line
            x1={0}
            y1={CHART_BASE}
            x2={CHART_W}
            y2={CHART_BASE}
            stroke="rgba(255, 255, 255, 0.14)"
            strokeWidth={1}
          />
          <path
            d={starPath}
            fill="none"
            stroke="var(--osd-text)"
            strokeWidth={3}
            strokeLinecap="round"
            strokeLinejoin="round"
            pathLength={1}
            className={animate ? 'coscup-draw' : undefined}
            style={animate ? { strokeDasharray: 1 } : undefined}
          />
          <g
            className={animate ? 'coscup-fade' : undefined}
            style={animate ? { animationDelay: '1400ms' } : undefined}
          >
            <circle
              cx={chartX(TRENDING_INDEX)}
              cy={chartY(STAR_SERIES[TRENDING_INDEX])}
              r={7}
              fill="var(--osd-bg)"
              stroke="var(--osd-text)"
              strokeWidth={2.5}
            />
            <text
              x={chartX(TRENDING_INDEX) + 30}
              y={chartY(STAR_SERIES[TRENDING_INDEX]) + 56}
              fill={muted}
              fontSize={26}
              textAnchor="start"
            >
              衝上 GitHub Trending
            </text>
          </g>
          <g
            className={animate ? 'coscup-fade' : undefined}
            style={animate ? { animationDelay: '2300ms' } : undefined}
          >
            <circle
              cx={chartX(STAR_SERIES.length - 1)}
              cy={chartY(STAR_TOTAL)}
              r={9}
              fill="var(--osd-text)"
            />
          </g>
        </svg>
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            marginTop: 14,
            fontSize: 26,
            color: muted,
          }}
        >
          <span>2026 年 5 月</span>
          <span>今天</span>
        </div>
      </div>
    </div>
  );
};

const Meetup: Page = () => (
  <div style={{ width: '100%', height: '100%', background: 'var(--osd-bg)', position: 'relative' }}>
    <img
      src={cursorMeetup}
      alt="Cursor Meetup"
      style={{
        width: '100%',
        height: '100%',
        objectFit: 'cover',
        filter: 'grayscale(1) brightness(0.45)',
      }}
    />
    <div
      style={{
        position: 'absolute',
        inset: 0,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        textAlign: 'center',
        padding: '0 160px',
      }}
    >
      <h2
        style={{
          fontFamily: 'var(--osd-font-display)',
          fontSize: 120,
          fontWeight: 700,
          letterSpacing: '-0.02em',
          lineHeight: 1.1,
          margin: 0,
          color: 'var(--osd-text)',
        }}
      >
        Cursor Meetup Taichung
      </h2>
    </div>
  </div>
);

// Full-bleed photo page — snap in, no transition.
Meetup.transition = { duration: 0 };

// House transition — RISE. One motion DNA across the deck.
export const transition: SlideTransition = {
  duration: 280,
  exit: {
    duration: 180,
    easing: EASE_IN,
    keyframes: [
      { opacity: 1, transform: 'translateY(0)' },
      { opacity: 0, transform: 'translateY(-4px)' },
    ],
  },
  enter: {
    duration: 280,
    delay: 100,
    easing: EASE_OUT,
    keyframes: [
      { opacity: 0, transform: 'translateY(6px)' },
      { opacity: 1, transform: 'translateY(0)' },
    ],
  },
};

// Cover gets the SETTLE variant — same DNA, a hair of blur on enter.
Cover.transition = {
  duration: 340,
  exit: {
    duration: 180,
    easing: EASE_IN,
    keyframes: [
      { opacity: 1, transform: 'translateY(0)' },
      { opacity: 0, transform: 'translateY(-6px)' },
    ],
  },
  enter: {
    duration: 340,
    delay: 120,
    easing: EASE_OUT,
    keyframes: [
      { opacity: 0, transform: 'translateY(12px)', filter: 'blur(4px)' },
      { opacity: 1, transform: 'translateY(0)', filter: 'blur(0)' },
    ],
  },
};

export const meta: SlideMeta = {
  title: 'open-slide：從騎車時的靈感到衝上 GitHub Trending',
  createdAt: '2026-07-31T16:18:33.859Z',
};
export default [Cover, Logo, Stars, Meetup] satisfies Page[];
