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

  /**
   * Start of professional / production timeline (first role: Nov 2020).
   * Drives the “Years in production” metric and any other tenure copy — change once here.
   */
  var CAREER_START_ISO = "2020-11-01";

  window.__PORTFOLIO_ENV__ = {
    devOrigin: DEV_ORIGIN,
    prodOrigin: PROD_ORIGIN,
    backendOrigin: origin,
    portfolioApiBase: origin + "/api/portfolio",
    authApiBase: origin + "/api/authentication",
    isDevHostname:
      window.location.hostname === "localhost" ||
      window.location.hostname === "127.0.0.1",

    /** ISO date (YYYY-MM-DD) — professional experience counter starts here */
    careerStartIso: CAREER_START_ISO,

    /** Full years as a float (from careerStartIso to now). */
    getCareerYears: function () {
      var iso = this.careerStartIso || CAREER_START_ISO;
      var start = new Date(iso + "T12:00:00");
      var now = new Date();
      if (now.getTime() < start.getTime()) return 0;
      return (now - start) / (365.25 * 24 * 60 * 60 * 1000);
    },

    /** Rounded tenure to arbitrary decimals (e.g. 5.4) — optional for non-UI use */
    getCareerYearsRounded: function (decimals) {
      var d = decimals === undefined ? 1 : decimals;
      var y = this.getCareerYears();
      var pow = Math.pow(10, d);
      return Math.round(y * pow) / pow;
    },

    /** Whole years for UI (metric + About copy), e.g. 5 */
    getCareerYearsWhole: function () {
      return Math.max(0, Math.round(this.getCareerYears()));
    },
  };
})();
