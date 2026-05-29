(function () {
  const base = window.CLINGO_API_BASE || 'http://localhost:3000';
  const TOKEN_KEY = 'clingo-web-token';

  function getToken() {
    return localStorage.getItem(TOKEN_KEY);
  }

  function setToken(token) {
    if (token) localStorage.setItem(TOKEN_KEY, token);
    else localStorage.removeItem(TOKEN_KEY);
  }

  async function apiFetch(path, options) {
    const headers = Object.assign({ 'Content-Type': 'application/json' }, options && options.headers);
    const token = getToken();
    if (token) headers.Authorization = 'Bearer ' + token;
    const res = await fetch(base.replace(/\/$/, '') + path, Object.assign({}, options, {
      headers,
      credentials: 'include',
    }));
    const data = await res.json().catch(function () { return {}; });
    if (!res.ok) throw new Error(data.error || 'Request failed (' + res.status + ')');
    return data;
  }

  window.ClingoApi = {
    base: base,
    getToken,
    setToken,
    login: function (username, password) {
      return apiFetch('/api/auth/login', {
        method: 'POST',
        body: JSON.stringify({ username, password }),
      }).then(function (data) {
        setToken(data.token);
        return data.user;
      });
    },
    register: function (username, password) {
      return apiFetch('/api/auth/register', {
        method: 'POST',
        body: JSON.stringify({ username, password }),
      });
    },
    submitFeedback: function (content) {
      return apiFetch('/api/feedback', {
        method: 'POST',
        body: JSON.stringify({
          productCode: window.CLINGO_PRODUCT_CODE || 'hsk_web',
          content: content,
        }),
      });
    },
    getProductConfig: function (code) {
      return apiFetch('/api/products/' + (code || window.CLINGO_PRODUCT_CODE || 'hsk_web') + '/config')
        .then(function (data) { return data.configs; });
    },
  };
})();
