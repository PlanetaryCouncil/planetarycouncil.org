/*! geo-locale.js — pick a default edition / language / URL from the visitor's country.
 *  No keys, no dependencies, no permission prompts (never uses navigator.geolocation).
 *  Planetary Council · MIT licence · https://planetarycouncil.org/js/geo-locale.js
 *
 *  HOW IT DECIDES (first hit wins)
 *    1. URL override        ?country=GB   or   ?<param>=uk   (param = opts.param, e.g. "edition" or "lang")
 *    2. Manual choice       GeoLocale.choose(value) saved in localStorage
 *    3. Cached country      from an earlier IP lookup (default TTL 1 day)
 *    4. Public IP lookups   keyless, CORS-enabled endpoints, tried in order with a short timeout
 *    5. Time zone           Europe/London → GB, Asia/Jerusalem → IL, Asia/Gaza → PS, Arab capitals …
 *    6. Browser language    the region of navigator.languages ("en-GB" → GB)
 *    7. rules.default / opts.default
 *
 *  PRIVACY: the IP address is never stored. Only the 2-letter country code is cached on the
 *  device (localStorage). The IP lookup is a request from the visitor's browser to the
 *  provider; a URL override or a manual choice skips it entirely.
 *
 *  ── Example 1: edition switch (UK vs rest of the world) ───────────────────────────────
 *    <script src="/js/geo-locale.js"></script>
 *    <script>
 *      const opts = { rules: { UK: "uk", default: "world" }, param: "edition", cacheKey: "pc.edition" };
 *      showEdition(GeoLocale.peek(opts)?.value || "world");          // instant, no network
 *      GeoLocale.detect(opts).then(r => showEdition(r.value));       // refine when the lookup returns
 *      // when the visitor picks one themselves:  GeoLocale.choose(opts, "uk");
 *    </script>
 *
 *  ── Example 2: language switch (Hebrew in Israel, Arabic in Palestine + Arab League) ──
 *    <script src="/js/geo-locale.js"></script>
 *    <script>
 *      const opts = { rules: { IL: "he", PS: "ar", ARAB_LEAGUE: "ar", default: "en" }, param: "lang", cacheKey: "site.lang" };
 *      GeoLocale.detect(opts).then(r => { GeoLocale.applyLang(r.value); loadStrings(r.value); });
 *    </script>
 *    applyLang("he") sets <html lang="he" dir="rtl">; "ar" → rtl; "en" → ltr.
 *
 *  ── Example 3: redirect to a country site ────────────────────────────────────────────
 *    GeoLocale.detect({ rules: { GB: "/uk/", default: null } }).then(r => r.value && location.replace(r.value));
 *
 *  API
 *    GeoLocale.detect(opts) → Promise<{ country, value, source, match }>
 *        country  "GB" | null      value   rules[match] (or default)
 *        source   "override" | "choice" | "cache" | "ip:<provider>" | "timezone" | "language" | "default"
 *        match    the rules key that matched ("GB", "ARAB_LEAGUE", "default" …)
 *    GeoLocale.peek(opts)        synchronous: override / choice / cache only, or null
 *    GeoLocale.resolve(country, rules, fallback, groups) → { value, match }
 *    GeoLocale.choose(opts, value) / GeoLocale.clearChoice(opts)
 *    GeoLocale.applyLang(lang, el = document.documentElement)
 *    GeoLocale.GROUPS, GeoLocale.PROVIDERS, GeoLocale.TIMEZONES, GeoLocale.isRtl(lang)
 *
 *  opts
 *    rules      { "GB": value, "ARAB_LEAGUE": value, "default": value } — country codes or GROUPS names
 *    groups     extra named groups, e.g. { NORDICS: ["DK","FI","IS","NO","SE"] }
 *    default    fallback value if rules has no "default"
 *    param      URL parameter that forces a value (e.g. "edition", "lang"); ?country=XX always works
 *    providers  array of provider names or objects { name, url, type: "json"|"text", parse(body) }
 *    timeoutMs  per provider (default 1500)
 *    cacheKey   localStorage prefix (default "geoLocale")
 *    cacheTtl   ms (default 86400000 = 1 day)
 */
(function (root) {
  "use strict";

  const GROUPS = {
    // League of Arab States (22 members)
    ARAB_LEAGUE: ["AE", "BH", "DJ", "DZ", "EG", "IQ", "JO", "KM", "KW", "LB", "LY", "MA", "MR", "OM", "PS", "QA", "SA", "SD", "SO", "SY", "TN", "YE"],
    UK: ["GB", "GG", "JE", "IM"],                       // United Kingdom + Crown Dependencies
    EU: ["AT", "BE", "BG", "CY", "CZ", "DE", "DK", "EE", "ES", "FI", "FR", "GR", "HR", "HU", "IE", "IT", "LT", "LU", "LV", "MT", "NL", "PL", "PT", "RO", "SE", "SI", "SK"]
  };

  const PROVIDERS = [
    { name: "country.is",  url: "https://api.country.is/",                  type: "json", parse: function (j) { return j && j.country; } },
    { name: "geojs",       url: "https://get.geojs.io/v1/ip/country.json",  type: "json", parse: function (j) { return j && j.country; } },
    { name: "cloudflare",  url: "https://www.cloudflare.com/cdn-cgi/trace", type: "text", parse: function (t) { const m = /^loc=([A-Za-z]{2})$/m.exec(t || ""); return m && m[1]; } },
    { name: "ipwho.is",    url: "https://ipwho.is/?fields=country_code",    type: "json", parse: function (j) { return j && j.country_code; } }
  ];

  const TIMEZONES = {
    "Europe/London": "GB", "Europe/Belfast": "GB", "GB": "GB", "GB-Eire": "GB",
    "Europe/Guernsey": "GG", "Europe/Jersey": "JE", "Europe/Isle_of_Man": "IM",
    "Asia/Jerusalem": "IL", "Asia/Tel_Aviv": "IL", "Israel": "IL",
    "Asia/Gaza": "PS", "Asia/Hebron": "PS",
    "Asia/Dubai": "AE", "Asia/Bahrain": "BH", "Africa/Djibouti": "DJ", "Africa/Algiers": "DZ",
    "Africa/Cairo": "EG", "Egypt": "EG", "Asia/Baghdad": "IQ", "Asia/Amman": "JO", "Indian/Comoro": "KM",
    "Asia/Kuwait": "KW", "Asia/Beirut": "LB", "Africa/Tripoli": "LY", "Libya": "LY", "Africa/Casablanca": "MA",
    "Africa/Nouakchott": "MR", "Asia/Muscat": "OM", "Asia/Qatar": "QA", "Asia/Riyadh": "SA",
    "Africa/Khartoum": "SD", "Africa/Mogadishu": "SO", "Asia/Damascus": "SY", "Africa/Tunis": "TN", "Asia/Aden": "YE"
  };

  const RTL = ["ar", "he", "iw", "fa", "ur", "yi", "ps", "ckb", "dv", "sd", "ug"];

  const cc = function (x) { x = String(x || "").trim().toUpperCase(); return /^[A-Z]{2}$/.test(x) && x !== "XX" && x !== "T1" && x !== "ZZ" ? x : null; };
  const now = function () { return Date.now(); };
  const store = {
    get: function (k) { try { return root.localStorage.getItem(k); } catch (e) { return null; } },
    set: function (k, v) { try { root.localStorage.setItem(k, v); } catch (e) {} },
    del: function (k) { try { root.localStorage.removeItem(k); } catch (e) {} }
  };
  const keys = function (o) { const p = (o && o.cacheKey) || "geoLocale"; return { choice: p + ".choice", country: p + ".country" }; };
  const param = function (name) {
    try { return new URLSearchParams(root.location.search).get(name); } catch (e) { return null; }
  };

  function resolve(country, rules, fallback, groups) {
    rules = rules || {};
    const dflt = Object.prototype.hasOwnProperty.call(rules, "default") ? rules.default : fallback;
    const c = cc(country);
    if (c) {
      if (Object.prototype.hasOwnProperty.call(rules, c)) return { value: rules[c], match: c };
      for (const k in rules) {
        const g = (groups && groups[k]) || GROUPS[k];
        if (g && g.indexOf(c) >= 0) return { value: rules[k], match: k };
      }
    }
    return { value: dflt === undefined ? null : dflt, match: "default" };
  }

  function result(country, source, opts) {
    const r = resolve(country, opts.rules, opts.default, opts.groups);
    return { country: cc(country), value: r.value, source: source, match: r.match };
  }

  function peek(opts) {
    opts = opts || {};
    const k = keys(opts);
    if (opts.param) {
      const v = param(opts.param);
      if (v) return { country: null, value: v, source: "override", match: opts.param };
    }
    const qc = cc(param("country"));
    if (qc) return result(qc, "override", opts);
    const ch = store.get(k.choice);
    if (ch) return { country: null, value: ch, source: "choice", match: "choice" };
    try {
      const c = JSON.parse(store.get(k.country) || "null");
      if (c && cc(c.c) && now() - c.t < (opts.cacheTtl || 864e5)) return result(c.c, "cache", opts);
    } catch (e) {}
    return null;
  }

  function fetchWithTimeout(url, ms) {
    const ctl = typeof AbortController === "function" ? new AbortController() : null;
    const t = setTimeout(function () { if (ctl) ctl.abort(); }, ms);
    return fetch(url, { signal: ctl ? ctl.signal : undefined, cache: "no-store", credentials: "omit", referrerPolicy: "no-referrer" })
      .then(function (r) { if (!r.ok) throw new Error("HTTP " + r.status); return r; })
      .finally(function () { clearTimeout(t); });
  }

  async function fromIp(opts) {
    const list = (opts.providers || PROVIDERS).map(function (p) {
      return typeof p === "string" ? PROVIDERS.find(function (x) { return x.name === p; }) : p;
    }).filter(Boolean);
    for (const p of list) {
      try {
        const r = await fetchWithTimeout(p.url, opts.timeoutMs || 1500);
        const body = p.type === "text" ? await r.text() : await r.json();
        const c = cc(p.parse(body));
        if (c) return { country: c, provider: p.name };
      } catch (e) { /* next provider */ }
    }
    return null;
  }

  function fromTimezone() {
    try { return TIMEZONES[Intl.DateTimeFormat().resolvedOptions().timeZone] || null; } catch (e) { return null; }
  }
  function fromLanguage() {
    const langs = (root.navigator && (root.navigator.languages || [root.navigator.language])) || [];
    for (const l of langs) {
      const m = /^[a-z]{2,3}[-_]([A-Za-z]{2})\b/.exec(l || "");
      if (m && cc(m[1])) return cc(m[1]);
    }
    return null;
  }

  async function detect(opts) {
    opts = opts || {};
    const quick = peek(opts);
    if (quick) return quick;
    const ip = await fromIp(opts);
    if (ip) {
      store.set(keys(opts).country, JSON.stringify({ c: ip.country, t: now() })); // country code only, never the IP
      return result(ip.country, "ip:" + ip.provider, opts);
    }
    const tz = fromTimezone();
    if (tz) return result(tz, "timezone", opts);
    const lang = fromLanguage();
    if (lang) return result(lang, "language", opts);
    return result(null, "default", opts);
  }

  function choose(opts, value) { store.set(keys(opts).choice, String(value)); }
  function clearChoice(opts) { store.del(keys(opts).choice); }
  function clearCache(opts) { store.del(keys(opts).country); }

  function isRtl(lang) { return RTL.indexOf(String(lang || "").toLowerCase().split(/[-_]/)[0]) >= 0; }
  function applyLang(lang, el) {
    el = el || (root.document && root.document.documentElement);
    if (!el || !lang) return;
    el.setAttribute("lang", lang);
    el.setAttribute("dir", isRtl(lang) ? "rtl" : "ltr");
  }

  root.GeoLocale = {
    detect: detect, peek: peek, resolve: resolve, choose: choose, clearChoice: clearChoice, clearCache: clearCache,
    applyLang: applyLang, isRtl: isRtl,
    fromTimezone: fromTimezone, fromLanguage: fromLanguage,
    GROUPS: GROUPS, PROVIDERS: PROVIDERS, TIMEZONES: TIMEZONES, version: "1.0.0"
  };
})(typeof window !== "undefined" ? window : this);
