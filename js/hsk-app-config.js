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

  window.CLINGO_HSK_APP_BASE =
    window.CLINGO_HSK_APP_BASE ||
    (isLocal ? protocol + '//' + (host || 'localhost') + ':3001' : 'https://app.clingoaios.com');

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
