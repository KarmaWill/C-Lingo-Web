(function () {
  var fullscreenActive = false;
  var examInProgress = false;
  var lastFocusedElement = null;
  var inertBackgroundElements = [];
  var HSK_PAGE_BG =
    'linear-gradient(180deg, #F4FFF5 0%, #EAFBF0 48%, #F7FFF6 100%)';

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

  function createExamIframe(root) {
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
  function bindHskInteractions(root) {
    var enterBtn = root.querySelector('.hsk-tablet-enter-btn');
    var overlay = document.getElementById('hsk-fullscreen-overlay');
    var closeBtn = overlay && overlay.querySelector('.hsk-fullscreen-close');

    function openFullscreen() {
      lastFocusedElement = document.activeElement;
      setFullscreen(true, root);
    }

    function closeFullscreen() {
      window.closeHskFullscreen(false);
    }

    if (enterBtn) {
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
      root.dataset.mounted !== '3' ||
      !root.querySelector('.hsk-tablet-enter-btn') ||
      !root.querySelector('.hsk-tablet-preview-col');

    if (needsMount) {
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
                  '<div class="hsk-tablet-preview-slot">' +
                    '<img class="hsk-tablet-preview-image" src="assets/experience-hero-tablet.png" alt="C-Lingo HSK mock exam tablet preview">' +
                  '</div>' +
                '</div>' +
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
                '</button>' +
              '</div>' +
            '</div>' +
          '</div>' +
        '</section>' +
        '<div class="hsk-fullscreen-overlay" id="hsk-fullscreen-overlay" role="dialog" aria-modal="true" aria-label="C-Lingo HSK mock exam" aria-hidden="true">' +
          '<button type="button" class="hsk-fullscreen-close" aria-label="Close full screen">Close ✕</button>' +
          '<div class="hsk-fullscreen-stage"></div>' +
        '</div>';

      root.dataset.mounted = '3';
      var overlay = document.getElementById('hsk-fullscreen-overlay');
      if (overlay && overlay.parentNode !== document.body) {
        document.body.appendChild(overlay);
      }
      bindHskInteractions(root);
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
  window.HSK_PAGE_BG = HSK_PAGE_BG;
})();
