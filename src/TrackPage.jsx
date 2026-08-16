import TrackRipple from './components/TrackRipple.jsx';
import hero from './assets/hero.png?url';

export default function App() {
  return (
    <main
      style={{
        position: 'absolute',
        inset: 0,
        width: '100%',
        height: '100%',
        overflow: 'hidden',
        background: '#000',
      }}
    >
      <TrackRipple
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
    </main>
  );
}
