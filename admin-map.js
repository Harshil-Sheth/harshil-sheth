/**
 * Visitor map: Leaflet (CDN) — pan, zoom, clickable circle markers with popups.
 * Tiles: Carto Light/Dark (grayscale-friendly) · OSM data via Carto attribution.
 */
(function (global) {
  var mapInstance = null;
  var baseLayer = null;
  var themeObserver = null;

  function isDarkTheme() {
    return document.documentElement.getAttribute("data-theme") === "dark";
  }

  function tileUrl() {
    return isDarkTheme()
      ? "https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
      : "https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png";
  }

  function attribution() {
    return (
      '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> ' +
      '&copy; <a href="https://carto.com/attributions">CARTO</a>'
    );
  }

  function markerColors() {
    return isDarkTheme()
      ? { fill: "#d0d0d0", stroke: "#ffffff" }
      : { fill: "#2a2a2a", stroke: "#0a0a0a" };
  }

  function destroyMap() {
    if (mapInstance) {
      mapInstance.remove();
      mapInstance = null;
      baseLayer = null;
    }
  }

  function markerRadius(count) {
    var c = Number(count) || 1;
    if (c <= 1) return 6;
    if (c <= 5) return 10;
    if (c <= 15) return 14;
    return 18;
  }

  function escapeHtml(s) {
    var d = document.createElement("div");
    d.textContent = s == null ? "" : String(s);
    return d.innerHTML;
  }

  function buildPopupHtml(loc) {
    var lines = [];
    lines.push(
      "<strong>" +
        escapeHtml(loc.city || "Unknown") +
        "</strong>, " +
        escapeHtml(loc.country || "Unknown"),
    );
    lines.push("Visits: <strong>" + String(loc.count || 0) + "</strong>");
    if (loc.latitude != null && loc.longitude != null) {
      lines.push(
        Number(loc.latitude).toFixed(4) +
          "°, " +
          Number(loc.longitude).toFixed(4) +
          "°",
      );
    }
    var sources = [];
    (loc.visitors || []).forEach(function (v) {
      if (v && v.utmSource) sources.push(v.utmSource);
    });
    var uniq = [];
    sources.forEach(function (s) {
      if (uniq.indexOf(s) === -1) uniq.push(s);
    });
    uniq = uniq.slice(0, 6);
    if (uniq.length) {
      lines.push("Sources: " + uniq.map(escapeHtml).join(", "));
    }
    return lines.join("<br/>");
  }

  function applyMarkerTheme() {
    if (!mapInstance) return;
    var cols = markerColors();
    mapInstance.eachLayer(function (layer) {
      if (layer && typeof L !== "undefined" && layer instanceof L.CircleMarker) {
        layer.setStyle({
          fillColor: cols.fill,
          color: cols.stroke,
        });
      }
    });
  }

  function ensureThemeObserver() {
    if (themeObserver) return;
    themeObserver = new MutationObserver(function () {
      if (!mapInstance) return;
      if (baseLayer && mapInstance.hasLayer(baseLayer)) {
        mapInstance.removeLayer(baseLayer);
      }
      baseLayer = L.tileLayer(tileUrl(), {
        attribution: attribution(),
        maxZoom: 19,
      }).addTo(mapInstance);
      applyMarkerTheme();
    });
    themeObserver.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["data-theme"],
    });
  }

  function renderPortfolioVisitorMap(containerEl, locations) {
    var mapWrap = document.getElementById("visitor-map-wrap");
    var emptyEl = document.getElementById("visitor-map-empty");

    if (typeof L === "undefined") {
      console.warn("Leaflet is not loaded");
      return;
    }
    if (!containerEl) return;

    var list = Array.isArray(locations) ? locations : [];
    var plot = list.filter(function (loc) {
      var lat = Number(loc.latitude);
      var lng = Number(loc.longitude);
      return isFinite(lat) && isFinite(lng);
    });

    destroyMap();

    if (!plot.length) {
      containerEl.innerHTML = "";
      containerEl.style.display = "none";
      if (emptyEl) emptyEl.style.display = list.length ? "block" : "none";
      if (mapWrap) mapWrap.style.display = list.length ? "block" : "none";
      return;
    }

    if (emptyEl) emptyEl.style.display = "none";
    containerEl.style.display = "block";
    if (mapWrap) mapWrap.style.display = "block";

    ensureThemeObserver();

    mapInstance = L.map(containerEl, {
      worldCopyJump: true,
      scrollWheelZoom: true,
      zoomControl: true,
    });

    baseLayer = L.tileLayer(tileUrl(), {
      attribution: attribution(),
      maxZoom: 19,
    }).addTo(mapInstance);

    var cols = markerColors();
    var group = L.featureGroup();

    plot.forEach(function (loc) {
      var lat = Number(loc.latitude);
      var lng = Number(loc.longitude);
      var r = markerRadius(loc.count);
      var m = L.circleMarker([lat, lng], {
        radius: r,
        fillColor: cols.fill,
        color: cols.stroke,
        weight: 2,
        opacity: 1,
        fillOpacity: 0.88,
      });
      m.bindPopup(buildPopupHtml(loc));
      m.addTo(group);
    });

    group.addTo(mapInstance);

    if (plot.length === 1) {
      mapInstance.setView(
        [Number(plot[0].latitude), Number(plot[0].longitude)],
        5,
      );
    } else {
      mapInstance.fitBounds(group.getBounds(), {
        padding: [40, 40],
        maxZoom: 8,
      });
    }

    setTimeout(function () {
      if (mapInstance) mapInstance.invalidateSize();
    }, 150);

    global._portfolioLeafletMap = mapInstance;
  }

  global.renderPortfolioVisitorMap = renderPortfolioVisitorMap;
})(window);
