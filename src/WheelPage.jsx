import { useEffect, useState } from 'react';
import MoltenMetal from './components/MoltenMetal.jsx';
import RippleDistortion from './components/RippleDistortion.jsx';
import Folder from './components/Folder.jsx';
import AboutStory from './components/AboutStory.jsx';
import ProjectsStory from './components/ProjectsStory.jsx';
import ExperienceStory from './components/ExperienceStory.jsx';
import PageSwap, { PAGE_TITLES, PageSheet } from './components/PageSwap.jsx';
import './WheelPage.css';

export default function App() {
  const [showFolder, setShowFolder] = useState(false);
  const [showSwap, setShowSwap] = useState(false);
  const [swapClosing, setSwapClosing] = useState(false);
  const [page, setPage] = useState(null);
  const [pageClosing, setPageClosing] = useState(false);
  const [swapSignal, setSwapSignal] = useState(0);
  const [swapIndex, setSwapIndex] = useState(null);

  const openSwap = () => {
    if (showSwap || page) return;
    setSwapClosing(false);
    setShowSwap(true);
  };

  const dismissPage = () => {
    if (!page || pageClosing) return;
    setPageClosing(true);
  };

  const dismissSwap = () => {
    if (!showSwap || swapClosing || page) return;
    setSwapClosing(true);
  };

  const handleSelect = (title, rect) => {
    setPage({
      type:
        title === 'About' ? 'story' : title === 'Projects' ? 'projects' : title === 'Experience' ? 'experience' : 'sheet',
      title,
      top: rect.top,
      left: rect.left,
      width: rect.width,
      height: rect.height,
    });
    setPageClosing(false);
  };

  useEffect(() => {
    if (!pageClosing) return;
    setSwapIndex(PAGE_TITLES.indexOf(page?.title));
    setSwapSignal(n => n + 1);
    const delay =
      page?.type === 'story' || page?.type === 'projects' || page?.type === 'experience' ? 520 : 280;
    const t = setTimeout(() => {
      setPage(null);
      setPageClosing(false);
    }, delay);
    return () => clearTimeout(t);
  }, [pageClosing, page?.type, page?.title]);

  useEffect(() => {
    if (!swapClosing) return;
    const t = setTimeout(() => {
      setShowSwap(false);
      setSwapClosing(false);
    }, 350);
    return () => clearTimeout(t);
  }, [swapClosing]);

  useEffect(() => {
    const onKey = e => {
      if (e.key !== 'Escape') return;
      if (page && !pageClosing) {
        setPageClosing(true);
        return;
      }
      if (showSwap && !page && !swapClosing) setSwapClosing(true);
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [showSwap, page, pageClosing, swapClosing]);

  return (
    <main
      className={page?.type === 'projects' ? 'is-scene-blurred' : undefined}
      style={{
        position: 'absolute',
        inset: 0,
        width: '100%',
        height: '100%',
        overflow: 'hidden',
        background: '#fff',
      }}
      onPointerDown={() => {
        if (!showFolder && !showSwap && !page) setShowFolder(true);
      }}
    >
      <div className="molten-bg">
        <MoltenMetal
          color1="#6E737C"
          color2="#C9CED6"
          color3="#FFFFFF"
          speed={0.35}
          scale={4}
          detail={3}
          glow={1.8}
          coreSize={0.1}
          swirl={1}
          fold={-0.2}
          blackPoint={0.05}
          brightness={1.45}
          colorMode="frost"
          grain
          grainIntensity={0.04}
          mouseInteraction
          mouseStrength={0.3}
          opacity={1.0}
        />
      </div>
      <RippleDistortion
        src=""
        brushSize={150}
        strength={0.2}
        swirl={1}
        rings={4}
        spread={5}
        fade={3}
        spacing={15}
        dispersion={0}
        glint={0}
        tintAmount={0}
        grayscale={false}
        trigger="both"
        clickStrength={2}
        quality="high"
        style={{
          position: 'absolute',
          inset: 0,
          width: '100%',
          height: '100%',
          zIndex: 1,
        }}
      />
      {showFolder ? (
        <div className={`folder-overlay${showSwap ? ' is-away' : ''}`}>
          <div className="folder-stage">
            <div className="folder-shadow" aria-hidden="true" />
            <Folder
              size={1}
              color="#4A4F56"
              className="custom-folder"
              onOpen={openSwap}
              items={[
                <span className="paper-label">Projects</span>,
                <span className="paper-label">Experience</span>,
                <span className="paper-label">About</span>,
              ]}
            />
            <p className="folder-name">Nathan Zhao</p>
          </div>
        </div>
      ) : null}
      {showSwap ? (
        <PageSwap
          titles={PAGE_TITLES}
          closing={swapClosing}
          covered={Boolean(page)}
          swapSignal={swapSignal}
          swapIndex={swapIndex}
          onDismiss={dismissSwap}
          onSelect={handleSelect}
        />
      ) : null}
      {page?.type === 'story' ? (
        <AboutStory fromRect={page} closing={pageClosing} onDismiss={dismissPage} />
      ) : null}
      {page?.type === 'projects' ? (
        <ProjectsStory fromRect={page} closing={pageClosing} onDismiss={dismissPage} />
      ) : null}
      {page?.type === 'experience' ? (
        <ExperienceStory closing={pageClosing} onDismiss={dismissPage} />
      ) : null}
      {page?.type === 'sheet' ? (
        <PageSheet title={page.title} closing={pageClosing} onBack={dismissPage} />
      ) : null}
    </main>
  );
}
