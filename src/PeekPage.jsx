import { useEffect, useRef } from 'react';
import EdgeRipple from './components/EdgeRipple.jsx';
import hero from './assets/hero.png?url';
import './PeekPage.css';

export default function App() {
  const rootRef = useRef(null);

  useEffect(() => {
    const el = rootRef.current;
    if (!el) return;

    const onMove = event => {
      const rect = el.getBoundingClientRect();
      el.style.setProperty('--mx', `${event.clientX - rect.left}px`);
      el.style.setProperty('--my', `${event.clientY - rect.top}px`);
    };

    window.addEventListener('pointermove', onMove, { passive: true });
    return () => window.removeEventListener('pointermove', onMove);
  }, []);

  return (
    <main ref={rootRef} className="peek">
      <EdgeRipple
        src={hero}
        brushSize={90}
        strength={0.55}
        swirl={1.5}
        rings={1.5}
        spacing={6}
        fade={4}
        grayscale={false}
        tintAmount={0}
        glint={0}
        trigger="both"
        clickStrength={3}
        quality="high"
        style={{
          position: 'absolute',
          inset: 0,
          width: '100%',
          height: '100%',
        }}
      />
      <img className="peek-photo" src={hero} alt="" draggable={false} />
    </main>
  );
}
