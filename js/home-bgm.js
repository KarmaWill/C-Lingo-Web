(function () {
  var STORAGE_PAUSED = 'clingo-home-bgm-user-paused';
  var STORAGE_MUTED = 'clingo-home-bgm-muted';
  var DEFAULT_VOLUME = 0.32;

  /** Fixed playlist order (loop to start). Suno links are titles only — local mp3 required. */
  var PLAYLIST = [
    {
      id: 'beyond-language',
      title: 'Beyond Language',
      src: 'assets/audio/01-beyond-language.mp3',
      suno: 'https://suno.com/s/Pg7yHwGRxmbioDoz'
    },
    {
      id: 'beyond-language-y',
      title: 'Beyond Language Y',
      src: 'assets/audio/02-beyond-language-y.mp3',
      suno: 'https://suno.com/s/e6F0ZEePbedBijGp'
    },
    {
      id: 'lumi-nation-op',
      title: 'Lumi-Nation (OP)',
      src: 'assets/audio/03-lumi-nation-op.mp3',
      suno: 'https://suno.com/s/T8iRA6gHNFqL3r1M'
    },
    {
      id: 'lumi-nation-musical',
      title: 'Lumi-Nation (Musical)',
      src: 'assets/audio/04-lumi-nation-musical.mp3',
      suno: 'https://suno.com/s/z9ktnhOEpie36ptv'
    },
    {
      id: 'beyond-language-global',
      title: 'Beyond Language (Global Version)',
      src: 'assets/audio/05-beyond-language-global.mp3',
      suno: 'https://suno.com/s/bdztZwE6SgN4GRNT'
    },
    {
      id: 'beyond-language-z',
      title: 'Beyond Language Z',
      src: 'assets/audio/06-beyond-language-z.mp3',
      suno: 'https://suno.com/s/1YyhyYhiORokjtkg'
    },
    {
      id: 'explorer',
      title: '探索者',
      src: 'assets/audio/07-explorer.mp3',
      suno: 'https://suno.com/s/yXJFtJLJpadkh2X6'
    },
    {
      id: 'the-explorer',
      title: 'The Explorer',
      src: 'assets/audio/08-the-explorer.mp3',
      suno: 'https://suno.com/s/skwOfICJYuB4lPri'
    }
  ];

  var audio = null;
  var index = 0;
  var ready = false;
  var wantsPlay = false;
  var gestureArmed = false;
  var expanded = false;
  var pinExpanded = false;
  var consecutiveErrors = 0;
  var els = {};
  var GESTURE_EVENTS = ['pointerdown', 'touchstart', 'keydown', 'click'];
  var fineHover = false;

  function sessionPaused() {
    try { return sessionStorage.getItem(STORAGE_PAUSED) === '1'; } catch (e) { return false; }
  }

  function setSessionPaused(value) {
    try {
      if (value) sessionStorage.setItem(STORAGE_PAUSED, '1');
      else sessionStorage.removeItem(STORAGE_PAUSED);
    } catch (e) { /* ignore */ }
  }

  function sessionMuted() {
    try { return sessionStorage.getItem(STORAGE_MUTED) === '1'; } catch (e) { return false; }
  }

  function setSessionMuted(value) {
    try {
      if (value) sessionStorage.setItem(STORAGE_MUTED, '1');
      else sessionStorage.removeItem(STORAGE_MUTED);
    } catch (e) { /* ignore */ }
  }

  function isHomeActive() {
    var page = document.getElementById('page-home');
    return !!(page && page.classList.contains('active'));
  }

  function currentTrack() {
    return PLAYLIST[index] || PLAYLIST[0];
  }

  function isBlocked() {
    return !!(wantsPlay && audio && audio.paused && isHomeActive() && !sessionPaused());
  }

  function setExpanded(on, pinned) {
    expanded = !!on;
    if (typeof pinned === 'boolean') pinExpanded = pinned;
    if (!expanded) pinExpanded = false;
    if (els.root) {
      els.root.setAttribute('data-expanded', expanded ? '1' : '0');
    }
  }

  function updateUi() {
    if (!els.root) return;
    var track = currentTrack();
    var playing = !!(audio && !audio.paused && !audio.ended);
    var blocked = isBlocked();

    els.root.hidden = !isHomeActive();
    els.root.setAttribute('data-playing', playing ? '1' : '0');
    els.root.setAttribute('data-needs-gesture', blocked ? '1' : '0');
    els.root.setAttribute('data-expanded', expanded ? '1' : '0');
    if (els.hint) {
      els.hint.textContent = blocked ? 'Tap play' : (playing ? 'Now playing' : 'Paused');
    }
    if (els.title) els.title.textContent = track.title;
    if (els.play) {
      els.play.setAttribute('aria-label', playing ? 'Pause' : 'Play');
      els.play.setAttribute('title', playing ? 'Pause' : 'Play');
    }
    if (els.mute) {
      var muted = !!(audio && audio.muted);
      els.mute.setAttribute('aria-label', muted ? 'Unmute' : 'Mute');
      els.mute.setAttribute('title', muted ? 'Unmute' : 'Mute');
      els.root.setAttribute('data-muted', muted ? '1' : '0');
    }
  }

  function loadTrack(i, autoplay, fromError) {
    if (!audio || !PLAYLIST.length) return;
    index = ((i % PLAYLIST.length) + PLAYLIST.length) % PLAYLIST.length;
    var track = currentTrack();
    wantsPlay = !!autoplay;
    if (!fromError) consecutiveErrors = 0;
    audio.src = track.src;
    audio.load();
    updateUi();
    if (autoplay) tryPlay();
  }

  function disarmGestureUnlock() {
    if (!gestureArmed) return;
    gestureArmed = false;
    GESTURE_EVENTS.forEach(function (type) {
      document.removeEventListener(type, onFirstGesture, true);
    });
  }

  function onFirstGesture() {
    if (!isHomeActive() || sessionPaused()) {
      disarmGestureUnlock();
      return;
    }
    disarmGestureUnlock();
    setSessionPaused(false);
    tryPlay();
  }

  function armGestureUnlock() {
    if (gestureArmed || sessionPaused() || !isHomeActive()) return;
    gestureArmed = true;
    GESTURE_EVENTS.forEach(function (type) {
      document.addEventListener(type, onFirstGesture, { capture: true, passive: true });
    });
  }

  function tryPlay() {
    if (!audio || !isHomeActive()) return;
    wantsPlay = true;
    if (audio.readyState < 2) {
      audio.addEventListener('canplay', function onReady() {
        audio.removeEventListener('canplay', onReady);
        if (wantsPlay && !sessionPaused() && isHomeActive()) tryPlay();
      });
    }
    var p = audio.play();
    if (p && typeof p.then === 'function') {
      p.then(function () {
        setSessionPaused(false);
        disarmGestureUnlock();
        updateUi();
      }).catch(function () {
        // Keep collapsed; pulse the circle CTA.
        setExpanded(false);
        armGestureUnlock();
        updateUi();
      });
    } else {
      updateUi();
    }
  }

  function pauseForNav() {
    if (!audio) return;
    wantsPlay = false;
    setExpanded(false);
    audio.pause();
    updateUi();
  }

  function userPause() {
    if (!audio) return;
    wantsPlay = false;
    setSessionPaused(true);
    audio.pause();
    updateUi();
  }

  function userPlay() {
    setSessionPaused(false);
    tryPlay();
  }

  function togglePlay() {
    if (!audio) return;
    if (audio.paused) userPlay();
    else userPause();
  }

  function next(auto) {
    loadTrack(index + 1, auto !== false && !sessionPaused());
  }

  function prev() {
    if (audio && audio.currentTime > 2.5) {
      audio.currentTime = 0;
      updateUi();
      return;
    }
    loadTrack(index - 1, !sessionPaused());
  }

  function toggleMute() {
    if (!audio) return;
    audio.muted = !audio.muted;
    setSessionMuted(audio.muted);
    updateUi();
  }

  function onHomeEnter() {
    if (!ready) return;
    updateUi();
    if (sessionPaused()) {
      wantsPlay = false;
      disarmGestureUnlock();
      updateUi();
      return;
    }
    tryPlay();
  }

  function onHomeLeave() {
    disarmGestureUnlock();
    pauseForNav();
  }

  function syncRoute() {
    if (isHomeActive()) onHomeEnter();
    else onHomeLeave();
  }

  function onPlayClick(e) {
    e.stopPropagation();
    var blocked = isBlocked();
    var playing = !!(audio && !audio.paused && !audio.ended);

    // Touch: while playing and collapsed, first tap expands (not pause).
    if (!fineHover && !expanded && playing && !blocked) {
      setExpanded(true, true);
      updateUi();
      return;
    }

    // Blocked autoplay: play immediately, stay collapsed.
    if (blocked) {
      setExpanded(false);
      userPlay();
      return;
    }

    togglePlay();
  }

  function onShellClick(e) {
    if (e.target.closest('[data-bgm-play], [data-bgm-prev], [data-bgm-next], [data-bgm-mute]')) {
      return;
    }
    // Click chrome expands (desktop + touch).
    if (!expanded) {
      setExpanded(true, true);
      updateUi();
    }
  }

  function onDocPointerDown(e) {
    if (!expanded || !els.root || !isHomeActive()) return;
    if (els.root.contains(e.target)) return;
    setExpanded(false);
    updateUi();
  }

  function bindShell() {
    fineHover = !!(window.matchMedia && window.matchMedia('(hover: hover) and (pointer: fine)').matches);

    els.root.addEventListener('mouseenter', function () {
      if (!fineHover) return;
      setExpanded(true, false);
      updateUi();
    });
    els.root.addEventListener('mouseleave', function () {
      if (!fineHover) return;
      if (pinExpanded) return;
      setExpanded(false);
      updateUi();
    });
    els.root.addEventListener('click', onShellClick);
    document.addEventListener('pointerdown', onDocPointerDown, true);
  }

  function bindControls() {
    if (els.play) els.play.addEventListener('click', onPlayClick);
    if (els.prev) els.prev.addEventListener('click', function () { prev(); });
    if (els.next) els.next.addEventListener('click', function () { next(true); });
    if (els.mute) els.mute.addEventListener('click', toggleMute);
  }

  function bindAudio() {
    audio.addEventListener('play', function () {
      consecutiveErrors = 0;
      updateUi();
    });
    audio.addEventListener('pause', updateUi);
    audio.addEventListener('canplay', function () {
      consecutiveErrors = 0;
    });
    audio.addEventListener('ended', function () {
      next(true);
    });
    audio.addEventListener('error', function () {
      consecutiveErrors += 1;
      if (consecutiveErrors >= PLAYLIST.length) {
        wantsPlay = false;
        updateUi();
        return;
      }
      loadTrack(index + 1, wantsPlay && !sessionPaused(), true);
    });
  }

  function init() {
    els.root = document.getElementById('home-bgm');
    if (!els.root) return;
    els.hint = els.root.querySelector('[data-bgm-hint]');
    els.title = els.root.querySelector('[data-bgm-title]');
    els.play = els.root.querySelector('[data-bgm-play]');
    els.prev = els.root.querySelector('[data-bgm-prev]');
    els.next = els.root.querySelector('[data-bgm-next]');
    els.mute = els.root.querySelector('[data-bgm-mute]');

    audio = new Audio();
    audio.preload = 'auto';
    audio.volume = DEFAULT_VOLUME;
    audio.muted = sessionMuted();
    try { audio.setAttribute('playsinline', ''); } catch (e) { /* ignore */ }

    bindAudio();
    bindControls();
    bindShell();
    document.addEventListener('visibilitychange', function () {
      if (document.visibilityState === 'visible' && isHomeActive() && !sessionPaused()) {
        tryPlay();
      }
    });
    ready = true;

    loadTrack(0, window.self === window.top && !sessionPaused());
    syncRoute();
  }

  window.syncHomeBgm = syncRoute;

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
