(function () {
  var PATH_TO_PAGE = {
    '/': 'home',
    '/methodology': 'methodology',
    '/products': 'products',
    '/product-tablet': 'product-tablet',
    '/product-scanpen': 'product-scanpen',
    '/about': 'about',
    '/partners': 'partners',
    '/news': 'news',
    '/experience': 'experience',
    '/hsk': 'hsk',
    '/news/hec': 'news-article-hec',
    '/news/utar': 'news-article',
    '/news/brics': 'news-article-brics',
    '/news/launch': 'news-article-launch',
    '/news/vietnam': 'news-article-vietnam',
    '/news/values': 'news-article-values',
    '/news/interview': 'news-article-interview',
  };

  var PAGE_TO_PATH = {
    home: '/',
    methodology: '/methodology',
    products: '/products',
    'product-tablet': '/product-tablet',
    'product-scanpen': '/product-scanpen',
    about: '/about',
    partners: '/partners',
    news: '/news',
    experience: '/experience',
    hsk: '/hsk',
    'news-article-hec': '/news/hec',
    'news-article': '/news/utar',
    'news-article-brics': '/news/brics',
    'news-article-launch': '/news/launch',
    'news-article-vietnam': '/news/vietnam',
    'news-article-values': '/news/values',
    'news-article-interview': '/news/interview',
  };

  function normalizePath(pathname) {
    if (!pathname || pathname === '/') return '/';
    return pathname.replace(/\/+$/, '') || '/';
  }

  function pageFromPath(pathname) {
    return PATH_TO_PAGE[normalizePath(pathname)] || 'home';
  }

  function pathForPage(page) {
    return PAGE_TO_PATH[page] || '/';
  }

  function navHighlightPage(page) {
    if (page === 'about' || page === 'partners' || page === 'methodology') return 'about';
    if (page === 'news' || page.indexOf('news-article') === 0) return 'about';
    if (page.indexOf('product-') === 0) return 'products';
    return page;
  }

  function dropdownMatchesPage(page, pages) {
    if (pages.indexOf(page) !== -1) return true;
    if (pages.indexOf('news') !== -1 && (page === 'news' || page.indexOf('news-article') === 0)) return true;
    return false;
  }

  function updateNavActive(page) {
    var navPage = navHighlightPage(page);
    document.querySelectorAll('.nav-links > li > a[data-page]').forEach(function (a) {
      a.classList.toggle('active', a.dataset.page === navPage);
    });
    document.querySelectorAll('.nav-dropdown-menu a[data-page]').forEach(function (a) {
      var dp = a.dataset.page;
      var active = page === dp || (dp === 'news' && (page === 'news' || page.indexOf('news-article') === 0));
      a.classList.toggle('active', active);
    });
    document.querySelectorAll('.nav-dropdown').forEach(function (dd) {
      var pages = (dd.dataset.pages || '').split(',');
      dd.classList.toggle('is-active', dropdownMatchesPage(page, pages));
    });
  }

  function scrollExperienceHash() {
    if (window.location.hash === '#apply') {
      var target = document.getElementById('experience-apply');
      if (target) {
        setTimeout(function () { target.scrollIntoView({ behavior: 'smooth', block: 'start' }); }, 120);
      }
    }
  }

  function activatePage(page, scrollTop) {
    if (typeof scrollTop === 'undefined') scrollTop = true;
    document.querySelectorAll('.page').forEach(function (p) { p.classList.remove('active'); });
    var el = document.getElementById('page-' + page);
    if (!el) {
      page = 'home';
      el = document.getElementById('page-home');
    }
    if (el) el.classList.add('active');
    if (page === 'experience' && window.mountExperiencePage) {
      window.mountExperiencePage();
    }
    if (page === 'hsk' && window.mountHskPage) {
      window.mountHskPage();
    } else if (window.stopHskPreviewCarousel) {
      window.stopHskPreviewCarousel();
    }
    if (window.syncHomeBgm) window.syncHomeBgm();
    document.body.classList.toggle('site-page-hsk', page === 'hsk');
    updateNavActive(page);
    if (scrollTop) window.scrollTo({ top: 0, behavior: 'smooth' });
    if (typeof observeAnimations === 'function') observeAnimations();
    if (typeof applyLaunchImageEmbargo === 'function') applyLaunchImageEmbargo();
    scrollExperienceHash();
    return page;
  }

  window.goTo = function (page, options) {
    options = options || {};
    var currentPage = pageFromPath(window.location.pathname);
    if (currentPage === 'hsk' && page !== 'hsk' && window.prepareHskNavigation && !window.prepareHskNavigation()) {
      return;
    }
    var path = pathForPage(page);
    var hash = options.hash || '';
    var url = path + hash;
    var current = window.location.pathname + window.location.hash;
    if (!options.replace && current !== url) {
      history.pushState({ page: page }, '', url);
    } else if (options.replace) {
      history.replaceState({ page: page }, '', url);
    }
    activatePage(page);
  };

  window.addEventListener('popstate', function (e) {
    var page = (e.state && e.state.page) || pageFromPath(window.location.pathname);
    var hskPage = document.getElementById('page-hsk');
    if (page !== 'hsk' && hskPage && hskPage.classList.contains('active') && window.prepareHskNavigation && !window.prepareHskNavigation()) {
      history.pushState({ page: 'hsk' }, '', '/hsk');
      return;
    }
    activatePage(page, false);
  });

  document.addEventListener('DOMContentLoaded', function () {
    var page = pageFromPath(window.location.pathname);
    history.replaceState({ page: page }, '', window.location.pathname + window.location.search + window.location.hash);
    activatePage(page, false);

    document.querySelectorAll('.nav-dropdown-trigger').forEach(function (btn) {
      btn.addEventListener('click', function (e) {
        e.stopPropagation();
        var dd = btn.closest('.nav-dropdown');
        var open = dd.classList.toggle('is-open');
        btn.setAttribute('aria-expanded', open ? 'true' : 'false');
        document.querySelectorAll('.nav-dropdown').forEach(function (other) {
          if (other !== dd) {
            other.classList.remove('is-open');
            var t = other.querySelector('.nav-dropdown-trigger');
            if (t) t.setAttribute('aria-expanded', 'false');
          }
        });
      });
    });

    document.addEventListener('click', function () {
      document.querySelectorAll('.nav-dropdown.is-open').forEach(function (dd) {
        dd.classList.remove('is-open');
        var t = dd.querySelector('.nav-dropdown-trigger');
        if (t) t.setAttribute('aria-expanded', 'false');
      });
    });
  });

  window.ClingoRouter = { pageFromPath: pageFromPath, pathForPage: pathForPage };
})();
