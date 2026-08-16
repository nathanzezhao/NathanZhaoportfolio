import { useEffect, useRef, useState } from 'react';
import OptionWheel from './OptionWheel.jsx';
import './ProjectsStory.css';

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
];

const PROJECT_NAMES = PROJECTS.map(item => item.name);

const IconChevron = ({ dir }) => (
  <svg className="projects-wheel-nav__icon" viewBox="0 0 24 24" aria-hidden="true">
    <path
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      d={dir === 'up' ? 'M6 14.5 12 8.5l6 6' : 'M6 9.5 12 15.5l6-6'}
    />
  </svg>
);

export default function ProjectsStory({ closing, onDismiss }) {
  const wheelRef = useRef(null);
  const [selected, setSelected] = useState(0);

  const project = PROJECTS[selected] ?? PROJECTS[0];

  useEffect(() => {
    const id = requestAnimationFrame(() => {
      wheelRef.current?.focus();
    });
    return () => cancelAnimationFrame(id);
  }, []);

  useEffect(() => {
    const onKey = e => {
      if (e.key === 'Escape') onDismiss();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [onDismiss]);

  return (
    <div
      className={`projects-story${closing ? ' is-out' : ''}`}
      onClick={onDismiss}
    >
      <div className="projects-story__layout">
        <div className="projects-story__wheel" onClick={e => e.stopPropagation()}>
          <div className="projects-wheel-nav">
            <button
              type="button"
              className="projects-wheel-nav__btn"
              aria-label="Previous project"
              onClick={() => wheelRef.current?.step(-1)}
            >
              <IconChevron dir="up" />
            </button>
            <button
              type="button"
              className="projects-wheel-nav__btn"
              aria-label="Next project"
              onClick={() => wheelRef.current?.step(1)}
            >
              <IconChevron dir="down" />
            </button>
          </div>
          <OptionWheel
            ref={wheelRef}
            items={PROJECT_NAMES}
            defaultSelected={0}
            textColor="#3d4248"
            activeColor="#1a1d21"
            side="left"
            fontSize={1.85}
            spacing={1.42}
            curve={0.85}
            tilt={4.8}
            blur={0.55}
            fade={0.07}
            minOpacity={0.68}
            smoothing={55}
            inset={28}
            loop={false}
            draggable
            onChange={index => {
              setSelected(index);
            }}
          />
        </div>

        <div className="projects-story__panel">
          <article
            className="projects-tab"
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
