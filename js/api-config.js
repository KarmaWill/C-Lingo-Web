// Auto-detect local vs production API base
(function () {
  var host = typeof location !== 'undefined' ? location.hostname : '';
  var isLocal =
    host === 'localhost' ||
    host === '127.0.0.1' ||
    host === '' ||
    /^192\.168\.\d{1,3}\.\d{1,3}$/.test(host) ||
    /^10\.\d{1,3}\.\d{1,3}\.\d{1,3}$/.test(host) ||
    /^172\.(1[6-9]|2\d|3[01])\.\d{1,3}\.\d{1,3}$/.test(host);
  window.CLINGO_API_BASE =
    window.CLINGO_API_BASE ||
    (isLocal ? 'http://localhost:3000' : 'https://clingo-api.vercel.app');
  window.CLINGO_PRODUCT_CODE = window.CLINGO_PRODUCT_CODE || 'hsk_web';
})();
