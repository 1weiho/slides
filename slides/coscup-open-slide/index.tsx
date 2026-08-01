import React from 'react';
import type { DesignSystem, Page, SlideMeta, SlideTransition } from '@open-slide/core';
import { ImagePlaceholder, MorphElement, Step, Steps, useIsActivePage } from '@open-slide/core';
import avatar from '@assets/avatar.jpg';
import geistFont from '@assets/geist.woff2';
import geistMonoFont from '@assets/geist-mono.woff2';
import openSlide from './assets/open-slide.png';
import cursorMeetup from './assets/cursor-meetup.webp';
import claudeIcon from './assets/claude-ai-icon.svg';
import firstVersion from './assets/first-version.webp';
import launchVideo from './assets/launch-video.webp';


export const notes: (string | undefined)[] = [
  "https://coscup.org/2026/session/JTPCAZ",
  undefined,
  undefined,
  undefined,
  undefined,
  "每次生成 HTML 需花費大量 Token 讓 Agent 去製作頁數、播放等簡報基礎",
  "每次生成的操作 UI 都不同",
  "每次產出的 HTML 都是散落的",
  undefined,
  "如果可以有個統一的框架",
  "如果可以只讓 agent 生成簡報的視覺",
  "如果可以在一個 workspace 中生成多個且可管理的簡報",
];


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
}
@font-face {
  font-family: 'Geist Mono';
  src: url('${geistMonoFont}') format('woff2');
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
const monoFont = '"Geist Mono", ui-monospace, "SF Mono", Menlo, monospace';

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
@keyframes coscup-token {
  0%   { opacity: 0; transform: translate(var(--dx), var(--dy)) scale(1); }
  15%  { opacity: 0.85; }
  80%  { opacity: 0.85; }
  100% { opacity: 0; transform: translate(0, 0) scale(0.3); }
}
.coscup-rise  { animation: coscup-rise  1200ms ${EASE_ENTRANCE} both; }
.coscup-bloom { animation: coscup-bloom 1400ms ${EASE_ENTRANCE} both; }
.coscup-draw  { animation: coscup-draw  1800ms ${EASE_OUT} 600ms both; }
.coscup-fade  { animation: coscup-fade  600ms ${EASE_OUT} both; }
.coscup-token { animation: coscup-token 1000ms cubic-bezier(0.4, 0, 0.2, 1) both; }
@keyframes coscup-settle {
  from { opacity: 0; transform: translate(var(--sx, 0px), var(--sy, 0px)) rotate(var(--sr, 0deg)); }
  to   { opacity: 1; transform: translate(0, 0) rotate(0deg); }
}
.coscup-settle { animation: coscup-settle 1100ms ${EASE_ENTRANCE} both; }
@keyframes coscup-hide {
  from { opacity: 1; }
  to   { opacity: 0; }
}
.coscup-hide { animation: coscup-hide 400ms ${EASE_OUT} both; }
@media (prefers-reduced-motion: reduce) {
  .coscup-rise, .coscup-bloom, .coscup-draw, .coscup-fade, .coscup-token, .coscup-settle { animation: none; }
  .coscup-hide { animation: none; opacity: 0; }
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
        justifyContent: 'space-between',
        padding: '120px 160px',
        textAlign: 'left',
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
        COSCUP 2026
      </div>

      <div>
        <h1
          className={rise}
          style={{
            fontFamily: 'var(--osd-font-display)',
            fontSize: 'var(--osd-size-hero)',
            fontWeight: 700,
            letterSpacing: '-0.03em',
            lineHeight: 1.05,
            margin: 0,
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
            fontSize: 50,
            fontWeight: 600,
            letterSpacing: '-0.01em',
            lineHeight: 1.3,
            margin: '28px 0 0',
            color: 'rgba(245, 245, 247, 0.6)',
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
            gap: 24,
            marginTop: 88,
            animationDelay: '700ms',
          }}
        >
          <div
            style={{
              width: 88,
              height: 88,
              borderRadius: '50%',
              overflow: 'hidden',
              flexShrink: 0,
              boxShadow: '0 0 0 1px rgba(255, 255, 255, 0.12)',
            }}
          >
            <img src={avatar} alt='講者大頭照（Avatar）' style={{ width: 88, height: 88, objectFit: 'cover', objectPosition: '50% 50%' }} />
          </div>
          <div style={{ fontSize: 36, fontWeight: 500, color: 'var(--osd-text)' }}>Yiwei Ho</div>
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
const useCountUp = (
  target: number,
  active: boolean,
  delay: number,
  duration: number,
  ease: (t: number) => number = easeOutQuint,
) => {
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
      setValue(Math.round(target * ease(t)));
      if (t < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [target, active, delay, duration, ease]);
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
          fontFamily: monoFont,
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

// Monochrome mock of a slide running as a plain HTML file in a browser.
const HtmlFile: Page = () => {
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

      <div
        className={rise}
        style={{
          width: 1460,
          borderRadius: 20,
          border: '1px solid rgba(255, 255, 255, 0.14)',
          background: '#111114',
          overflow: 'hidden',
          animationDelay: '0ms',
        }}
      >
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            height: 84,
            padding: '0 28px',
            borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
          }}
        >
          <div style={{ display: 'flex', gap: 12, flexShrink: 0 }}>
            <div style={{ width: 16, height: 16, borderRadius: '50%', background: 'rgba(255, 255, 255, 0.22)' }} />
            <div style={{ width: 16, height: 16, borderRadius: '50%', background: 'rgba(255, 255, 255, 0.22)' }} />
            <div style={{ width: 16, height: 16, borderRadius: '50%', background: 'rgba(255, 255, 255, 0.22)' }} />
          </div>
          <div
            style={{
              flex: 1,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 120px 0 72px',
              height: 48,
              borderRadius: 12,
              background: 'rgba(255, 255, 255, 0.06)',
              fontFamily: monoFont,
              fontSize: 24,
            }}
          >
            <span style={{ color: muted }}>file:///Users/speaker/talk/</span>
            <span style={{ color: 'var(--osd-text)' }}>k8s-talk.html</span>
          </div>
        </div>

        <div
          style={{
            position: 'relative',
            height: 740,
            background: '#fafafa',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            textAlign: 'left',
            padding: '0 96px',
          }}
        >
          <div
            style={{
              fontSize: 20,
              fontWeight: 600,
              letterSpacing: '0.18em',
              color: '#8e8e93',
            }}
          >
            AGENDA
          </div>
          <div
            style={{
              fontFamily: 'var(--osd-font-display)',
              fontSize: 54,
              fontWeight: 700,
              letterSpacing: '-0.01em',
              lineHeight: 1.2,
              marginTop: 20,
              color: '#111114',
            }}
          >
            深入淺出 Kubernetes
          </div>
          <ul
            style={{
              margin: '40px 0 0',
              padding: 0,
              listStylePosition: 'inside',
              fontSize: 32,
              lineHeight: 1.9,
              color: '#3a3a3c',
            }}
          >
            <li>為什麼需要容器編排</li>
            <li>Pod、Service、Deployment 三分鐘搞懂</li>
            <li>踩坑經驗與實戰案例</li>
          </ul>
          <div
            style={{
              position: 'absolute',
              right: 40,
              bottom: 30,
              fontFamily: monoFont,
              fontSize: 22,
              color: '#8e8e93',
            }}
          >
            12 / 48
          </div>
        </div>
      </div>
    </div>
  );
};

// ——— Pain-point triptych (pages 6–8): pure graphics, narrated live ———

const wire = 'rgba(255, 255, 255, 0.28)';
const wireDim = 'rgba(255, 255, 255, 0.12)';
const wireBright = 'rgba(255, 255, 255, 0.85)';

const Chevron = ({ dir, size = 28, color = wireBright }: { dir: 'left' | 'right'; size?: number; color?: string }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" style={{ display: 'block' }}>
    <polyline
      points={dir === 'left' ? '15,4 8,12 15,20' : '9,4 16,12 9,20'}
      fill="none"
      stroke={color}
      strokeWidth={2.5}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

const Dot = ({ on = false }: { on?: boolean }) => (
  <div
    style={{
      width: 10,
      height: 10,
      borderRadius: '50%',
      background: on ? wireBright : 'rgba(255, 255, 255, 0.25)',
      transition: `background 300ms ${EASE_OUT}`,
    }}
  />
);

const SkeletonLines = () => (
  <div style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
    <div style={{ width: '52%', height: 30, borderRadius: 8, background: 'rgba(255, 255, 255, 0.30)' }} />
    <div style={{ width: '72%', height: 16, borderRadius: 6, background: wireDim }} />
    <div style={{ width: '60%', height: 16, borderRadius: 6, background: wireDim }} />
  </div>
);

// One flying token particle. --dx/--dy set its start offset; it converges
// on the player chrome and dissolves, looping while the page is active.
const TokenDot = ({ dx, dy, delay }: { dx: number; dy: number; delay: number }) => (
  <div
    className="coscup-token"
    style={
      {
        position: 'absolute',
        width: 13,
        height: 13,
        borderRadius: 4,
        background: 'rgba(255, 255, 255, 0.75)',
        '--dx': `${dx}px`,
        '--dy': `${dy}px`,
        animationDelay: `${delay}ms`,
      } as React.CSSProperties
    }
  />
);

// One thumbnail in the sidebar preview rail.
const Thumb = ({ on = false, delay, animate }: { on?: boolean; delay: number; animate: boolean }) => (
  <div
    className={animate ? 'coscup-fade' : undefined}
    style={{
      width: 152,
      height: 88,
      borderRadius: 10,
      border: `2px solid ${on ? wire : wireDim}`,
      background: on ? 'rgba(255, 255, 255, 0.10)' : 'transparent',
      flexShrink: 0,
      animationDelay: `${delay}ms`,
      transition: `border-color 300ms ${EASE_OUT}, background 300ms ${EASE_OUT}`,
    }}
  />
);

// A burst of tokens converging on one exact chrome target. The group sits
// at the target's center, so every particle lands precisely on it.
const TokenBurst = ({ x, y, start }: { x: number; y: number; start: number }) => (
  <div style={{ position: 'absolute', left: x, top: y }}>
    <TokenDot dx={-560} dy={-420} delay={start} />
    <TokenDot dx={340} dy={-580} delay={start + 60} />
    <TokenDot dx={520} dy={-500} delay={start + 130} />
    <TokenDot dx={-640} dy={-280} delay={start + 190} />
    <TokenDot dx={-720} dy={-100} delay={start + 260} />
    <TokenDot dx={140} dy={-660} delay={start + 320} />
    <TokenDot dx={680} dy={-200} delay={start + 390} />
    <TokenDot dx={-440} dy={-520} delay={start + 450} />
    <TokenDot dx={-300} dy={-560} delay={start + 520} />
    <TokenDot dx={600} dy={-360} delay={start + 580} />
    <TokenDot dx={240} dy={-620} delay={start + 650} />
    <TokenDot dx={-180} dy={-700} delay={start + 710} />
  </div>
);

// Page 6 — tokens burn on rebuilding the same player chrome every time.
// The player assembles piece by piece: thumbnail rail → prev/next →
// pagination dots → fullscreen — and only THEN does the actual slide
// content get generated, burning the counter into the 300k range.
const FRAME_W = 1120;
const FRAME_H = 620;
const RAIL_W = 200;
const BAR_H = 92;

const TOKEN_UI = 135327; // spent on player chrome (phases 1–4, ends ~6.0s)
const TOKEN_TOTAL = 334127; // after generating the content itself
const TOKEN_DURATION = 8200;
const UI_SHARE = TOKEN_UI / TOKEN_TOTAL;
const UI_TIME = 6000 / TOKEN_DURATION;
// Steady burn while the chrome builds, then a faster second surge for
// the content phase, easing out into the final total.
const tokenEase = (t: number) =>
  t < UI_TIME
    ? (t / UI_TIME) * UI_SHARE
    : UI_SHARE + (1 - Math.pow(1 - (t - UI_TIME) / (1 - UI_TIME), 3)) * (1 - UI_SHARE);

const TokenCost: Page = () => {
  const animate = useIsActivePage();
  const tokenCount = useCountUp(TOKEN_TOTAL, animate, 200, TOKEN_DURATION, tokenEase);

  return (
    <div
      style={{
        ...fill,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 48,
      }}
    >
      <style>{entranceCss}</style>

      <div
        className={animate ? 'coscup-bloom' : undefined}
        style={{
          position: 'relative',
          width: FRAME_W,
          height: FRAME_H,
          border: `2px solid ${wire}`,
          borderRadius: 24,
        }}
      >
        {/* Phase 1 — sidebar preview rail */}
        <div
          style={{
            position: 'absolute',
            left: 0,
            top: 0,
            bottom: 0,
            width: RAIL_W,
            borderRight: `2px solid ${wireDim}`,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: 18,
            padding: '24px 0',
          }}
        >
          <Thumb on delay={800} animate={animate} />
          <Thumb delay={950} animate={animate} />
          <Thumb delay={1100} animate={animate} />
          <Thumb delay={1250} animate={animate} />
          <Thumb delay={1400} animate={animate} />
        </div>

        {/* Phase 5 — the content itself, generated last */}
        <div
          className={animate ? 'coscup-fade' : undefined}
          style={{
            position: 'absolute',
            left: RAIL_W,
            right: 0,
            top: 0,
            padding: '64px 72px',
            animationDelay: '6900ms',
          }}
        >
          <SkeletonLines />
        </div>

        {/* Bottom control bar */}
        <div
          style={{
            position: 'absolute',
            left: RAIL_W,
            right: 0,
            bottom: 0,
            height: BAR_H,
            borderTop: `2px solid ${wireDim}`,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '0 48px',
          }}
        >
          {/* Phase 2 — prev / next */}
          <div
            className={animate ? 'coscup-fade' : undefined}
            style={{ display: 'flex', gap: 24, animationDelay: '2450ms' }}
          >
            <Chevron dir="left" />
            <Chevron dir="right" />
          </div>
          {/* Phase 3 — pagination dots */}
          <div
            className={animate ? 'coscup-fade' : undefined}
            style={{ display: 'flex', gap: 16, animationDelay: '3850ms' }}
          >
            <Dot on />
            <Dot />
            <Dot />
            <Dot />
            <Dot />
          </div>
          {/* Phase 4 — fullscreen */}
          <div
            className={animate ? 'coscup-fade' : undefined}
            style={{ animationDelay: '5250ms' }}
          >
            <svg width={30} height={30} viewBox="0 0 24 24" style={{ display: 'block' }}>
              <path
                d="M4 9 V4 H9 M15 4 H20 V9 M20 15 V20 H15 M9 20 H4 V15"
                fill="none"
                stroke={wireBright}
                strokeWidth={2.2}
                strokeLinecap="round"
              />
            </svg>
          </div>
        </div>

        {animate && (
          <>
            {/* Targets: rail center, chevron pair, dot row, fullscreen icon */}
            <TokenBurst x={RAIL_W / 2} y={FRAME_H / 2} start={200} />
            <TokenBurst x={RAIL_W + 48 + 42} y={FRAME_H - BAR_H / 2} start={1600} />
            <TokenBurst x={RAIL_W + (FRAME_W - RAIL_W) / 2} y={FRAME_H - BAR_H / 2} start={3000} />
            <TokenBurst x={FRAME_W - 48 - 15} y={FRAME_H - BAR_H / 2} start={4400} />
            {/* Phase 5 — bursts land on the skeleton elements themselves.
                Content box starts at x = RAIL_W + 72, y = 64; inner width 776. */}
            <TokenBurst x={RAIL_W + 72 + 0.52 * 776 * 0.5} y={64 + 15} start={6000} />
            <TokenBurst x={RAIL_W + 72 + 0.72 * 776 * 0.5} y={112 + 8} start={6350} />
            <TokenBurst x={RAIL_W + 72 + 0.6 * 776 * 0.5} y={146 + 8} start={6700} />
          </>
        )}
      </div>

      <div
        className={animate ? 'coscup-fade' : undefined}
        style={{
          fontFamily: monoFont,
          fontSize: 36,
          fontVariantNumeric: 'tabular-nums',
          animationDelay: '200ms',
        }}
      >
        <span style={{ color: muted }}>Token: </span>
        <span style={{ color: 'var(--osd-text)', fontWeight: 600 }}>
          {tokenCount.toLocaleString('en-US')}
        </span>
      </div>
    </div>
  );
};

// Page 7 — same skeleton, three different control layouts every generation.
const InconsistentUI: Page = () => {
  const animate = useIsActivePage();
  const rise = animate ? 'coscup-rise' : undefined;

  const card = {
    position: 'relative',
    width: 460,
    height: 520,
    border: `2px solid ${wire}`,
    borderRadius: 20,
    flexShrink: 0,
  } as const;

  return (
    <div
      style={{
        ...fill,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 60,
      }}
    >
      <style>{entranceCss}</style>

      <div className={rise} style={{ ...card, animationDelay: '0ms' }}>
        <div style={{ padding: '52px 48px' }}>
          <SkeletonLines />
        </div>
        <div
          style={{
            position: 'absolute',
            left: 0,
            right: 0,
            bottom: 36,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 24,
          }}
        >
          <Chevron dir="left" size={24} />
          <div style={{ display: 'flex', gap: 12 }}>
            <Dot on />
            <Dot />
            <Dot />
            <Dot />
          </div>
          <Chevron dir="right" size={24} />
        </div>
      </div>

      <div className={rise} style={{ ...card, animationDelay: '220ms' }}>
        <div
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '58%',
            height: 5,
            borderRadius: '20px 0 4px 0',
            background: wireBright,
          }}
        />
        <div style={{ padding: '52px 48px' }}>
          <SkeletonLines />
        </div>
        <div style={{ position: 'absolute', left: 20, top: '50%', transform: 'translateY(-50%)' }}>
          <Chevron dir="left" size={30} />
        </div>
        <div style={{ position: 'absolute', right: 20, top: '50%', transform: 'translateY(-50%)' }}>
          <Chevron dir="right" size={30} />
        </div>
      </div>

      <div className={rise} style={{ ...card, animationDelay: '440ms' }}>
        <div style={{ padding: '52px 48px' }}>
          <SkeletonLines />
        </div>
        <div
          style={{
            position: 'absolute',
            right: 28,
            top: '50%',
            transform: 'translateY(-50%)',
            display: 'flex',
            flexDirection: 'column',
            gap: 12,
          }}
        >
          <Dot on />
          <Dot />
          <Dot />
          <Dot />
        </div>
        <div
          style={{
            position: 'absolute',
            left: 40,
            bottom: 32,
            width: 60,
            height: 60,
            borderRadius: '50%',
            border: `2px solid ${wireBright}`,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <svg width={22} height={22} viewBox="0 0 24 24">
            <polygon points="8,5 19,12 8,19" fill={wireBright} />
          </svg>
        </div>
        <div
          style={{
            position: 'absolute',
            left: 0,
            right: 120,
            bottom: 0,
            height: 5,
            borderRadius: '0 4px 0 20px',
            background: wireDim,
          }}
        />
      </div>
    </div>
  );
};

// One scattered .html file card.
const HtmlCard = ({
  name,
  x,
  y,
  rot,
  delay,
  animate,
}: {
  name: string;
  x: number;
  y: number;
  rot: number;
  delay: number;
  animate: boolean;
}) => (
  <div style={{ position: 'absolute', left: x, top: y, transform: `rotate(${rot}deg)` }}>
    <div
      className={animate ? 'coscup-rise' : undefined}
      style={{
        width: 200,
        height: 244,
        border: `2px solid ${wire}`,
        borderRadius: 16,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 24,
        animationDelay: `${delay}ms`,
      }}
    >
      <div style={{ fontFamily: monoFont, fontSize: 40, fontWeight: 500, color: wireBright }}>
        {'</>'}
      </div>
      <div style={{ fontFamily: monoFont, fontSize: 19, color: muted, maxWidth: 176, textAlign: 'center' }}>
        {name}
      </div>
    </div>
  </div>
);

// Page 8 — every run leaves another stray .html behind.
const Scattered: Page = () => {
  const animate = useIsActivePage();

  return (
    <div style={{ ...fill }}>
      <style>{entranceCss}</style>
      <HtmlCard name="slides.html" x={260} y={150} rot={-9} delay={0} animate={animate} />
      <HtmlCard name="slides-v2.html" x={780} y={95} rot={5} delay={140} animate={animate} />
      <HtmlCard name="deck(3).html" x={1310} y={170} rot={-5} delay={280} animate={animate} />
      <HtmlCard name="untitled-1.html" x={510} y={480} rot={11} delay={420} animate={animate} />
      <HtmlCard name="final-FINAL.html" x={1030} y={430} rot={-12} delay={560} animate={animate} />
      <HtmlCard name="backup_old.html" x={1500} y={620} rot={8} delay={700} animate={animate} />
      <HtmlCard name="tmp.html" x={250} y={700} rot={6} delay={840} animate={animate} />
      <HtmlCard name="new-new-slides.html" x={840} y={760} rot={-6} delay={980} animate={animate} />
    </div>
  );
};

// Page 9 — chapter turn. Pure type: the pivot from pain to solution.
const WhatIf: Page = () => {
  const animate = useIsActivePage();
  const fadeDot = (delay: number) => ({
    className: animate ? 'coscup-fade' : undefined,
    style: { animationDelay: `${delay}ms` } as React.CSSProperties,
  });

  return (
    <div
      style={{
        ...fill,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <style>{entranceCss}</style>
      <h2
        className={animate ? 'coscup-rise' : undefined}
        style={{
          fontFamily: 'var(--osd-font-display)',
          fontSize: 150,
          fontWeight: 700,
          letterSpacing: '-0.02em',
          lineHeight: 1.1,
          margin: 0,
          color: 'var(--osd-text)',
          animationDelay: '0ms',
        }}
      >
        What if
        <span {...fadeDot(900)}>.</span>
        <span {...fadeDot(1300)}>.</span>
        <span {...fadeDot(1700)}>.</span>
      </h2>
    </div>
  );
};

// Section break — exit fully, hold a beat, then enter (BREATH).
WhatIf.transition = {
  duration: 460,
  exit: {
    duration: 180,
    easing: EASE_IN,
    keyframes: [{ opacity: 1 }, { opacity: 0 }],
  },
  enter: {
    duration: 240,
    delay: 300,
    easing: EASE_OUT,
    keyframes: [
      { opacity: 0, transform: 'translateY(8px)' },
      { opacity: 1, transform: 'translateY(0)' },
    ],
  },
};

// ——— What-if triptych (pages 10–12): the three answers, same wire language ———

// Page 10 — a unified framework: the whole player kit clicks into place
// in under two seconds, no tokens burned. Mirrors page 6's layout.
const Unified: Page = () => {
  const animate = useIsActivePage();
  const settleClass = animate ? 'coscup-settle' : undefined;
  const settleVars = (sx: number, sy: number, delay: number) =>
    ({
      '--sx': `${sx}px`,
      '--sy': `${sy}px`,
      animationDelay: `${delay}ms`,
    }) as React.CSSProperties;

  return (
    <div
      style={{
        ...fill,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <style>{entranceCss}</style>

      <div
        className={animate ? 'coscup-bloom' : undefined}
        style={{
          position: 'relative',
          width: FRAME_W,
          height: FRAME_H,
          border: `2px solid ${wire}`,
          borderRadius: 24,
        }}
      >
        {/* Sidebar arrives as one finished piece */}
        <div
          className={settleClass}
          style={{
            ...settleVars(-80, 0, 300),
            position: 'absolute',
            left: 0,
            top: 0,
            bottom: 0,
            width: RAIL_W,
            borderRight: `2px solid ${wireDim}`,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: 18,
            padding: '24px 0',
          }}
        >
          <Thumb on delay={0} animate={false} />
          <Thumb delay={0} animate={false} />
          <Thumb delay={0} animate={false} />
          <Thumb delay={0} animate={false} />
          <Thumb delay={0} animate={false} />
        </div>

        {/* Empty content slot, waiting for the agent */}
        <div
          className={animate ? 'coscup-fade' : undefined}
          style={{
            position: 'absolute',
            left: RAIL_W + 48,
            right: 48,
            top: 48,
            bottom: BAR_H + 40,
            border: `2px dashed ${wireDim}`,
            borderRadius: 16,
            animationDelay: '1100ms',
          }}
        />

        {/* Control bar arrives as one finished piece */}
        <div
          className={settleClass}
          style={{
            ...settleVars(0, 80, 550),
            position: 'absolute',
            left: RAIL_W,
            right: 0,
            bottom: 0,
            height: BAR_H,
            borderTop: `2px solid ${wireDim}`,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '0 48px',
          }}
        >
          <div style={{ display: 'flex', gap: 24 }}>
            <Chevron dir="left" />
            <Chevron dir="right" />
          </div>
          <div style={{ display: 'flex', gap: 16 }}>
            <Dot on />
            <Dot />
            <Dot />
            <Dot />
            <Dot />
          </div>
          <svg width={30} height={30} viewBox="0 0 24 24" style={{ display: 'block' }}>
            <path
              d="M4 9 V4 H9 M15 4 H20 V9 M20 15 V20 H15 M9 20 H4 V15"
              fill="none"
              stroke={wireBright}
              strokeWidth={2.2}
              strokeLinecap="round"
            />
          </svg>
        </div>
      </div>
    </div>
  );
};

// Page 11 — the agent only generates the visuals: chrome pre-exists,
// tokens flow into the content area alone, and the bill stays small.
const VisualOnly: Page = () => {
  const animate = useIsActivePage();
  const tokenCount = useCountUp(28540, animate, 400, 2800);

  return (
    <div
      style={{
        ...fill,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 48,
      }}
    >
      <style>{entranceCss}</style>

      <div
        className={animate ? 'coscup-bloom' : undefined}
        style={{
          position: 'relative',
          width: FRAME_W,
          height: FRAME_H,
          border: `2px solid ${wire}`,
          borderRadius: 24,
        }}
      >
        {/* Chrome already exists — static from the first frame */}
        <div
          style={{
            position: 'absolute',
            left: 0,
            top: 0,
            bottom: 0,
            width: RAIL_W,
            borderRight: `2px solid ${wireDim}`,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: 18,
            padding: '24px 0',
          }}
        >
          <Thumb on delay={0} animate={false} />
          <Thumb delay={0} animate={false} />
          <Thumb delay={0} animate={false} />
          <Thumb delay={0} animate={false} />
          <Thumb delay={0} animate={false} />
        </div>
        <div
          style={{
            position: 'absolute',
            left: RAIL_W,
            right: 0,
            bottom: 0,
            height: BAR_H,
            borderTop: `2px solid ${wireDim}`,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '0 48px',
          }}
        >
          <div style={{ display: 'flex', gap: 24 }}>
            <Chevron dir="left" />
            <Chevron dir="right" />
          </div>
          <div style={{ display: 'flex', gap: 16 }}>
            <Dot on />
            <Dot />
            <Dot />
            <Dot />
            <Dot />
          </div>
          <svg width={30} height={30} viewBox="0 0 24 24" style={{ display: 'block' }}>
            <path
              d="M4 9 V4 H9 M15 4 H20 V9 M20 15 V20 H15 M9 20 H4 V15"
              fill="none"
              stroke={wireBright}
              strokeWidth={2.2}
              strokeLinecap="round"
            />
          </svg>
        </div>

        {/* Only the content is generated */}
        <div
          style={{
            position: 'absolute',
            left: RAIL_W,
            right: 0,
            top: 0,
            padding: '64px 72px',
            display: 'flex',
            flexDirection: 'column',
            gap: 18,
          }}
        >
          <div
            className={animate ? 'coscup-fade' : undefined}
            style={{
              width: '52%',
              height: 30,
              borderRadius: 8,
              background: 'rgba(255, 255, 255, 0.30)',
              animationDelay: '900ms',
            }}
          />
          <div
            className={animate ? 'coscup-fade' : undefined}
            style={{ width: '72%', height: 16, borderRadius: 6, background: wireDim, animationDelay: '1250ms' }}
          />
          <div
            className={animate ? 'coscup-fade' : undefined}
            style={{ width: '60%', height: 16, borderRadius: 6, background: wireDim, animationDelay: '1500ms' }}
          />
          <div
            className={animate ? 'coscup-fade' : undefined}
            style={{
              width: '46%',
              height: 170,
              marginTop: 14,
              border: `2px solid ${wire}`,
              borderRadius: 12,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              animationDelay: '1900ms',
            }}
          >
            <svg width={64} height={48} viewBox="0 0 32 24">
              <circle cx="10" cy="8" r="3" fill="none" stroke={wireBright} strokeWidth={1.8} />
              <polyline
                points="3,21 12,12 18,18 24,10 29,15"
                fill="none"
                stroke={wireBright}
                strokeWidth={1.8}
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </div>
        </div>

        {animate && (
          <>
            {/* Targets: title bar, text lines, image block — element centers.
                Content box starts at x = RAIL_W + 72, y = 64; inner width 776. */}
            <TokenBurst x={RAIL_W + 72 + 0.52 * 776 * 0.5} y={64 + 15} start={300} />
            <TokenBurst x={RAIL_W + 72 + 0.72 * 776 * 0.5} y={112 + 25} start={800} />
            <TokenBurst x={RAIL_W + 72 + 0.46 * 776 * 0.5} y={194 + 85} start={1300} />
          </>
        )}
      </div>

      <div
        className={animate ? 'coscup-fade' : undefined}
        style={{
          fontFamily: monoFont,
          fontSize: 36,
          fontVariantNumeric: 'tabular-nums',
          animationDelay: '400ms',
        }}
      >
        <span style={{ color: muted }}>Token: </span>
        <span style={{ color: 'var(--osd-text)', fontWeight: 600 }}>
          {tokenCount.toLocaleString('en-US')}
        </span>
      </div>
    </div>
  );
};

// One deck card flying from a scattered pose into its grid slot.
const DeckCard = ({
  sx,
  sy,
  sr,
  delay,
  animate,
}: {
  sx: number;
  sy: number;
  sr: number;
  delay: number;
  animate: boolean;
}) => (
  <div
    className={animate ? 'coscup-settle' : undefined}
    style={
      {
        width: 360,
        height: 270,
        border: `2px solid ${wire}`,
        borderRadius: 14,
        padding: '36px 32px',
        display: 'flex',
        flexDirection: 'column',
        gap: 14,
        '--sx': `${sx}px`,
        '--sy': `${sy}px`,
        '--sr': `${sr}deg`,
        animationDelay: `${delay}ms`,
      } as React.CSSProperties
    }
  >
    <div style={{ width: '62%', height: 22, borderRadius: 6, background: 'rgba(255, 255, 255, 0.30)' }} />
    <div style={{ width: '84%', height: 12, borderRadius: 4, background: wireDim }} />
    <div style={{ width: '70%', height: 12, borderRadius: 4, background: wireDim }} />
    <div style={{ marginTop: 'auto', display: 'flex', gap: 8 }}>
      <Dot on />
      <Dot />
      <Dot />
    </div>
  </div>
);

// Page 12 — one workspace, many decks: the chaos of page 8 flies into
// a tidy managed grid.
const Workspace: Page = () => {
  const animate = useIsActivePage();

  return (
    <div
      style={{
        ...fill,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <style>{entranceCss}</style>

      <div
        className={animate ? 'coscup-bloom' : undefined}
        style={{
          width: 1280,
          border: `2px solid ${wire}`,
          borderRadius: 24,
          overflow: 'hidden',
        }}
      >
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 12,
            height: 64,
            padding: '0 28px',
            borderBottom: `2px solid ${wireDim}`,
          }}
        >
          <div style={{ width: 14, height: 14, borderRadius: '50%', background: 'rgba(255, 255, 255, 0.22)' }} />
          <div style={{ width: 14, height: 14, borderRadius: '50%', background: 'rgba(255, 255, 255, 0.22)' }} />
          <div style={{ width: 14, height: 14, borderRadius: '50%', background: 'rgba(255, 255, 255, 0.22)' }} />
        </div>

        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(3, 360px)',
            gap: 40,
            justifyContent: 'center',
            padding: '40px 0',
          }}
        >
          <DeckCard sx={-340} sy={-180} sr={-14} delay={300} animate={animate} />
          <DeckCard sx={220} sy={-260} sr={10} delay={450} animate={animate} />
          <DeckCard sx={420} sy={140} sr={8} delay={600} animate={animate} />
          <DeckCard sx={-400} sy={220} sr={12} delay={750} animate={animate} />
          <DeckCard sx={140} sy={300} sr={-10} delay={900} animate={animate} />
          <DeckCard sx={-160} sy={-320} sr={6} delay={1050} animate={animate} />
        </div>
      </div>
    </div>
  );
};

// Page 13 — chapter turn into the build: pure type, mirrors WhatIf.
const LetsBuild: Page = () => {
  const animate = useIsActivePage();

  return (
    <div
      style={{
        ...fill,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <style>{entranceCss}</style>
      <h2
        className={animate ? 'coscup-rise' : undefined}
        style={{
          fontFamily: 'var(--osd-font-display)',
          fontSize: 150,
          fontWeight: 700,
          letterSpacing: '-0.02em',
          lineHeight: 1.1,
          margin: 0,
          color: 'var(--osd-text)',
          animationDelay: '0ms',
        }}
      >
        Let&rsquo;s build it.
      </h2>
    </div>
  );
};

// Chapter turn — the deck's second and last BREATH.
LetsBuild.transition = {
  duration: 460,
  exit: {
    duration: 180,
    easing: EASE_IN,
    keyframes: [{ opacity: 1 }, { opacity: 0 }],
  },
  enter: {
    duration: 240,
    delay: 300,
    easing: EASE_OUT,
    keyframes: [
      { opacity: 0, transform: 'translateY(8px)' },
      { opacity: 1, transform: 'translateY(0)' },
    ],
  },
};

// ——— Core-goal triptych (pages 14–16): the product taking shape ———

// Page 14 — a fixed page switcher + preview rail, served as a web app.
// The player cycles pages by itself: thumbs, dots and content in sync.
const WebAppPlayer: Page = () => {
  const animate = useIsActivePage();
  const [idx, setIdx] = React.useState(0);

  React.useEffect(() => {
    if (!animate || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const timer = setInterval(() => setIdx((i) => (i + 1) % 3), 1800);
    return () => clearInterval(timer);
  }, [animate]);

  const pageStyle = (n: number) =>
    ({
      position: 'absolute',
      inset: 0,
      padding: '56px 64px',
      display: 'flex',
      flexDirection: 'column',
      gap: 16,
      opacity: idx === n ? 1 : 0,
      transition: `opacity 400ms ${EASE_OUT}`,
    }) as const;

  return (
    <div
      style={{
        ...fill,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <style>{entranceCss}</style>

      <div
        className={animate ? 'coscup-bloom' : undefined}
        style={{
          width: 1240,
          border: `2px solid ${wire}`,
          borderRadius: 24,
          overflow: 'hidden',
        }}
      >
        {/* Browser chrome — it's a web app */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            height: 72,
            padding: '0 26px',
            borderBottom: `2px solid ${wireDim}`,
          }}
        >
          <div style={{ display: 'flex', gap: 11, flexShrink: 0 }}>
            <div style={{ width: 14, height: 14, borderRadius: '50%', background: 'rgba(255, 255, 255, 0.22)' }} />
            <div style={{ width: 14, height: 14, borderRadius: '50%', background: 'rgba(255, 255, 255, 0.22)' }} />
            <div style={{ width: 14, height: 14, borderRadius: '50%', background: 'rgba(255, 255, 255, 0.22)' }} />
          </div>
          <div
            style={{
              flex: 1,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 110px 0 66px',
              height: 42,
              borderRadius: 10,
              background: 'rgba(255, 255, 255, 0.06)',
              fontFamily: monoFont,
              fontSize: 21,
              color: muted,
            }}
          >
            localhost:5173
          </div>
        </div>

        <div style={{ position: 'relative', height: 600 }}>
          {/* Preview rail — active thumb follows the live page */}
          <div
            style={{
              position: 'absolute',
              left: 0,
              top: 0,
              bottom: 0,
              width: RAIL_W,
              borderRight: `2px solid ${wireDim}`,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: 18,
              padding: '24px 0',
            }}
          >
            <Thumb on={idx === 0} delay={0} animate={false} />
            <Thumb on={idx === 1} delay={0} animate={false} />
            <Thumb on={idx === 2} delay={0} animate={false} />
            <Thumb delay={0} animate={false} />
            <Thumb delay={0} animate={false} />
          </div>

          {/* Live page content — crossfades between three layouts */}
          <div
            style={{
              position: 'absolute',
              left: RAIL_W,
              right: 0,
              top: 0,
              bottom: BAR_H,
            }}
          >
            <div style={pageStyle(0)}>
              <div style={{ width: '52%', height: 30, borderRadius: 8, background: 'rgba(255, 255, 255, 0.30)' }} />
              <div style={{ width: '72%', height: 16, borderRadius: 6, background: wireDim }} />
              <div style={{ width: '60%', height: 16, borderRadius: 6, background: wireDim }} />
            </div>
            <div style={pageStyle(1)}>
              <div style={{ width: '44%', height: 30, borderRadius: 8, background: 'rgba(255, 255, 255, 0.30)' }} />
              <div
                style={{
                  width: '58%',
                  height: 240,
                  marginTop: 10,
                  border: `2px solid ${wire}`,
                  borderRadius: 12,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <svg width={60} height={45} viewBox="0 0 32 24">
                  <circle cx="10" cy="8" r="3" fill="none" stroke={wireBright} strokeWidth={1.8} />
                  <polyline
                    points="3,21 12,12 18,18 24,10 29,15"
                    fill="none"
                    stroke={wireBright}
                    strokeWidth={1.8}
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </div>
            </div>
            <div style={{ ...pageStyle(2), alignItems: 'center', justifyContent: 'center' }}>
              <div style={{ width: '64%', height: 44, borderRadius: 10, background: 'rgba(255, 255, 255, 0.30)' }} />
              <div style={{ width: '40%', height: 16, borderRadius: 6, background: wireDim }} />
            </div>
          </div>

          {/* Fixed switcher — always the same controls */}
          <div
            style={{
              position: 'absolute',
              left: RAIL_W,
              right: 0,
              bottom: 0,
              height: BAR_H,
              borderTop: `2px solid ${wireDim}`,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              padding: '0 48px',
            }}
          >
            <div style={{ display: 'flex', gap: 24 }}>
              <Chevron dir="left" />
              <Chevron dir="right" />
            </div>
            <div style={{ display: 'flex', gap: 16 }}>
              <Dot on={idx === 0} />
              <Dot on={idx === 1} />
              <Dot on={idx === 2} />
            </div>
            <svg width={30} height={30} viewBox="0 0 24 24" style={{ display: 'block' }}>
              <path
                d="M4 9 V4 H9 M15 4 H20 V9 M20 15 V20 H15 M9 20 H4 V15"
                fill="none"
                stroke={wireBright}
                strokeWidth={2.2}
                strokeLinecap="round"
              />
            </svg>
          </div>
        </div>
      </div>
    </div>
  );
};

// One image tile in the asset panel.
const AssetTile = ({ dim = false }: { dim?: boolean }) => (
  <div
    style={{
      width: 190,
      height: 130,
      border: `2px solid ${dim ? wireDim : wire}`,
      borderRadius: 12,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
    }}
  >
    <svg width={44} height={33} viewBox="0 0 32 24">
      <circle cx="10" cy="8" r="3" fill="none" stroke={dim ? wire : wireBright} strokeWidth={1.8} />
      <polyline
        points="3,21 12,12 18,18 24,10 29,15"
        fill="none"
        stroke={dim ? wire : wireBright}
        strokeWidth={1.8}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  </div>
);

// Page 15 — assets matter: a proper asset manager, and an image flies
// from the panel straight into the slide's image slot.
const ASSET_FLY_CSS = `
@keyframes coscup-asset-fly {
  0%   { opacity: 0; transform: translate(0, 0) scale(1); }
  10%  { opacity: 1; transform: translate(0, 0) scale(1.06); }
  60%  { opacity: 1; transform: translate(-914px, 106px) scale(1.58); }
  76%  { opacity: 0; transform: translate(-914px, 106px) scale(1.58); }
  100% { opacity: 0; transform: translate(-914px, 106px) scale(1.58); }
}
.coscup-asset-fly { animation: coscup-asset-fly 2600ms ${EASE_ENTRANCE} 1200ms both; }
@media (prefers-reduced-motion: reduce) {
  .coscup-asset-fly { animation: none; opacity: 0; }
}
`;

const AssetManager: Page = () => {
  const animate = useIsActivePage();

  return (
    <div
      style={{
        ...fill,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <style>{entranceCss}</style>
      <style>{ASSET_FLY_CSS}</style>

      <div style={{ position: 'relative', display: 'flex', gap: 60 }}>
        {/* The slide, with an empty image slot */}
        <div
          className={animate ? 'coscup-bloom' : undefined}
          style={{
            width: 900,
            height: 620,
            border: `2px solid ${wire}`,
            borderRadius: 24,
            padding: '64px 72px',
            display: 'flex',
            flexDirection: 'column',
            gap: 18,
            animationDelay: '0ms',
          }}
        >
          <div style={{ width: '54%', height: 30, borderRadius: 8, background: 'rgba(255, 255, 255, 0.30)' }} />
          <div style={{ width: '74%', height: 16, borderRadius: 6, background: wireDim }} />
          <div style={{ width: '62%', height: 16, borderRadius: 6, background: wireDim }} />
          <div style={{ position: 'relative', marginTop: 22, width: 300, height: 205 }}>
            {/* Dashed slot, hidden once the asset lands */}
            <div
              className={animate ? 'coscup-hide' : undefined}
              style={{
                position: 'absolute',
                inset: 0,
                border: `2px dashed ${wireDim}`,
                borderRadius: 12,
                animationDelay: '2650ms',
              }}
            />
            {/* The landed image */}
            <div
              className={animate ? 'coscup-fade' : undefined}
              style={{
                position: 'absolute',
                inset: 0,
                border: `2px solid ${wire}`,
                borderRadius: 12,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                animationDelay: '2650ms',
              }}
            >
              <svg width={64} height={48} viewBox="0 0 32 24">
                <circle cx="10" cy="8" r="3" fill="none" stroke={wireBright} strokeWidth={1.8} />
                <polyline
                  points="3,21 12,12 18,18 24,10 29,15"
                  fill="none"
                  stroke={wireBright}
                  strokeWidth={1.8}
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </div>
          </div>
        </div>

        {/* Asset manager panel */}
        <div
          className={animate ? 'coscup-rise' : undefined}
          style={{
            width: 480,
            height: 620,
            border: `2px solid ${wire}`,
            borderRadius: 24,
            padding: 28,
            display: 'flex',
            flexDirection: 'column',
            gap: 22,
            animationDelay: '250ms',
          }}
        >
          {/* Search pill */}
          <div
            style={{
              height: 48,
              borderRadius: 12,
              background: 'rgba(255, 255, 255, 0.06)',
              display: 'flex',
              alignItems: 'center',
              padding: '0 18px',
              gap: 12,
            }}
          >
            <svg width={20} height={20} viewBox="0 0 24 24">
              <circle cx="10" cy="10" r="6" fill="none" stroke={muted} strokeWidth={2.2} />
              <line x1="15" y1="15" x2="20" y2="20" stroke={muted} strokeWidth={2.2} strokeLinecap="round" />
            </svg>
            <div style={{ width: 120, height: 12, borderRadius: 4, background: wireDim }} />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 190px)', gap: 22 }}>
            <AssetTile />
            <AssetTile dim />
            <AssetTile dim />
            <AssetTile dim />
            <AssetTile dim />
            <AssetTile dim />
          </div>
        </div>

        {/* Flying copy of the first tile → into the slot.
            Start = tile(0,0) top-left; target = slot top-left. */}
        {animate && (
          <div
            className="coscup-asset-fly"
            style={{ position: 'absolute', left: 988, top: 98, transformOrigin: 'top left' }}
          >
            <AssetTile />
          </div>
        )}
      </div>
    </div>
  );
};

// Page 16 — one workspace: new decks just appear, no per-deck init.
const OneWorkspace: Page = () => {
  const animate = useIsActivePage();

  const plusSlot = (
    <svg width={44} height={44} viewBox="0 0 24 24">
      <line x1="12" y1="5" x2="12" y2="19" stroke={muted} strokeWidth={2.2} strokeLinecap="round" />
      <line x1="5" y1="12" x2="19" y2="12" stroke={muted} strokeWidth={2.2} strokeLinecap="round" />
    </svg>
  );

  return (
    <div
      style={{
        ...fill,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <style>{entranceCss}</style>

      <div
        className={animate ? 'coscup-bloom' : undefined}
        style={{
          width: 1280,
          border: `2px solid ${wire}`,
          borderRadius: 24,
          overflow: 'hidden',
        }}
      >
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 12,
            height: 64,
            padding: '0 28px',
            borderBottom: `2px solid ${wireDim}`,
          }}
        >
          <div style={{ width: 14, height: 14, borderRadius: '50%', background: 'rgba(255, 255, 255, 0.22)' }} />
          <div style={{ width: 14, height: 14, borderRadius: '50%', background: 'rgba(255, 255, 255, 0.22)' }} />
          <div style={{ width: 14, height: 14, borderRadius: '50%', background: 'rgba(255, 255, 255, 0.22)' }} />
        </div>

        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(3, 360px)',
            gap: 40,
            justifyContent: 'center',
            padding: '40px 0',
          }}
        >
          <DeckCard sx={0} sy={0} sr={0} delay={0} animate={animate} />
          <DeckCard sx={0} sy={0} sr={0} delay={150} animate={animate} />
          <DeckCard sx={0} sy={0} sr={0} delay={300} animate={animate} />

          {/* Slot 4 — "+" becomes a real deck, instantly */}
          <div style={{ position: 'relative', width: 360, height: 270 }}>
            <div
              className={animate ? 'coscup-hide' : undefined}
              style={{
                position: 'absolute',
                inset: 0,
                border: `2px dashed ${wireDim}`,
                borderRadius: 14,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                animationDelay: '1700ms',
                opacity: animate ? undefined : 0,
              }}
            >
              {plusSlot}
            </div>
            <div
              className={animate ? 'coscup-fade' : undefined}
              style={{ position: 'absolute', inset: 0, animationDelay: '1800ms' }}
            >
              <DeckCard sx={0} sy={0} sr={0} delay={0} animate={false} />
            </div>
          </div>

          {/* Slot 5 — and the next "+" is already waiting */}
          <div
            className={animate ? 'coscup-fade' : undefined}
            style={{
              width: 360,
              height: 270,
              border: `2px dashed ${wireDim}`,
              borderRadius: 14,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              animationDelay: '2600ms',
            }}
          >
            {plusSlot}
          </div>
        </div>
      </div>
    </div>
  );
};

// Page 17 — the actual prompt, typed live into a Claude Code session.
const PROMPT_TEXT = `我要開發一個用於讓 agent 生成投影片的框架，生成的投影片是純 React，一個 slide 就是一個 tsx file。框架會提供 Page 等 component primitive，讓 agent 可以在上面自由地設計視覺；頁面切換、側邊欄預覽、簡報播放等功能則由框架提供。然後，再提供一個簡易的 web app 來檢視所有簡報。

我的想像是：

slides
├─ first-slide
│  ├─ index.tsx
│  └─ assets
└─ second-slide
   ├─ index.tsx
   └─ assets

這個 web app 可以在首頁看到有兩個 slide，而 slide 本身又是單純的 React，因此可以讓所有 AI agent 生成新的簡報或進行調整。`;

const TYPE_CSS = `
@keyframes coscup-blink {
  0%, 49% { opacity: 1; }
  50%, 100% { opacity: 0; }
}
.coscup-blink { animation: coscup-blink 1000ms step-end infinite; }
@media (prefers-reduced-motion: reduce) {
  .coscup-blink { animation: none; }
}
`;

const ClaudePrompt: Page = () => {
  const animate = useIsActivePage();
  const [typed, setTyped] = React.useState(animate ? 0 : PROMPT_TEXT.length);

  React.useEffect(() => {
    if (!animate || window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      setTyped(PROMPT_TEXT.length);
      return;
    }
    setTyped(0);
    let timer: ReturnType<typeof setInterval>;
    const kickoff = setTimeout(() => {
      timer = setInterval(() => {
        setTyped((n) => {
          if (n >= PROMPT_TEXT.length) {
            clearInterval(timer);
            return n;
          }
          return n + 1;
        });
      }, 18);
    }, 900);
    return () => {
      clearTimeout(kickoff);
      clearInterval(timer);
    };
  }, [animate]);

  return (
    <div
      style={{
        ...fill,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <style>{entranceCss}</style>
      <style>{TYPE_CSS}</style>

      <div
        className={animate ? 'coscup-bloom' : undefined}
        style={{
          width: 1400,
          height: 880,
          border: `2px solid ${wire}`,
          borderRadius: 24,
          background: '#111114',
          overflow: 'hidden',
          display: 'flex',
          flexDirection: 'column',
        }}
      >
        {/* Terminal chrome */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 11,
            height: 56,
            padding: '0 24px',
            borderBottom: `2px solid ${wireDim}`,
            flexShrink: 0,
          }}
        >
          <div style={{ width: 14, height: 14, borderRadius: '50%', background: 'rgba(255, 255, 255, 0.22)' }} />
          <div style={{ width: 14, height: 14, borderRadius: '50%', background: 'rgba(255, 255, 255, 0.22)' }} />
          <div style={{ width: 14, height: 14, borderRadius: '50%', background: 'rgba(255, 255, 255, 0.22)' }} />
          <div
            style={{
              flex: 1,
              textAlign: 'center',
              marginRight: 64,
              fontFamily: monoFont,
              fontSize: 20,
              color: muted,
            }}
          >
            claude
          </div>
        </div>

        <div style={{ flex: 1, padding: 36, display: 'flex', flexDirection: 'column', gap: 24 }}>
          {/* Session header */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
            <img src={claudeIcon} alt="Claude" style={{ width: 40, height: 40 }} />
            <div style={{ fontFamily: monoFont, fontSize: 24, color: 'var(--osd-text)', fontWeight: 500 }}>
              Claude Code
            </div>
          </div>

          {/* Prompt input */}
          <div
            style={{
              flex: 1,
              border: `2px solid ${wire}`,
              borderRadius: 16,
              padding: '24px 28px',
              fontFamily: monoFont,
              fontSize: 20,
              lineHeight: 1.65,
              color: 'var(--osd-text)',
              whiteSpace: 'pre-wrap',
            }}
          >
            <span style={{ color: muted }}>{'> '}</span>
            {PROMPT_TEXT.slice(0, typed)}
            <span
              className="coscup-blink"
              style={{ display: 'inline-block', width: 11, height: 24, background: wireBright, verticalAlign: '-3px' }}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

// Page 18 — the first try: what Claude produced, and the project
// structure it generated, as a designed file tree (no raw ASCII).
// `morphId` pairs a row across pages (18 → 19: index.tsx flies into the
// editor tab). The morph node is the inner icon+name row — the depth
// padding stays on the wrapper so the clone doesn't stretch in flight.
type TreeTone = 'hi' | 'base' | 'lo';

const TreeRow = ({
  depth,
  name,
  folder = false,
  tone = 'base',
  delay = 0,
  animate = false,
  morphId,
}: {
  depth: number;
  name: string;
  folder?: boolean;
  tone?: TreeTone;
  delay?: number;
  animate?: boolean;
  morphId?: string;
}) => {
  const iconColor = tone === 'hi' ? wireBright : tone === 'lo' ? 'rgba(255, 255, 255, 0.10)' : wire;
  const textColor =
    tone === 'hi'
      ? 'var(--osd-text)'
      : tone === 'lo'
        ? 'rgba(245, 245, 247, 0.22)'
        : 'rgba(245, 245, 247, 0.72)';
  const row = (
    // fit-content keeps the morph rect hugging the icon+name, so the 18 → 19
    // glide is a pure translate instead of a horizontal squash.
    <div style={{ display: 'flex', alignItems: 'center', gap: 14, height: 34, width: 'fit-content' }}>
      {folder ? (
        <svg width={21} height={21} viewBox="0 0 24 24" style={{ flexShrink: 0 }}>
          <path
            d="M3 7 a2 2 0 0 1 2-2 h4.5 l2 2.5 H19 a2 2 0 0 1 2 2 V17 a2 2 0 0 1-2 2 H5 a2 2 0 0 1-2-2 Z"
            fill="none"
            stroke={iconColor}
            strokeWidth={1.8}
            strokeLinejoin="round"
          />
        </svg>
      ) : (
        <svg width={21} height={21} viewBox="0 0 24 24" style={{ flexShrink: 0 }}>
          <path
            d="M6 3 h8 l4 4 v13 a1 1 0 0 1-1 1 H7 a1 1 0 0 1-1-1 Z"
            fill="none"
            stroke={iconColor}
            strokeWidth={1.8}
            strokeLinejoin="round"
          />
          <path d="M14 3 v4 h4" fill="none" stroke={iconColor} strokeWidth={1.8} strokeLinejoin="round" />
        </svg>
      )}
      <div
        style={{
          fontFamily: monoFont,
          fontSize: 21,
          color: textColor,
        }}
      >
        {name}
      </div>
    </div>
  );
  return (
    <div
      className={animate ? 'coscup-fade' : undefined}
      style={{ paddingLeft: depth * 36, animationDelay: `${delay}ms` }}
    >
      {morphId ? <MorphElement id={morphId}>{row}</MorphElement> : row}
    </div>
  );
};

// The whole generated tree, with an optional spotlight group: the
// highlighted directory's rows go bright, everything else dims. Each
// <Step> stacks an opaque copy with the next spotlight over the base.
type TreeSpot = 'slides' | 'components' | 'lib' | 'app' | null;

const FileTree = ({
  spot,
  animate = false,
  morph = false,
}: {
  spot: TreeSpot;
  animate?: boolean;
  morph?: boolean;
}) => {
  const g = (group: Exclude<TreeSpot, null>): TreeTone =>
    spot === null ? 'base' : spot === group ? 'hi' : 'lo';
  // src stays readable as context while one of its subfolders is lit.
  const srcTone: TreeTone = spot === null ? 'base' : spot === 'slides' ? 'lo' : 'base';
  const idxTone: TreeTone = spot === null || spot === 'slides' ? 'hi' : 'lo';
  const d = (i: number) => 350 + i * 40;

  return (
    <div>
      <TreeRow depth={0} name="slides" folder tone={g('slides')} delay={d(0)} animate={animate} />
      <TreeRow depth={1} name="example-deck" folder tone={g('slides')} delay={d(1)} animate={animate} />
      <TreeRow depth={2} name="index.tsx" tone={idxTone} delay={d(2)} animate={animate} morphId={morph ? 'index-file' : undefined} />
      <TreeRow depth={0} name="src" folder tone={srcTone} delay={d(3)} animate={animate} />
      <TreeRow depth={1} name="components" folder tone={g('components')} delay={d(4)} animate={animate} />
      <TreeRow depth={2} name="Player.tsx" tone={g('components')} delay={d(5)} animate={animate} />
      <TreeRow depth={2} name="SlideCanvas.tsx" tone={g('components')} delay={d(6)} animate={animate} />
      <TreeRow depth={2} name="ThumbnailRail.tsx" tone={g('components')} delay={d(7)} animate={animate} />
      <TreeRow depth={1} name="lib" folder tone={g('lib')} delay={d(8)} animate={animate} />
      <TreeRow depth={2} name="decks.ts" tone={g('lib')} delay={d(9)} animate={animate} />
      <TreeRow depth={2} name="sdk.ts" tone={g('lib')} delay={d(10)} animate={animate} />
      <TreeRow depth={1} name="routes" folder tone={g('app')} delay={d(11)} animate={animate} />
      <TreeRow depth={2} name="Deck.tsx" tone={g('app')} delay={d(12)} animate={animate} />
      <TreeRow depth={2} name="Home.tsx" tone={g('app')} delay={d(13)} animate={animate} />
      <TreeRow depth={1} name="App.tsx" tone={g('app')} delay={d(14)} animate={animate} />
      <TreeRow depth={1} name="main.tsx" tone={g('app')} delay={d(15)} animate={animate} />
      <TreeRow depth={1} name="styles.css" tone={g('app')} delay={d(16)} animate={animate} />
    </div>
  );
};

const treeOverlay = {
  position: 'absolute',
  inset: 0,
  background: 'var(--osd-bg)',
} as const;

const FirstTry: Page = () => {
  const animate = useIsActivePage();

  return (
    <div
      style={{
        ...fill,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 48,
      }}
    >
      <style>{entranceCss}</style>

      <div
        className={animate ? 'coscup-rise' : undefined}
        style={{
          fontSize: 26,
          fontWeight: 600,
          letterSpacing: '0.28em',
          color: muted,
          animationDelay: '0ms',
        }}
      >
        FIRST TRY
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: 56 }}>
        <div
          className={animate ? 'coscup-bloom' : undefined}
          style={{
            width: 1050,
            height: 599,
            border: `2px solid ${wire}`,
            borderRadius: 10,
            overflow: 'hidden',
            flexShrink: 0,
            animationDelay: '150ms',
          }}
        >
          <img
            src={firstVersion}
            alt="open-slide first version"
            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
          />
        </div>

        {/* Spotlight walkthrough: each → lights up one directory group,
            dimming the rest; the last step settles back to the full tree
            (which also carries the index.tsx morph into page 19). */}
        <div style={{ position: 'relative' }}>
          <Steps>
            <FileTree spot={null} animate={animate} />
            <Step duration={240}>
              <div style={treeOverlay}>
                <FileTree spot="slides" />
              </div>
            </Step>
            <Step duration={240}>
              <div style={treeOverlay}>
                <FileTree spot="components" />
              </div>
            </Step>
            <Step duration={240}>
              <div style={treeOverlay}>
                <FileTree spot="lib" />
              </div>
            </Step>
            <Step duration={240}>
              <div style={treeOverlay}>
                <FileTree spot="app" />
              </div>
            </Step>
            <Step duration={240}>
              <div style={treeOverlay}>
                <FileTree spot={null} morph />
              </div>
            </Step>
          </Steps>
        </div>
      </div>
    </div>
  );
};

// Code tokens for the index.tsx snippet — keywords in accent blue,
// punctuation muted, everything else default text.
const Kw = ({ children }: { children: React.ReactNode }) => (
  <span style={{ color: 'var(--osd-accent)' }}>{children}</span>
);
const Punc = ({ children }: { children: React.ReactNode }) => (
  <span style={{ color: muted }}>{children}</span>
);
const Strg = ({ children }: { children: React.ReactNode }) => (
  <span style={{ color: 'rgba(245, 245, 247, 0.72)' }}>{children}</span>
);
const Dots = () => <span style={{ color: muted }}>…</span>;

const CodeLine = ({
  delay,
  animate,
  children,
}: {
  delay: number;
  animate: boolean;
  children: React.ReactNode;
}) => (
  <div
    className={animate ? 'coscup-fade' : undefined}
    style={{ height: 48, whiteSpace: 'pre', animationDelay: `${delay}ms` }}
  >
    {children}
  </div>
);

// Page 19 — index.tsx up close: the whole deck contract in a dozen lines.
// The file glides out of page 18's tree into this editor tab (morph);
// entrances here are opacity-only so the clone owns all the motion, and
// the code lines cascade in only after the tab has landed (MORPH_MS).
const IndexSource: Page = () => {
  const animate = useIsActivePage();
  const line = (i: number) => MORPH_MS + 150 + i * 90;

  return (
    <div
      style={{
        ...fill,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 48,
      }}
    >
      <style>{entranceCss}</style>

      <div
        className={animate ? 'coscup-fade' : undefined}
        style={{
          fontSize: 26,
          fontWeight: 600,
          letterSpacing: '0.28em',
          color: muted,
          animationDelay: '0ms',
        }}
      >
        JUST REACT COMPONENTS
      </div>

      {/* No entrance animation here — this window is an ancestor of the
          morph target (the index.tsx tab), and the runtime interpolates the
          clone's opacity toward the target's effective (ancestor-multiplied)
          opacity at cut time. A fade here would make the clone fade out in
          flight; the page-level enter fade already covers the reveal. */}
      <div
        style={{
          width: 1240,
          border: `2px solid ${wire}`,
          borderRadius: 24,
          background: '#111114',
          overflow: 'hidden',
        }}
      >
        {/* Editor chrome — the tab is the morph landing spot. */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 11,
            height: 64,
            padding: '0 24px',
            borderBottom: `2px solid ${wireDim}`,
          }}
        >
          <div style={{ width: 14, height: 14, borderRadius: '50%', background: 'rgba(255, 255, 255, 0.22)' }} />
          <div style={{ width: 14, height: 14, borderRadius: '50%', background: 'rgba(255, 255, 255, 0.22)' }} />
          <div style={{ width: 14, height: 14, borderRadius: '50%', background: 'rgba(255, 255, 255, 0.22)' }} />
          <div
            style={{
              marginLeft: 18,
              padding: '6px 22px',
              borderRadius: 10,
              background: 'rgba(255, 255, 255, 0.06)',
            }}
          >
            <TreeRow depth={0} name="index.tsx" tone="hi" delay={0} animate={false} morphId="index-file" />
          </div>
          <div style={{ marginLeft: 'auto', fontFamily: monoFont, fontSize: 20, color: muted }}>
            slides/example-deck
          </div>
        </div>

        <div
          style={{
            padding: '40px 56px',
            fontFamily: monoFont,
            fontSize: 26,
            color: 'var(--osd-text)',
          }}
        >
          <CodeLine delay={line(0)} animate={animate}>
            <Kw>import type</Kw> <Punc>{'{'}</Punc> DeckMeta<Punc>,</Punc> SlidePage <Punc>{'}'}</Punc> <Kw>from</Kw> <Strg>'../../src/lib/sdk'</Strg><Punc>;</Punc>
          </CodeLine>
          <div style={{ height: 22 }} />
          <CodeLine delay={line(1)} animate={animate}>
            <Kw>const</Kw> Title<Punc>:</Punc> SlidePage <Punc>{'= () => ('}</Punc> <Dots /> <Punc>{');'}</Punc>
          </CodeLine>
          <div style={{ height: 22 }} />
          <CodeLine delay={line(2)} animate={animate}>
            <Kw>const</Kw> Contract<Punc>:</Punc> SlidePage <Punc>{'= () => ('}</Punc> <Dots /> <Punc>{');'}</Punc>
          </CodeLine>
          <div style={{ height: 22 }} />
          <CodeLine delay={line(3)} animate={animate}>
            <Kw>const</Kw> Closing<Punc>:</Punc> SlidePage <Punc>{'= () => ('}</Punc> <Dots /> <Punc>{');'}</Punc>
          </CodeLine>
          <div style={{ height: 22 }} />
          <CodeLine delay={line(4)} animate={animate}>
            <Kw>export const</Kw> meta<Punc>:</Punc> DeckMeta <Punc>{'= {'}</Punc> title<Punc>:</Punc> <Strg>'Example deck'</Strg> <Punc>{'};'}</Punc>
          </CodeLine>
          <div style={{ height: 22 }} />
          <CodeLine delay={line(5)} animate={animate}>
            <Kw>export default</Kw> <Punc>[</Punc>Title<Punc>,</Punc> Contract<Punc>,</Punc> Closing<Punc>]</Punc> <Kw>satisfies</Kw> SlidePage<Punc>[];</Punc>
          </CodeLine>
        </div>
      </div>
    </div>
  );
};

// One bundled-skill document card. `morphId` pairs it across pages 20/21;
// `dim` mutes everything but the featured skill.
const SkillCard = ({
  name,
  delay,
  animate,
  dim = false,
  morphId,
}: {
  name: string;
  delay: number;
  animate: boolean;
  dim?: boolean;
  morphId?: string;
}) => {
  const lineBg = dim ? 'rgba(255, 255, 255, 0.05)' : wireDim;
  const card = (
    <div
      className={animate ? 'coscup-rise' : undefined}
      style={{
        width: 300,
        height: 210,
        border: `2px solid ${dim ? wireDim : wire}`,
        borderRadius: 16,
        padding: '28px 30px',
        display: 'flex',
        flexDirection: 'column',
        gap: 13,
        animationDelay: `${delay}ms`,
      }}
    >
      <div
        style={{
          fontFamily: monoFont,
          fontSize: 22,
          color: dim ? 'rgba(255, 255, 255, 0.35)' : 'var(--osd-text)',
          textAlign: 'center',
        }}
      >
        {name}
      </div>
      <div style={{ width: '88%', height: 11, borderRadius: 4, background: lineBg, marginTop: 8 }} />
      <div style={{ width: '72%', height: 11, borderRadius: 4, background: lineBg }} />
      <div style={{ width: '80%', height: 11, borderRadius: 4, background: lineBg }} />
      <div style={{ width: '56%', height: 11, borderRadius: 4, background: lineBg }} />
    </div>
  );
  return morphId ? <MorphElement id={morphId}>{card}</MorphElement> : card;
};

// Page 20 — the framework is designed for agents, so it's skills-first:
// skills ship with the project, an updater keeps them fresh, and every
// primitive is documented as a skill.
const SPIN_CSS = `
@keyframes coscup-spin {
  from { transform: rotate(0deg); }
  to   { transform: rotate(720deg); }
}
.coscup-spin { animation: coscup-spin 1400ms ${EASE_ENTRANCE} 1300ms both; }
@media (prefers-reduced-motion: reduce) {
  .coscup-spin { animation: none; }
}
`;

const SkillsFirst: Page = () => {
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
      <style>{SPIN_CSS}</style>

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
        DESIGNED FOR AGENTS
      </div>

      <h2
        className={rise}
        style={{
          fontFamily: 'var(--osd-font-display)',
          fontSize: 120,
          fontWeight: 700,
          letterSpacing: '-0.02em',
          lineHeight: 1.1,
          margin: '24px 0 0',
          color: 'var(--osd-text)',
          animationDelay: '180ms',
        }}
      >
        Skills First
      </h2>

      <div style={{ display: 'flex', gap: 44, marginTop: 72 }}>
        <SkillCard name="create-slide" delay={450} animate={animate} morphId="skill-create-slide" />
        <SkillCard name="slide-authoring" delay={600} animate={animate} morphId="skill-slide-authoring" />
        <SkillCard name="apply-comments" delay={750} animate={animate} morphId="skill-apply-comments" />
      </div>

      <div
        className={animate ? 'coscup-fade' : undefined}
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: 18,
          marginTop: 56,
          padding: '18px 36px',
          border: `2px solid ${wire}`,
          borderRadius: 999,
          animationDelay: '1100ms',
        }}
      >
        <svg className={animate ? 'coscup-spin' : undefined} width={28} height={28} viewBox="0 0 24 24">
          <path
            d="M20 12a8 8 0 1 1-2.34-5.66"
            fill="none"
            stroke={wireBright}
            strokeWidth={2.2}
            strokeLinecap="round"
          />
          <polyline
            points="18,2 18,6.6 13.4,6.6"
            fill="none"
            stroke={wireBright}
            strokeWidth={2.2}
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
        <div style={{ fontFamily: monoFont, fontSize: 24, color: 'var(--osd-text)' }}>sync:skills</div>
        <div style={{ fontFamily: monoFont, fontSize: 22, color: muted }}>v1.16.0 → v1.17.1</div>
      </div>
    </div>
  );
};

// Page 21 — the cards glide left (create-slide stays lit), and a Claude
// Code session shows /create-slide being invoked with a prompt.
const MORPH_MS = 868;
const INVOKE_PROMPT = '幫我做一份「深入淺出 Kubernetes」的分享簡報，聽眾是後端工程師，10 頁以內，風格簡潔、深色系';

const SkillInvoke: Page = () => {
  const animate = useIsActivePage();
  const [typed, setTyped] = React.useState(animate ? 0 : INVOKE_PROMPT.length);

  React.useEffect(() => {
    if (!animate || window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      setTyped(INVOKE_PROMPT.length);
      return;
    }
    setTyped(0);
    let timer: ReturnType<typeof setInterval>;
    const kickoff = setTimeout(() => {
      timer = setInterval(() => {
        setTyped((n) => {
          if (n >= INVOKE_PROMPT.length) {
            clearInterval(timer);
            return n;
          }
          return n + 1;
        });
      }, 24);
    }, MORPH_MS + 900);
    return () => {
      clearTimeout(kickoff);
      clearInterval(timer);
    };
  }, [animate]);

  return (
    <div style={{ ...fill }}>
      <style>{entranceCss}</style>
      <style>{TYPE_CSS}</style>

      {/* Skill rail — same cards, now stacked left; create-slide featured */}
      <div
        style={{
          position: 'absolute',
          left: 140,
          top: 197,
          display: 'flex',
          flexDirection: 'column',
          gap: 28,
        }}
      >
        <SkillCard name="create-slide" delay={0} animate={false} morphId="skill-create-slide" />
        <SkillCard name="slide-authoring" delay={0} animate={false} dim morphId="skill-slide-authoring" />
        <SkillCard name="apply-comments" delay={0} animate={false} dim morphId="skill-apply-comments" />
      </div>

      {/* Claude Code session — revealed once the morph lands */}
      <div
        className={animate ? 'coscup-fade' : undefined}
        style={{
          position: 'absolute',
          left: 560,
          right: 140,
          top: 197,
          height: 686,
          border: `2px solid ${wire}`,
          borderRadius: 24,
          background: '#111114',
          overflow: 'hidden',
          display: 'flex',
          flexDirection: 'column',
          animationDelay: `${MORPH_MS}ms`,
        }}
      >
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 11,
            height: 56,
            padding: '0 24px',
            borderBottom: `2px solid ${wireDim}`,
            flexShrink: 0,
          }}
        >
          <div style={{ width: 14, height: 14, borderRadius: '50%', background: 'rgba(255, 255, 255, 0.22)' }} />
          <div style={{ width: 14, height: 14, borderRadius: '50%', background: 'rgba(255, 255, 255, 0.22)' }} />
          <div style={{ width: 14, height: 14, borderRadius: '50%', background: 'rgba(255, 255, 255, 0.22)' }} />
          <div
            style={{
              flex: 1,
              textAlign: 'center',
              marginRight: 64,
              fontFamily: monoFont,
              fontSize: 20,
              color: muted,
            }}
          >
            claude
          </div>
        </div>

        <div style={{ flex: 1, padding: 32, display: 'flex', flexDirection: 'column', gap: 24 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
            <img src={claudeIcon} alt="Claude" style={{ width: 36, height: 36 }} />
            <div style={{ fontFamily: monoFont, fontSize: 22, color: 'var(--osd-text)', fontWeight: 500 }}>
              Claude Code
            </div>
          </div>

          <div
            style={{
              flex: 1,
              border: `2px solid ${wire}`,
              borderRadius: 16,
              padding: '24px 28px',
              fontFamily: monoFont,
              fontSize: 22,
              lineHeight: 1.8,
              color: 'var(--osd-text)',
              whiteSpace: 'pre-wrap',
            }}
          >
            <span style={{ color: muted }}>{'> '}</span>
            <span
              style={{
                display: 'inline-block',
                padding: '2px 14px',
                borderRadius: 8,
                background: 'rgba(255, 255, 255, 0.12)',
                color: 'var(--osd-text)',
              }}
            >
              /create-slide
            </span>{' '}
            {INVOKE_PROMPT.slice(0, typed)}
            {animate && (
              <span
                className="coscup-blink"
                style={{
                  display: 'inline-block',
                  width: 12,
                  height: 26,
                  background: wireBright,
                  verticalAlign: '-4px',
                }}
              />
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

// One primitive reference doc inside the slide-authoring skill.
const DocCard = ({ name, delay, animate }: { name: string; delay: number; animate: boolean }) => (
  <div
    className={animate ? 'coscup-settle' : undefined}
    style={
      {
        width: 300,
        height: 150,
        border: `2px solid ${wire}`,
        borderRadius: 14,
        padding: '22px 26px',
        display: 'flex',
        flexDirection: 'column',
        gap: 11,
        '--sx': '-60px',
        animationDelay: `${delay}ms`,
      } as React.CSSProperties
    }
  >
    <div style={{ fontFamily: monoFont, fontSize: 19, color: 'var(--osd-text)' }}>{name}</div>
    <div style={{ width: '82%', height: 9, borderRadius: 4, background: wireDim, marginTop: 6 }} />
    <div style={{ width: '64%', height: 9, borderRadius: 4, background: wireDim }} />
    <div style={{ width: '72%', height: 9, borderRadius: 4, background: wireDim }} />
  </div>
);

// Page 22 — the highlight morphs down to slide-authoring, which unfolds
// into its real primitive reference docs.
const SkillDocs: Page = () => {
  const animate = useIsActivePage();
  const doc = (i: number) => MORPH_MS + 150 + i * 110;

  return (
    <div style={{ ...fill }}>
      <style>{entranceCss}</style>

      {/* Same rail — slide-authoring takes the light */}
      <div
        style={{
          position: 'absolute',
          left: 140,
          top: 197,
          display: 'flex',
          flexDirection: 'column',
          gap: 28,
        }}
      >
        <SkillCard name="create-slide" delay={0} animate={false} dim morphId="skill-create-slide" />
        <SkillCard name="slide-authoring" delay={0} animate={false} morphId="skill-slide-authoring" />
        <SkillCard name="apply-comments" delay={0} animate={false} dim morphId="skill-apply-comments" />
      </div>

      {/* Its reference docs emanate to the right */}
      <div
        style={{
          position: 'absolute',
          left: 560,
          right: 140,
          top: 197,
          height: 686,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 300px)', gap: 32 }}>
          <DocCard name="design-system.md" delay={doc(0)} animate={animate} />
          <DocCard name="assets.md" delay={doc(1)} animate={animate} />
          <DocCard name="webfonts.md" delay={doc(2)} animate={animate} />
          <DocCard name="steps.md" delay={doc(3)} animate={animate} />
          <DocCard name="transitions.md" delay={doc(4)} animate={animate} />
          <DocCard name="morph.md" delay={doc(5)} animate={animate} />
          <DocCard name="page-numbers.md" delay={doc(6)} animate={animate} />
        </div>
      </div>
    </div>
  );
};

// Page 23 — apply-comments in action: the cursor pins a comment on a
// slide element, Claude Code runs the skill, and the agent's edit lands
// with the comment dissolving away.
const APPLY_CSS = `
@keyframes coscup-cursor-in {
  0%   { opacity: 1; transform: translate(1100px, 760px); }
  100% { opacity: 1; transform: translate(0, 0); }
}
@keyframes coscup-click {
  0%   { transform: scale(1); }
  40%  { transform: scale(0.82); }
  100% { transform: scale(1); }
}
@keyframes coscup-pop {
  0%   { opacity: 0; transform: scale(0.4); }
  65%  { opacity: 1; transform: scale(1.1); }
  100% { opacity: 1; transform: scale(1); }
}
@keyframes coscup-pop-out {
  from { opacity: 1; transform: scale(1); }
  to   { opacity: 0; transform: scale(0.55); }
}
@keyframes coscup-bubble-in {
  from { opacity: 0; transform: translateY(8px) scale(0.88); }
  to   { opacity: 1; transform: translateY(0) scale(1); }
}
@keyframes coscup-title-grow {
  from { top: 56px; width: 320px; height: 30px; border-radius: 8px; background: rgba(255, 255, 255, 0.30); }
  to   { top: 48px; width: 480px; height: 46px; border-radius: 10px; background: rgba(255, 255, 255, 0.55); }
}
@keyframes coscup-ring {
  0%   { box-shadow: 0 0 0 0 rgba(255, 255, 255, 0); }
  35%  { box-shadow: 0 0 0 14px rgba(255, 255, 255, 0.12); }
  100% { box-shadow: 0 0 0 24px rgba(255, 255, 255, 0); }
}
`;

const APPLY_COMMENT = '這個標題再大一點';

const ApplyDemo: Page = () => {
  const animate = useIsActivePage();
  const play =
    animate &&
    (typeof window === 'undefined' ||
      !window.matchMedia('(prefers-reduced-motion: reduce)').matches);
  const [typed, setTyped] = React.useState(play ? 0 : APPLY_COMMENT.length);

  React.useEffect(() => {
    if (!play) {
      setTyped(APPLY_COMMENT.length);
      return;
    }
    setTyped(0);
    let timer: ReturnType<typeof setInterval>;
    const kickoff = setTimeout(() => {
      timer = setInterval(() => {
        setTyped((n) => {
          if (n >= APPLY_COMMENT.length) {
            clearInterval(timer);
            return n;
          }
          return n + 1;
        });
      }, 55);
    }, 3000);
    return () => {
      clearTimeout(kickoff);
      clearInterval(timer);
    };
  }, [play]);

  const appear = (delay: number) =>
    play ? { animation: `coscup-fade 600ms ${EASE_OUT} ${delay}ms both` } : undefined;

  return (
    <div style={{ ...fill }}>
      <style>{entranceCss}</style>
      <style>{APPLY_CSS}</style>
      <style>{TYPE_CSS}</style>

      {/* Same rail — apply-comments takes the light */}
      <div
        style={{
          position: 'absolute',
          left: 140,
          top: 197,
          display: 'flex',
          flexDirection: 'column',
          gap: 28,
        }}
      >
        <SkillCard name="create-slide" delay={0} animate={false} dim morphId="skill-create-slide" />
        <SkillCard name="slide-authoring" delay={0} animate={false} dim morphId="skill-slide-authoring" />
        <SkillCard name="apply-comments" delay={0} animate={false} morphId="skill-apply-comments" />
      </div>

      <div
        style={{
          position: 'absolute',
          left: 560,
          right: 140,
          top: 197,
          height: 686,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          gap: 24,
        }}
      >
        {/* The slide being reviewed */}
        <div
          className={play ? 'coscup-fade' : undefined}
          style={{
            position: 'relative',
            width: 1000,
            height: 420,
            border: `2px solid ${wire}`,
            borderRadius: 20,
            animationDelay: `${MORPH_MS}ms`,
          }}
        >
          {/* Title element — grows in place when the agent applies the edit */}
          <div
            style={{
              position: 'absolute',
              left: 64,
              top: 48,
              width: 480,
              height: 46,
              borderRadius: 10,
              background: 'rgba(255, 255, 255, 0.55)',
              ...(play
                ? {
                    animation: `coscup-title-grow 650ms ${EASE_ENTRANCE} 5200ms both, coscup-ring 900ms ${EASE_OUT} 5250ms both`,
                  }
                : {}),
            }}
          />
          <div
            style={{
              position: 'absolute',
              left: 64,
              top: 132,
              width: 560,
              height: 16,
              borderRadius: 6,
              background: wireDim,
            }}
          />
          <div
            style={{
              position: 'absolute',
              left: 64,
              top: 166,
              width: 460,
              height: 16,
              borderRadius: 6,
              background: wireDim,
            }}
          />

          {/* Inspector cursor — enters from off-canvas, clicks ON the title */}
          {play && (
            <svg
              width={26}
              height={30}
              viewBox="0 0 13 15"
              style={{
                position: 'absolute',
                left: 210,
                top: 58,
                animation: `coscup-cursor-in 1300ms ${EASE_ENTRANCE} 1000ms both, coscup-click 200ms ${EASE_OUT} 2350ms, coscup-hide 150ms ${EASE_OUT} 2470ms forwards`,
              }}
            >
              <path
                d="M1 1 L1 11.5 L4 8.8 L5.9 13.4 L7.8 12.6 L5.9 8.1 L9.6 7.9 Z"
                fill="#f5f5f7"
                stroke="#000000"
                strokeWidth={0.8}
              />
            </svg>
          )}

          {/* Comment mode — inspector selection ring with corner handles */}
          <div
            style={{
              position: 'absolute',
              left: 54,
              top: 46,
              width: 340,
              height: 50,
              border: `1.5px solid ${wireBright}`,
              borderRadius: 4,
              ...(play
                ? {
                    animation: `coscup-fade 200ms ${EASE_OUT} 2450ms both, coscup-hide 300ms ${EASE_OUT} 5100ms forwards`,
                  }
                : { opacity: 0 }),
            }}
          >
            <div style={{ position: 'absolute', left: -5, top: -5, width: 8, height: 8, background: wireBright }} />
            <div style={{ position: 'absolute', right: -5, top: -5, width: 8, height: 8, background: wireBright }} />
            <div style={{ position: 'absolute', left: -5, bottom: -5, width: 8, height: 8, background: wireBright }} />
            <div style={{ position: 'absolute', right: -5, bottom: -5, width: 8, height: 8, background: wireBright }} />
          </div>

          {/* Comment pin — the cursor becomes this at the click point */}
          <div
            style={{
              position: 'absolute',
              left: 208,
              top: 22,
              width: 40,
              height: 40,
              borderRadius: '50% 50% 50% 6px',
              border: `2px solid ${wireBright}`,
              background: '#111114',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              transformOrigin: 'bottom left',
              ...(play
                ? {
                    animation: `coscup-pop 320ms ${EASE_ENTRANCE} 2450ms both, coscup-pop-out 380ms ${EASE_OUT} 5100ms forwards`,
                  }
                : { opacity: 0 }),
            }}
          >
            <div style={{ width: 10, height: 10, borderRadius: '50%', background: wireBright }} />
          </div>

          {/* Comment bubble — springs from the pin, comment types out */}
          <div
            style={{
              position: 'absolute',
              left: 268,
              top: 6,
              width: 274,
              height: 62,
              padding: '14px 24px',
              borderRadius: '16px 16px 16px 4px',
              border: `2px solid ${wire}`,
              background: '#111114',
              fontSize: 24,
              lineHeight: '34px',
              color: 'var(--osd-text)',
              whiteSpace: 'nowrap',
              transformOrigin: 'left bottom',
              ...(play
                ? {
                    animation: `coscup-bubble-in 420ms ${EASE_ENTRANCE} 2750ms both, coscup-pop-out 380ms ${EASE_OUT} 5100ms forwards`,
                  }
                : { opacity: 0 }),
            }}
          >
            {APPLY_COMMENT.slice(0, typed)}
          </div>
        </div>

        {/* Claude Code strip */}
        <div
          className={play ? 'coscup-fade' : undefined}
          style={{
            width: 1000,
            border: `2px solid ${wire}`,
            borderRadius: 16,
            background: '#111114',
            padding: '22px 28px',
            fontFamily: monoFont,
            fontSize: 22,
            lineHeight: 1.9,
            animationDelay: `${MORPH_MS}ms`,
          }}
        >
          <div style={appear(3500)}>
            <span style={{ color: muted }}>{'> '}</span>
            <span
              style={{
                display: 'inline-block',
                padding: '2px 14px',
                borderRadius: 8,
                background: 'rgba(255, 255, 255, 0.12)',
                color: 'var(--osd-text)',
              }}
            >
              /apply-comments
            </span>
          </div>
          {/* Status line — applying… then done */}
          <div style={{ position: 'relative', height: 42 }}>
            <div
              style={{
                position: 'absolute',
                inset: 0,
                color: muted,
                ...(play
                  ? {
                      animation: `coscup-fade 500ms ${EASE_OUT} 4000ms both, coscup-hide 300ms ${EASE_OUT} 4950ms forwards`,
                    }
                  : { opacity: 0 }),
              }}
            >
              <span className="coscup-blink">⏺</span> Applying comment…
            </div>
            <div style={{ position: 'absolute', inset: 0, color: muted, ...appear(5000) }}>
              ✓ 1 comment applied
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// Page 24 — LIVE DEMO. Terminal decode: glyphs churn and lock in one by
// one, left to right, then a block cursor keeps blinking until the
// screen switch.
const DEMO_TEXT = 'Live Demo';
const DEMO_GLYPHS = '!<>-_\\/[]{}=+*^?#$%&0123456789ABCDEF';

const LiveDemo: Page = () => {
  const animate = useIsActivePage();
  const play =
    animate &&
    (typeof window === 'undefined' ||
      !window.matchMedia('(prefers-reduced-motion: reduce)').matches);
  const scramble = (locked: number) => {
    let next = '';
    for (let i = 0; i < DEMO_TEXT.length; i++) {
      if (DEMO_TEXT[i] === ' ') next += ' ';
      else if (i < locked) next += DEMO_TEXT[i];
      else next += DEMO_GLYPHS[Math.floor(Math.random() * DEMO_GLYPHS.length)];
    }
    return next;
  };
  const [display, setDisplay] = React.useState(() => (play ? scramble(0) : DEMO_TEXT));

  React.useEffect(() => {
    if (!play) {
      setDisplay(DEMO_TEXT);
      return;
    }
    setDisplay(scramble(0));
    // Scramble from the very first frame; locking starts after a beat.
    const start = performance.now() + 700;
    const timer = setInterval(() => {
      const elapsed = performance.now() - start;
      const locked = Math.max(0, Math.min(Math.floor(elapsed / 140), DEMO_TEXT.length));
      setDisplay(scramble(locked));
      if (locked >= DEMO_TEXT.length) clearInterval(timer);
    }, 40);
    return () => clearInterval(timer);
  }, [play]);

  return (
    <div
      style={{
        ...fill,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <style>{entranceCss}</style>
      <style>{TYPE_CSS}</style>

      <div
        className={animate ? 'coscup-fade' : undefined}
        style={{
          fontFamily: monoFont,
          fontSize: 150,
          fontWeight: 600,
          letterSpacing: '-0.01em',
          color: 'var(--osd-text)',
          textShadow: '0 0 60px rgba(255, 255, 255, 0.25)',
          whiteSpace: 'pre',
          animationDelay: '100ms',
        }}
      >
        <span style={{ color: muted, textShadow: 'none' }}>{'> '}</span>
        {display}
        <span
          className="coscup-blink"
          style={{
            display: 'inline-block',
            width: 74,
            height: 140,
            marginLeft: 24,
            background: wireBright,
            verticalAlign: '-12px',
          }}
        />
      </div>
    </div>
  );
};

// Shared morph transition — the 18 → 19 file-to-tab cut and the
// 20 → 23 skill-rail cuts. Opacity-only fades so the gliding clones
// carry all the motion.
const morphTransition: SlideTransition = {
  duration: 280,
  exit: {
    duration: 224,
    easing: EASE_IN,
    keyframes: [{ opacity: 1 }, { opacity: 0 }],
  },
  enter: {
    duration: 308,
    delay: 112,
    easing: EASE_OUT,
    keyframes: [{ opacity: 0 }, { opacity: 1 }],
  },
  morph: { duration: MORPH_MS, easing: 'cubic-bezier(0.4, 0, 0.2, 1)' },
};
IndexSource.transition = morphTransition;
SkillInvoke.transition = morphTransition;
SkillDocs.transition = morphTransition;
ApplyDemo.transition = morphTransition;
// Entering SkillsFirst (page 20, and stepping back 21 → 20) stays a quiet
// dissolve — no morph flag, so the unmatched ids at the 19 → 20 cut don't
// double-animate.
SkillsFirst.transition = {
  duration: 280,
  exit: {
    duration: 224,
    easing: EASE_IN,
    keyframes: [{ opacity: 1 }, { opacity: 0 }],
  },
  enter: {
    duration: 308,
    delay: 112,
    easing: EASE_OUT,
    keyframes: [{ opacity: 0 }, { opacity: 1 }],
  },
};

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
// Page 25 — chapter turn: shipping the journey in the open.
const BuildInPublic: Page = () => {
  const animate = useIsActivePage();

  return (
    <div
      style={{
        ...fill,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <style>{entranceCss}</style>
      <h2
        className={animate ? 'coscup-rise' : undefined}
        style={{
          fontFamily: 'var(--osd-font-display)',
          fontSize: 150,
          fontWeight: 700,
          letterSpacing: '-0.02em',
          lineHeight: 1.1,
          margin: 0,
          color: 'var(--osd-text)',
          animationDelay: '0ms',
        }}
      >
        Build in Public
      </h2>
    </div>
  );
};

// Page 26 — the launch tweet, recreated as a native card (self-contained,
// no external embed script).
const LaunchTweet: Page = () => {
  const animate = useIsActivePage();

  return (
    <div
      style={{
        ...fill,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <style>{entranceCss}</style>

      <div
        className={animate ? 'coscup-bloom' : undefined}
        style={{
          width: 860,
          border: `2px solid ${wire}`,
          borderRadius: 24,
          background: '#111114',
          padding: '36px 40px',
          animationDelay: '100ms',
        }}
      >
        {/* Header */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 20 }}>
          <div style={{ width: 64, height: 64, borderRadius: '50%', overflow: 'hidden', flexShrink: 0 }}>
            <img src={avatar} alt="Yiwei Ho" style={{ width: 64, height: 64, objectFit: 'cover' }} />
          </div>
          <div>
            <div style={{ fontSize: 28, fontWeight: 700, color: 'var(--osd-text)' }}>Yiwei Ho</div>
            <div style={{ fontSize: 24, color: muted }}>@1weiho</div>
          </div>
          <svg width={30} height={30} viewBox="0 0 24 24" style={{ marginLeft: 'auto' }}>
            <path
              d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"
              fill="rgba(245, 245, 247, 0.85)"
            />
          </svg>
        </div>

        {/* Body */}
        <div style={{ marginTop: 24, fontSize: 28, lineHeight: 1.5, color: 'var(--osd-text)' }}>
          <div>Introducing open-slide - The slide framework built for agents.</div>
          <div style={{ marginTop: 20 }}>Prompt your agent, get a polished deck.</div>
          <div style={{ marginTop: 20, fontFamily: monoFont, fontSize: 26 }}>
            $ npx @open-slide/cli init
          </div>
          <div style={{ marginTop: 20 }}>👇</div>
        </div>

        {/* Media */}
        <div
          style={{
            marginTop: 24,
            borderRadius: 16,
            overflow: 'hidden',
            border: `1px solid ${wireDim}`,
          }}
        >
          <img src={launchVideo} alt='推文附圖（launch demo 截圖）' style={{ width: 778, height: 420, objectFit: 'cover', objectPosition: '50% 50%' }} />
        </div>

        <div style={{ marginTop: 20, fontSize: 22, color: muted }}>9:41 AM · May 2, 2026</div>
      </div>
    </div>
  );
};

export default [
  Cover,
  Logo,
  Stars,
  Meetup,
  HtmlFile,
  TokenCost,
  InconsistentUI,
  Scattered,
  WhatIf,
  Unified,
  VisualOnly,
  Workspace,
  LetsBuild,
  WebAppPlayer,
  AssetManager,
  OneWorkspace,
  ClaudePrompt,
  FirstTry,
  IndexSource,
  SkillsFirst,
  SkillInvoke,
  SkillDocs,
  ApplyDemo,
  LiveDemo,
  BuildInPublic,
  LaunchTweet,
] satisfies Page[];
