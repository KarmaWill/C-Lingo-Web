// HSK tablet app embed base URL (C-Lingo AIOS local-agent-app)
(function () {
  var host = typeof location !== 'undefined' ? location.hostname : '';
  var protocol =
    typeof location !== 'undefined' && location.protocol ? location.protocol : 'http:';
  var isLocal =
    host === 'localhost' ||
    host === '127.0.0.1' ||
    host === '' ||
    /^192\.168\.\d{1,3}\.\d{1,3}$/.test(host) ||
    /^10\.\d{1,3}\.\d{1,3}\.\d{1,3}$/.test(host) ||
    /^172\.(1[6-9]|2\d|3[01])\.\d{1,3}\.\d{1,3}$/.test(host);

  // Protected zone: live mock-exam iframe only on local / LAN.
  // Production shows the HSK marketing page + preview carousel, but does not
  // embed app.clingoaios.com until that host and exam API exist.
  window.CLINGO_HSK_EXAM_EMBED_ENABLED =
    typeof window.CLINGO_HSK_EXAM_EMBED_ENABLED === 'boolean'
      ? window.CLINGO_HSK_EXAM_EMBED_ENABLED
      : isLocal;

  window.CLINGO_HSK_APP_BASE =
    window.CLINGO_HSK_APP_BASE ||
    (isLocal ? protocol + '//' + (host || 'localhost') + ':3001' : 'https://app.clingoaios.com');

  window.isHskExamEmbedEnabled = function () {
    return Boolean(window.CLINGO_HSK_EXAM_EMBED_ENABLED);
  };

  window.buildHskEmbedUrl = function (options) {
    options = options || {};
    var skin = options.skin || 'official';
    var track = options.track || skin;
    var params = new URLSearchParams();
    params.set('mode', 'website');
    params.set('skin', skin);
    params.set('track', track);
    return (
      window.CLINGO_HSK_APP_BASE.replace(/\/+$/, '') +
      '/hsk-prep-training?' +
      params.toString()
    );
  };
})();
