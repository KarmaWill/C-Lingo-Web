(function () {
  var fullscreenActive = false;
  var examInProgress = false;
  var lastFocusedElement = null;
  var inertBackgroundElements = [];
  var previewCarouselTimer = null;
  var HSK_PAGE_BG =
    'linear-gradient(180deg, #F4FFF5 0%, #EAFBF0 48%, #F7FFF6 100%)';
  var PREVIEW_SLIDES = [
    {
      src: 'assets/hsk-preview/hsk-cutout-01-levels.png?v=20260731hd',
      alt: 'HSK mock exam — choose level'
    },
    {
      src: 'assets/hsk-preview/hsk-cutout-02-papers.png?v=20260731hd',
      alt: 'HSK 1 practice papers — mock test and C-Lingo practice'
    },
    {
      src: 'assets/hsk-preview/hsk-cutout-03-listening.png?v=20260731hd',
      alt: 'HSK 1 mock exam — listening question with image options'
    },
    {
      src: 'assets/hsk-preview/hsk-cutout-04-match.png?v=20260731hd',
      alt: 'HSK 1 mock exam — listen and match images'
    },
    {
      src: 'assets/hsk-preview/hsk-cutout-05-fillblank.png?v=20260731hd',
      alt: 'HSK 1 mock exam — fill in the blank with pinyin'
    },
    {
      src: 'assets/hsk-preview/hsk-cutout-06-results.png?v=20260731hd',
      alt: 'HSK 1 mock exam — score report and answer review'
    }
  ];
  var PREVIEW_INTERVAL_MS = 3200;

  function getSearchParams() {
    return new URLSearchParams(window.location.search || '');
  }

  function buildEmbedUrl() {
    var params = getSearchParams();
    var skin = params.get('skin') === 'clingo' ? 'clingo' : 'official';
    if (typeof window.buildHskEmbedUrl === 'function') {
      return window.buildHskEmbedUrl({ skin: skin, track: skin });
    }
    return '/hsk-prep-training';
  }

  function isExamEmbedEnabled() {
    if (typeof window.isHskExamEmbedEnabled === 'function') {
      return window.isHskExamEmbedEnabled();
    }
    return Boolean(window.CLINGO_HSK_EXAM_EMBED_ENABLED);
  }

  function createExamIframe(root) {
    if (!isExamEmbedEnabled()) return null;
    var overlay = document.getElementById('hsk-fullscreen-overlay');
    var fullscreenSlot = overlay && overlay.querySelector('.hsk-fullscreen-stage');
    if (!fullscreenSlot) return null;
    var existing = document.getElementById('hsk-tablet-iframe');
    if (existing) return existing;
    var iframe = document.createElement('iframe');
    iframe.className = 'hsk-tablet-iframe hsk-tablet-iframe--fullscreen';
    iframe.id = 'hsk-tablet-iframe';
    iframe.title = 'C-Lingo HSK Mock Exam';
    var embedUrl = new URL(buildEmbedUrl(), window.location.href);
    embedUrl.searchParams.set('parentOrigin', window.location.origin);
    iframe.src = embedUrl.toString();
    iframe.allow = 'fullscreen; autoplay; clipboard-write';
    iframe.setAttribute('tabindex', '0');
    fullscreenSlot.appendChild(iframe);
    return iframe;
  }

  function destroyExamIframe() {
    var iframe = document.getElementById('hsk-tablet-iframe');
    if (!iframe) return;
    iframe.src = 'about:blank';
    iframe.remove();
    examInProgress = false;
  }

  function setBackgroundInert(active, overlay) {
    if (active) {
      inertBackgroundElements = Array.prototype.filter.call(document.body.children, function (element) {
        return element !== overlay && !element.inert;
      });
      inertBackgroundElements.forEach(function (element) {
        element.inert = true;
      });
      return;
    }
    inertBackgroundElements.forEach(function (element) {
      element.inert = false;
    });
    inertBackgroundElements = [];
  }

  function setFullscreen(active, root) {
    if (active && !isExamEmbedEnabled()) return;
    fullscreenActive = active;
    document.body.classList.toggle('hsk-fullscreen-active', active);
    var overlay = document.getElementById('hsk-fullscreen-overlay');

    if (overlay && overlay.parentNode !== document.body) {
      document.body.appendChild(overlay);
    }

    if (overlay) {
      overlay.classList.toggle('is-open', active);
      overlay.setAttribute('aria-hidden', active ? 'false' : 'true');
      setBackgroundInert(active, overlay);
    }
    if (active) {
      var iframe = createExamIframe(root);
      window.setTimeout(function () {
        try {
          if (iframe) iframe.focus();
        } catch (err) {
          /* cross-origin focus may fail silently */
        }
      }, 60);
    }
    var nav = document.getElementById('nav');
    if (nav) nav.setAttribute('aria-hidden', active ? 'true' : 'false');
  }

  function closeFullscreen(root, force) {
    if (!fullscreenActive) return true;
    if (!force && examInProgress && !window.confirm('The mock exam is still in progress. Close it and resume later?')) return false;
    destroyExamIframe();
    setFullscreen(false, root);
    if (lastFocusedElement && typeof lastFocusedElement.focus === 'function') lastFocusedElement.focus();
    lastFocusedElement = null;
    return true;
  }
  function stopPreviewCarousel() {
    if (previewCarouselTimer) {
      window.clearInterval(previewCarouselTimer);
      previewCarouselTimer = null;
    }
  }

  function startPreviewCarousel(root) {
    stopPreviewCarousel();
    var slides = root.querySelectorAll('.hsk-tablet-preview-slide');
    var carousel = root.querySelector('.hsk-tablet-preview-carousel');
    if (slides.length < 2 || PREVIEW_SLIDES.length < 2) return;
    var index = 0;
    var front = 0;
    previewCarouselTimer = window.setInterval(function () {
      index = (index + 1) % PREVIEW_SLIDES.length;
      var back = 1 - front;
      slides[back].src = PREVIEW_SLIDES[index].src;
      slides[back].alt = PREVIEW_SLIDES[index].alt;
      slides[front].classList.remove('is-active');
      slides[back].classList.add('is-active');
      front = back;
      if (carousel) {
        // Restart sheen without forced layout read (offsetWidth caused switch jank).
        carousel.classList.remove('is-switching');
        window.requestAnimationFrame(function () {
          carousel.classList.add('is-switching');
          window.setTimeout(function () {
            carousel.classList.remove('is-switching');
          }, 850);
        });
      }
    }, PREVIEW_INTERVAL_MS);
  }

  function buildPreviewCarouselHtml() {
    var first = PREVIEW_SLIDES[0];
    var second = PREVIEW_SLIDES[1];
    return (
      '<div class="hsk-tablet-preview-slot" aria-live="polite">' +
        '<div class="hsk-tablet-float">' +
          '<div class="hsk-tablet-cutout">' +
            '<div class="hsk-tablet-preview-carousel">' +
              '<img class="hsk-tablet-preview-slide is-active" src="' +
                first.src +
                '" alt="' +
                first.alt +
                '" width="2880" height="1785" decoding="async" fetchpriority="high">' +
              '<img class="hsk-tablet-preview-slide" src="' +
                second.src +
                '" alt="' +
                second.alt +
                '" width="2880" height="1785" decoding="async">' +
            '</div>' +
          '</div>' +
        '</div>' +
      '</div>'
    );
  }

  function buildEnterButtonHtml() {
    var enabled = isExamEmbedEnabled();
    if (enabled) {
      return (
        '<button type="button" class="hsk-tablet-enter-btn">' +
          '<span class="hsk-tablet-enter-icon" aria-hidden="true">' +
            '<svg width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">' +
              '<path d="M3 6.5V3.5C3 3.22 3.22 3 3.5 3H6.5" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>' +
              '<path d="M11.5 3H14.5C14.78 3 15 3.22 15 3.5V6.5" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>' +
              '<path d="M15 11.5V14.5C15 14.78 14.78 15 14.5 15H11.5" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>' +
              '<path d="M6.5 15H3.5C3.22 15 3 14.78 3 14.5V11.5" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>' +
            '</svg>' +
          '</span>' +
          '<span class="hsk-tablet-enter-label">Open mock exam</span>' +
        '</button>'
      );
    }
    return (
      '<button type="button" class="hsk-tablet-enter-btn is-protected" disabled aria-disabled="true" title="Mock exam opens on local / LAN preview only">' +
        '<span class="hsk-tablet-enter-icon" aria-hidden="true">' +
          '<svg width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">' +
            '<path d="M3 6.5V3.5C3 3.22 3.22 3 3.5 3H6.5" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>' +
            '<path d="M11.5 3H14.5C14.78 3 15 3.22 15 3.5V6.5" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>' +
            '<path d="M15 11.5V14.5C15 14.78 14.78 15 14.5 15H11.5" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>' +
            '<path d="M6.5 15H3.5C3.22 15 3 14.78 3 14.5V11.5" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>' +
          '</svg>' +
        '</span>' +
        '<span class="hsk-tablet-enter-label">Coming soon</span>' +
      '</button>'
    );
  }

  function bindHskInteractions(root) {
    var enterBtn = root.querySelector('.hsk-tablet-enter-btn');
    var overlay = document.getElementById('hsk-fullscreen-overlay');
    var closeBtn = overlay && overlay.querySelector('.hsk-fullscreen-close');

    function openFullscreen() {
      if (!isExamEmbedEnabled()) return;
      lastFocusedElement = document.activeElement;
      setFullscreen(true, root);
    }

    function closeFullscreen() {
      window.closeHskFullscreen(false);
    }

    if (enterBtn && isExamEmbedEnabled()) {
      enterBtn.addEventListener('click', function (e) {
        e.preventDefault();
        e.stopPropagation();
        openFullscreen();
      });
    }

    if (closeBtn) {
      closeBtn.addEventListener('click', closeFullscreen);
    }

    if (!window.__hskEscBound) {
      window.__hskEscBound = true;
      document.addEventListener('keydown', function (e) {
        if (e.key === 'Escape' && fullscreenActive) {
          window.closeHskFullscreen(false);
        }
      });
    }
  }

  function mountHskPage() {
    var root = document.getElementById('page-hsk');
    if (!root) return;

    var needsMount =
      root.dataset.mounted !== '17' ||
      !root.querySelector('.hsk-tablet-enter-btn') ||
      !root.querySelector('.hsk-tablet-cutout') ||
      root.querySelectorAll('.hsk-tablet-preview-slide').length !== 2 ||
      Boolean(root.querySelector('.hsk-tablet-enter-btn.is-protected')) === isExamEmbedEnabled();

    if (needsMount) {
      stopPreviewCarousel();
      root.innerHTML =
        '<section class="hsk-page">' +
          '<div class="hsk-page-inner">' +
            '<div class="hsk-page-copy animate-in">' +
              '<div class="eyebrow">Try HSK on C-Lingo Tablet</div>' +
              '<h1>Two exam tracks.<br><em>One tablet experience.</em></h1>' +
              '<p class="hsk-page-lead">' +
                'Free micro-experience on the C-Lingo AI Learning Tablet — pick official simulation or C-Lingo enhanced practice.' +
              '</p>' +
              '<div class="hsk-compare-wrap">' +
                '<table class="hsk-compare-table">' +
                  '<thead>' +
                    '<tr>' +
                      '<th scope="col"></th>' +
                      '<th scope="col" class="col-official">Official Mock</th>' +
                      '<th scope="col" class="col-clingo">C-Lingo Practice</th>' +
                    '</tr>' +
                  '</thead>' +
                  '<tbody>' +
                    '<tr><th scope="row">Images</th><td class="col-official">Real-life photos</td><td class="col-clingo">AI brand visuals</td></tr>' +
                    '<tr><th scope="row">Interface</th><td class="col-official">Plain exam UI</td><td class="col-clingo">C-Lingo intro &amp; coaching</td></tr>' +
                    '<tr><th scope="row">Timing</th><td class="col-official">Standard exam timer</td><td class="col-clingo">Flexible · 5-min alert</td></tr>' +
                    '<tr><th scope="row">Score report</th><td class="col-official">Traditional sheet</td><td class="col-clingo">Deep analysis &amp; video tips</td></tr>' +
                    '<tr><th scope="row">Question types</th><td class="col-official">Standard HSK items</td><td class="col-clingo">Multi-format + smart rules</td></tr>' +
                  '</tbody>' +
                '</table>' +
              '</div>' +
              '<p class="hsk-page-switch-note">Switch styles inside the tablet — two skins, same device.</p>' +
              '<div class="hsk-page-actions">' +
                '<a class="btn-primary" onclick="goTo(\'product-tablet\')">View the Tablet →</a>' +
              '</div>' +
            '</div>' +
            '<div class="hsk-tablet-stage animate-in" style="transition-delay:0.08s">' +
              '<div class="hsk-tablet-preview-col">' +
                '<div class="hsk-tablet-preview">' +
                  buildPreviewCarouselHtml() +
                '</div>' +
                buildEnterButtonHtml() +
              '</div>' +
            '</div>' +
          '</div>' +
        '</section>' +
        '<div class="hsk-fullscreen-overlay" id="hsk-fullscreen-overlay" role="dialog" aria-modal="true" aria-label="C-Lingo HSK mock exam" aria-hidden="true">' +
          '<button type="button" class="hsk-fullscreen-close" aria-label="Close full screen">Close ✕</button>' +
          '<div class="hsk-fullscreen-stage"></div>' +
        '</div>';

      root.dataset.mounted = '17';
      var overlay = document.getElementById('hsk-fullscreen-overlay');
      if (overlay && overlay.parentNode !== document.body) {
        document.body.appendChild(overlay);
      }
      bindHskInteractions(root);
      startPreviewCarousel(root);
    } else if (!previewCarouselTimer) {
      startPreviewCarousel(root);
    }

    if (fullscreenActive) closeFullscreen(root, true);
  }

  window.addEventListener('message', function (event) {
    var iframe = document.getElementById('hsk-tablet-iframe');
    if (!iframe || event.source !== iframe.contentWindow || !event.data || event.data.type !== 'clingo:hsk-state') return;
    var iframeOrigin = '';
    try {
      iframeOrigin = new URL(iframe.src, window.location.href).origin;
    } catch (err) {
      return;
    }
    if (event.origin !== iframeOrigin) return;
    examInProgress = Boolean(event.data.inProgress);
  });

  window.addEventListener('beforeunload', function (event) {
    if (!examInProgress) return;
    event.preventDefault();
    event.returnValue = '';
  });

  window.closeHskFullscreen = function (force) {
    return closeFullscreen(document.getElementById('page-hsk'), Boolean(force));
  };
  window.prepareHskNavigation = function () {
    return closeFullscreen(document.getElementById('page-hsk'), false);
  };
  window.mountHskPage = mountHskPage;
  window.stopHskPreviewCarousel = stopPreviewCarousel;
  window.HSK_PAGE_BG = HSK_PAGE_BG;
})();
