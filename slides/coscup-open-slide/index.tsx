import React from 'react';
import type { DesignSystem, Page, SlideMeta, SlideTransition } from '@open-slide/core';
import { useIsActivePage } from '@open-slide/core';
import avatar from '@assets/avatar.jpg';
import geistFont from '@assets/geist.woff2';
import geistMonoFont from '@assets/geist-mono.woff2';
import openSlide from './assets/open-slide.png';
import cursorMeetup from './assets/cursor-meetup.webp';

export const notes: (string | undefined)[] = [
  undefined,
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
@media (prefers-reduced-motion: reduce) {
  .coscup-rise, .coscup-bloom, .coscup-draw, .coscup-fade, .coscup-token, .coscup-settle { animation: none; }
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

// Page 13 — the payoff: the idea arrives. App-splash reveal of the mark.
const IdeaBorn: Page = () => {
  const animate = useIsActivePage();

  return (
    <div
      style={{
        ...fill,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 72,
      }}
    >
      <style>{entranceCss}</style>

      <div
        className={animate ? 'coscup-bloom' : undefined}
        style={{
          width: 200,
          height: 200,
          borderRadius: 48,
          overflow: 'hidden',
          boxShadow: '0 0 0 1px rgba(255, 255, 255, 0.12)',
          animationDelay: '0ms',
        }}
      >
        <img
          src={openSlide}
          alt="open-slide logo"
          style={{ width: 200, height: 200, objectFit: 'cover' }}
        />
      </div>

      <h2
        className={animate ? 'coscup-rise' : undefined}
        style={{
          fontFamily: 'var(--osd-font-display)',
          fontSize: 'var(--osd-size-hero)',
          fontWeight: 700,
          letterSpacing: '-0.02em',
          lineHeight: 1.05,
          margin: 0,
          color: 'var(--osd-text)',
          animationDelay: '600ms',
        }}
      >
        open-slide
      </h2>
    </div>
  );
};

// The reveal gets the second (and last) BREATH of the deck.
IdeaBorn.transition = {
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
  IdeaBorn,
] satisfies Page[];
