import { useEffect, useRef } from 'react';
import { Renderer, Program, Mesh, Geometry, Triangle, Texture, RenderTarget } from 'ogl';
import './ShineRipple.css';

const MAX_WAVES = 100;
const QUALITY_SCALE = { low: 0.4, medium: 0.7, high: 1 };
const START_SCALE = 1.5;
const LIFE_CONSTANT = Math.log(500);

const waveVertex = `
precision highp float;

attribute vec2 position;
attribute vec2 uv;
attribute vec2 iOffset;
attribute vec2 iScale;
attribute float iOpacity;

varying vec2 vUv;
varying float vOpacity;

void main() {
  vUv = uv;
  vOpacity = iOpacity;
  gl_Position = vec4(iOffset + position * iScale, 0.0, 1.0);
}
`;

const waveFragment = `
precision highp float;

varying vec2 vUv;
varying float vOpacity;

uniform float uRings;

const float PI = 3.141592653589793;
const float EDGE = 0.006737947;

void main() {
  vec2 p = vUv * 2.0 - 1.0;
  float r = dot(p, p);
  if (r > 1.0) discard;

  float brush = (exp(-r * 5.0) - EDGE) / (1.0 - EDGE);

  brush *= 0.55 + 0.45 * cos(sqrt(r) * PI * 2.0 * uRings);

  gl_FragColor = vec4(vec3(brush * vOpacity * vOpacity), 1.0);
}
`;

const screenVertex = `#version 300 es
precision highp float;
in vec2 position;
in vec2 uv;
out vec2 vUv;
void main() {
  vUv = uv;
  gl_Position = vec4(position, 0.0, 1.0);
}
`;

const compositeFragment = `#version 300 es
precision highp float;

in vec2 vUv;
out vec4 fragColor;

uniform sampler2D uTexture;
uniform sampler2D uDisplacement;
uniform vec2 uResolution;
uniform vec2 uTextureSize;
uniform vec2 uTexel;
uniform vec3 uTint;
uniform vec3 uHighlight;
uniform float uStrength;
uniform float uSwirl;
uniform float uDispersion;
uniform float uGlint;
uniform float uTintAmount;
uniform float uGrayscale;
uniform vec4 uButton;
uniform float uButtonRadius;
uniform float uButtonOn;

const float TAU = 6.283185307179586;

float sdRoundedRect(vec2 p, vec2 b, float r) {
  vec2 q = abs(p) - b + r;
  return length(max(q, 0.0)) + min(max(q.x, q.y), 0.0) - r;
}

vec2 coverUV(vec2 uv) {
  vec2 safe = max(uTextureSize, vec2(1.0));
  vec2 s = uResolution / safe;
  vec2 scaledSize = safe * max(s.x, s.y);
  vec2 offset = (uResolution - scaledSize) * 0.5;
  return (uv * uResolution - offset) / scaledSize;
}

vec3 sampleImage(vec2 uv) {
  return textureLod(uTexture, clamp(uv, vec2(0.0), vec2(1.0)), 0.0).rgb;
}

void main() {
  float amount = textureLod(uDisplacement, vUv, 0.0).r;
  if (uButtonOn > 0.5) {
    vec2 p = gl_FragCoord.xy - uButton.xy;
    float d = sdRoundedRect(p, uButton.zw, uButtonRadius);
    amount *= smoothstep(0.0, 4.0, d);
  }

  float ex = textureLod(uDisplacement, vUv + vec2(uTexel.x, 0.0), 0.0).r - textureLod(uDisplacement, vUv - vec2(uTexel.x, 0.0), 0.0).r;
  float ey = textureLod(uDisplacement, vUv + vec2(0.0, uTexel.y), 0.0).r - textureLod(uDisplacement, vUv - vec2(0.0, uTexel.y), 0.0).r;

  vec3 normal = normalize(vec3(-ex * 55.0, -ey * 55.0, 0.55));
  vec3 view = vec3(0.0, 0.0, 1.0);
  vec3 key = normalize(vec3(-0.16, 0.28, 0.95));
  vec3 fill = normalize(vec3(0.62, -0.18, 0.55));
  vec3 R = reflect(-view, normal);
  float ndv = max(dot(normal, view), 0.0);
  float fresnel = pow(1.0 - ndv, 2.0);

  vec3 env = mix(vec3(0.18, 0.19, 0.22), vec3(0.82, 0.86, 0.9), pow(ndv, 0.55));
  env += vec3(1.0) * pow(max(dot(R, key), 0.0), 14.0) * 0.95;
  env += vec3(0.75, 0.82, 1.0) * pow(max(R.y, 0.0), 4.0) * 0.25;

  float spec = pow(max(dot(normal, key), 0.0), 18.0);
  float hot = pow(max(dot(normal, key), 0.0), 72.0);
  float spec2 = pow(max(dot(normal, fill), 0.0), 36.0);

  float glass = smoothstep(0.001, 0.035, amount);
  vec3 chrome = env;
  chrome += vec3(1.0) * spec * 0.85;
  chrome += vec3(1.0) * hot * 1.35;
  chrome += vec3(0.92, 0.95, 1.0) * spec2 * 0.4;
  chrome += vec3(0.7, 0.8, 1.0) * fresnel * 0.55;
  chrome += vec3(1.0) * pow(amount * ndv, 1.4) * 0.28;

  vec3 color = mix(vec3(1.0), chrome, glass);

  fragColor = vec4(color, 1.0);
}
`;

const hexToRGB = hex => {
  const clean = hex.replace('#', '');
  const full =
    clean.length === 3
      ? clean
          .split('')
          .map(c => c + c)
          .join('')
      : clean;
  const n = parseInt(full, 16);
  if (Number.isNaN(n)) return [1, 1, 1];
  return [((n >> 16) & 255) / 255, ((n >> 8) & 255) / 255, (n & 255) / 255];
};

const lockTexture = (gl, texture) => {
  texture.bind();
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
  if ('TEXTURE_BASE_LEVEL' in gl) {
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_BASE_LEVEL, 0);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAX_LEVEL, 0);
  }
};

const ShineRipple = ({
  src = 'https://images.unsplash.com/photo-1782977389500-dd7adad33ebe?q=80&w=3416&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
  brushSize = 150,
  strength = 0.2,
  swirl = 1,
  rings = 4,
  spread = 5,
  fade = 3,
  spacing = 15,
  dispersion = 0,
  glint = 0,
  tint = '#a855f7',
  tintAmount = 0.1,
  grayscale = true,
  highlightColor = '#ffffff',
  trigger = 'hover',
  clickStrength = 2,
  quality = 'low',
  enabled = true,
  className = '',
  style
}) => {
  const mountRef = useRef(null);
  const configRef = useRef({});
  const uniformsRef = useRef(null);

  configRef.current = { brushSize, spread, fade, spacing, clickStrength, trigger, enabled };

  useEffect(() => {
    const mount = mountRef.current;
    if (!mount) return;

    const reduceMotion =
      typeof window !== 'undefined' &&
      window.matchMedia &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    const renderer = new Renderer({
      alpha: false,
      antialias: false,
      dpr: Math.min(window.devicePixelRatio || 1, 2)
    });
    const gl = renderer.gl;
    gl.clearColor(0, 0, 0, 1);
    const canvas = gl.canvas;
    canvas.style.display = 'block';
    canvas.style.position = 'absolute';
    canvas.style.inset = '0';
    canvas.style.zIndex = '0';
    mount.appendChild(canvas);

    renderer.setViewport = (width, height, x = 0, y = 0) => {
      if (!renderer.state.framebuffer) {
        width = gl.drawingBufferWidth;
        height = gl.drawingBufferHeight;
      }
      gl.viewport(x, y, width, height);
      renderer.state.viewport.x = x;
      renderer.state.viewport.y = y;
      renderer.state.viewport.width = width;
      renderer.state.viewport.height = height;
    };

    const imageTexture = new Texture(gl, {
      generateMipmaps: false,
      minFilter: gl.LINEAR,
      magFilter: gl.LINEAR,
      wrapS: gl.CLAMP_TO_EDGE,
      wrapT: gl.CLAMP_TO_EDGE,
      unpackAlignment: 1,
      flipY: true
    });

    const white = document.createElement('canvas');
    white.width = 8;
    white.height = 8;
    const wctx = white.getContext('2d');
    wctx.fillStyle = '#ffffff';
    wctx.fillRect(0, 0, 8, 8);
    imageTexture.image = white;
    imageTexture.needsUpdate = true;
    imageTexture.update();
    lockTexture(gl, imageTexture);

    let disposed = false;
    const image = new window.Image();
    if (/^https?:\/\//i.test(src)) {
      image.crossOrigin = 'anonymous';
    }
    image.decoding = 'async';

    const offsets = new Float32Array(MAX_WAVES * 2);
    const scales = new Float32Array(MAX_WAVES * 2);
    const opacities = new Float32Array(MAX_WAVES);

    const waves = Array.from({ length: MAX_WAVES }, () => ({
      x: 0,
      y: 0,
      scale: START_SCALE,
      target: START_SCALE,
      size: 1,
      opacity: 0
    }));
    let current = 0;

    const geometry = new Geometry(gl, {
      position: { size: 2, data: new Float32Array([-1, -1, 1, -1, -1, 1, -1, 1, 1, -1, 1, 1]) },
      uv: { size: 2, data: new Float32Array([0, 0, 1, 0, 0, 1, 0, 1, 1, 0, 1, 1]) },
      iOffset: { instanced: 1, size: 2, data: offsets },
      iScale: { instanced: 1, size: 2, data: scales },
      iOpacity: { instanced: 1, size: 1, data: opacities }
    });

    const waveUniforms = { uRings: { value: rings } };
    const waveProgram = new Program(gl, {
      vertex: waveVertex,
      fragment: waveFragment,
      uniforms: waveUniforms,
      transparent: true,
      depthTest: false,
      depthWrite: false,
      cullFace: false
    });
    waveProgram.setBlendFunc(gl.ONE, gl.ONE);
    const waveMesh = new Mesh(gl, { geometry, program: waveProgram, frustumCulled: false });

    const displacementTarget = new RenderTarget(gl, {
      width: 2,
      height: 2,
      depth: false,
      minFilter: gl.LINEAR,
      magFilter: gl.LINEAR,
      wrapS: gl.CLAMP_TO_EDGE,
      wrapT: gl.CLAMP_TO_EDGE
    });
    lockTexture(gl, displacementTarget.texture);

    const compositeUniforms = {
      uTexture: { value: imageTexture },
      uDisplacement: { value: displacementTarget.texture },
      uResolution: { value: [1, 1] },
      uTextureSize: { value: [1, 1] },
      uTexel: { value: [1, 1] },
      uTint: { value: hexToRGB(tint) },
      uHighlight: { value: hexToRGB(highlightColor) },
      uStrength: { value: strength },
      uSwirl: { value: swirl },
      uDispersion: { value: dispersion },
      uGlint: { value: glint },
      uTintAmount: { value: tintAmount },
      uGrayscale: { value: grayscale ? 1 : 0 },
      uButton: { value: [0, 0, 1, 1] },
      uButtonRadius: { value: 0 },
      uButtonOn: { value: 0 }
    };

    const compositeMesh = new Mesh(gl, {
      geometry: new Triangle(gl),
      program: new Program(gl, {
        vertex: screenVertex,
        fragment: compositeFragment,
        uniforms: compositeUniforms,
        depthTest: false,
        depthWrite: false
      })
    });

    uniformsRef.current = { wave: waveUniforms, composite: compositeUniforms };

    image.onload = () => {
      if (disposed) return;
      imageTexture.image = image;
      imageTexture.generateMipmaps = false;
      imageTexture.minFilter = gl.LINEAR;
      imageTexture.magFilter = gl.LINEAR;
      imageTexture.needsUpdate = true;
      imageTexture.update();
      lockTexture(gl, imageTexture);
      compositeUniforms.uTextureSize.value = [
        Math.max(1, image.naturalWidth),
        Math.max(1, image.naturalHeight)
      ];
    };
    if (src) image.src = src;

    let width = 1;
    let height = 1;
    let layoutW = 1;
    let layoutH = 1;

    const resize = () => {
      const rect = mount.getBoundingClientRect();
      layoutW = Math.max(1, rect.width);
      layoutH = Math.max(1, rect.height);
      width = Math.max(1, Math.round(layoutW));
      height = Math.max(1, Math.round(layoutH));
      renderer.setSize(width, height);
      compositeUniforms.uResolution.value = [width, height];

      const scale = QUALITY_SCALE[quality] || QUALITY_SCALE.high;
      const fieldW = Math.max(2, Math.round(width * scale));
      const fieldH = Math.max(2, Math.round(height * scale));
      displacementTarget.setSize(fieldW, fieldH);
      lockTexture(gl, displacementTarget.texture);
      compositeUniforms.uTexel.value = [1 / fieldW, 1 / fieldH];
    };

    const ro = new ResizeObserver(resize);
    ro.observe(mount);
    resize();

    const setNewWave = (x, y, power) => {
      const cfg = configRef.current;
      const wave = waves[current];
      current = (current + 1) % MAX_WAVES;
      wave.x = x;
      wave.y = y;
      wave.scale = START_SCALE * power;
      wave.target = START_SCALE * Math.max(1, cfg.spread) * power;
      wave.size = Math.max(1, cfg.brushSize);
      wave.opacity = 1;
    };

    const localPoint = (clientX, clientY) => {
      const rect = mount.getBoundingClientRect();
      if (rect.width === 0 || rect.height === 0) return null;
      if (clientX < rect.left || clientX > rect.right || clientY < rect.top || clientY > rect.bottom) {
        return null;
      }
      return [
        (clientX - rect.left) * (layoutW / rect.width),
        layoutH - (clientY - rect.top) * (layoutH / rect.height)
      ];
    };

    let previousX = 0;
    let previousY = 0;

    const overWheel = event => Boolean(event.target?.closest?.('.option-wheel'));

    const onMove = event => {
      const cfg = configRef.current;
      if (!cfg.enabled || reduceMotion || cfg.trigger === 'click') return;
      if (overWheel(event)) return;
      const point = localPoint(event.clientX, event.clientY);
      if (!point) return;
      const step = Math.max(1, cfg.spacing);
      if (Math.abs(point[0] - previousX) > step || Math.abs(point[1] - previousY) > step) {
        setNewWave(point[0], point[1], 1);
        previousX = point[0];
        previousY = point[1];
      }
    };

    const onDown = event => {
      const cfg = configRef.current;
      if (!cfg.enabled || reduceMotion || cfg.trigger === 'hover') return;
      if (overWheel(event)) return;
      const point = localPoint(event.clientX, event.clientY);
      if (!point) return;
      setNewWave(point[0], point[1], Math.max(1, cfg.clickStrength));
    };

    window.addEventListener('pointermove', onMove, { passive: true });
    window.addEventListener('pointerdown', onDown, { passive: true });

    let raf = 0;
    let previousTime = 0;

    const loop = now => {
      raf = requestAnimationFrame(loop);
      const delta = previousTime ? Math.min(0.05, (now - previousTime) / 1000) : 0;
      previousTime = now;
      const cfg = configRef.current;

      const growth = reduceMotion ? 0 : 1 - Math.exp(-delta * 1.09);
      const decay = reduceMotion ? 1 : Math.exp((-delta * LIFE_CONSTANT) / Math.max(0.15, cfg.fade));

      for (let i = 0; i < MAX_WAVES; i += 1) {
        const wave = waves[i];
        if (wave.opacity <= 0) {
          opacities[i] = 0;
          continue;
        }

        wave.opacity *= decay;
        wave.scale += (wave.target - wave.scale) * growth;

        if (wave.opacity < 0.002) {
          wave.opacity = 0;
          opacities[i] = 0;
          continue;
        }

        const half = (wave.scale * wave.size) / 2;
        offsets[i * 2] = (wave.x / layoutW) * 2 - 1;
        offsets[i * 2 + 1] = (wave.y / layoutH) * 2 - 1;
        scales[i * 2] = (half / layoutW) * 2;
        scales[i * 2 + 1] = (half / layoutH) * 2;
        opacities[i] = wave.opacity;
      }

      geometry.attributes.iOffset.needsUpdate = true;
      geometry.attributes.iScale.needsUpdate = true;
      geometry.attributes.iOpacity.needsUpdate = true;

      compositeUniforms.uButtonOn.value = 0;

      gl.clearColor(0, 0, 0, 1);
      renderer.render({ scene: waveMesh, target: displacementTarget, clear: true });
      gl.clearColor(1, 1, 1, 1);
      renderer.render({ scene: compositeMesh, clear: true });
    };
    raf = requestAnimationFrame(loop);

    return () => {
      disposed = true;
      cancelAnimationFrame(raf);
      ro.disconnect();
      window.removeEventListener('pointermove', onMove);
      window.removeEventListener('pointerdown', onDown);
      uniformsRef.current = null;
      if (canvas.parentNode === mount) mount.removeChild(canvas);
      const ext = gl.getExtension('WEBGL_lose_context');
      if (ext) ext.loseContext();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [src, quality]);

  useEffect(() => {
    const u = uniformsRef.current;
    if (!u) return;
    u.wave.uRings.value = rings;
    u.composite.uStrength.value = strength;
    u.composite.uSwirl.value = swirl;
    u.composite.uDispersion.value = dispersion;
    u.composite.uGlint.value = glint;
    u.composite.uTintAmount.value = tintAmount;
    u.composite.uGrayscale.value = grayscale ? 1 : 0;
    u.composite.uHighlight.value = hexToRGB(highlightColor);
    u.composite.uTint.value = hexToRGB(tint);
  }, [rings, strength, swirl, dispersion, glint, tintAmount, grayscale, highlightColor, tint]);

  return <div ref={mountRef} className={`shine-ripple ${className}`.trim()} style={style} />;
};

export default ShineRipple;
