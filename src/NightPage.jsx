import NightRipple from './components/NightRipple.jsx';
import hero from './assets/night.png?url';

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
      <NightRipple
        src={hero}
        brushSize={90}
        strength={0.55}
        swirl={1.5}
        rings={1.5}
        spacing={6}
        fade={4}
        grayscale={false}
        tintAmount={0}
        glint={0.45}
        highlightColor="#ffffff"
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
