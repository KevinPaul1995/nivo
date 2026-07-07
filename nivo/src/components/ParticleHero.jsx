import { useEffect, useRef } from 'react';
import * as THREE from 'three';

const STATE_CHAOS = 'chaos';
const STATE_NIVO = 'nivo';
const STATE_CLEAN = 'clean';

const TRANSITION_DURATION = 1850;
const TEXT_SAMPLE_STEP = 3;

const PARTICLE_PALETTES = {
  [STATE_CHAOS]: {
    ink: '#07120f',
    fog: '#2d3a34',
    accent: '#000000',
  },
  [STATE_NIVO]: {
    ink: '#07120f',
    fog: '#2d3a34',
    accent: '#000000',
  },
  [STATE_CLEAN]: {
    ink: '#ffffff',
    fog: '#aeb8b8',
    accent: '#ffffff',
  },
};

function isWideLayout(width, height) {
  return width >= 820 && width / Math.max(1, height) >= 1.04;
}

const vertexShader = `
  attribute float aSize;
  attribute float aMist;
  attribute float aChaosRank;
  varying float vMist;
  uniform float uPixelRatio;
  uniform float uSizeScale;
  uniform float uChaosVisibility;
  uniform float uIsChaos;

  void main() {
    vMist = aMist;
    float visible = mix(1.0, step(aChaosRank, uChaosVisibility), uIsChaos);
    vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
    gl_PointSize = aSize * uPixelRatio * uSizeScale * visible;
    gl_Position = projectionMatrix * mvPosition;
  }
`;

const fragmentShader = `
  precision mediump float;

  varying float vMist;
  uniform vec3 uInk;
  uniform vec3 uFog;
  uniform vec3 uAccent;

  void main() {
    vec2 point = gl_PointCoord - vec2(0.5);
    float distanceToCenter = length(point);
    float alpha = smoothstep(0.5, 0.08, distanceToCenter);
    vec3 softColor = mix(uFog, uInk, smoothstep(0.16, 0.9, vMist));
    vec3 finalColor = mix(softColor, uAccent, smoothstep(0.78, 1.0, vMist) * 0.28);

    gl_FragColor = vec4(finalColor, alpha * 0.82);
  }
`;

function easeInOutCubic(t) {
  return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
}

function createRandom(seed) {
  let value = seed >>> 0;

  return function random() {
    value += 0x6d2b79f5;
    let next = value;
    next = Math.imul(next ^ (next >>> 15), next | 1);
    next ^= next + Math.imul(next ^ (next >>> 7), next | 61);
    return ((next ^ (next >>> 14)) >>> 0) / 4294967296;
  };
}

function getParticleCount(width, reducedMotion) {
  if (reducedMotion) {
    return width < 720 ? 2600 : 4600;
  }

  if (width < 560) {
    return 5600;
  }

  if (width < 920) {
    return 8800;
  }

  return 19000;
}

function getChaosVisibility(width) {
  if (width < 560) {
    return 0.46;
  }

  if (width < 920) {
    return 0.48;
  }

  return 0.5;
}

function getChaosSizeScale(width) {
  if (width < 560) {
    return 0.98;
  }

  if (width < 920) {
    return 1.08;
  }

  return 1.24;
}

function createCanvas(width, height) {
  const canvas = document.createElement('canvas');
  canvas.width = width;
  canvas.height = height;
  return canvas;
}

function drawSpacedText(context, text, x, y, spacing) {
  const letters = text.split('');
  const widths = letters.map((letter) => context.measureText(letter).width);
  const totalWidth =
    widths.reduce((total, width) => total + width, 0) +
    spacing * (letters.length - 1);
  let cursorX = x - totalWidth / 2;

  for (let i = 0; i < letters.length; i += 1) {
    context.fillText(letters[i], cursorX, y);
    cursorX += widths[i] + spacing;
  }
}

function collectOpaquePixels(canvas, step) {
  const context = canvas.getContext('2d', { willReadFrequently: true });
  const imageData = context.getImageData(0, 0, canvas.width, canvas.height).data;
  const points = [];
  let minX = canvas.width;
  let minY = canvas.height;
  let maxX = 0;
  let maxY = 0;

  for (let y = 0; y < canvas.height; y += step) {
    for (let x = 0; x < canvas.width; x += step) {
      const alpha = imageData[(y * canvas.width + x) * 4 + 3];

      if (alpha > 40) {
        points.push(x, y);
        minX = Math.min(minX, x);
        minY = Math.min(minY, y);
        maxX = Math.max(maxX, x);
        maxY = Math.max(maxY, y);
      }
    }
  }

  return {
    points,
    bounds: {
      minX,
      minY,
      maxX,
      maxY,
      width: Math.max(1, maxX - minX),
      height: Math.max(1, maxY - minY),
    },
  };
}

function convertPixelsToTargets({
  count,
  pixels,
  bounds,
  width,
  height,
  targetWidth,
  targetHeight,
  centerX,
  centerY,
  seed,
  jitter,
}) {
  const random = createRandom(seed);
  const targets = new Float32Array(count * 3);
  const scale = Math.min(targetWidth / bounds.width, targetHeight / bounds.height);
  const pointCount = Math.max(1, pixels.length / 2);
  const shapeCenterX = bounds.minX + bounds.width / 2;
  const shapeCenterY = bounds.minY + bounds.height / 2;

  for (let i = 0; i < count; i += 1) {
    const sourceIndex = Math.floor(random() * pointCount) * 2;
    const px = pixels[sourceIndex] ?? shapeCenterX;
    const py = pixels[sourceIndex + 1] ?? shapeCenterY;
    const offsetX = (random() - 0.5) * jitter;
    const offsetY = (random() - 0.5) * jitter;
    const index = i * 3;

    targets[index] = centerX + (px - shapeCenterX) * scale + offsetX;
    targets[index + 1] = centerY - (py - shapeCenterY) * scale + offsetY;
    targets[index + 2] = (random() - 0.5) * Math.min(width, height) * 0.035;
  }

  return targets;
}

function createTextTargets(count, width, height) {
  const canvas = createCanvas(1600, 520);
  const context = canvas.getContext('2d');

  context.clearRect(0, 0, canvas.width, canvas.height);
  context.fillStyle = '#000';
  context.textBaseline = 'middle';
  context.font =
    '900 330px "Arial Black", "Archivo", "Helvetica Neue", Arial, sans-serif';
  drawSpacedText(context, 'NIVO', canvas.width / 2, canvas.height / 2 + 12, 78);

  const { points, bounds } = collectOpaquePixels(canvas, TEXT_SAMPLE_STEP);
  const isDesktop = isWideLayout(width, height);

  return convertPixelsToTargets({
    count,
    pixels: points,
    bounds,
    width,
    height,
    targetWidth: isDesktop ? width * 0.48 : width * 0.88,
    targetHeight: isDesktop ? height * 0.27 : height * 0.24,
    centerX: isDesktop ? width * 0.24 : 0,
    centerY: isDesktop ? height * 0.02 : height * 0.11,
    seed: 8128,
    jitter: isDesktop ? 0.85 : 0.65,
  });
}

function createCleanTargets(count, width, height) {
  const isDesktop = isWideLayout(width, height);
  const random = createRandom(1947 + Math.floor(width) * 13 + Math.floor(height) * 3);
  const targets = new Float32Array(count * 3);
  const targetWidth = isDesktop ? width * 0.34 : width * 0.54;
  const targetHeight = isDesktop ? height * 0.58 : height * 0.3;
  const centerX = isDesktop ? -width * 0.25 : 0;
  const centerY = isDesktop ? -height * 0.02 : height * 0.16;
  const scale = Math.min(targetWidth / 330, targetHeight / 470);

  for (let i = 0; i < count; i += 1) {
    const index = i * 3;

    const t = Math.pow(random(), 0.9);
    const phi = random() * Math.PI * 2;
    const profile =
      Math.pow(Math.sin(t * Math.PI), 0.58) * (0.46 + 0.58 * t);
    const belly = 1 + Math.sin(t * Math.PI) * t * 0.34;
    const shell = 0.78 + Math.pow(random(), 0.42) * 0.22;
    const localX = Math.cos(phi) * profile * belly * shell * 142;
    const localZ = Math.sin(phi) * profile * shell * 106;
    const localY = 222 - t * 474 + t * t * 72;

    targets[index] = centerX + localX * scale;
    targets[index + 1] = centerY + localY * scale;
    targets[index + 2] = localZ * scale;
  }

  return targets;
}

function createChaosTargets(count, width, height) {
  const random = createRandom(4291 + Math.floor(width) * 7 + Math.floor(height));
  const targets = new Float32Array(count * 3);
  const isDesktop = isWideLayout(width, height);
  const panelRight = width * 0.54;
  const panelLeft = width * (isDesktop ? -0.23 : -0.5);
  const verticalReach = height * (isDesktop ? 0.7 : 0.5);

  for (let i = 0; i < count; i += 1) {
    const index = i * 3;
    const yNorm = random() * 2 - 1;
    const cornerInset = Math.pow(Math.max(0, Math.abs(yNorm) - 0.72) / 0.28, 2);
    const leftEdge = panelLeft + cornerInset * width * (isDesktop ? 0.055 : 0.035);
    const spread = panelRight - leftEdge;
    const xMix = isDesktop ? Math.pow(random(), 0.46) : random();
    const waveX =
      Math.sin(yNorm * 5.4 + random() * 0.8) * width * (isDesktop ? 0.01 : 0.007);
    const waveY =
      Math.cos(xMix * 5.6 + yNorm * 2.5) *
      height *
      (isDesktop ? 0.012 : 0.008);

    targets[index] =
      leftEdge +
      xMix * spread +
      waveX +
      (random() - 0.5) * (isDesktop ? 12 : 8);
    targets[index + 1] =
      yNorm * verticalReach +
      waveY +
      (random() - 0.5) * (isDesktop ? 10 : 7);
    targets[index + 2] = (random() - 0.5) * 120;
  }

  return targets;
}

function setCamera(camera, width, height) {
  camera.left = width / -2;
  camera.right = width / 2;
  camera.top = height / 2;
  camera.bottom = height / -2;
  camera.updateProjectionMatrix();
}

export default function ParticleHero() {
  const mountRef = useRef(null);

  useEffect(() => {
    const mount = mountRef.current;

    if (!mount) {
      return undefined;
    }

    const hero = mount.closest('.hero');
    const prefersReducedMotion = window.matchMedia(
      '(prefers-reduced-motion: reduce)',
    ).matches;
    let syncedViewportHeight = 0;

    function syncViewportHeight() {
      const viewportHeight = window.visualViewport?.height || window.innerHeight;
      const roundedHeight = Math.round(viewportHeight);

      if (roundedHeight !== syncedViewportHeight) {
        syncedViewportHeight = roundedHeight;
        document.documentElement.style.setProperty('--hero-vh', `${roundedHeight}px`);
      }
    }

    syncViewportHeight();

    let width = Math.max(1, mount.clientWidth);
    let height = Math.max(1, mount.clientHeight);
    const particleCount = getParticleCount(width, prefersReducedMotion);
    let chaosTargets = createChaosTargets(particleCount, width, height);
    let nivoTargets = createTextTargets(particleCount, width, height);
    let cleanTargets = createCleanTargets(particleCount, width, height);
    let activeTargets = prefersReducedMotion ? nivoTargets : chaosTargets;
    let state = prefersReducedMotion ? STATE_NIVO : STATE_CHAOS;
    let transitionFrom = null;
    let transitionTo = null;
    let transitionStart = 0;
    let transitioning = false;
    let locked = false;
    let rafId = 0;
    let destroyed = false;
    let touchStartY = 0;
    let touchStartedInSequence = false;
    let previousBodyOverflow = '';
    let previousBodyTouchAction = '';
    let previousRootOverscroll = '';
    let previousRootOverflow = '';
    let previousRootOverflowX = '';
    let lockedScrollY = 0;
    let renderedSizeScale = state === STATE_CHAOS ? getChaosSizeScale(width) : 1;
    const pointer = {
      active: false,
      x: 0,
      y: 0,
      force: 0,
    };

    const renderer = new THREE.WebGLRenderer({
      alpha: true,
      antialias: false,
      powerPreference: 'high-performance',
    });
    const scene = new THREE.Scene();
    const camera = new THREE.OrthographicCamera(
      width / -2,
      width / 2,
      height / 2,
      height / -2,
      0.1,
      1600,
    );

    camera.position.z = 700;
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, width < 720 ? 1.5 : 2));
    renderer.setSize(width, height, false);
    renderer.setClearColor(0xffffff, 0);
    mount.appendChild(renderer.domElement);

    const positions = new Float32Array(particleCount * 3);
    const velocities = new Float32Array(particleCount * 3);
    const phases = new Float32Array(particleCount);
    const frequencies = new Float32Array(particleCount);
    const amplitudes = new Float32Array(particleCount);
    const sizes = new Float32Array(particleCount);
    const mists = new Float32Array(particleCount);
    const chaosRanks = new Float32Array(particleCount);
    const random = createRandom(7117);

    for (let i = 0; i < particleCount; i += 1) {
      const index = i * 3;

      positions[index] = activeTargets[index] + (random() - 0.5) * 18;
      positions[index + 1] = activeTargets[index + 1] + (random() - 0.5) * 18;
      positions[index + 2] = activeTargets[index + 2];
      phases[i] = random() * Math.PI * 2;
      frequencies[i] = 0.42 + random() * 0.58;
      amplitudes[i] = 0.78 + random() * 1.85;
      sizes[i] =
        (width < 720 ? 1.15 : 1.45) + random() * (width < 720 ? 1.3 : 1.55);
      mists[i] = random();
      chaosRanks[i] = random();
    }

    const geometry = new THREE.BufferGeometry();
    const positionAttribute = new THREE.BufferAttribute(positions, 3);
    positionAttribute.setUsage(THREE.DynamicDrawUsage);
    geometry.setAttribute('position', positionAttribute);
    geometry.setAttribute('aSize', new THREE.BufferAttribute(sizes, 1));
    geometry.setAttribute('aMist', new THREE.BufferAttribute(mists, 1));
    geometry.setAttribute('aChaosRank', new THREE.BufferAttribute(chaosRanks, 1));

    const material = new THREE.ShaderMaterial({
      vertexShader,
      fragmentShader,
      transparent: true,
      depthWrite: false,
      uniforms: {
        uPixelRatio: {
          value: renderer.getPixelRatio(),
        },
        uSizeScale: {
          value: renderedSizeScale,
        },
        uChaosVisibility: {
          value: getChaosVisibility(width),
        },
        uIsChaos: {
          value: state === STATE_CHAOS ? 1 : 0,
        },
        uInk: {
          value: new THREE.Color(PARTICLE_PALETTES[state].ink),
        },
        uFog: {
          value: new THREE.Color(PARTICLE_PALETTES[state].fog),
        },
        uAccent: {
          value: new THREE.Color(PARTICLE_PALETTES[state].accent),
        },
      },
    });

    const points = new THREE.Points(geometry, material);
    const paletteTargets = {
      [STATE_CHAOS]: {
        ink: new THREE.Color(PARTICLE_PALETTES[STATE_CHAOS].ink),
        fog: new THREE.Color(PARTICLE_PALETTES[STATE_CHAOS].fog),
        accent: new THREE.Color(PARTICLE_PALETTES[STATE_CHAOS].accent),
      },
      [STATE_NIVO]: {
        ink: new THREE.Color(PARTICLE_PALETTES[STATE_NIVO].ink),
        fog: new THREE.Color(PARTICLE_PALETTES[STATE_NIVO].fog),
        accent: new THREE.Color(PARTICLE_PALETTES[STATE_NIVO].accent),
      },
      [STATE_CLEAN]: {
        ink: new THREE.Color(PARTICLE_PALETTES[STATE_CLEAN].ink),
        fog: new THREE.Color(PARTICLE_PALETTES[STATE_CLEAN].fog),
        accent: new THREE.Color(PARTICLE_PALETTES[STATE_CLEAN].accent),
      },
    };
    scene.add(points);

    function lockScroll() {
      if (locked) {
        return;
      }

      locked = true;
      lockedScrollY = Math.round(hero?.offsetTop ?? window.scrollY);
      window.scrollTo(0, lockedScrollY);
      previousBodyOverflow = document.body.style.overflow;
      previousBodyTouchAction = document.body.style.touchAction;
      previousRootOverflow = document.documentElement.style.overflow;
      previousRootOverflowX = document.documentElement.style.overflowX;
      previousRootOverscroll = document.documentElement.style.overscrollBehavior;
      document.body.style.overflow = 'hidden';
      document.body.style.touchAction = 'none';
      document.documentElement.classList.add('is-scroll-locked');
      document.documentElement.style.overflow = 'hidden';
      document.documentElement.style.overflowX = 'hidden';
      document.documentElement.style.overscrollBehavior = 'none';
    }

    function unlockScroll() {
      if (!locked) {
        return;
      }

      locked = false;
      document.body.style.overflow = previousBodyOverflow;
      document.body.style.touchAction = previousBodyTouchAction;
      document.documentElement.classList.remove('is-scroll-locked');
      document.documentElement.style.overflow = previousRootOverflow;
      document.documentElement.style.overflowX = previousRootOverflowX;
      document.documentElement.style.overscrollBehavior = previousRootOverscroll;
      window.scrollTo(0, lockedScrollY);
    }

    function setParticleState(nextState) {
      mount.dataset.particleState = nextState;
    }

    function setVisualState(nextState) {
      if (hero) {
        hero.dataset.visualState = nextState;
      }
    }

    function setTransitionTarget(nextState) {
      if (hero) {
        hero.dataset.transitionTarget = nextState;
      }
    }

    function clearTransitionTarget() {
      if (hero) {
        delete hero.dataset.transitionTarget;
      }
    }

    function isHeroSequenceActive() {
      if (!hero) {
        return true;
      }

      const rect = hero.getBoundingClientRect();
      const viewportHeight = window.visualViewport?.height || window.innerHeight || height;

      return rect.top <= 2 && rect.bottom >= viewportHeight * 0.56;
    }

    function getTransitionTargets(direction) {
      if (direction > 0 && state === STATE_CHAOS) {
        return {
          nextState: STATE_NIVO,
          nextTargets: nivoTargets,
        };
      }

      if (direction > 0 && state === STATE_NIVO) {
        return {
          nextState: STATE_CLEAN,
          nextTargets: cleanTargets,
        };
      }

      if (direction < 0 && state === STATE_CLEAN) {
        return {
          nextState: STATE_NIVO,
          nextTargets: nivoTargets,
        };
      }

      if (direction < 0 && state === STATE_NIVO) {
        return {
          nextState: STATE_CHAOS,
          nextTargets: chaosTargets,
        };
      }

      return null;
    }

    function startTransition(direction) {
      if (transitioning || prefersReducedMotion) {
        return false;
      }

      const next = getTransitionTargets(direction);

      if (!next) {
        return false;
      }

      lockScroll();
      transitioning = true;
      transitionStart = performance.now();
      transitionFrom = new Float32Array(positions);
      transitionTo = next.nextTargets;
      state = next.nextState;
      setParticleState(state);
      setVisualState('transitioning');
      setTransitionTarget(state);
      return true;
    }

    function updatePointer(clientX, clientY) {
      const rect = mount.getBoundingClientRect();

      pointer.active = true;
      pointer.x = clientX - rect.left - width / 2;
      pointer.y = height / 2 - (clientY - rect.top);
      pointer.force = 1;
    }

    function onPointerMove(event) {
      updatePointer(event.clientX, event.clientY);
    }

    function onPointerLeave() {
      pointer.active = false;
    }

    function onTouchStart(event) {
      touchStartY = event.touches[0]?.clientY ?? 0;
      touchStartedInSequence = isHeroSequenceActive();

      if (event.touches[0]) {
        updatePointer(event.touches[0].clientX, event.touches[0].clientY);
      }
    }

    function onTouchMove(event) {
      if (event.touches[0]) {
        updatePointer(event.touches[0].clientX, event.touches[0].clientY);
      }

      if (transitioning) {
        event.preventDefault();
        return;
      }

      if (prefersReducedMotion) {
        return;
      }

      if (!touchStartedInSequence) {
        return;
      }

      const currentY = event.touches[0]?.clientY ?? touchStartY;
      const deltaY = touchStartY - currentY;

      if (Math.abs(deltaY) > 8) {
        if (startTransition(deltaY > 0 ? 1 : -1)) {
          event.preventDefault();
        }
      }
    }

    function onWheel(event) {
      if (transitioning) {
        event.preventDefault();
        return;
      }

      if (prefersReducedMotion) {
        return;
      }

      if (!isHeroSequenceActive()) {
        return;
      }

      if (Math.abs(event.deltaY) > 0 || Math.abs(event.deltaX) > 0) {
        const primaryDelta =
          Math.abs(event.deltaY) >= Math.abs(event.deltaX)
            ? event.deltaY
            : event.deltaX;

        if (startTransition(primaryDelta > 0 ? 1 : -1)) {
          event.preventDefault();
        }
      }
    }

    function onKeyDown(event) {
      if (
        event.key !== 'PageDown' &&
        event.key !== 'PageUp' &&
        event.key !== 'ArrowDown' &&
        event.key !== 'ArrowUp' &&
        event.key !== ' '
      ) {
        return;
      }

      if (transitioning) {
        event.preventDefault();
        return;
      }

      if (prefersReducedMotion) {
        return;
      }

      if (!isHeroSequenceActive()) {
        return;
      }

      const direction =
        event.key === 'PageUp' || event.key === 'ArrowUp' || event.shiftKey
          ? -1
          : 1;

      if (startTransition(direction)) {
        event.preventDefault();
      }
    }

    function resize() {
      syncViewportHeight();
      width = Math.max(1, mount.clientWidth);
      height = Math.max(1, mount.clientHeight);
      renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, width < 720 ? 1.5 : 2));
      renderer.setSize(width, height, false);
      material.uniforms.uPixelRatio.value = renderer.getPixelRatio();
      material.uniforms.uChaosVisibility.value = getChaosVisibility(width);
      setCamera(camera, width, height);
      chaosTargets = createChaosTargets(particleCount, width, height);
      nivoTargets = createTextTargets(particleCount, width, height);
      cleanTargets = createCleanTargets(particleCount, width, height);

      if (state === STATE_CHAOS) {
        activeTargets = chaosTargets;
      } else if (state === STATE_NIVO) {
        activeTargets = nivoTargets;
      } else {
        activeTargets = cleanTargets;
      }
    }

    function animate(now) {
      if (destroyed) {
        return;
      }

      rafId = window.requestAnimationFrame(animate);

      let transitionEase = 1;

      if (transitioning) {
        const progress = Math.min(1, (now - transitionStart) / TRANSITION_DURATION);
        transitionEase = easeInOutCubic(progress);

        if (progress >= 1) {
          transitioning = false;
          activeTargets = transitionTo;
          transitionFrom = null;
          transitionTo = null;
          setVisualState(state);
          clearTransitionTarget();
          unlockScroll();
        }
      }

      const time = now * 0.001;
      const radius =
        state === STATE_CHAOS
          ? Math.min(width, 720) * 0.3
          : Math.min(width, 580) * 0.19;
      const radiusSq = radius * radius;
      const cursorPower = pointer.active ? pointer.force : pointer.force * 0.75;
      const interactionStrength =
        (state === STATE_CHAOS ? 128 : state === STATE_CLEAN ? 34 : 46) *
        cursorPower *
        (width < 720 ? 0.82 : 1);
      const stiffness = transitioning
        ? 0.085
        : state === STATE_CHAOS
          ? 0.031
          : 0.052;
      const damping = transitioning ? 0.83 : 0.875;
      const baseBreath = state === STATE_CHAOS ? 7.2 : state === STATE_CLEAN ? 1.35 : 2.35;
      const targetSizeScale =
        state === STATE_CHAOS ? getChaosSizeScale(width) : state === STATE_CLEAN ? 0.9 : 1;

      pointer.force *= state === STATE_CHAOS ? 0.958 : 0.935;
      renderedSizeScale += (targetSizeScale - renderedSizeScale) * 0.08;
      material.uniforms.uSizeScale.value = renderedSizeScale;
      material.uniforms.uIsChaos.value = state === STATE_CHAOS ? 1 : 0;

      const targetPalette = paletteTargets[state] || paletteTargets[STATE_CHAOS];
      material.uniforms.uInk.value.lerp(targetPalette.ink, 0.075);
      material.uniforms.uFog.value.lerp(targetPalette.fog, 0.075);
      material.uniforms.uAccent.value.lerp(targetPalette.accent, 0.075);

      const isCleanModel = state === STATE_CLEAN && !transitioning;
      const cleanCenterX = isWideLayout(width, height) ? -width * 0.25 : 0;
      const cleanCenterY = isWideLayout(width, height) ? -height * 0.02 : height * 0.16;
      const cleanYaw =
        Math.sin(time * 0.68) * 0.46 +
        (pointer.active ? (pointer.x / width) * 0.035 : 0);
      const cleanPitch = Math.sin(time * 0.52 + 1.3) * 0.16;
      const cleanRoll = Math.cos(time * 0.36) * 0.08;
      const cleanYawCos = Math.cos(cleanYaw);
      const cleanYawSin = Math.sin(cleanYaw);
      const cleanPitchCos = Math.cos(cleanPitch);
      const cleanPitchSin = Math.sin(cleanPitch);
      const cleanRollCos = Math.cos(cleanRoll);
      const cleanRollSin = Math.sin(cleanRoll);
      const cleanFloat = Math.sin(time * 0.72) * (width < 720 ? 3 : 5);
      const cleanBreath = 1 + Math.sin(time * 0.58) * 0.008;

      for (let i = 0; i < particleCount; i += 1) {
        const index = i * 3;
        const phase = phases[i];
        const organic =
          Math.sin(time * frequencies[i] + phase) *
          amplitudes[i] *
          baseBreath;
        const organicCross =
          Math.cos(time * (frequencies[i] * 0.74) + phase * 1.37) *
          amplitudes[i] *
          baseBreath;

        let targetX;
        let targetY;
        let targetZ;

        if (transitioning && transitionFrom && transitionTo) {
          targetX =
            transitionFrom[index] +
            (transitionTo[index] - transitionFrom[index]) * transitionEase;
          targetY =
            transitionFrom[index + 1] +
            (transitionTo[index + 1] - transitionFrom[index + 1]) * transitionEase;
          targetZ =
            transitionFrom[index + 2] +
            (transitionTo[index + 2] - transitionFrom[index + 2]) * transitionEase;
        } else {
          targetX = activeTargets[index];
          targetY = activeTargets[index + 1];
          targetZ = activeTargets[index + 2];
        }

        if (isCleanModel) {
          const modelX = (targetX - cleanCenterX) * cleanBreath;
          const modelY = (targetY - cleanCenterY) * cleanBreath;
          const modelZ = targetZ * cleanBreath;
          const rollX = modelX * cleanRollCos - modelY * cleanRollSin;
          const rollY = modelX * cleanRollSin + modelY * cleanRollCos;
          const pitchY = rollY * cleanPitchCos - modelZ * cleanPitchSin;
          const pitchZ = rollY * cleanPitchSin + modelZ * cleanPitchCos;

          targetX = cleanCenterX + rollX * cleanYawCos - pitchZ * cleanYawSin;
          targetY = cleanCenterY + pitchY + cleanFloat;
          targetZ = rollX * cleanYawSin + pitchZ * cleanYawCos;
        }

        targetX += organic;
        targetY += organicCross;
        targetZ += Math.sin(time * 0.58 + phase) * amplitudes[i] * 0.8;

        if (cursorPower > 0.012) {
          const dx = targetX - pointer.x;
          const dy = targetY - pointer.y;
          const distanceSq = dx * dx + dy * dy;

          if (distanceSq < radiusSq && distanceSq > 0.0001) {
            const distance = Math.sqrt(distanceSq);
            const falloff = Math.pow(1 - distance / radius, 2);
            const force = falloff * interactionStrength;
            const invDistance = 1 / distance;
            const flutterMultiplier = state === STATE_CHAOS ? 0.42 : 0.22;
            const flutter = Math.sin(time * 10.5 + phase) * force * flutterMultiplier;

            targetX += dx * invDistance * force + flutter;
            targetY += dy * invDistance * force - flutter * 0.55;
            targetZ += force * 0.55;
          }
        }

        velocities[index] += (targetX - positions[index]) * stiffness;
        velocities[index + 1] += (targetY - positions[index + 1]) * stiffness;
        velocities[index + 2] += (targetZ - positions[index + 2]) * stiffness;
        velocities[index] *= damping;
        velocities[index + 1] *= damping;
        velocities[index + 2] *= damping;
        positions[index] += velocities[index];
        positions[index + 1] += velocities[index + 1];
        positions[index + 2] += velocities[index + 2];
      }

      positionAttribute.needsUpdate = true;
      renderer.render(scene, camera);
    }

    const resizeObserver = new ResizeObserver(resize);
    resizeObserver.observe(mount);
    setParticleState(state);
    setVisualState(state);
    window.addEventListener('pointermove', onPointerMove, {
      passive: true,
    });
    window.addEventListener('pointerleave', onPointerLeave);
    window.addEventListener('touchstart', onTouchStart, {
      passive: true,
    });
    window.addEventListener('touchmove', onTouchMove, {
      passive: false,
      capture: true,
    });
    window.addEventListener('wheel', onWheel, {
      passive: false,
      capture: true,
    });
    window.addEventListener('keydown', onKeyDown, {
      capture: true,
    });
    window.addEventListener('resize', resize);
    window.visualViewport?.addEventListener('resize', resize);
    window.visualViewport?.addEventListener('scroll', resize);

    rafId = window.requestAnimationFrame(animate);

    return () => {
      destroyed = true;
      window.cancelAnimationFrame(rafId);
      unlockScroll();
      if (hero) {
        delete hero.dataset.visualState;
        delete hero.dataset.transitionTarget;
      }
      resizeObserver.disconnect();
      window.removeEventListener('pointermove', onPointerMove);
      window.removeEventListener('pointerleave', onPointerLeave);
      window.removeEventListener('touchstart', onTouchStart);
      window.removeEventListener('touchmove', onTouchMove, {
        capture: true,
      });
      window.removeEventListener('wheel', onWheel, {
        capture: true,
      });
      window.removeEventListener('keydown', onKeyDown, {
        capture: true,
      });
      window.removeEventListener('resize', resize);
      window.visualViewport?.removeEventListener('resize', resize);
      window.visualViewport?.removeEventListener('scroll', resize);
      scene.remove(points);
      geometry.dispose();
      material.dispose();
      renderer.dispose();

      if (renderer.domElement.parentNode === mount) {
        mount.removeChild(renderer.domElement);
      }
    };
  }, []);

  return <div ref={mountRef} className="particle-hero" aria-hidden="true" />;
}
