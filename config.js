/**
 * Central backend base URL for portfolio static pages (dev vs prod).
 *
 * Resolution order:
 * 1. Query: ?apiOrigin=https://your-api.example.com (no trailing slash required)
 * 2. localStorage: portfolio_backend_origin (full origin, persisted override)
 * 3. Hostname: localhost / 127.0.0.1 / empty → dev; otherwise → production
 *
 * Edit DEV_ORIGIN / PROD_ORIGIN below when your deployment URLs change.
 */
(function () {
  var DEV_ORIGIN = "http://localhost:5000";
  var PROD_ORIGIN = "https://job-hunter-service.vercel.app";

  function trimSlash(s) {
    return String(s).replace(/\/+$/, "");
  }

  function resolveBackendOrigin() {
    try {
      var q = new URLSearchParams(window.location.search).get("apiOrigin");
      if (q) return trimSlash(q);
    } catch (e) {}

    try {
      var stored = localStorage.getItem("portfolio_backend_origin");
      if (stored) return trimSlash(stored);
    } catch (e) {}

    var h = window.location.hostname;
    if (h === "localhost" || h === "127.0.0.1" || h === "") {
      return DEV_ORIGIN;
    }
    return PROD_ORIGIN;
  }

  var origin = resolveBackendOrigin();

  window.__PORTFOLIO_ENV__ = {
    devOrigin: DEV_ORIGIN,
    prodOrigin: PROD_ORIGIN,
    backendOrigin: origin,
    portfolioApiBase: origin + "/api/portfolio",
    authApiBase: origin + "/api/authentication",
    isDevHostname:
      window.location.hostname === "localhost" ||
      window.location.hostname === "127.0.0.1",
  };
})();
