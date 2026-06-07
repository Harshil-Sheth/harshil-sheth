// Portfolio Website - Client-side JavaScript
// Minimalist, performant, no external dependencies

/* ========================================
   CONFIGURATION (base URL from config.js → __PORTFOLIO_ENV__)
   ======================================== */
const CONFIG = {
  get API_BASE_URL() {
    var env = window.__PORTFOLIO_ENV__;
    if (env && env.portfolioApiBase) return env.portfolioApiBase;
    return "http://localhost:5000/api/portfolio";
  },
  get RESUME_URL() {
    return `${this.API_BASE_URL}/resume/download`;
  },
};

/* ========================================
   THEME MANAGEMENT
   ======================================== */
class ThemeManager {
  constructor() {
    this.themeToggle = document.getElementById("theme-toggle");
    this.currentTheme = localStorage.getItem("theme") || "light";
    this.init();
  }

  init() {
    document.documentElement.setAttribute("data-theme", this.currentTheme);
    this.themeToggle.addEventListener("click", () => this.toggleTheme());
  }

  toggleTheme() {
    this.currentTheme = this.currentTheme === "light" ? "dark" : "light";
    document.documentElement.setAttribute("data-theme", this.currentTheme);
    localStorage.setItem("theme", this.currentTheme);
  }
}

/* ========================================
   NAVIGATION
   ======================================== */
class Navigation {
  constructor() {
    this.navToggle = document.querySelector(".nav-toggle");
    this.navMenu = document.querySelector(".nav-menu");
    this.navLinks = document.querySelectorAll(".nav-link");
    this.init();
  }

  init() {
    if (this.navToggle) {
      this.navToggle.addEventListener("click", () => this.toggleMenu());
    }

    this.navLinks.forEach((link) => {
      link.addEventListener("click", () => this.closeMenu());
    });

    // Smooth scroll
    this.navLinks.forEach((link) => {
      link.addEventListener("click", (e) => {
        e.preventDefault();
        const targetId = link.getAttribute("href").substring(1);
        const targetSection = document.getElementById(targetId);
        if (targetSection) {
          const navHeight = document.querySelector(".nav").offsetHeight;
          const targetPosition = targetSection.offsetTop - navHeight;
          window.scrollTo({
            top: targetPosition,
            behavior: "smooth",
          });
        }
      });
    });

    // Highlight active section
    window.addEventListener("scroll", () => this.highlightActiveSection());
  }

  toggleMenu() {
    this.navMenu.classList.toggle("active");
  }

  closeMenu() {
    this.navMenu.classList.remove("active");
  }

  highlightActiveSection() {
    const sections = document.querySelectorAll("section[id]");
    const scrollY = window.pageYOffset;
    const navHeight = document.querySelector(".nav").offsetHeight;

    sections.forEach((section) => {
      const sectionHeight = section.offsetHeight;
      const sectionTop = section.offsetTop - navHeight - 100;
      const sectionId = section.getAttribute("id");
      const correspondingLink = document.querySelector(
        `.nav-link[href="#${sectionId}"]`,
      );

      if (scrollY > sectionTop && scrollY <= sectionTop + sectionHeight) {
        this.navLinks.forEach((link) => link.classList.remove("active"));
        if (correspondingLink) {
          correspondingLink.classList.add("active");
        }
      }
    });
  }
}

/* ========================================
   METRICS COUNTER ANIMATION
   ======================================== */
class MetricsCounter {
  constructor() {
    this.metrics = document.querySelectorAll(".metrics .metric-value");
    this.animated = false;
    this.init();
  }

  init() {
    window.addEventListener("scroll", () => this.checkVisibility());
    this.checkVisibility();
  }

  checkVisibility() {
    if (this.animated) return;

    const metricsSection = document.querySelector(".metrics");
    if (!metricsSection) return;

    const rect = metricsSection.getBoundingClientRect();
    const isVisible = rect.top < window.innerHeight && rect.bottom >= 0;

    if (isVisible) {
      this.animated = true;
      this.animateCounters();
    }
  }

  animateCounters() {
    this.metrics.forEach((metric) => {
      if (metric.hasAttribute("data-tenure")) {
        const env = window.__PORTFOLIO_ENV__;
        const target =
          env && typeof env.getCareerYearsRounded === "function"
            ? env.getCareerYearsRounded(1)
            : 0;
        this.animateTenureYears(metric, target, 2000);
        return;
      }

      const target = parseInt(metric.getAttribute("data-target"), 10);
      if (Number.isNaN(target)) return;

      const duration = 2000;
      const increment = target / (duration / 16);
      let current = 0;

      const updateCounter = () => {
        current += increment;
        if (current < target) {
          metric.textContent = Math.floor(current).toLocaleString() + "+";
          requestAnimationFrame(updateCounter);
        } else {
          metric.textContent = target.toLocaleString() + "+";
        }
      };

      updateCounter();
    });
  }

  /** Whole years from careerStartIso, same style as other metrics (e.g. 5+) */
  animateTenureYears(metric, target, duration) {
    const increment = target / (duration / 16);
    let current = 0;

    const updateCounter = () => {
      current += increment;
      if (current < target) {
        metric.textContent = Math.floor(current).toLocaleString() + "+";
        requestAnimationFrame(updateCounter);
      } else {
        metric.textContent = target.toLocaleString() + "+";
      }
    };

    updateCounter();
  }
}

/* ========================================
   ANALYTICS TRACKING
   ======================================== */
class Analytics {
  constructor() {
    this.sessionId = this.getOrCreateSessionId();
    this.fingerprint = this.generateFingerprint();
    this.trackPageView();
    this.trackTimeOnPage();
    this.trackScrollDepth();
    this.initUiClickTracking();
  }

  // Generate unique session ID
  getOrCreateSessionId() {
    let sessionId = sessionStorage.getItem("portfolio_session_id");
    if (!sessionId) {
      sessionId = this.generateUUID();
      sessionStorage.setItem("portfolio_session_id", sessionId);
    }
    return sessionId;
  }

  // Generate UUID
  generateUUID() {
    return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(
      /[xy]/g,
      function (c) {
        const r = (Math.random() * 16) | 0;
        const v = c === "x" ? r : (r & 0x3) | 0x8;
        return v.toString(16);
      },
    );
  }

  // Generate browser fingerprint for unique visitor tracking
  generateFingerprint() {
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");
    ctx.textBaseline = "top";
    ctx.font = "14px Arial";
    ctx.fillText("fingerprint", 2, 2);
    const canvasData = canvas.toDataURL();

    const components = [
      navigator.userAgent,
      navigator.language,
      screen.colorDepth,
      screen.width + "x" + screen.height,
      new Date().getTimezoneOffset(),
      !!window.sessionStorage,
      !!window.localStorage,
      canvasData,
    ];

    return this.hashCode(components.join("|||"));
  }

  // Simple hash function
  hashCode(str) {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
      const char = str.charCodeAt(i);
      hash = (hash << 5) - hash + char;
      hash = hash & hash;
    }
    return Math.abs(hash).toString(36);
  }

  // Parse URL parameters (UTM and custom)
  getUrlParameters() {
    const params = new URLSearchParams(window.location.search);
    return {
      utmSource: params.get("utm_source") || params.get("source") || null,
      utmMedium: params.get("utm_medium") || params.get("medium") || null,
      utmCampaign: params.get("utm_campaign") || params.get("campaign") || null,
      utmTerm: params.get("utm_term") || params.get("term") || null,
      utmContent: params.get("utm_content") || params.get("content") || null,
      customSource: params.get("ref") || params.get("from") || null,
    };
  }

  async trackPageView() {
    try {
      const urlParams = this.getUrlParameters();

      const trackingData = {
        // Page & Navigation
        page: window.location.pathname + window.location.search,
        referrer: document.referrer,

        // UTM & Campaign Parameters
        ...urlParams,

        // Device & Browser
        userAgent: navigator.userAgent,
        screenResolution: `${window.screen.width}x${window.screen.height}`,
        viewport: `${window.innerWidth}x${window.innerHeight}`,
        colorDepth: window.screen.colorDepth,
        timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
        language: navigator.language,

        // Session & Behavior
        sessionId: this.sessionId,
        fingerprint: this.fingerprint,

        // Timestamp
        timestamp: new Date().toISOString(),
      };

      const response = await fetch(`${CONFIG.API_BASE_URL}/analytics/visit`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(trackingData),
      });

      if (response.ok) {
        const result = await response.json();
        console.log("Page view tracked:", result);

        // Store visitor ID for future tracking
        if (result.visitorId) {
          sessionStorage.setItem("portfolio_visitor_id", result.visitorId);
        }
      }
    } catch (error) {
      console.error("Failed to track page view:", error);
    }
  }

  // Track scroll depth
  trackScrollDepth() {
    let maxScrollDepth = 0;

    const trackScroll = () => {
      const windowHeight = window.innerHeight;
      const documentHeight = document.documentElement.scrollHeight;
      const scrollTop =
        window.pageYOffset || document.documentElement.scrollTop;

      const scrollDepth = Math.round(
        ((scrollTop + windowHeight) / documentHeight) * 100,
      );

      if (scrollDepth > maxScrollDepth) {
        maxScrollDepth = scrollDepth;

        // Track milestones: 25%, 50%, 75%, 100%
        if (maxScrollDepth >= 25 && maxScrollDepth < 50) {
          this.trackEvent("scroll_depth", { depth: 25 });
        } else if (maxScrollDepth >= 50 && maxScrollDepth < 75) {
          this.trackEvent("scroll_depth", { depth: 50 });
        } else if (maxScrollDepth >= 75 && maxScrollDepth < 100) {
          this.trackEvent("scroll_depth", { depth: 75 });
        } else if (maxScrollDepth === 100) {
          this.trackEvent("scroll_depth", { depth: 100 });
        }
      }
    };

    let scrollTimeout;
    window.addEventListener("scroll", () => {
      clearTimeout(scrollTimeout);
      scrollTimeout = setTimeout(trackScroll, 500);
    });
  }

  trackTimeOnPage() {
    const startTime = Date.now();

    window.addEventListener("beforeunload", async () => {
      const timeSpent = Math.floor((Date.now() - startTime) / 1000);

      // Use sendBeacon for reliable tracking on page unload
      const data = JSON.stringify({
        page: window.location.pathname,
        sessionId: this.sessionId,
        timeSpent: timeSpent,
      });

      navigator.sendBeacon(`${CONFIG.API_BASE_URL}/analytics/time-spent`, data);
    });
  }

  async trackEvent(eventName, eventData = {}) {
    try {
      const visitorId = sessionStorage.getItem("portfolio_visitor_id");
      await fetch(`${CONFIG.API_BASE_URL}/analytics/event`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          event: eventName,
          visitorId: visitorId || undefined,
          data: {
            ...eventData,
            sessionId: this.sessionId,
            fingerprint: this.fingerprint,
          },
          timestamp: new Date().toISOString(),
        }),
      });
    } catch (error) {
      console.error("Failed to track event:", error);
    }
  }

  /**
   * Nav, footer, project links, CTAs — stored as event `ui_click` with category/label.
   */
  async trackUiClick({ category, label, href }) {
    try {
      const visitorId = sessionStorage.getItem("portfolio_visitor_id");
      await fetch(`${CONFIG.API_BASE_URL}/analytics/event`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          event: "ui_click",
          visitorId: visitorId || undefined,
          category,
          label,
          href: href || "",
          data: {
            sessionId: this.sessionId,
            fingerprint: this.fingerprint,
          },
          timestamp: new Date().toISOString(),
        }),
        keepalive: true,
      });
    } catch (error) {
      console.error("Failed to track UI click:", error);
    }
  }

  initUiClickTracking() {
    document.addEventListener(
      "click",
      (e) => {
        const el = e.target.closest("a, button");
        if (!el) return;
        if (el.closest("[data-no-track]")) return;
        if (el.id === "download-resume") return;

        let category = "other";
        let label = "";
        const href = el.getAttribute("href") || "";

        if (el.classList.contains("nav-link")) {
          category = "nav";
          label = (el.textContent || "").trim() || href;
        } else if (el.classList.contains("nav-logo")) {
          category = "nav";
          label = "Logo (home)";
        } else if (el.classList.contains("project-link-btn")) {
          category = "project_link";
          const span = el.querySelector("span");
          label = span
            ? span.textContent.trim()
            : (el.textContent || "").trim();
        } else if (el.closest(".footer-links")) {
          category = "footer";
          label = (el.textContent || "").trim() || href;
        } else if (el.id === "theme-toggle") {
          category = "ui";
          label = "theme_toggle";
        } else if (el.classList.contains("nav-toggle")) {
          category = "ui";
          label = "mobile_menu_toggle";
        } else if (el.closest(".hero-cta")) {
          category = "cta";
          label =
            (el.textContent || "").trim().slice(0, 120) || "hero_cta";
        } else if (
          el.tagName === "BUTTON" &&
          el.getAttribute("type") === "submit" &&
          el.closest("form")
        ) {
          const fid = el.closest("form")?.getAttribute("id") || "form";
          category = "form";
          label = `${fid}_submit`;
        } else if (el.tagName === "A") {
          category = "link";
          label =
            (el.textContent || "").trim().slice(0, 120) || href || "link";
        } else if (el.tagName === "BUTTON") {
          category = "button";
          label =
            (el.textContent || "").trim().slice(0, 120) ||
            el.getAttribute("aria-label") ||
            "button";
        }

        if (!label) label = href || "unknown";

        this.trackUiClick({ category, label, href });
      },
      true,
    );
  }

  static async trackEvent(eventName, eventData = {}) {
    try {
      await fetch(`${CONFIG.API_BASE_URL}/analytics/event`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          event: eventName,
          data: eventData,
          timestamp: new Date().toISOString(),
        }),
      });
    } catch (error) {
      console.error("Failed to track event:", error);
    }
  }
}

/* ========================================
   RESUME DOWNLOAD
   ======================================== */
class ResumeDownloader {
  constructor() {
    this.downloadBtn = document.getElementById("download-resume");
    this.init();
  }

  init() {
    if (this.downloadBtn) {
      this.downloadBtn.addEventListener("click", () => this.downloadResume());
    }
  }

  async downloadResume() {
    try {
      const pa = window.portfolioAnalytics;
      if (pa && typeof pa.trackEvent === "function") {
        await pa.trackEvent("resume_download", { source: "hero_section" });
      } else {
        await Analytics.trackEvent("resume_download", {
          source: "hero_section",
        });
      }

      const response = await fetch(`${CONFIG.API_BASE_URL}/resume/download`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userAgent: navigator.userAgent,
          timestamp: new Date().toISOString(),
        }),
      });

      if (response.ok) {
        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = "Harshil_Sheth_Resume.pdf";
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(url);
        document.body.removeChild(a);
      } else {
        console.error("Failed to download resume");
        alert("Failed to download resume. Please try again.");
      }
    } catch (error) {
      console.error("Error downloading resume:", error);
      alert("Failed to download resume. Please try again.");
    }
  }
}

/* ========================================
   CONTACT FORM
   ======================================== */
class ContactForm {
  constructor() {
    this.form = document.getElementById("contact-form");
    this.status = document.getElementById("contact-status");
    this.init();
  }

  init() {
    if (this.form) {
      this.form.addEventListener("submit", (e) => this.handleSubmit(e));
    }
  }

  async handleSubmit(e) {
    e.preventDefault();

    const formData = new FormData(this.form);
    const data = {
      name: formData.get("name"),
      email: formData.get("email"),
      subject: formData.get("subject"),
      message: formData.get("message"),
      timestamp: new Date().toISOString(),
    };

    try {
      const response = await fetch(`${CONFIG.API_BASE_URL}/contact`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      if (response.ok) {
        this.showStatus(
          "success",
          "Message sent successfully! I'll get back to you soon.",
        );
        this.form.reset();
        Analytics.trackEvent("contact_form_submit", { success: true });
      } else {
        this.showStatus("error", "Failed to send message. Please try again.");
        Analytics.trackEvent("contact_form_submit", { success: false });
      }
    } catch (error) {
      console.error("Error submitting contact form:", error);
      this.showStatus("error", "Failed to send message. Please try again.");
      Analytics.trackEvent("contact_form_submit", {
        success: false,
        error: error.message,
      });
    }
  }

  showStatus(type, message) {
    this.status.textContent = message;
    this.status.className = `form-status ${type}`;

    setTimeout(() => {
      this.status.className = "form-status";
    }, 5000);
  }
}

/* ========================================
   FREELANCE FORM
   ======================================== */
class FreelanceForm {
  constructor() {
    this.form = document.getElementById("freelance-form");
    this.status = document.getElementById("freelance-status");
    this.init();
  }

  init() {
    if (this.form) {
      this.form.addEventListener("submit", (e) => this.handleSubmit(e));
    }
  }

  async handleSubmit(e) {
    e.preventDefault();

    const formData = new FormData(this.form);
    const data = {
      name: formData.get("name"),
      email: formData.get("email"),
      company: formData.get("company"),
      budget: formData.get("budget"),
      projectDescription: formData.get("projectDescription"),
      timestamp: new Date().toISOString(),
    };

    try {
      const response = await fetch(`${CONFIG.API_BASE_URL}/freelance`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      if (response.ok) {
        this.showStatus(
          "success",
          "Inquiry submitted successfully! I'll review and get back to you within 48 hours.",
        );
        this.form.reset();
        Analytics.trackEvent("freelance_inquiry_submit", {
          success: true,
          budget: data.budget,
        });
      } else {
        this.showStatus("error", "Failed to submit inquiry. Please try again.");
        Analytics.trackEvent("freelance_inquiry_submit", { success: false });
      }
    } catch (error) {
      console.error("Error submitting freelance form:", error);
      this.showStatus("error", "Failed to submit inquiry. Please try again.");
      Analytics.trackEvent("freelance_inquiry_submit", {
        success: false,
        error: error.message,
      });
    }
  }

  showStatus(type, message) {
    this.status.textContent = message;
    this.status.className = `form-status ${type}`;

    setTimeout(() => {
      this.status.className = "form-status";
    }, 5000);
  }
}

/* ========================================
   SCROLL ANIMATIONS
   ======================================== */
class ScrollAnimations {
  constructor() {
    this.elements = document.querySelectorAll(
      ".timeline-item, .project-card, .skill-category",
    );
    this.init();
  }

  init() {
    if ("IntersectionObserver" in window) {
      this.observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              entry.target.classList.add("fade-in");
              this.observer.unobserve(entry.target);
            }
          });
        },
        {
          threshold: 0.1,
          rootMargin: "0px 0px -50px 0px",
        },
      );

      this.elements.forEach((element) => {
        this.observer.observe(element);
      });
    }
  }
}

/* ========================================
   INITIALIZATION
   ======================================== */
function initFooterYear() {
  const el = document.getElementById("portfolio-footer-year");
  if (el) {
    el.textContent = String(new Date().getFullYear());
  }
}

function initAboutCareerYears() {
  const env = window.__PORTFOLIO_ENV__;
  const el = document.getElementById("about-career-years");
  if (el && env && typeof env.getCareerYearsWhole === "function") {
    el.textContent = String(env.getCareerYearsWhole());
  }
}

document.addEventListener("DOMContentLoaded", () => {
  initFooterYear();
  initAboutCareerYears();
  // Initialize all components
  new ThemeManager();
  new Navigation();
  new MetricsCounter();
  const analytics = new Analytics();
  window.portfolioAnalytics = analytics;
  new ResumeDownloader();
  new ContactForm();
  new FreelanceForm();
  new ScrollAnimations();

  console.log("Portfolio website initialized");
  console.log("Session ID:", analytics.sessionId);
  console.log("Fingerprint:", analytics.fingerprint);

  // Parse and log UTM parameters if present
  const urlParams = analytics.getUrlParameters();
  if (Object.values(urlParams).some((v) => v !== null)) {
    console.log("UTM Parameters:", urlParams);
  }
});

// Export Analytics class for external use
window.Analytics = Analytics;
