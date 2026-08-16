import CloudRipple from './components/CloudRipple.jsx';
import hero from './assets/hero.png?url';
import './App.css';

export default function App() {
  return (
    <main className="landing">
      <CloudRipple
        src={hero}
        brushSize={218}
        strength={0.55}
        swirl={1.5}
        rings={1.5}
        spacing={6}
        fade={4}
        grayscale
        tint="#ffffff"
        tintAmount={0.08}
        glint={0.55}
        highlightColor="#ffffff"
        trigger="both"
        clickStrength={3}
        quality="high"
      />
    </main>
  );
}
