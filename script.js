/* ══════════════════════════════════════════════
   INTRO CINÉMATIQUE
══════════════════════════════════════════════ */
function initWelcomeGate() {
  const gate    = document.getElementById('welcome-gate');
  const btnEnter = document.getElementById('btn-enter');
  if (!gate || !btnEnter) {
    // Pas d'écran d'entrée → lancer l'intro directement
    initCinematicIntro();
    return;
  }

  btnEnter.addEventListener('click', () => {
    gate.classList.add('fade-out');
    setTimeout(() => {
      gate.classList.add('hidden');
      initCinematicIntro();
    }, 1400);
  });
}

function initCinematicIntro() {
  const intro    = document.getElementById('cinematic-intro');
  const video    = document.getElementById('intro-video');
  const overlay  = document.getElementById('intro-overlay');
  const text     = document.getElementById('intro-text');
  const skipBtn  = document.getElementById('intro-skip');
  const bgMusic  = document.getElementById('bg-music');

  if (!intro || !video) {
    // Pas de vidéo intro → démarrer le site directement
    startSite();
    return;
  }

  // Bloquer le scroll pendant l'intro
  document.body.style.overflow = 'hidden';

  // Afficher l'écran intro (il démarre caché)
  intro.classList.remove('hidden');

  // Lancer la vidéo
  video.volume = 0.85;
  video.load();
  video.play().catch(() => {
    endIntro();
  });

  // Surveiller la progression pour le fondu final
  video.addEventListener('timeupdate', () => {
    const remaining = video.duration - video.currentTime;

    // Dernières 3 secondes → baisser le volume progressivement
    if (remaining <= 3 && remaining > 0) {
      video.volume = Math.max(0, (remaining / 3) * 0.85);
    }

    // Dernière seconde → commencer l'assombrissement
    if (remaining <= 2.5) {
      overlay.classList.add('darkening');
    }

    // 0.8s avant la fin → afficher le texte de transition
    if (remaining <= 0.8 && !text.classList.contains('visible')) {
      text.classList.add('visible');
    }
  });

  // Fin de la vidéo
  video.addEventListener('ended', () => {
    // Laisser le texte visible 2.5s
    setTimeout(() => endIntro(), 2500);
  });

  // Bouton passer
  skipBtn?.addEventListener('click', () => endIntro());

  // Bouton passer visible après 2.5s
  setTimeout(() => { skipBtn?.classList.add('visible'); }, 2500);

  // Tap sur la vidéo après 3s = passer
  let tapEnabled = false;
  setTimeout(() => { tapEnabled = true; }, 3000);
  intro.addEventListener('click', e => {
    if (tapEnabled && e.target !== skipBtn) endIntro();
  });

  function endIntro() {
    // Assombrir complètement
    overlay.classList.add('darkening');
    overlay.style.transition = 'opacity 1.2s ease';

    // Afficher texte si pas encore visible
    if (!text.classList.contains('visible')) {
      text.classList.add('visible');
    }

    // Baisser le son vidéo
    fadeOutVideoAudio(video, 1200);

    setTimeout(() => {
      // Fondu de sortie de l'intro
      intro.classList.add('fade-out');

      setTimeout(() => {
        intro.classList.add('hidden');
        video.pause();
        startSite();
      }, 1800);
    }, 1200);
  }
}

function fadeOutVideoAudio(video, durationMs) {
  const startVol = video.volume;
  const steps    = 30;
  const stepTime = durationMs / steps;
  let   step     = 0;

  const interval = setInterval(() => {
    step++;
    video.volume = Math.max(0, startVol * (1 - step / steps));
    if (step >= steps) {
      video.volume = 0;
      clearInterval(interval);
    }
  }, stepTime);
}

function startSite() {
  // Débloquer le scroll
  document.body.style.overflow = '';

  // Démarrer la musique de fond en fondu
  const bgMusic = document.getElementById('bg-music');
  if (bgMusic) {
    bgMusic.volume = 0;
    bgMusic.play().catch(() => {});
    fadeInAudio(bgMusic, 0.3, 3000);
  }

  // Déclencher le loader puis les particles
  const loader = document.getElementById('loader');
  if (loader) {
    setTimeout(() => {
      loader.classList.add('hidden');
      initParticles();
    }, 2800);
  } else {
    initParticles();
  }
}

function fadeInAudio(audio, targetVol, durationMs) {
  const steps    = 40;
  const stepTime = durationMs / steps;
  let   step     = 0;

  const interval = setInterval(() => {
    step++;
    audio.volume = Math.min(targetVol, targetVol * (step / steps));
    if (step >= steps) {
      audio.volume = targetVol;
      clearInterval(interval);
    }
  }, stepTime);
}
/* ══════════════════════════════════════════════
   CONFIG MÉDIAS
══════════════════════════════════════════════ */
const CONFIG = {
  lucrece: {
    photos: [
      'image1.jpeg','image2.jpeg','image3.jpeg',
      'image4.jpeg','image5.jpeg','image6.jpeg',
      'image7.jpeg','image8.jpeg','image9.jpeg','image10.jpeg'
    ]
  },
  luciano: {
    photos: [
      'IMAGE1.jpeg','IMAGE2.jpeg','IMAGE3.jpeg',
      'IMAGE4.jpeg','IMAGE5.jpeg','IMAGE6.jpeg'
    ]
  },
  videos: [
    { file: 'video1.mp4',  folder: 'videos/lucrece/' },
    { file: 'video2.mp4',  folder: 'videos/lucrece/' },
    { file: 'video3.mp4',  folder: 'videos/lucrece/' },
    { file: 'video4.mp4',  folder: 'videos/lucrece/' },
    { file: 'video5.mp4',  folder: 'videos/lucrece/' },
    { file: 'video6.mp4',  folder: 'videos/lucrece/' },
    { file: 'video7.mp4',  folder: 'videos/lucrece/' },
    { file: 'video8.mp4',  folder: 'videos/lucrece/' },
    { file: 'video9.mp4',  folder: 'videos/lucrece/' },
    { file: 'video10.mp4', folder: 'videos/lucrece/' }
  ]
};

/* ══════════════════════════════════════════════
   2 ENVELOPPES — LUCIO & MAMAN
══════════════════════════════════════════════ */
const ENVELOPES = [
  {
    from: 'Lucio',
    emoji: '💛',
    message: `Murielle,

Ça fait 22 ans que tu es là.
22 ans que tu es la grande sœur que tout le monde rêve d'avoir.

Tu n'as jamais eu besoin de te battre pour qu'on te remarque.
Tu es juste là — calme, forte, présente.
Et cette présence, elle compte plus que tu ne le crois.

Il y a des soirs où j'ai eu besoin de toi sans te le dire.
Et tu étais là quand même.
C'est ça, Murielle.

Aujourd'hui c'est ton jour.
Profite de chaque seconde.
Tu le mérites depuis longtemps.

Je t'aime, grande sœur.`,
    signature: '— Lucio ♥'
  },
  {
    from: 'Maman',
    emoji: '🌸',
    message: `Ma Murielle,

Tu sais, il y a des choses qu'une mère ne dit pas assez.
Pas parce qu'elle ne les pense pas —
mais parce que la vie passe trop vite
et qu'on croit toujours qu'on aura le temps plus tard.

Alors aujourd'hui je te le dis :

Tu es ma fierté.
Pas pour ce que tu fais.
Pour ce que tu es.

Ta douceur dans un monde qui l'est peu.
Ta patience quand tout le monde s'impatiente.
Ce sourire que tu gardes même dans les moments difficiles.

22 ans, mon bébé.
Et tu es déjà une femme que j'admire.

Je t'aime de tout mon cœur,
pour toujours et au-delà.`,
    signature: '— Maman 🌸'
  }
];

/* ══════════════════════════════════════════════
   LOADER
   (déclenché par startSite() après l'intro)
══════════════════════════════════════════════ */
window.addEventListener('load', () => {
  window._siteLoaded = true;
});

/* ══════════════════════════════════════════════
   PARTICLES
══════════════════════════════════════════════ */
function initParticles() {
  if (typeof particlesJS === 'undefined') return;
  particlesJS('particles-js', {
    particles: {
      number: { value: 50, density: { enable: true, value_area: 900 } },
      color: { value: ['#c9a84c', '#f0d080', '#ffffff', '#00b4ff'] },
      shape: { type: 'circle' },
      opacity: {
        value: 0.35, random: true,
        anim: { enable: true, speed: 0.4, opacity_min: 0.05, sync: false }
      },
      size: { value: 1.8, random: true },
      line_linked: {
        enable: true, distance: 140,
        color: '#c9a84c', opacity: 0.06, width: 1
      },
      move: {
        enable: true, speed: 0.45,
        direction: 'none', random: true, out_mode: 'out'
      }
    },
    interactivity: {
      detect_on: 'canvas',
      events: { onhover: { enable: true, mode: 'repulse' }, resize: true },
      modes: { repulse: { distance: 100, duration: 0.4 } }
    },
    retina_detect: true
  });
}

/* ══════════════════════════════════════════════
   GALERIES
══════════════════════════════════════════════ */
function buildGallery(containerId, person, photos) {
  const container = document.getElementById(containerId);
  if (!container) return;
  container.innerHTML = '';

  if (!photos.length) {
    container.innerHTML = `<div class="gallery-placeholder">
      📷 Ajoute tes photos dans img/${person}/
    </div>`;
    return;
  }

  photos.forEach((file, i) => {
    const item = document.createElement('div');
    item.className = 'gallery-item';

    const img = document.createElement('img');
    img.src = `img/${person}/${file}`;
    img.alt = `Souvenir ${i + 1}`;
    img.loading = 'lazy';

    const zoom = document.createElement('div');
    zoom.className = 'zoom-icon';
    zoom.textContent = '⊕';

    item.appendChild(img);
    item.appendChild(zoom);

    item.addEventListener('click', (function(src) {
      return function() { openLightbox(src); };
    })(`img/${person}/${file}`));

    container.appendChild(item);
  });
}

/* ══════════════════════════════════════════════
   LIGHTBOX
══════════════════════════════════════════════ */
function openLightbox(src) {
  const lb = document.getElementById('lightbox');
  lb.querySelector('img').src = src;
  lb.classList.add('active');
  document.body.style.overflow = 'hidden';
}

function closeLightbox() {
  document.getElementById('lightbox').classList.remove('active');
  document.body.style.overflow = '';
}

function initLightbox() {
  const lb = document.getElementById('lightbox');
  if (!lb) return;
  lb.addEventListener('click', closeLightbox);
  lb.querySelector('img').addEventListener('click', e => e.stopPropagation());
  document.querySelector('.lightbox-close')?.addEventListener('click', closeLightbox);
}

/* ══════════════════════════════════════════════
   VIDÉOS AUTOPLAY
══════════════════════════════════════════════ */
function buildVideoFeed() {
  const feed = document.getElementById('video-feed');
  if (!feed || !CONFIG.videos.length) return;
  feed.innerHTML = '';

  CONFIG.videos.forEach(v => {
    const item = document.createElement('div');
    item.className = 'video-item';

    const video = document.createElement('video');
    video.src         = `${v.folder}${v.file}`;
    video.loop        = true;
    video.muted       = true;
    video.playsInline = true;
    video.preload     = 'metadata';

    const overlay = document.createElement('div');
    overlay.className = 'video-overlay';

    const btn = document.createElement('div');
    btn.className     = 'play-btn';
    btn.textContent   = '▶';
    btn.style.opacity = '0';

    overlay.appendChild(btn);

    item.addEventListener('click', () => {
      if (video.paused) {
        pauseAllVideos();
        video.play().catch(() => {});
        btn.style.opacity = '0';
      } else {
        video.pause();
        btn.style.opacity = '1';
      }
    });

    const obs = new IntersectionObserver(entries => {
      entries.forEach(e => {
        if (e.isIntersecting) {
          video.play().catch(() => {});
          btn.style.opacity = '0';
        } else {
          video.pause();
          video.currentTime = 0;
          btn.style.opacity = '1';
        }
      });
    }, { threshold: 0.5 });

    obs.observe(item);
    item.appendChild(video);
    item.appendChild(overlay);
    feed.appendChild(item);
  });
}

function pauseAllVideos() {
  document.querySelectorAll('.video-item video').forEach(v => {
    v.pause();
    const btn = v.closest('.video-item')?.querySelector('.play-btn');
    if (btn) btn.style.opacity = '1';
  });
}

/* ══════════════════════════════════════════════
   CODE SECRET — CLAVIER CUSTOM
══════════════════════════════════════════════ */
const SECRET_CODE = '1974';
let currentCode = '';

function initCodeSecret() {
  const btnOpen    = document.getElementById('btn-open-messages');
  const modalCode  = document.getElementById('modal-code');
  const btnClose   = document.getElementById('btn-close-modal');
  const errorMsg   = document.getElementById('code-error');
  const numBtns    = document.querySelectorAll('.num-btn');

  if (!btnOpen || !modalCode) return;

  btnOpen.addEventListener('click', () => {
    currentCode = '';
    updateDots();
    errorMsg.classList.remove('visible');
    openModal(modalCode);
  });

  btnClose?.addEventListener('click', () => {
    closeModal(modalCode);
    resetCodeState();
  });

  modalCode.addEventListener('click', e => {
    if (e.target === modalCode) {
      closeModal(modalCode);
      resetCodeState();
    }
  });

  // Clavier custom
  numBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const val = btn.getAttribute('data-num');

      if (val === 'clear') {
        currentCode = currentCode.slice(0, -1);
        updateDots();
        errorMsg.classList.remove('visible');
        resetDotColors();
      } else if (val === 'ok') {
        validateCode(errorMsg, modalCode);
      } else {
        if (currentCode.length < 4) {
          currentCode += val;
          updateDots();
          // Animation du dot qui vient de se remplir
          const dot = document.getElementById(`dot-${currentCode.length - 1}`);
          if (dot) {
            dot.style.transform = 'scale(1.4)';
            setTimeout(() => { dot.style.transform = ''; }, 300);
          }
          // Auto-valider quand 4 chiffres
          if (currentCode.length === 4) {
            setTimeout(() => validateCode(errorMsg, modalCode), 400);
          }
        }
      }
    });
  });

  // Support clavier physique
  document.addEventListener('keydown', handleKeyboard);
}

function handleKeyboard(e) {
  const modalCode = document.getElementById('modal-code');
  if (!modalCode?.classList.contains('active')) return;

  if (e.key >= '0' && e.key <= '9' && currentCode.length < 4) {
    currentCode += e.key;
    updateDots();
    if (currentCode.length === 4) {
      setTimeout(() => validateCode(
        document.getElementById('code-error'),
        modalCode
      ), 400);
    }
  } else if (e.key === 'Backspace') {
    currentCode = currentCode.slice(0, -1);
    updateDots();
    resetDotColors();
    document.getElementById('code-error')?.classList.remove('visible');
  } else if (e.key === 'Enter') {
    validateCode(document.getElementById('code-error'), modalCode);
  }
}

function updateDots() {
  for (let i = 0; i < 4; i++) {
    const dot = document.getElementById(`dot-${i}`);
    if (!dot) continue;
    if (i < currentCode.length) {
      dot.classList.add('filled');
    } else {
      dot.classList.remove('filled');
    }
  }
}

function resetDotColors() {
  for (let i = 0; i < 4; i++) {
    const dot = document.getElementById(`dot-${i}`);
    dot?.classList.remove('error-dot');
  }
}

function validateCode(errorMsg, modalCode) {
  if (currentCode.length < 4) return;

  if (currentCode === SECRET_CODE) {
    // Succès — transition cinématique
    closeModal(modalCode);
    resetCodeState();
    setTimeout(() => {
      openModal(document.getElementById('modal-envelopes'));
    }, 600);
  } else {
    // Erreur — animation premium
    errorMsg?.classList.add('visible');
    for (let i = 0; i < 4; i++) {
      const dot = document.getElementById(`dot-${i}`);
      dot?.classList.remove('filled');
      dot?.classList.add('error-dot');
    }
    setTimeout(() => {
      currentCode = '';
      updateDots();
      resetDotColors();
    }, 800);
  }
}

function resetCodeState() {
  currentCode = '';
  updateDots();
  resetDotColors();
  document.getElementById('code-error')?.classList.remove('visible');
}

/* ══════════════════════════════════════════════
   ENVELOPPES
══════════════════════════════════════════════ */
function buildEnvelopes() {
  const grid = document.getElementById('envelopes-grid');
  if (!grid) return;
  grid.innerHTML = '';

  ENVELOPES.forEach((env, i) => {
    const wrap = document.createElement('div');
    wrap.className = 'envelope-wrap';

    wrap.innerHTML = `
      <div class="envelope">
        <div class="envelope-body">
          <div class="envelope-lines">
            <span></span><span></span><span></span>
          </div>
        </div>
        <div class="envelope-flap"></div>
        <div class="envelope-seal">${env.emoji}</div>
      </div>
      <div class="envelope-name">De ${env.from}</div>
    `;

    wrap.addEventListener('click', (function(index, element) {
      return function() { openLetter(index, element); };
    })(i, wrap));

    grid.appendChild(wrap);
  });

  document.getElementById('btn-close-envelopes')?.addEventListener('click', () => {
    closeModal(document.getElementById('modal-envelopes'));
  });

  document.getElementById('modal-envelopes')?.addEventListener('click', e => {
    if (e.target === document.getElementById('modal-envelopes')) {
      closeModal(document.getElementById('modal-envelopes'));
    }
  });
}

/* ══════════════════════════════════════════════
   LETTRE — APPARITION LIGNE PAR LIGNE
══════════════════════════════════════════════ */
function openLetter(index, wrap) {
  const env = ENVELOPES[index];
  if (!env) return;

  wrap.classList.add('opened');

  setTimeout(() => {
    const fromEl = document.getElementById('letter-from');
    const bodyEl = document.getElementById('letter-body');
    const signEl = document.getElementById('letter-signature');

    if (fromEl) fromEl.textContent = `De : ${env.from}`;
    if (bodyEl) bodyEl.textContent = '';
    if (signEl) {
      signEl.textContent = env.signature;
      signEl.classList.remove('visible');
    }

    closeModal(document.getElementById('modal-envelopes'));

    setTimeout(() => {
      openModal(document.getElementById('modal-letter'));

      // Apparition ligne par ligne
      setTimeout(() => {
        if (bodyEl) typewriterEffect(bodyEl, env.message, signEl);
      }, 400);
    }, 350);
  }, 700);
}

function typewriterEffect(el, text, signEl) {
  const lines = text.split('\n');
  let lineIndex = 0;

  function addNextLine() {
    if (lineIndex >= lines.length) {
      // Toutes les lignes affichées → signature apparaît
      setTimeout(() => {
        if (signEl) signEl.classList.add('visible');
      }, 300);
      return;
    }

    const line = lines[lineIndex];
    lineIndex++;

    // Créer le nœud texte pour cette ligne
    el.textContent += (lineIndex > 1 ? '\n' : '') + line;

    // Scroll automatique dans la lettre
    const letterBox = document.querySelector('.letter-box');
    if (letterBox) {
      letterBox.scrollTop = letterBox.scrollHeight;
    }

    // Délai entre les lignes : plus court pour les lignes courtes
    const delay = line.trim() === '' ? 80 : Math.min(60 + line.length * 8, 280);
    setTimeout(addNextLine, delay);
  }

  addNextLine();
}

function initLetterClose() {
  const modalLetter    = document.getElementById('modal-letter');
  const modalEnvelopes = document.getElementById('modal-envelopes');
  const btnClose       = document.getElementById('btn-close-letter');

  const backToEnvelopes = () => {
    closeModal(modalLetter);
    document.querySelectorAll('.envelope-wrap.opened')
      .forEach(w => w.classList.remove('opened'));
    setTimeout(() => openModal(modalEnvelopes), 400);
  };

  btnClose?.addEventListener('click', backToEnvelopes);
  modalLetter?.addEventListener('click', e => {
    if (e.target === modalLetter) backToEnvelopes();
  });
}

/* ══════════════════════════════════════════════
   HELPERS MODALES
══════════════════════════════════════════════ */
function openModal(modal) {
  if (!modal) return;
  modal.classList.add('active');
  document.body.style.overflow = 'hidden';
}

function closeModal(modal) {
  if (!modal) return;
  modal.classList.remove('active');
  document.body.style.overflow = '';
}

document.addEventListener('keydown', e => {
  if (e.key === 'Escape') {
    document.querySelectorAll('.modal-overlay.active').forEach(m => closeModal(m));
    closeLightbox();
  }
});

/* ══════════════════════════════════════════════
   MUSIQUE
══════════════════════════════════════════════ */
function initMusic() {
  const btn   = document.getElementById('music-toggle');
  const audio = document.getElementById('bg-music');
  if (!btn || !audio) return;

  let playing = false;

  btn.addEventListener('click', () => {
    if (playing) {
      audio.pause();
      btn.classList.remove('playing');
      btn.textContent = '♪';
    } else {
      audio.volume = 0.3;
      audio.play().catch(() => {});
      btn.classList.add('playing');
      btn.textContent = '♫';
    }
    playing = !playing;
  });
}

/* ══════════════════════════════════════════════
   PARALLAX HERO
══════════════════════════════════════════════ */
function initParallax() {
  const heroContent = document.querySelector('.hero-content');
  if (!heroContent) return;

  window.addEventListener('scroll', () => {
    const y  = window.scrollY;
    const vh = window.innerHeight;
    if (y < vh) {
      heroContent.style.transform = `translateY(${y * 0.25}px)`;
      heroContent.style.opacity   = Math.max(0, 1 - (y / vh) * 1.3);
    }
  }, { passive: true });
}

/* ══════════════════════════════════════════════
   CONFETTIS
══════════════════════════════════════════════ */
let confettiFired = false;

function launchConfetti() {
  if (confettiFired || typeof confetti === 'undefined') return;
  confettiFired = true;

  // Burst central
  confetti({
    particleCount: 120,
    spread: 130,
    origin: { y: 0.6 },
    colors: ['#c9a84c', '#f0d080', '#00b4ff', '#60d4ff', '#ffffff'],
    ticks: 350
  });

  // Pluie latérale
  const end = Date.now() + 5000;
  const interval = setInterval(() => {
    if (Date.now() > end) { clearInterval(interval); return; }
    confetti({
      particleCount: 4, angle: 60, spread: 60,
      origin: { x: 0 },
      colors: ['#c9a84c', '#f0d080', '#ffffff'], ticks: 280
    });
    confetti({
      particleCount: 4, angle: 120, spread: 60,
      origin: { x: 1 },
      colors: ['#00b4ff', '#60d4ff', '#ffffff'], ticks: 280
    });
  }, 38);
}

/* ══════════════════════════════════════════════
   WOW MOMENT — RÉVÉLATION FINALE
══════════════════════════════════════════════ */
let wowFired = false;

function initWowMoment() {
  // Observer le finale
  const finale = document.getElementById('finale');
  if (!finale) return;

  const obs = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (e.isIntersecting && !wowFired) {
        // Le wow se déclenche 4s après l'entrée dans le finale
        setTimeout(() => triggerWowMoment(), 4000);
      }
    });
  }, { threshold: 0.8 });

  obs.observe(finale);
}

function triggerWowMoment() {
  if (wowFired) return;
  wowFired = true;

  const wow = document.getElementById('wow-screen');
  if (!wow) return;

  wow.classList.add('active');

  // Séquence d'animation
  const line1 = wow.querySelector('.wow-line-1');
  const line2 = wow.querySelector('.wow-line-2');
  const line3 = wow.querySelector('.wow-line-3');
  const sign  = wow.querySelector('.wow-signature');

  // 1. Murielle apparaît
  setTimeout(() => {
    if (line1) {
      line1.style.transition = 'opacity 1.2s ease, transform 1.2s ease';
      line1.style.opacity    = '1';
      line1.style.transform  = 'translateY(0)';
    }
  }, 800);

  // 2. Luciano apparaît
  setTimeout(() => {
    if (line2) {
      line2.style.transition = 'opacity 1.2s ease, transform 1.2s ease';
      line2.style.opacity    = '1';
      line2.style.transform  = 'translateY(0)';
    }
  }, 2000);

  // 3. La phrase s'écrit lettre par lettre
  setTimeout(() => {
    if (line3) {
      line3.style.transition = 'opacity 0.8s ease';
      line3.style.opacity    = '1';
      const fullText = 'Ce site a été fait avec tout mon amour.';
      line3.textContent = '';
      let i = 0;
      const typeInterval = setInterval(() => {
        line3.textContent += fullText[i];
        i++;
        if (i >= fullText.length) clearInterval(typeInterval);
      }, 55);
    }
  }, 3400);

  // 4. Signature
  setTimeout(() => {
    if (sign) {
      sign.style.transition = 'opacity 1.5s ease';
      sign.style.opacity    = '1';
    }
  }, 6000);

  // 5. Confettis depuis le wow
  setTimeout(() => {
    confetti({
      particleCount: 150,
      spread: 160,
      origin: { y: 0.5 },
      colors: ['#c9a84c', '#f0d080', '#00b4ff', '#60d4ff', '#ffffff'],
      ticks: 400
    });
  }, 5500);

  // 6. Fermeture douce après 10s (tap pour fermer aussi)
  setTimeout(() => {
    wow.style.transition = 'opacity 2s ease';
    wow.style.opacity    = '0';
    setTimeout(() => {
      wow.classList.remove('active');
      wow.style.opacity = '';
    }, 2000);
  }, 10000);

  // Tap pour fermer manuellement
  wow.addEventListener('click', () => {
    wow.style.transition = 'opacity 1s ease';
    wow.style.opacity    = '0';
    setTimeout(() => {
      wow.classList.remove('active');
      wow.style.opacity = '';
    }, 1000);
  }, { once: true });
}

/* ══════════════════════════════════════════════
   GSAP ANIMATIONS
══════════════════════════════════════════════ */
function initGSAP() {
  if (typeof gsap === 'undefined' || typeof ScrollTrigger === 'undefined') {
    initScrollFallback(); return;
  }

  gsap.registerPlugin(ScrollTrigger);

  // Labels
  gsap.utils.toArray('.chapter-label').forEach(el => {
    gsap.fromTo(el,
      { opacity: 0, y: -10 },
      { opacity: 1, y: 0, duration: 1, ease: 'power2.out',
        scrollTrigger: { trigger: el, start: 'top 90%' } }
    );
  });

  // Textes fond
  gsap.utils.toArray('.chapter-bg-text').forEach(el => {
    gsap.fromTo(el,
      { opacity: 0, scale: 1.06 },
      { opacity: 1, scale: 1, duration: 2, ease: 'power2.out',
        scrollTrigger: { trigger: el, start: 'top 80%' } }
    );
  });

  // Tags
  gsap.utils.toArray('.person-tag').forEach(el => {
    gsap.fromTo(el,
      { opacity: 0, scale: 0.7 },
      { opacity: 1, scale: 1, duration: 0.9, ease: 'back.out(2)',
        scrollTrigger: { trigger: el, start: 'top 88%' } }
    );
  });

  // Noms
  gsap.utils.toArray('.person-name').forEach(el => {
    gsap.fromTo(el,
      { opacity: 0, y: 80 },
      { opacity: 1, y: 0, duration: 1.4, ease: 'power4.out',
        scrollTrigger: { trigger: el, start: 'top 85%' } }
    );
  });

  // Citations
  gsap.utils.toArray('.person-quote').forEach(el => {
    gsap.fromTo(el,
      { opacity: 0, y: 24 },
      { opacity: 1, y: 0, duration: 1.1, ease: 'power2.out',
        scrollTrigger: { trigger: el, start: 'top 87%' } }
    );
  });

  // Traits
  gsap.utils.toArray('.trait').forEach((el, i) => {
    gsap.fromTo(el,
      { opacity: 0, y: 12 },
      { opacity: 1, y: 0, duration: 0.7, delay: i * 0.1,
        ease: 'power2.out',
        scrollTrigger: { trigger: el, start: 'top 90%' } }
    );
  });

  // Titres
  gsap.utils.toArray('.chapter-title').forEach(el => {
    gsap.fromTo(el,
      { opacity: 0, y: 40 },
      { opacity: 1, y: 0, duration: 1.1, ease: 'power3.out',
        scrollTrigger: { trigger: el, start: 'top 85%' } }
    );
  });

  // Photos
  gsap.utils.toArray('.gallery-item').forEach((el, i) => {
    gsap.fromTo(el,
      { opacity: 0, scale: 0.9 },
      { opacity: 1, scale: 1, duration: 0.7, delay: (i % 3) * 0.08,
        ease: 'power2.out',
        scrollTrigger: { trigger: el, start: 'top 95%' } }
    );
  });

  // Messages story
  gsap.utils.toArray('.story-msg').forEach((el, i) => {
    gsap.fromTo(el,
      { opacity: 0, x: -50 },
      { opacity: 1, x: 0, duration: 1.1, delay: i * 0.15,
        ease: 'power3.out',
        scrollTrigger: { trigger: el, start: 'top 86%' } }
    );
  });

  // Transition narrative
  gsap.fromTo('.nb-text',
    { opacity: 0, letterSpacing: '0.4em' },
    { opacity: 1, letterSpacing: '0.02em', duration: 1.5, ease: 'power2.out',
      scrollTrigger: { trigger: '.narrative-break', start: 'top 80%' } }
  );
  gsap.fromTo('.nb-line',
    { scaleX: 0 },
    { scaleX: 1, duration: 1.8, ease: 'power2.inOut',
      scrollTrigger: { trigger: '.narrative-break', start: 'top 80%' } }
  );

  // Vidéos
  gsap.utils.toArray('.video-item').forEach((el, i) => {
    gsap.fromTo(el,
      { opacity: 0, y: 50 },
      { opacity: 1, y: 0, duration: 0.9, delay: (i % 3) * 0.08,
        ease: 'power3.out',
        scrollTrigger: { trigger: el, start: 'top 93%' } }
    );
  });

  // Carte messages
  gsap.fromTo('.messages-card-inner',
    { opacity: 0, y: 50, scale: 0.96 },
    { opacity: 1, y: 0, scale: 1, duration: 1.2, ease: 'power3.out',
      scrollTrigger: { trigger: '.messages-card', start: 'top 82%' } }
  );

  // Final
  const tl = gsap.timeline({
    scrollTrigger: {
      trigger: '#finale',
      start: 'top 65%',
      onEnter: launchConfetti
    }
  });

  tl.fromTo('.finale-pre',
      { opacity: 0, y: 20 },
      { opacity: 1, y: 0, duration: 0.9 })
    .fromTo('.finale-title',
      { opacity: 0, y: 60 },
      { opacity: 1, y: 0, duration: 1.4, ease: 'power4.out' }, '-=0.3')
    .fromTo('.finale-names',
      { opacity: 0, scale: 0.85 },
      { opacity: 1, scale: 1, duration: 1.2, ease: 'back.out(1.6)' }, '-=0.6')
    .fromTo('.finale-date',
      { opacity: 0 },
      { opacity: 1, duration: 1 }, '-=0.4')
    .fromTo('.finale-sign',
      { opacity: 0, y: 16 },
      { opacity: 1, y: 0, duration: 0.9 }, '-=0.5');
}

function initScrollFallback() {
  const obs = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        e.target.style.opacity    = '1';
        e.target.style.transform  = 'none';
        e.target.style.transition = 'opacity 0.9s ease, transform 0.9s ease';
      }
    });
  }, { threshold: 0.1 });

  document.querySelectorAll(
    '.person-name, .person-tag, .person-quote, .gallery-item, ' +
    '.story-msg, .chapter-title, .video-item, .messages-card-inner'
  ).forEach(el => {
    el.style.opacity = '0';
    obs.observe(el);
  });
}

/* ══════════════════════════════════════════════
   INIT GÉNÉRAL
══════════════════════════════════════════════ */
document.addEventListener('DOMContentLoaded', () => {
  initWelcomeGate();
  buildGallery('gallery-lucrece', 'lucrece', CONFIG.lucrece.photos);
  buildGallery('gallery-luciano', 'luciano', CONFIG.luciano.photos);
  buildVideoFeed();
  buildEnvelopes();
  initLightbox();
  initCodeSecret();
  initLetterClose();
  initMusic();
  initParallax();
  initWowMoment();

  const waitGSAP = setInterval(() => {
    if (typeof gsap !== 'undefined') {
      clearInterval(waitGSAP);
      initGSAP();
    }
  }, 80);

  setTimeout(() => {
    clearInterval(waitGSAP);
    if (typeof gsap === 'undefined') initScrollFallback();
  }, 3000);
});