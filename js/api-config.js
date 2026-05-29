// Auto-detect local vs production API base
(function () {
  var host = typeof location !== 'undefined' ? location.hostname : '';
  var isLocal = host === 'localhost' || host === '127.0.0.1' || host === '';
  window.CLINGO_API_BASE =
    window.CLINGO_API_BASE ||
    (isLocal ? 'http://localhost:3000' : 'https://clingo-api.vercel.app');
  window.CLINGO_PRODUCT_CODE = window.CLINGO_PRODUCT_CODE || 'hsk_web';
})();
