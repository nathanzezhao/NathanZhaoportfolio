import OverlayRipple from './components/OverlayRipple.jsx';
import hero from './assets/hero.png?url';
import './App.css';

export default function App() {
  return (
    <main className="landing">
      <img className="landing__photo" src={hero} alt="" />
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
        highlightColor="#ffffff"
        trigger="both"
        clickStrength={3}
        quality="high"
      />
    </main>
  );
}
