import { useEffect, useLayoutEffect, useRef, useState } from 'react';
import OptionWheel from './OptionWheel.jsx';
import './ProjectsStory.css';

const FLY_MS = 480;

const PROJECTS = [
  {
    name: 'Aurora',
    kicker: 'Spatial interface',
    copy: 'A lighting and materials study for realtime spatial UI. Placeholder copy for now — the real writeup goes here later.',
    links: ['Live', 'Code', 'Notes', 'Film'],
  },
  {
    name: 'Lumen',
    kicker: 'Visual system',
    copy: 'Type, color, and motion rules for a product that has to feel quiet and precise. Swap this text when you are ready.',
    links: ['Live', 'Code', 'Deck', 'Stills'],
  },
  {
    name: 'Drift',
    kicker: 'Interaction prototype',
    copy: 'Pointer-driven distortion and page transitions, tuned so the surface feels like metal instead of glass. Placeholder body copy.',
    links: ['Demo', 'Code', 'Notes', 'Clip'],
  },
  {
    name: 'Nimbus',
    kicker: 'Editorial site',
    copy: 'A long-form layout with a left-rail selector and a single focused panel. This card is just holding space for later content.',
    links: ['Site', 'Code', 'Figma', 'Copy'],
  },
  {
    name: 'Pulse',
    kicker: 'Motion study',
    copy: 'Timing, easing, and residual blur across a set of UI states. Temporary description until the project details land.',
    links: ['Live', 'Code', 'Study', 'Still'],
  },
  {
    name: 'Echo',
    kicker: 'Personal tool',
    copy: 'A small utility with a big surface. Use this slot for the next project — title, story, and links can all change.',
    links: ['App', 'Code', 'Log', 'Shot'],
  },
];

const PROJECT_NAMES = PROJECTS.map(item => item.name);

export default function ProjectsStory({ fromRect, closing, onDismiss }) {
  const tabRef = useRef(null);
  const [phase, setPhase] = useState('fly');
  const [selected, setSelected] = useState(0);
  const [hasSwapped, setHasSwapped] = useState(false);

  const project = PROJECTS[selected] ?? PROJECTS[0];

  useLayoutEffect(() => {
    if (closing) return;
    const el = tabRef.current;
    if (!el || !fromRect) return;

    const to = el.getBoundingClientRect();
    const dx = fromRect.left - to.left;
    const dy = fromRect.top - to.top;
    const sx = fromRect.width / Math.max(to.width, 1);
    const sy = fromRect.height / Math.max(to.height, 1);

    el.style.transformOrigin = 'top left';
    el.style.transform = `translate(${dx}px, ${dy}px) scale(${sx}, ${sy})`;
    el.style.overflow = 'hidden';

    const id = requestAnimationFrame(() => {
      el.style.transition = `transform ${FLY_MS}ms cubic-bezier(0.22, 1, 0.36, 1)`;
      el.style.transform = 'none';
    });
    const done = setTimeout(() => {
      el.style.transition = '';
      el.style.overflow = '';
      el.style.transformOrigin = '';
      setPhase('in');
    }, FLY_MS);

    return () => {
      cancelAnimationFrame(id);
      clearTimeout(done);
    };
  }, [fromRect, closing]);

  useEffect(() => {
    const onKey = e => {
      if (e.key === 'Escape') onDismiss();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [onDismiss]);

  return (
    <div
      className={`projects-story${phase === 'in' && !closing ? ' is-in' : ''}${closing ? ' is-out' : ''}`}
      onClick={onDismiss}
    >
      <div className="projects-story__layout">
        <div className="projects-story__wheel" onClick={e => e.stopPropagation()}>
          <OptionWheel
            items={PROJECT_NAMES}
            defaultSelected={0}
            textColor="#8a9098"
            activeColor="#2a2e34"
            side="left"
            fontSize={2.15}
            spacing={1.5}
            curve={1}
            tilt={5.5}
            blur={1.8}
            fade={0.22}
            minOpacity={0.08}
            smoothing={180}
            inset={36}
            loop={false}
            draggable
            onChange={index => {
              setSelected(index);
              if (phase === 'in') setHasSwapped(true);
            }}
          />
        </div>

        <div className="projects-story__panel">
          <article
            key={hasSwapped ? project.name : 'seed'}
            ref={tabRef}
            className={`projects-tab${phase === 'fly' ? ' is-flying' : ''}${hasSwapped ? ' is-swap' : ''}`}
            onClick={e => e.stopPropagation()}
          >
            <p className="projects-tab__kicker">{project.kicker}</p>
            <h2 className="projects-tab__title">{project.name}</h2>
            <p className="projects-tab__copy">{project.copy}</p>
            <div className="projects-tab__actions">
              {project.links.map(label => (
                <span key={label} className="projects-tab__action">
                  {label}
                </span>
              ))}
            </div>
          </article>
        </div>
      </div>
    </div>
  );
}
