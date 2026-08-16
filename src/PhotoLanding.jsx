import PhotoRipple from './components/PhotoRipple.jsx';
import hero from './assets/hero.png?url';
import './App.css';

export default function App() {
  return (
    <main className="landing">
      <PhotoRipple
        src={hero}
        brushSize={218}
        strength={0.55}
        swirl={1.5}
        rings={1.5}
        spacing={6}
        fade={4}
        grayscale={false}
        tintAmount={0}
        glint={0.2}
        highlightColor="#ffffff"
        trigger="both"
        clickStrength={3}
        quality="high"
      />
    </main>
  );
}
