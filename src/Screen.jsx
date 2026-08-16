import OverlayRipple from './components/OverlayRipple.jsx';
import hero from './assets/hero.png?url';
import './screen.css';

const photoStyle = {
  position: 'absolute',
  inset: 0,
  width: '100%',
  height: '100%',
  objectFit: 'cover',
  objectPosition: 'center',
  display: 'block',
  pointerEvents: 'none',
  transform: 'scale(1.08)',
  transformOrigin: 'center center',
};

const overlayStyle = {
  position: 'absolute',
  inset: 0,
  width: '100%',
  height: '100%',
  transform: 'scale(1.08)',
  transformOrigin: 'center center',
};

export default function App() {
  return (
    <main className="screen">
      <img
        className="screen__photo"
        src={hero}
        alt=""
        decoding="async"
        fetchPriority="high"
        style={photoStyle}
      />
      <OverlayRipple
        src={hero}
        style={overlayStyle}
        brushSize={109}
        strength={0.55}
        swirl={1.5}
        rings={1.5}
        spacing={6}
        fade={4}
        grayscale={false}
        tintAmount={0}
        glint={0}
        highlightColor="#ffffff"
        trigger="both"
        clickStrength={3}
        quality="high"
      />
    </main>
  );
}
