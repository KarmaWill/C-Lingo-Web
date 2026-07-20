(function () {
  var fullscreenActive = false;
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

  function setFullscreen(active, root) {
    fullscreenActive = active;
    document.body.classList.toggle('hsk-fullscreen-active', active);
    var overlay = document.getElementById('hsk-fullscreen-overlay');
    var iframe = document.getElementById('hsk-tablet-iframe');
    var pageRoot = root || document.getElementById('page-hsk');
    var previewSlot = pageRoot && pageRoot.querySelector('.hsk-tablet-preview-slot');
    var fullscreenSlot = overlay && overlay.querySelector('.hsk-fullscreen-stage');

    if (overlay && overlay.parentNode !== document.body) {
      document.body.appendChild(overlay);
    }

    if (overlay) {
      overlay.classList.toggle('is-open', active);
      overlay.setAttribute('aria-hidden', active ? 'false' : 'true');
    }
    if (iframe && previewSlot && fullscreenSlot) {
      if (active) {
        fullscreenSlot.appendChild(iframe);
        iframe.classList.add('hsk-tablet-iframe--fullscreen');
        iframe.classList.remove('hsk-tablet-iframe--preview');
        iframe.setAttribute('tabindex', '0');
        window.setTimeout(function () {
          try {
            iframe.focus();
          } catch (err) {
            /* cross-origin focus may fail silently */
          }
        }, 60);
      } else {
        previewSlot.appendChild(iframe);
        iframe.classList.remove('hsk-tablet-iframe--fullscreen');
        iframe.classList.add('hsk-tablet-iframe--preview');
        iframe.removeAttribute('tabindex');
      }
    }
    var nav = document.getElementById('nav');
    if (nav) nav.setAttribute('aria-hidden', active ? 'true' : 'false');
  }

  function bindHskInteractions(root) {
    var enterBtn = root.querySelector('.hsk-tablet-enter-btn');
    var overlay = document.getElementById('hsk-fullscreen-overlay');
    var closeBtn = overlay && overlay.querySelector('.hsk-fullscreen-close');

    function openFullscreen() {
      setFullscreen(true, root);
    }

    function closeFullscreen() {
      setFullscreen(false, root);
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
          var page = document.getElementById('page-hsk');
          setFullscreen(false, page);
        }
      });
    }
  }

  function mountHskPage() {
    var root = document.getElementById('page-hsk');
    if (!root) return;

    var embedUrl = buildEmbedUrl();
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
                    '<iframe ' +
                      'class="hsk-tablet-iframe hsk-tablet-iframe--preview" ' +
                      'id="hsk-tablet-iframe" ' +
                      'title="C-Lingo HSK Mock Exam" ' +
                      'src="' + embedUrl + '" ' +
                      'allow="fullscreen; autoplay; clipboard-write" ' +
                      'loading="lazy"' +
                    '></iframe>' +
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
        '<div class="hsk-fullscreen-overlay" id="hsk-fullscreen-overlay" aria-hidden="true">' +
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

    if (fullscreenActive) setFullscreen(false, root);
  }

  window.mountHskPage = mountHskPage;
  window.HSK_PAGE_BG = HSK_PAGE_BG;
})();
