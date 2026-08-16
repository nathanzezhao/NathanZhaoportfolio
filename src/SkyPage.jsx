import OverlayRipple from './components/OverlayRipple.jsx';
import hero from './assets/hero.png?url';
import './screen.css';

const fill = {
  position: 'absolute',
  inset: 0,
  width: '100%',
  height: '100%',
};

export default function App() {
  return (
    <main
      style={{
        ...fill,
        overflow: 'hidden',
        background: '#000',
      }}
    >
      <img
        src={hero}
        alt=""
        decoding="async"
        fetchPriority="high"
        style={{
          ...fill,
          objectFit: 'cover',
          objectPosition: 'center bottom',
          display: 'block',
          pointerEvents: 'none',
        }}
      />
      <OverlayRipple
        src={hero}
        brushSize={109}
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
        style={fill}
      />
    </main>
  );
}
