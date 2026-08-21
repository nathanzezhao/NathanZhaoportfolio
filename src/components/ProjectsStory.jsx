import { useEffect, useRef, useState } from 'react';
import {
  AppWindow,
  Braces,
  Clapperboard,
  Code,
  Code2,
  Database,
  Globe,
  Image,
  Play,
  Presentation,
  Sparkles,
  StickyNote,
  Zap,
} from 'lucide-react';
import OptionWheel from './OptionWheel.jsx';
import './ProjectsStory.css';

const PROJECTS = [
  {
    name: 'Michelle.ai',
    kicker: 'Local RAG Desktop Agent - v1',
    copy: 'A local floating desktop assistant. Frameless, always on-top electron window that  \
    collapses into a small orb and expands into chat. Remembers facts about you across different chat sessions \
    through intent assessment and links to local documents for retrieval. Built to improve everyday workflow and runs locally. Check out the Repo README for more info. ',
    links: ['Python', 'HTML/CSS/JavaScript', 'Electron', 'SQLite', 'Fast API', 'Ollama/Gemini LLM', 'Next.js'],
    github: 'https://github.com/nathanzezhao/michelle.ai',
    dates: 'May 2026 – Present',
  },
  {
    name: 'FitFix',
    kicker: 'Online Outfit Coach',
    copy: 'Virtual outfit coach based on body type and colour combinations. Includes face scan, closet option, and a pre-added clothing catalog with the option to add your own closet through description. Plans your week of outfits to reduce the stress of picking out an outfit daily.',
    links: ['HTML/CSS/JavaScript', 'Next.js'],
    github: 'https://github.com/nathanzezhao/FitFix',
    dates: 'April 2026 - May 2026',
  },
  {
    name: 'Mr. Interviewer',
    kicker: 'Virtual Mock Interviewer',
    copy: 'Virtual mock interviewer that spans across several industries, from tech to healthcare. Gives advice based on user input, and offers a rating based on words matched: similar to an ATS system.',
    links: ['HTML/CSS/JavaScript'],
    github: 'https://github.com/nathanzezhao/mrinterviewer',
    dates: 'April 2026 - May 2026',
  },
];

const STACK_COLORS = {
  Python: '#3776AB',
  'HTML/CSS/JavaScript': '#E44D26',
  Electron: '#47848F',
  SQLite: '#0B7A9E',
  'Fast API': '#009688',
  'Ollama/Gemini LLM': '#7C5CFC',
  Live: '#4A90D9',
  Code: '#2A2E34',
  Deck: '#C4A35A',
  Stills: '#7A8494',
  Demo: '#3D7A6A',
  Notes: '#8A6A4A',
  Clip: '#6B5B95',
};

const STACK_ICONS = {
  Python: Code2,
  'HTML/CSS/JavaScript': Braces,
  Electron: AppWindow,
  SQLite: Database,
  'Fast API': Zap,
  'Ollama/Gemini LLM': Sparkles,
  Live: Globe,
  Code: Code,
  Deck: Presentation,
  Stills: Image,
  Demo: Play,
  Notes: StickyNote,
  Clip: Clapperboard,
};

const STACK_FALLBACK = ['#5B7C99', '#C47A4A', '#3F6F5B', '#8A5A6A', '#6A6F78'];

const PROJECT_NAMES = PROJECTS.map(item => item.name);

const IconGithub = () => (
  <svg className="projects-tab__gh-icon" viewBox="0 0 24 24" aria-hidden="true">
    <path
      fill="currentColor"
      d="M12 2C6.48 2 2 6.58 2 12.26c0 4.52 2.87 8.36 6.84 9.71.5.1.68-.22.68-.49 0-.24-.01-.87-.01-1.71-2.78.62-3.37-1.37-3.37-1.37-.45-1.18-1.11-1.5-1.11-1.5-.91-.64.07-.63.07-.63 1 .07 1.53 1.06 1.53 1.06.9 1.57 2.36 1.12 2.94.86.09-.67.35-1.12.63-1.37-2.22-.26-4.56-1.14-4.56-5.07 0-1.12.39-2.03 1.03-2.75-.1-.26-.45-1.3.1-2.71 0 0 .84-.27 2.75 1.05A9.3 9.3 0 0 1 12 6.84c.85.01 1.71.12 2.51.34 1.9-1.32 2.74-1.05 2.74-1.05.55 1.41.2 2.45.1 2.71.64.72 1.03 1.63 1.03 2.75 0 3.94-2.34 4.8-4.57 5.06.36.32.68.94.68 1.9 0 1.37-.01 2.47-.01 2.81 0 .27.18.6.69.49A10.03 10.03 0 0 0 22 12.26C22 6.58 17.52 2 12 2Z"
    />
  </svg>
);

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
  const atStart = selected <= 0;
  const atEnd = selected >= PROJECTS.length - 1;

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
              disabled={atStart}
              onClick={() => wheelRef.current?.step(-1)}
            >
              <IconChevron dir="up" />
            </button>
            <button
              type="button"
              className="projects-wheel-nav__btn"
              aria-label="Next project"
              disabled={atEnd}
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
            <div className="projects-tab__heading">
              <h2 className="projects-tab__title">{project.name}</h2>
              {project.github ? (
                <a
                  className="projects-tab__gh"
                  href={project.github}
                  target="_blank"
                  rel="noreferrer"
                  aria-label={`${project.name} on GitHub`}
                  onClick={e => e.stopPropagation()}
                >
                  <IconGithub />
                </a>
              ) : null}
              {project.dates ? (
                <span className="projects-tab__dates">{project.dates}</span>
              ) : null}
            </div>
            <p className="projects-tab__copy">{project.copy}</p>
            <div className="projects-tab__actions">
              {project.links.map((label, i) => {
                const Icon = STACK_ICONS[label] || Code;
                const color = STACK_COLORS[label] || STACK_FALLBACK[i % STACK_FALLBACK.length];
                return (
                  <span
                    key={label}
                    className="projects-tab__action"
                    style={{ '--stack-color': color }}
                  >
                    <span className="projects-tab__avatar" aria-hidden="true">
                      <Icon size={13} strokeWidth={2.2} />
                    </span>
                    {label}
                  </span>
                );
              })}
            </div>
          </article>
        </div>
      </div>
    </div>
  );
}
