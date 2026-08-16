import PointerRipple from './components/PointerRipple.jsx';
import hero from './assets/fog.jpg?url';
import './App.css';

export default function App() {
  return (
    <main className="landing">
      <PointerRipple
        src={hero}
        brushSize={42}
        strength={0.55}
        swirl={1.5}
        rings={1.5}
        spacing={6}
        fade={4}
        grayscale
        glint={0.4}
        highlightColor="#e22020"
        trigger="both"
        clickStrength={3}
        quality="high"
      />
    </main>
  );
}
