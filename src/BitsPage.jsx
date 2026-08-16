import { useEffect, useRef } from 'react';
import RippleDistortion from './components/RippleDistortion.jsx';
import hero from './assets/hero.png?url';
import './BitsPage.css';

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
    <main ref={rootRef} className="bits">
      <RippleDistortion
        src={hero}
        brushSize={150}
        strength={0.2}
        swirl={1}
        rings={4}
        grayscale
        tintAmount={0}
        glint={0}
        trigger="hover"
        quality="high"
        style={{
          position: 'absolute',
          inset: 0,
          width: '100%',
          height: '100%',
        }}
      />
      <img className="bits-photo" src={hero} alt="" draggable={false} />
    </main>
  );
}
