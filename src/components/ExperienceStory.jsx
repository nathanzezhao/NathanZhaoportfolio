import { useEffect } from 'react';
import './ExperienceStory.css';

const SECTIONS = [
  {
    label: 'Technical',
    roles: [
      {
        
        dates: 'May 2026 — Aug 2026',
        title: 'Software Engineering Intern',
        company: 'Flock Social',
        bullets: [
          'Collaborated on front-end feature development by writing reusable components using Typescript and React.js to improve user interface and overall user experience, and pushed almost 10 new usable features to production based through consistent demand.',
          'Participated in team sprints and pairs to optimize code and improve website durability in an agile work environment, while troubleshooting in end-to-end production for optimization.',
          'Co-managed an agile program consisting of two-week sprints and pairs to increase user on-boarding traffic and saw a 32% increase in web to app user traffic.',
        ],
      },
    ],
  },
  {
    label: 'Leadership & volunteering',
    roles: [
      {
       
        dates: 'Jan 2026 — April 2026',
        title: 'Events Team Executive',
        company: "University of Waterloo Chinese Student's Association",
        bullets: [
          'Planned and executed various cultural and student-based events within and outside of the University of Waterloo campus through various sponsors while working with other teams.',
          'Explored ways to visualize and coordinate resources (sponsors, vendors, venues) across multiple teams to execute events while staying under budget.',
          'Achieved a combined turnout of over 5000 students to various held events during the Winter 2026 semester.',
          'Incoming Director of Internals - Fall 2026',
        ],
      },
      {
        
        dates: 'Mar 2022 — Jul 2025',
        title: 'Cultural Exchange Volunteer',
        company: 'Acquaint',
        bullets: [
          'Facilitated weekly 1-on-1 virtual sessions with individuals from diverse geographic and cultural backgrounds to foster mutual understanding and global connection.',
          'Leveraged active listening and empathy to bridge cultural gaps and build community in a digital-first environment.',
        ],
      },
    ],
  },
];

function RoleItem({ role }) {
  const hasBullets = role.bullets.length > 0;

  return (
    <li className="experience-item">
      <span className="experience-item__dot" aria-hidden="true" />
      <div className="experience-item__meta">
        <span className="experience-item__dates">{role.dates}</span>
        <span className="experience-item__index">{role.id}</span>
      </div>
      <h3 className="experience-item__title">{role.title}</h3>
      <p className="experience-item__company">{role.company}</p>
      {hasBullets ? (
        <div className="experience-item__body">
          <div className="experience-item__clip">
            <ul className="experience-item__bullets">
              {role.bullets.map(line => (
                <li key={line}>{line}</li>
              ))}
            </ul>
          </div>
        </div>
      ) : null}
    </li>
  );
}

export default function ExperienceStory({ closing, onDismiss }) {
  useEffect(() => {
    const onKey = e => {
      if (e.key === 'Escape') onDismiss();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [onDismiss]);

  return (
    <div
      className={`experience-story${closing ? ' is-out' : ''}`}
      onClick={onDismiss}
    >
      <article
        className="experience-tab"
        onClick={e => e.stopPropagation()}
      >
        {SECTIONS.map(section => (
          <section key={section.label} className="experience-section">
            <h2 className="experience-section__label">{section.label}</h2>
            <ol className="experience-list">
              {section.roles.map(role => (
                <RoleItem key={role.id} role={role} />
              ))}
            </ol>
          </section>
        ))}
      </article>
    </div>
  );
}
