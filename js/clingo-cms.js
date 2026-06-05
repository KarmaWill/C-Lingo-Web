(function () {
  function escapeHtml(value) {
    return String(value || '')
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;');
  }

  function formatNewsDate(item) {
    if (!item.publishedAt && !item.category) return '';
    var datePart = '';
    if (item.publishedAt) {
      try {
        datePart = new Date(item.publishedAt).toLocaleDateString('en-US', {
          year: 'numeric',
          month: 'long',
          day: 'numeric',
        });
      } catch (e) {
        datePart = String(item.publishedAt).slice(0, 10);
      }
    }
    if (item.category && datePart) return datePart + ' · ' + item.category;
    return item.category || datePart;
  }

  function showMaintenance(message) {
    var existing = document.getElementById('clingo-maintenance-overlay');
    if (existing) return;
    var overlay = document.createElement('div');
    overlay.id = 'clingo-maintenance-overlay';
    overlay.style.cssText =
      'position:fixed;inset:0;z-index:99999;background:rgba(0,45,35,0.92);color:#F4FFF5;display:flex;align-items:center;justify-content:center;padding:24px;text-align:center;font-family:DM Sans,sans-serif;';
    overlay.innerHTML =
      '<div style="max-width:480px"><h1 style="margin:0 0 12px;font-size:1.75rem">Under Maintenance</h1><p style="margin:0;opacity:0.85;line-height:1.6">' +
      escapeHtml(message || 'We are performing scheduled maintenance. Please check back soon.') +
      '</p></div>';
    document.body.appendChild(overlay);
  }

  function renderNews(items) {
    var grid = document.getElementById('home-news-grid');
    if (!grid || !items || !items.length) return;

    grid.innerHTML = items
      .slice(0, 3)
      .map(function (item) {
        var slug = item.slug ? "goTo('" + item.slug.replace(/'/g, "\\'") + "')" : '';
        var onclick = slug ? ' onclick="' + slug + '"' : '';
        var img = item.imageUrl
          ? '<img src="' + escapeHtml(item.imageUrl) + '" alt="' + escapeHtml(item.title) + '">'
          : '';
        return (
          '<div class="news-card"' +
          onclick +
          '><div class="news-card-img">' +
          img +
          '</div><div class="news-card-body"><div class="news-date">' +
          escapeHtml(formatNewsDate(item)) +
          '</div><h4>' +
          escapeHtml(item.title) +
          '</h4><p>' +
          escapeHtml(item.summary || '') +
          '</p></div></div>'
        );
      })
      .join('');
  }

  function renderSloganBanner(banner) {
    if (!banner) return;
    var headline = document.getElementById('home-slogan-headline-text');
    var tagline = document.getElementById('home-slogan-tagline');
    var logo = document.getElementById('home-slogan-logo');
    if (headline && banner.title) headline.textContent = banner.title;
    if (tagline && banner.subtitle) tagline.textContent = banner.subtitle;
    if (logo && banner.imageUrl) logo.src = banner.imageUrl;
  }

  async function loadCmsContent() {
    if (!window.ClingoApi) return;

    try {
      var cfg = await window.ClingoApi.getProductConfig();
      if (cfg && cfg.maintenance_mode === 'true') {
        showMaintenance(cfg.maintenance_message || '');
        return;
      }
    } catch (e) {
      /* keep static fallback */
    }

    try {
      var news = await window.ClingoApi.getCmsNews();
      if (Array.isArray(news) && news.length) renderNews(news);
    } catch (e) {
      /* keep static fallback */
    }

    try {
      var banners = await window.ClingoApi.getCmsBanners('home_slogan');
      if (Array.isArray(banners) && banners.length) renderSloganBanner(banners[0]);
    } catch (e) {
      /* keep static fallback */
    }
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', loadCmsContent);
  } else {
    loadCmsContent();
  }

  window.ClingoCms = { loadCmsContent, showMaintenance };
})();
