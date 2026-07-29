/* 
  REVA 3D Speaker Engine
  - Hero Section (#hero): 3D Hero Speaker Explode Canvas (#speakerCanvas)
  - Product Description (#specs): Exclusive Woofer Explosion Canvas (#wooferCanvas) from Exploded_view_woofer_speaker_ass._202607281322.mp4
*/

document.addEventListener('DOMContentLoaded', () => {
  // ==========================================
  // MAIN SPEAKER & WOOFER 3D CANVAS ENGINE
  // ==========================================
  const TOTAL_FRAMES = 96;
  
  // DOM Elements - Main Speaker Canvas (Hero)
  const speakerCanvas = document.getElementById('speakerCanvas');
  const speakerCtx = speakerCanvas ? speakerCanvas.getContext('2d') : null;
  const loader = document.getElementById('canvasLoader');
  const loaderBar = document.getElementById('loaderBar');
  const loaderPercent = document.getElementById('loaderPercent');
  
  // DOM Elements - Woofer Speaker Canvas (Product Description #specs)
  const wooferCanvas = document.getElementById('wooferCanvas');
  const wooferCtx = wooferCanvas ? wooferCanvas.getContext('2d') : null;

  // Frame Arrays
  const mainSpeakerFrames = [];
  const wooferFrames = [];
  
  let loadedMainCount = 0;
  let loadedWooferCount = 0;

  // Animation States
  let speakerCurrentFrame = 0;
  let speakerTargetFrame = 0;
  let isSpeakerExploded = false;

  let wooferCurrentFrame = 0;
  let wooferTargetFrame = 0;
  let isWooferExploded = false;

  // Preload Main Speaker Frames for Hero Section
  function preloadMainFrames() {
    for (let i = 1; i <= TOTAL_FRAMES; i++) {
      const img = new Image();
      const frameNum = String(i).padStart(3, '0');
      img.src = `./reva_black_video_frames/ezgif-frame-${frameNum}.jpg`;
      
      img.onload = () => {
        loadedMainCount++;
        updateLoaderProgress();
      };
      img.onerror = () => {
        loadedMainCount++;
        updateLoaderProgress();
      };
      mainSpeakerFrames.push(img);
    }
  }

  // Preload Woofer Speaker Frames for Product Description Section (#specs)
  function preloadWooferFrames() {
    for (let i = 1; i <= TOTAL_FRAMES; i++) {
      const img = new Image();
      const frameNum = String(i).padStart(3, '0');
      img.src = `./reva_woofer_frames/ezgif-frame-${frameNum}.jpg`;
      
      img.onload = () => {
        loadedWooferCount++;
        updateLoaderProgress();
      };
      img.onerror = () => {
        loadedWooferCount++;
        updateLoaderProgress();
      };
      wooferFrames.push(img);
    }
  }

  function updateLoaderProgress() {
    const totalLoaded = loadedMainCount + loadedWooferCount;
    const totalRequired = TOTAL_FRAMES * 2;
    const percent = Math.floor((totalLoaded / totalRequired) * 100);

    if (loaderBar) loaderBar.style.width = `${percent}%`;
    if (loaderPercent) loaderPercent.textContent = `${percent}%`;

    if (totalLoaded >= totalRequired) {
      setTimeout(() => {
        if (loader) loader.classList.add('hidden');
        resizeAllCanvases();
        renderMainFrame(0);
        renderWooferFrame(0);
        startRenderLoops();
      }, 200);
    }
  }

  // Responsive Canvas Resizing
  function resizeAllCanvases() {
    if (speakerCanvas) resizeSingleCanvas(speakerCanvas, speakerCtx, mainSpeakerFrames[Math.round(speakerCurrentFrame)]);
    if (wooferCanvas) resizeSingleCanvas(wooferCanvas, wooferCtx, wooferFrames[Math.round(wooferCurrentFrame)]);
  }

  function resizeSingleCanvas(canvasEl, ctxEl, currentImg) {
    if (!canvasEl || !ctxEl) return;
    const container = canvasEl.parentElement;
    const rect = container.getBoundingClientRect();
    const dpr = window.devicePixelRatio || 1;
    
    canvasEl.width = rect.width * dpr;
    canvasEl.height = rect.height * dpr;
    
    canvasEl.style.width = `${rect.width}px`;
    canvasEl.style.height = `${rect.height}px`;
    
    ctxEl.scale(dpr, dpr);
    if (currentImg && currentImg.complete) {
      drawImgToCtx(canvasEl, ctxEl, currentImg);
    }
  }

  window.addEventListener('resize', resizeAllCanvases);

  // Generic Draw Function
  function drawImgToCtx(canvasEl, ctxEl, img) {
    const containerWidth = canvasEl.clientWidth;
    const containerHeight = canvasEl.clientHeight;
    
    ctxEl.fillStyle = '#050505';
    ctxEl.fillRect(0, 0, containerWidth, containerHeight);
    
    const imgRatio = img.width / img.height;
    const containerRatio = containerWidth / containerHeight;
    
    let drawWidth, drawHeight, drawX, drawY;
    
    if (containerRatio > imgRatio) {
      drawHeight = containerHeight * 0.94;
      drawWidth = drawHeight * imgRatio;
    } else {
      drawWidth = containerWidth * 0.94;
      drawHeight = drawWidth / imgRatio;
    }
    
    drawX = (containerWidth - drawWidth) / 2;
    drawY = (containerHeight - drawHeight) / 2;
    
    ctxEl.save();
    ctxEl.drawImage(img, drawX, drawY, drawWidth, drawHeight);
    ctxEl.restore();
  }

  // Render Frame for Main Speaker Canvas (Hero)
  function renderMainFrame(index) {
    if (!speakerCanvas || !speakerCtx) return;
    const imgIndex = Math.max(0, Math.min(TOTAL_FRAMES - 1, Math.round(index)));
    const img = mainSpeakerFrames[imgIndex];
    if (!img || !img.complete) return;
    
    drawImgToCtx(speakerCanvas, speakerCtx, img);
  }

  // Render Frame for Woofer Speaker Canvas (Product Description #specs)
  function renderWooferFrame(index) {
    if (!wooferCanvas || !wooferCtx) return;
    const imgIndex = Math.max(0, Math.min(TOTAL_FRAMES - 1, Math.round(index)));
    const img = wooferFrames[imgIndex];
    if (!img || !img.complete) return;
    
    drawImgToCtx(wooferCanvas, wooferCtx, img);
  }

  // Animation Loop Engine
  function startRenderLoops() {
    function loop() {
      if (!isSpeakerExploded) speakerTargetFrame = 0;
      if (!isWooferExploded) wooferTargetFrame = 0;

      // Main Speaker lerp
      const diffSpeaker = speakerTargetFrame - speakerCurrentFrame;
      if (Math.abs(diffSpeaker) > 0.01) {
        speakerCurrentFrame += diffSpeaker * 0.14;
        renderMainFrame(speakerCurrentFrame);
      }

      // Woofer Speaker lerp (Product Description Explosion)
      const diffWoofer = wooferTargetFrame - wooferCurrentFrame;
      if (Math.abs(diffWoofer) > 0.01) {
        wooferCurrentFrame += diffWoofer * 0.14;
        renderWooferFrame(wooferCurrentFrame);
      }

      requestAnimationFrame(loop);
    }
    requestAnimationFrame(loop);
  }

  // Click Explode Listener for Main Speaker Canvas (Hero)
  if (speakerCanvas) {
    speakerCanvas.addEventListener('click', () => {
      isSpeakerExploded = !isSpeakerExploded;
      speakerTargetFrame = isSpeakerExploded ? TOTAL_FRAMES - 1 : 0;
    });
  }

  // Click Explode Listener for Woofer Canvas (Product Description #specs)
  if (wooferCanvas) {
    wooferCanvas.addEventListener('click', () => {
      isWooferExploded = !isWooferExploded;
      wooferTargetFrame = isWooferExploded ? TOTAL_FRAMES - 1 : 0;
    });
  }

  // Pricing Toggle
  const billingToggle = document.getElementById('billingToggle');
  const priceValues = document.querySelectorAll('.price-value');
  
  if (billingToggle) {
    billingToggle.addEventListener('change', (e) => {
      const isAnnual = e.target.checked;
      priceValues.forEach(el => {
        const monthlyPrice = el.getAttribute('data-monthly');
        const annualPrice = el.getAttribute('data-annual');
        el.textContent = isAnnual ? annualPrice : monthlyPrice;
      });
    });
  }

  // ==========================================
  // UNIFIED SINGLE AUDIO PLAYER CONTROLLER
  // ==========================================
  const audioEl = document.getElementById('revaAudioPlayer');
  const nativeAudioControls = document.getElementById('nativeAudioControls');
  const mainSoundPlayBtn = document.getElementById('mainSoundPlayBtn');
  const playIcon = document.getElementById('playIcon');
  const playText = document.getElementById('playText');
  const soundStatusText = document.getElementById('soundStatusText');
  const visualizerContainer = document.getElementById('soundWaveVisualizer');

  window.isPlayingSoundState = false;

  const audioTrackPath = './Silk_Stream.mp3';
  if (audioEl) audioEl.src = audioTrackPath;
  if (nativeAudioControls) nativeAudioControls.src = audioTrackPath;

  function toggleAudio() {
    if (window.isPlayingSoundState) {
      pauseAudio();
    } else {
      playAudio();
    }
  }

  function playAudio() {
    window.isPlayingSoundState = true;
    updateUI(true);

    if (audioEl) {
      audioEl.volume = 1.0;
      audioEl.play().then(() => {
        if (nativeAudioControls) nativeAudioControls.play().catch(() => {});
      }).catch(() => {
        if (nativeAudioControls) nativeAudioControls.play().catch(() => {});
      });
    } else if (nativeAudioControls) {
      nativeAudioControls.play().catch(() => {});
    }
  }

  function pauseAudio() {
    window.isPlayingSoundState = false;
    if (audioEl) audioEl.pause();
    if (nativeAudioControls) nativeAudioControls.pause();
    updateUI(false);
  }

  function updateUI(playing) {
    if (playIcon) playIcon.textContent = playing ? 'pause' : 'play_arrow';
    if (playText) playText.textContent = playing ? 'PAUSE SONG' : 'PLAY SONG';
    if (soundStatusText) soundStatusText.textContent = playing ? 'AUDIO PLAYBACK ACTIVE' : 'READY TO PLAY';

    if (visualizerContainer) {
      if (playing) {
        visualizerContainer.classList.add('playing');
      } else {
        visualizerContainer.classList.remove('playing');
      }
    }
  }

  // UNIFIED MAIN PLAY BUTTON CLICK
  if (mainSoundPlayBtn) {
    mainSoundPlayBtn.addEventListener('click', (e) => {
      e.preventDefault();
      toggleAudio();
    });
  }

  if (nativeAudioControls) {
    nativeAudioControls.onplay = function() {
      window.isPlayingSoundState = true;
      updateUI(true);
    };
    nativeAudioControls.onpause = function() {
      window.isPlayingSoundState = false;
      updateUI(false);
    };
  }

  // Preload Both Frame Sequences
  preloadMainFrames();
  preloadWooferFrames();
});
