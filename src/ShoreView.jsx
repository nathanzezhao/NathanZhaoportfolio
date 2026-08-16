import PointerRipple from './components/PointerRipple.jsx';
import hero from './assets/coast-rotated-90.jpg?url';
import './App.css';

export default function App() {
  return (
    <main className="landing">
      <PointerRipple
        src={hero}
        brushSize={84}
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
