import { useEffect, useLayoutEffect, useRef, useState } from 'react';
import waterlooSeal from '../assets/waterloo-seal.png';
import './AboutStory.css';

const IconGithub = () => (
  <svg className="story-link__icon" viewBox="0 0 24 24" aria-hidden="true">
    <path
      fill="currentColor"
      d="M12 2C6.48 2 2 6.58 2 12.26c0 4.52 2.87 8.36 6.84 9.71.5.1.68-.22.68-.49 0-.24-.01-.87-.01-1.71-2.78.62-3.37-1.37-3.37-1.37-.45-1.18-1.11-1.5-1.11-1.5-.91-.64.07-.63.07-.63 1 .07 1.53 1.06 1.53 1.06.9 1.57 2.36 1.12 2.94.86.09-.67.35-1.12.63-1.37-2.22-.26-4.56-1.14-4.56-5.07 0-1.12.39-2.03 1.03-2.75-.1-.26-.45-1.3.1-2.71 0 0 .84-.27 2.75 1.05A9.3 9.3 0 0 1 12 6.84c.85.01 1.71.12 2.51.34 1.9-1.32 2.74-1.05 2.74-1.05.55 1.41.2 2.45.1 2.71.64.72 1.03 1.63 1.03 2.75 0 3.94-2.34 4.8-4.57 5.06.36.32.68.94.68 1.9 0 1.37-.01 2.47-.01 2.81 0 .27.18.6.69.49A10.03 10.03 0 0 0 22 12.26C22 6.58 17.52 2 12 2Z"
    />
  </svg>
);

const IconLinkedin = () => (
  <svg className="story-link__icon" viewBox="0 0 24 24" aria-hidden="true">
    <path
      fill="currentColor"
      d="M20.45 20.45h-3.55v-5.57c0-1.33-.03-3.04-1.85-3.04-1.85 0-2.14 1.45-2.14 2.94v5.67H9.35V9h3.41v1.56h.05c.47-.9 1.63-1.85 3.36-1.85 3.59 0 4.26 2.36 4.26 5.44v6.3ZM5.34 7.43a2.06 2.06 0 1 1 0-4.12 2.06 2.06 0 0 1 0 4.12ZM7.12 20.45H3.56V9h3.56v11.45ZM22.23 0H1.77C.8 0 0 .77 0 1.73v20.54C0 23.22.8 24 1.77 24h20.46c.98 0 1.77-.78 1.77-1.73V1.73C24 .77 23.2 0 22.23 0Z"
    />
  </svg>
);

const IconEmail = () => (
  <svg className="story-link__icon" viewBox="0 0 24 24" aria-hidden="true">
    <path
      fill="currentColor"
      d="M20 4H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2Zm0 4-8 5L4 8V6l8 5 8-5v2Z"
    />
  </svg>
);

const IconResume = () => (
  <svg className="story-link__icon" viewBox="0 0 24 24" aria-hidden="true">
    <path
      fill="currentColor"
      d="M14 2H6c-1.1 0-2 .9-2 2v16c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V8l-6-6Zm1 15H9v-2h6v2Zm0-4H9v-2h6v2Zm-2-6V3.5L18.5 9H13Z"
    />
  </svg>
);

const LINKS = [
  { href: 'https://github.com/nathanzezhao', label: 'GitHub', icon: IconGithub },
  { href: 'https://www.linkedin.com/in/nathan-zhao-283821387/', label: 'LinkedIn', icon: IconLinkedin },
  { href: 'mailto:nathan.ze.zhao@gmail.com', label: 'Email', icon: IconEmail },
  { href: 'https://www.overleaf.com/7456295611njwfqwbmtpdm#c4cd7c', label: 'Resume', icon: IconResume },
];

const FLY_MS = 480;

const EDGE_NODES = [
  ['intro', 'midTop'],
  ['intro', 'midBot'],
  ['midTop', 'end'],
  ['midBot', 'end'],
];

const cubicEdge = (a, b) => {
  const dx = Math.max(48, Math.abs(b.x - a.x) * 0.52);
  return `M ${a.x.toFixed(2)} ${a.y.toFixed(2)} C ${(a.x + dx).toFixed(2)} ${a.y.toFixed(2)}, ${(b.x - dx).toFixed(2)} ${b.y.toFixed(2)}, ${b.x.toFixed(2)} ${b.y.toFixed(2)}`;
};

export default function AboutStory({ fromRect, closing, onDismiss }) {
  const rootRef = useRef(null);
  const introRef = useRef(null);
  const dotsRef = useRef({});
  const [phase, setPhase] = useState('fly');
  const [flyBox, setFlyBox] = useState(fromRect);
  const [lines, setLines] = useState([]);
  const [size, setSize] = useState({ w: 1, h: 1 });
  const [hoverNode, setHoverNode] = useState(null);

  useLayoutEffect(() => {
    if (closing) return;
    if (!introRef.current || !fromRect) return;
    const to = introRef.current.getBoundingClientRect();
    const id = requestAnimationFrame(() => {
      setFlyBox({
        top: to.top,
        left: to.left,
        width: to.width,
        height: to.height,
      });
    });
    const done = setTimeout(() => setPhase('in'), FLY_MS);
    return () => {
      cancelAnimationFrame(id);
      clearTimeout(done);
    };
  }, [fromRect, closing]);

  useEffect(() => {
    const measure = () => {
      const root = rootRef.current;
      if (!root) return;
      const rb = root.getBoundingClientRect();
      setSize({ w: Math.max(1, rb.width), h: Math.max(1, rb.height) });
      const pt = name => {
        const el = dotsRef.current[name];
        if (!el) return null;
        const b = el.getBoundingClientRect();
        return {
          x: b.left + b.width / 2 - rb.left,
          y: b.top + b.height / 2 - rb.top,
        };
      };
      const intro = pt('intro');
      const midTopIn = pt('midTopIn');
      const midTopOut = pt('midTopOut');
      const midBotIn = pt('midBotIn');
      const midBotOut = pt('midBotOut');
      const end = pt('end');
      if (!intro || !midTopIn || !midBotIn || !end) return;
      setLines([
        cubicEdge(intro, midTopIn),
        cubicEdge(intro, midBotIn),
        cubicEdge(midTopOut, end),
        cubicEdge(midBotOut, end),
      ]);
    };

    measure();
    const id = requestAnimationFrame(measure);
    const late = setTimeout(measure, 80);
    const later = setTimeout(measure, 520);
    const ro = new ResizeObserver(measure);
    if (rootRef.current) ro.observe(rootRef.current);
    window.addEventListener('resize', measure);
    return () => {
      cancelAnimationFrame(id);
      clearTimeout(late);
      clearTimeout(later);
      ro.disconnect();
      window.removeEventListener('resize', measure);
    };
  }, [phase, closing]);

  useEffect(() => {
    const onKey = e => {
      if (e.key === 'Escape') onDismiss();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [onDismiss]);

  const setDot = name => el => {
    dotsRef.current[name] = el;
  };

  const nodeHover = id => ({
    onMouseEnter: () => setHoverNode(id),
    onMouseLeave: () => setHoverNode(null),
  });

  const edgeHot = nodes => Boolean(hoverNode && nodes.includes(hoverNode));

  return (
    <div
      className={`about-story${phase === 'in' && !closing ? ' is-in' : ''}${closing ? ' is-out' : ''}`}
      onClick={onDismiss}
    >
      <div className="about-story__layout" ref={rootRef}>
        <svg
          className="about-story__lines"
          viewBox={`0 0 ${size.w} ${size.h}`}
          preserveAspectRatio="none"
          aria-hidden="true"
        >
          <defs>
            <linearGradient id="story-edge" x1="0" y1="0" x2="1" y2="0">
              <stop offset="0" stopColor="#ffffff" />
              <stop offset="1" stopColor="#808080" />
            </linearGradient>
            <filter id="story-edge-glow" x="-50%" y="-50%" width="200%" height="200%">
              <feGaussianBlur in="SourceGraphic" stdDeviation="2.4" result="blur" />
              <feMerge>
                <feMergeNode in="blur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
          </defs>
          {lines.map((d, i) => {
            const hot = edgeHot(EDGE_NODES[i]);
            const dim = Boolean(hoverNode && !hot);
            return (
              <g key={i} filter="url(#story-edge-glow)">
                <path
                  className={`about-story__edge about-story__edge--glow${hot ? ' is-hot' : ''}${dim ? ' is-dim' : ''}`}
                  d={d}
                />
                <path
                  className={`about-story__edge${hot ? ' is-hot' : ''}${dim ? ' is-dim' : ''}`}
                  d={d}
                />
              </g>
            );
          })}
        </svg>

        <article
          className="story-card story-card--intro"
          ref={introRef}
          style={phase === 'fly' ? { visibility: 'hidden' } : undefined}
          {...nodeHover('intro')}
        >
          <span className="story-card__title">Hey, I'm Nathan!</span>
          <span className="story-dot story-dot--right" ref={setDot('intro')} />
        </article>

        <article className="story-card story-card--mid-top" {...nodeHover('midTop')}>
          <span className="story-dot story-dot--left" ref={setDot('midTopIn')} />
          <div className="story-school">
            <img
              className="story-school__logo"
              src={waterlooSeal}
              alt=""
              draggable={false}
            />
            <p className="story-school__name">University of Waterloo</p>
            <span className="story-school__dot" aria-hidden="true">
              ·
            </span>
            <span className="story-school__term">2A</span>
          </div>
          <span className="story-dot story-dot--right" ref={setDot('midTopOut')} />
        </article>

        <article className="story-card story-card--mid-bot" {...nodeHover('midBot')}>
          <span className="story-dot story-dot--left" ref={setDot('midBotIn')} />
          <div className="story-degree">
            <span className="story-degree__badge">Bachelors of Mathematics</span>
            <div className="story-degree__tracks">
              <span className="story-degree__track story-degree__track--shaded">Applied Mathematics</span>
              <span className="story-degree__track">Combinatorics & Optimization</span>
            </div>
          </div>
          <span className="story-dot story-dot--right" ref={setDot('midBotOut')} />
        </article>

        <article
          className="story-card story-card--end"
          onClick={e => e.stopPropagation()}
          {...nodeHover('end')}
        >
          <span className="story-dot story-dot--left" ref={setDot('end')} />
          <div className="story-links">
            {LINKS.map(item => {
              const Icon = item.icon;
              return (
                <a
                  key={item.label}
                  className="story-link"
                  href={item.href}
                  target={item.href.startsWith('mailto:') ? undefined : '_blank'}
                  rel={item.href.startsWith('mailto:') ? undefined : 'noreferrer'}
                >
                  <Icon />
                  {item.label}
                </a>
              );
            })}
          </div>
        </article>
      </div>

      {phase === 'fly' && flyBox ? (
        <div
          className="story-fly"
          style={{
            top: flyBox.top,
            left: flyBox.left,
            width: flyBox.width,
            height: flyBox.height,
          }}
        >
          <span className="story-card__title">{closing ? 'About' : "Hey, I'm Nathan!"}</span>
        </div>
      ) : null}
    </div>
  );
}
