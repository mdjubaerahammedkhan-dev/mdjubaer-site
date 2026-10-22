/* All text and images come from /content/*.json. Edit those files (or use Pages CMS), never this script. */
(function () {
  "use strict";

  var esc = function (s) {
    return String(s == null ? "" : s)
      .replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;").replace(/'/g, "&#39;");
  };
  var list = function (a) { return Array.isArray(a) ? a : []; };
  var heading = function (o) {
    o = o || {};
    return esc(o.title) + (o.title_bold ? " <b>" + esc(o.title_bold) + "</b>" : "");
  };
  var load = function (p) {
    return fetch(p, { cache: "no-cache" }).then(function (r) {
      if (!r.ok) throw new Error(p + " " + r.status);
      return r.json();
    });
  };

  function youtubeId(url) {
    if (!url) return "";
    var m = String(url).match(/(?:youtu\.be\/|v=|\/embed\/|\/shorts\/)([A-Za-z0-9_-]{11})/);
    return m ? m[1] : "";
  }

  function videoHtml(about) {
    var id = youtubeId(about.video_youtube_url);
    if (id) {
      return '<div class="video"><iframe src="https://www.youtube-nocookie.com/embed/' + id +
        '" title="Intro video" allow="encrypted-media; picture-in-picture" allowfullscreen loading="lazy"></iframe></div>';
    }
    if (about.video_file) {
      return '<div class="video"><video controls preload="metadata" playsinline src="' + esc(about.video_file) + '"></video></div>';
    }
    return "";
  }

  function nav(site, home) {
    var b = site.brand || {};
    var pre = home ? "" : "index.html";
    return '<nav><div class="wrap nav-in">' +
      '<a class="logo" href="' + (home ? "#top" : "index.html") + '">' + esc(b.name) + "<span>" + esc(b.tagline) + "</span></a>" +
      '<div class="links"><a href="' + pre + '#about">About</a><a href="' + pre + '#services">Services</a><a href="' + pre + '#process">Process</a><a href="' + pre + '#work">Work</a></div>' +
      '<a class="btn btn-solid" href="' + pre + '#contact">' + esc(b.nav_button || "Contact") + "</a></div></nav>";
  }

  function footer(site) {
    var f = site.footer || {};
    return '<footer><div class="wrap"><span>' + esc(f.left) + "</span><span>" + esc(f.right) + "</span></div></footer>";
  }

  function contact(site) {
    var c = site.contact || {};
    var details = list(c.details).map(function (d) {
      return "<div><i>" + esc(d.label) + "</i>" + esc(d.value) + "</div>";
    }).join("");
    return '<section class="contact band-fade" id="contact"><div class="ring"></div><div class="wrap">' +
      '<div class="contact-copy"><p class="eyebrow">' + esc(c.eyebrow) + "</p><h2>" + heading(c) + '</h2><p class="lead">' + esc(c.text) + "</p></div>" +
      '<div class="glass contact-panel"><div class="contact-list"><div><i>Email</i><div class="copyrow"><code id="mail">' + esc(c.email) +
      '</code><button class="copy" id="copyBtn" type="button">Copy</button></div></div>' + details + "</div>" +
      '<a class="btn btn-solid" href="mailto:' + esc(c.email) + '?subject=Free%20Klaviyo%20audit">' + esc(c.button) + "</a></div>" +
      "</div></section>";
  }

  function wireCopy() {
    var btn = document.getElementById("copyBtn");
    if (!btn) return;
    btn.addEventListener("click", function () {
      var el = document.getElementById("mail");
      var done = function () { btn.textContent = "Copied"; setTimeout(function () { btn.textContent = "Copy"; }, 1600); };
      var fallback = function () {
        var r = document.createRange(); r.selectNodeContents(el);
        var s = getSelection(); s.removeAllRanges(); s.addRange(r); btn.textContent = "Selected";
      };
      try { navigator.clipboard.writeText(el.textContent).then(done, fallback); } catch (e) { fallback(); }
    });
  }

  function projectCard(p) {
    var built = list(p.built).map(function (x) { return "<li>" + esc(x) + "</li>"; }).join("");
    var kpis = list(p.kpis).map(function (k) { return '<div class="kpi"><strong>' + esc(k.number) + "</strong>" + esc(k.label) + "</div>"; }).join("");
    var link = "project.html?id=" + encodeURIComponent(p.slug);
    return '<article class="case">' +
      '<div class="case-visual">' + (p.cover ? '<img src="' + esc(p.cover) + '" alt="' + esc(p.brand) + ' email design" loading="lazy">' : "") + "</div>" +
      '<div class="case-body"><span class="badge">' + esc(p.niche) + "</span><h3>" + esc(p.brand) + ": " + esc(p.title) + "</h3>" +
      '<div class="cols"><div><h4>Problem</h4><p>' + esc(p.problem) + "</p></div><div><h4>What I built</h4><ul>" + built +
      "</ul></div><div><h4>Why it works</h4><p>" + esc(p.why) + "</p></div></div>" +
      '<div class="kpis">' + kpis + "</div>" + (p.kpi_note ? '<p class="note">' + esc(p.kpi_note) + "</p>" : "") +
      '<a class="btn btn-ghost" href="' + link + '" style="justify-self:start">View full project →</a></div></article>';
  }

  function renderHome(site, projects) {
    var h = site.hero || {}, a = site.about || {}, pr = site.problems || {}, sv = site.services || {}, ps = site.process || {}, w = site.work || {};
    var stats = list(h.stats).map(function (s) { return "<div><strong>" + esc(s.number) + "</strong>" + esc(s.label) + "</div>"; }).join("");
    var probs = list(pr.items).map(function (p) {
      return '<article class="prob"><h3>' + esc(p.title) + "</h3><p>" + esc(p.text) + '</p><div class="fix"><b>Fix</b>' + esc(p.fix) + "</div></article>";
    }).join("");
    var svcs = list(sv.items).map(function (s) {
      return '<article class="svc"><span class="tag">' + esc(s.tag) + "</span><h3>" + esc(s.title) + "</h3><ul>" +
        list(s.points).map(function (x) { return "<li>" + esc(x) + "</li>"; }).join("") + '</ul><p class="meta">' + esc(s.meta) + "</p></article>";
    }).join("");
    var steps = list(ps.steps).map(function (s) {
      return "<li><strong>" + esc(s.title) + "</strong><span>" + esc(s.text) + "</span><em>" + esc(s.time) + "</em></li>";
    }).join("");
    var cases = list(projects).filter(function (p) { return p.show !== false; }).map(projectCard).join("");
    var ticks = list(a.points).map(function (x) { return "<li>" + esc(x) + "</li>"; }).join("");

    var about = a.show === false ? "" :
      '<section class="band-dark" id="about"><div class="wrap sec"><div class="about">' +
      '<div class="about-media">' + (a.photo ? '<div class="photo"><img src="' + esc(a.photo) + '" alt="Photo of ' + esc((site.brand || {}).name) + '"></div>' : "") + videoHtml(a) + "</div>" +
      '<div class="about-copy"><p class="eyebrow">' + esc(a.eyebrow) + "</p><h2>" + heading(a) + '</h2><p class="lead">' + esc(a.text) + '</p><ul class="ticks">' + ticks + "</ul></div>" +
      "</div></div></section>";

    document.getElementById("app").innerHTML =
      nav(site, true) +
      '<header class="hero" id="top"><div class="ring"></div><div class="wrap"><div class="hero-copy">' +
      '<p class="eyebrow">' + esc(h.eyebrow) + "</p><h1>" + heading(h) + '</h1><p class="lead">' + esc(h.text) + "</p>" +
      '<div class="hero-cta"><a class="btn btn-solid" href="#contact">' + esc(h.button_main) + '</a><a class="btn btn-ghost" href="#work">' + esc(h.button_second) + "</a></div>" +
      '<div class="stats">' + stats + "</div></div>" +
      '<div class="glass flow" aria-label="Example Klaviyo welcome flow"><p class="eyebrow">Welcome series · Klaviyo flow</p>' +
      '<div class="node"><i>Trigger</i>Joined list: Popup 15% off</div><div class="wire"></div>' +
      '<div class="node mail"><i>Email 1</i>Your code is inside<span class="rev">0 min</span></div><div class="wire"></div>' +
      '<div class="node"><i>Delay</i>Wait 2 days</div><div class="wire"></div>' +
      '<div class="node"><i>Split</i>Placed order since start?</div><div class="wire"></div>' +
      '<div class="split"><div class="node mail"><i>Yes</i>Thank you</div><div class="node mail"><i>No</i>Best sellers</div></div></div>' +
      "</div></header>" +
      about +
      '<section class="band-dark" id="problems"><div class="wrap sec"><div class="sec-head"><p class="eyebrow">' + esc(pr.eyebrow) + "</p><h2>" + heading(pr) + '</h2><p class="lead">' + esc(pr.text) + '</p></div><div class="grid4">' + probs + "</div></div></section>" +
      '<section class="band-fade" id="services"><div class="ring small"></div><div class="wrap sec"><div class="sec-head"><p class="eyebrow">' + esc(sv.eyebrow) + "</p><h2>" + heading(sv) + '</h2><p class="lead">' + esc(sv.text) + '</p></div><div class="svc-grid">' + svcs + "</div></div></section>" +
      '<section class="band-rise" id="process"><div class="wrap sec"><div class="sec-head"><p class="eyebrow">' + esc(ps.eyebrow) + "</p><h2>" + heading(ps) + '</h2></div><ol class="steps">' + steps + "</ol></div></section>" +
      '<section class="band-dark" id="work"><div class="wrap sec"><div class="sec-head"><p class="eyebrow">' + esc(w.eyebrow) + "</p><h2>" + heading(w) + '</h2><p class="lead">' + esc(w.text) + '</p></div><div class="cases">' + cases + "</div></div></section>" +
      contact(site) + footer(site);
    wireCopy();
    if (location.hash) { var t = document.querySelector(location.hash); if (t) t.scrollIntoView(); }
  }

  function renderProject(site, projects) {
    var id = new URLSearchParams(location.search).get("id");
    var p = list(projects).filter(function (x) { return x.slug === id; })[0];
    var app = document.getElementById("app");
    if (!p) {
      app.innerHTML = nav(site, false) + '<div class="wrap empty"><h2>Project not found</h2><p style="margin-top:16px"><a class="btn btn-ghost" href="index.html#work">Back to all projects</a></p></div>' + footer(site);
      return;
    }
    document.title = p.brand + " · " + ((site.brand || {}).name || "");
    var shot = function (e) {
      return '<figure class="shot" style="margin:0"><button type="button" data-full="' + esc(e.image) + '" aria-label="Open ' + esc(e.title) + ' full size">' +
        '<img src="' + esc(e.image) + '" alt="' + esc(e.title) + '" loading="lazy"></button>' +
        (e.timing ? '<span class="when">' + esc(e.timing) + "</span>" : "") + "<strong>" + esc(e.title) + "</strong>" + (e.note ? "<p>" + esc(e.note) + "</p>" : "") + "</figure>";
    };
    var flows = list(p.flows).map(function (f) {
      return '<div class="flow-block"><div class="flow-meta"><h3>' + esc(f.name) + "</h3>" + (f.trigger ? '<span class="chip">Trigger: ' + esc(f.trigger) + "</span>" : "") +
        '<span class="chip">' + list(f.emails).length + " emails</span></div>" + (f.description ? '<p class="lead">' + esc(f.description) + "</p>" : "") +
        '<div class="gallery">' + list(f.emails).map(shot).join("") + "</div></div>";
    }).join("");
    var camps = list(p.campaigns);
    var others = list(projects).filter(function (x) { return x.slug !== p.slug && x.show !== false; })
      .map(function (x) { return '<a class="btn btn-ghost" href="project.html?id=' + encodeURIComponent(x.slug) + '">' + esc(x.brand) + " →</a>"; }).join("");

    app.innerHTML = nav(site, false) +
      '<header class="p-hero"><div class="ring"></div><div class="wrap"><a class="back" href="index.html#work">← All projects</a>' +
      '<span class="badge">' + esc(p.niche) + "</span><h1>" + esc(p.brand) + '</h1><p class="lead" style="font-size:1.05rem">' + esc(p.title) + ". " + esc(p.overview) + "</p>" +
      '<div class="summary"><div><h4>Problem</h4><p>' + esc(p.problem) + "</p></div><div><h4>What I built</h4><ul>" +
      list(p.built).map(function (x) { return "<li>" + esc(x) + "</li>"; }).join("") + "</ul></div><div><h4>Why it works</h4><p>" + esc(p.why) + "</p></div></div>" +
      '<div class="kpis">' + list(p.kpis).map(function (k) { return '<div class="kpi" style="background:rgba(3,6,13,.5)"><strong>' + esc(k.number) + "</strong>" + esc(k.label) + "</div>"; }).join("") + "</div>" +
      (p.kpi_note ? '<p class="note" style="color:#e9f2ff">' + esc(p.kpi_note) + "</p>" : "") +
      "</div></header>" +
      '<section class="band-dark"><div class="wrap sec"><div class="sec-head"><p class="eyebrow">Flows</p><h2>Every email, <b>in order.</b></h2><p class="lead">Tap any design to see it full size.</p></div>' + flows + "</div></section>" +
      (p.popup ? '<section class="band-dark"><div class="wrap sec" style="padding-top:0"><div class="sec-head"><p class="eyebrow">Signup form</p><h2>Popup <b>redesign.</b></h2></div><div class="gallery">' + shot({ image: p.popup, title: "Popup design" }) + "</div></div></section>" : "") +
      (camps.length ? '<section class="band-dark"><div class="wrap sec" style="padding-top:0"><div class="sec-head"><p class="eyebrow">Campaigns</p><h2>One-off <b>sends.</b></h2></div><div class="gallery">' + camps.map(shot).join("") + "</div></div></section>" : "") +
      (others ? '<section class="band-dark"><div class="wrap sec" style="padding-top:0"><p class="eyebrow">More projects</p><div class="next">' + others + "</div></div></section>" : "") +
      contact(site) + footer(site);

    var box = document.createElement("div");
    box.className = "lightbox"; box.hidden = true;
    box.innerHTML = '<button class="copy close" type="button">Close ✕</button><img alt="">';
    document.body.appendChild(box);
    var img = box.querySelector("img");
    var close = function () { box.hidden = true; img.src = ""; };
    app.addEventListener("click", function (ev) {
      var b = ev.target.closest("[data-full]");
      if (!b) return;
      img.src = b.getAttribute("data-full"); img.alt = b.getAttribute("aria-label") || ""; box.hidden = false;
      box.querySelector(".close").focus();
    });
    box.addEventListener("click", function (ev) { if (ev.target === box || ev.target.classList.contains("close")) close(); });
    document.addEventListener("keydown", function (ev) { if (ev.key === "Escape" && !box.hidden) close(); });
    wireCopy();
  }

  var page = document.body.getAttribute("data-page");
  Promise.all([load("content/site.json"), load("content/projects.json")])
    .then(function (r) { page === "project" ? renderProject(r[0], r[1]) : renderHome(r[0], r[1]); })
    .catch(function (err) {
      document.getElementById("app").innerHTML = '<div class="wrap empty"><h2>Content could not load</h2><p style="margin-top:12px">' + esc(err.message) +
        '</p><p style="margin-top:8px">Check that content/site.json and content/projects.json are valid.</p></div>';
    });
})();
