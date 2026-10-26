/* ================================================================
   朝闻道 · ZHAOWENDAO
   Interaction, sound, slideshow, works archive.
   ================================================================ */
(() => {
  "use strict";

  const cfg = window.SITE_CONFIG;
  if (!cfg) {
    console.error("SITE_CONFIG is missing. Check site.config.js.");
    return;
  }

  const $ = (selector, root = document) => root.querySelector(selector);
  const $$ = (selector, root = document) => Array.from(root.querySelectorAll(selector));
  const pad = (value) => String(value).padStart(2, "0");
  const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
  const finePointer = window.matchMedia("(pointer: fine)");

  const entry = $("#entry");
  const site = $("#site");
  const entryForm = $("#entry-form");
  const nameInput = $("#visitor-name");
  const identityPanel = $("#entry-identity");
  const soundPanel = $("#entry-sound");
  const confirmPanel = $("#entry-confirm");
  const entrySubmit = $("#entry-submit");
  const entryProtocol = $("#entry-protocol");
  const entryStepLabel = $("#entry-step-label");
  const entryStatus = $("#entry-status");
  const heroSlidesRoot = $("#hero-slides");
  const heroDots = $("#hero-dots");
  const worksGrid = $("#works-grid");
  const workDialog = $("#work-dialog");
  const mobileMenu = $("#mobile-menu");
  const menuToggle = $("#menu-toggle");
  const header = $("#site-header");
  const soundToggle = $("#sound-toggle");
  const soundLabel = $("#sound-label");

  const state = {
    visitor: "",
    entryComplete: false,
    siteRevealed: false,
    menuOpen: false,
    dialogOpen: false,
    slidesPaused: false,
    workIndex: 0,
    lastWorkTrigger: null
  };

  /* ─────────────────────────  CONTENT  ───────────────────────── */

  function setText(id, value) {
    const el = document.getElementById(id);
    if (el && value != null) el.textContent = value;
  }

  function setHTMLIfChanged(el, html) {
    if (el && el.innerHTML !== html) el.innerHTML = html;
  }

  function setMeta(selector, content) {
    const el = document.querySelector(selector);
    if (el && content) el.setAttribute("content", content);
  }

  function absoluteUrl(path) {
    if (!path) return "";
    try {
      return new URL(path, cfg.meta.siteUrl || document.baseURI).href;
    } catch {
      return path;
    }
  }

  function populateContent() {
    document.title = cfg.meta.title;
    setMeta('meta[name="description"]', cfg.meta.description);
    setMeta('meta[property="og:title"]', cfg.meta.title);
    setMeta('meta[property="og:description"]', cfg.meta.description);
    setMeta('meta[property="og:image"]', absoluteUrl(cfg.meta.ogImage));
    setMeta('meta[name="twitter:title"]', cfg.meta.title);
    setMeta('meta[name="twitter:description"]', cfg.meta.description);
    setMeta('meta[name="twitter:image"]', absoluteUrl(cfg.meta.ogImage));

    if (cfg.meta.siteUrl) {
      let canonical = document.querySelector('link[rel="canonical"]');
      if (!canonical) {
        canonical = document.createElement("link");
        canonical.rel = "canonical";
        document.head.append(canonical);
      }
      canonical.href = cfg.meta.siteUrl;
      setMeta('meta[property="og:url"]', cfg.meta.siteUrl);
    }

    // Entry
    const entryArt = $("#entry-art");
    if (entryArt) {
      entryArt.src = cfg.entry.image;
      entryArt.alt = cfg.entry.imageAlt || "";
    }
    setText("entry-eyebrow", cfg.entry.eyebrow);
    setText("entry-title", cfg.entry.title);
    setText("entry-roman", cfg.entry.roman);
    setText("entry-quote", `“${cfg.entry.quote}”`);
    setText("entry-deck", cfg.entry.deck);
    setText("entry-prompt", cfg.entry.prompt);
    setText("entry-prompt-en", cfg.entry.promptEn);
    nameInput.placeholder = cfg.entry.placeholder;
    setText("entry-submit-label", cfg.entry.verify);
    setText("entry-note", cfg.entry.disclaimer);
    setText("entry-protocol", cfg.entry.protocol);
    setText("entry-image-meta", cfg.entry.imageMeta);
    setText("entry-sound-eyebrow", cfg.entry.soundEyebrow);
    setText("entry-sound-title", cfg.entry.soundTitle);
    setText("entry-sound-deck", cfg.entry.soundDeck);
    setText("sound-on-title", cfg.entry.soundOn);
    setText("sound-on-en", cfg.entry.soundOnEn);
    setText("sound-on-note", cfg.entry.soundOnNote);
    setText("sound-off-title", cfg.entry.soundOff);
    setText("sound-off-en", cfg.entry.soundOffEn);
    setText("sound-off-note", cfg.entry.soundOffNote);

    // Hero
    setText("hero-eyebrow", cfg.hero.eyebrow);
    setText("hero-intro", cfg.hero.intro);
    setText("hero-cta", cfg.hero.cta);
    setText("hero-side-note", cfg.hero.sideNote);

    const heroTitle = $("#hero-title");
    if (heroTitle) {
      heroTitle.replaceChildren();
      cfg.hero.title.forEach((line, index) => {
        const span = document.createElement("span");
        span.className = "hero__line";
        if (index === 1) span.classList.add("hero__line--outline");
        if (index === 2) span.classList.add("hero__line--accent");
        span.textContent = line;
        heroTitle.append(span);
      });
    }

    // Works heading
    setText("works-lede", cfg.works.intro);
    renderTitleLines($("#works-title"), cfg.works.title);

    // Future works: a deliberately empty, reserved room.
    setText("future-eyebrow", cfg.future.eyebrow);
    renderTitleLines($("#future-title"), cfg.future.title);
    setText("future-lede", cfg.future.lede);
    setText("future-frame-label", cfg.future.frameLabel);
    setText("future-frame-meta", cfg.future.frameMeta);
    setText("future-ghost", cfg.future.ghost);

    // Discussion board.
    setText("discussion-eyebrow", cfg.discussion.eyebrow);
    renderTitleLines($("#discussion-title"), cfg.discussion.title);
    setText("discussion-intro", cfg.discussion.intro);
    setText("discussion-board-label", cfg.discussion.boardLabel);
    setText("discussion-status", cfg.discussion.boardStatus);
    setText("discussion-fallback-kicker", cfg.discussion.fallbackKicker);
    setText("discussion-fallback-title", cfg.discussion.fallbackTitle);
    setText("discussion-fallback-text", cfg.discussion.fallbackText);
    setText("discussion-fallback-cta", cfg.discussion.fallbackCta);
    const discussionFallbackLink = $("#discussion-fallback-link");
    if (discussionFallbackLink) {
      discussionFallbackLink.href = cfg.discussion.fallbackHref || "#contact";
    }

    renderTitleLines($("#about-title"), cfg.about.title);
    renderTitleLines($("#contact-title"), cfg.contact.title);

    // About
    setText("about-lede", cfg.about.body[0] || "");
    setText("about-body", cfg.about.body[1] || "");
    setText("about-name", cfg.about.name);
    setText("about-role", cfg.about.role);
    setText("about-image-caption", cfg.about.imageCaption);
    setText("about-image-side", cfg.about.imageSide);
    setText("about-quote", cfg.about.quote);
    setText("about-quote-from", cfg.about.quoteFrom);
    const aboutImage = $("#about-image");
    if (aboutImage) {
      aboutImage.src = cfg.about.image;
      aboutImage.alt = cfg.about.imageAlt || "";
    }

    const facts = $("#about-facts");
    if (facts) {
      facts.replaceChildren();
      cfg.about.facts.forEach((fact) => {
        const item = document.createElement("div");
        const dt = document.createElement("dt");
        const dd = document.createElement("dd");
        dt.textContent = fact.label;
        dd.textContent = fact.value;
        item.append(dt, dd);
        facts.append(item);
      });
    }

    // Contact
    const contactStatement = $("#contact-statement");
    if (contactStatement && Array.isArray(cfg.contact.statement)) {
      contactStatement.replaceChildren();
      cfg.contact.statement.forEach((line) => {
        const span = document.createElement("span");
        span.textContent = line;
        contactStatement.append(span);
      });
    }
    setText("contact-email", cfg.contact.email);
    setText("contact-availability", cfg.contact.availability);
    setText("contact-location", cfg.contact.location);
    setText("contact-note", cfg.contact.note);
    const emailLinks = [$("#contact-email"), $("#mobile-email")];
    emailLinks.forEach((link) => {
      if (link) link.href = `mailto:${cfg.contact.email}`;
    });
    const socials = $("#contact-socials");
    if (socials) {
      socials.replaceChildren();
      (cfg.contact.socials || []).forEach((social) => {
        if (!social.href) return;
        const link = document.createElement("a");
        link.href = social.href;
        link.target = "_blank";
        link.rel = "noopener noreferrer";
        link.textContent = social.label;
        socials.append(link);
      });
    }

    // New brand signature and fragment / open-call copy
    document.querySelectorAll(".brand__text small, .entry__brand small").forEach((el) => {
      el.textContent = (cfg.brand && cfg.brand.signature) || "to the Endless nameless.";
    });
    setText("fragment-eyebrow", cfg.fragment.eyebrow);
    setText("fragment-copy-title", cfg.fragment.title);
    setText("fragment-copy-text", cfg.fragment.text);
    setText("fragment-hint", cfg.fragment.hint);
    setText("fragment-prompt-label", cfg.fragment.promptLabel);
    setText("fragment-copy", cfg.fragment.copy);
    setText("open-call-eyebrow", cfg.openCall.eyebrow);
    renderTitleLines($("#open-call-title"), cfg.openCall.title);
    setText("open-call-intro", cfg.openCall.intro);
    setText("open-call-note", cfg.openCall.note);
    setText("submission-eyebrow", cfg.openCall.form.eyebrow);
    setText("submission-title", cfg.openCall.form.title);
    setText("submission-intro", cfg.openCall.form.intro);
    setText("submission-choose", cfg.openCall.form.choose);
    setText("submission-change", cfg.openCall.form.change);
    setText("submission-local-note", cfg.openCall.form.localNote);
    setText("submission-submit-label", cfg.openCall.form.submit);
    setText("submission-email-label", cfg.openCall.form.emailFallback);
    setText("community-eyebrow", cfg.openCall.gallery.eyebrow);
    setText("community-empty-title", cfg.openCall.gallery.emptyTitle);
    setText("community-empty-text", cfg.openCall.gallery.emptyText);
    const submissionEmail = $("#submission-email");
    if (submissionEmail) {
      const subject = encodeURIComponent("朝闻道 · 作品投稿");
      const body = encodeURIComponent("作品名：\n作者：\n年份：\n提示词 / 作品说明：\n\n请附上作品图片。");
      submissionEmail.href = `mailto:${cfg.contact.email}?subject=${subject}&body=${body}`;
    }

    // Footer
    setText("footer-copyright", cfg.footer.copyright);
    setText("footer-credit", cfg.footer.credit);

    renderSlides();
    renderWorks();
    prepareReveals();
  }

  function renderTitleLines(el, title) {
    if (!el || !title) return;
    const lines = Array.isArray(title)
      ? title.filter(Boolean)
      : String(title).split("\n").filter(Boolean);
    el.replaceChildren();
    lines.forEach((line, index) => {
      const node = document.createElement(index === 0 ? "span" : "em");
      node.textContent = line;
      el.append(node);
    });
  }

  /* ─────────────────────────  HERO SLIDESHOW  ───────────────────────── */

  const slides = cfg.hero.slides || [];
  let slideIndex = 0;
  let slideTimer = null;

  function renderSlides() {
    if (!heroSlidesRoot || !slides.length) return;
    heroSlidesRoot.replaceChildren();
    heroDots.replaceChildren();

    slides.forEach((slide, index) => {
      const wrap = document.createElement("div");
      wrap.className = "hero__slide";
      if (index === 0) wrap.classList.add("is-active");

      const image = document.createElement("img");
      image.src = slide.image;
      image.alt = slide.alt || "";
      image.style.objectPosition = slide.position || "center";
      image.loading = index === 0 ? "eager" : "lazy";
      image.decoding = "async";
      if (index === 0) image.fetchPriority = "high";
      wrap.append(image);
      heroSlidesRoot.append(wrap);

      const dot = document.createElement("button");
      dot.type = "button";
      dot.setAttribute("aria-label", `查看第 ${index + 1} 张：${slide.title}`);
      dot.setAttribute("aria-current", index === 0 ? "true" : "false");
      dot.className = index === 0 ? "is-active" : "";
      dot.addEventListener("click", () => {
        goToSlide(index, true);
      });
      heroDots.append(dot);
    });
    updateSlideCopy(0);
  }

  function updateSlideCopy(index) {
    const slide = slides[index];
    if (!slide) return;
    const title = $("#hero-slide-title");
    const en = $("#hero-slide-en");
    const count = $("#hero-count");
    if (title) title.textContent = slide.title;
    if (en) en.textContent = `${slide.en} — ${slide.meta}`;
    if (count) {
      count.replaceChildren();
      count.append(document.createTextNode(pad(index + 1) + " "));
      const total = document.createElement("i");
      total.textContent = `/ ${pad(slides.length)}`;
      count.append(total);
    }
  }

  function goToSlide(index, manual = false) {
    if (!slides.length) return;
    slideIndex = (index + slides.length) % slides.length;
    const slideEls = $$(".hero__slide", heroSlidesRoot);
    const dots = $$("button", heroDots);

    slideEls.forEach((slide, i) => slide.classList.toggle("is-active", i === slideIndex));
    dots.forEach((dot, i) => {
      dot.classList.toggle("is-active", i === slideIndex);
      dot.classList.remove("is-running");
      dot.setAttribute("aria-current", i === slideIndex ? "true" : "false");
      if (i === slideIndex) {
        // Restart the 3s progress animation.
        void dot.offsetWidth;
        dot.classList.add("is-running");
      }
    });

    updateSlideCopy(slideIndex);
    if (manual) scheduleSlide();
  }

  function scheduleSlide() {
    window.clearTimeout(slideTimer);
    if (reducedMotion.matches || !state.siteRevealed || state.slidesPaused || document.hidden) return;
    slideTimer = window.setTimeout(() => {
      goToSlide(slideIndex + 1);
      scheduleSlide();
    }, 3000);
  }

  function revealSlideshow() {
    goToSlide(0);
    scheduleSlide();
  }

  /* ─────────────────────────  WORKS  ───────────────────────── */

  function renderWorks() {
    if (!worksGrid) return;
    worksGrid.replaceChildren();
    (cfg.works.items || []).forEach((work, index) => {
      const article = document.createElement("article");
      article.className = "work-card reveal";
      article.style.setProperty("--ratio", work.ratio || "4 / 3");
      article.style.setProperty("--position", work.position || "center");
      article.style.transitionDelay = `${Math.min(index, 3) * 70}ms`;

      const media = document.createElement("figure");
      media.className = "work-card__media";

      const image = document.createElement("img");
      image.src = work.image;
      image.alt = work.alt || "";
      image.loading = "lazy";
      image.decoding = "async";
      media.append(image);

      const indexTag = document.createElement("span");
      indexTag.className = "work-card__index";
      indexTag.textContent = pad(index + 1);
      media.append(indexTag);

      const open = document.createElement("span");
      open.className = "work-card__open";
      const openText = document.createElement("span");
      openText.textContent = "查看作品";
      const openIcon = document.createElement("i");
      openIcon.textContent = "↗";
      open.append(openText, openIcon);
      media.append(open);

      const info = document.createElement("div");
      info.className = "work-card__info";
      const heading = document.createElement("h3");
      heading.textContent = work.title;
      const sub = document.createElement("em");
      sub.textContent = work.en;
      heading.append(sub);
      const meta = document.createElement("div");
      meta.className = "work-card__meta";
      const year = document.createElement("span");
      year.textContent = work.year;
      const category = document.createElement("span");
      category.textContent = work.category;
      meta.append(year, category);
      info.append(heading, meta);

      const hit = document.createElement("button");
      hit.type = "button";
      hit.className = "work-card__hit";
      hit.setAttribute("aria-label", `查看作品：${work.title}，${work.en}，${work.year}`);
      hit.addEventListener("click", () => openWork(index, hit));

      article.append(media, info, hit);
      worksGrid.append(article);
    });
  }

  function openWork(index, trigger) {
    if (!workDialog) return;
    state.workIndex = (index + cfg.works.items.length) % cfg.works.items.length;
    state.lastWorkTrigger = trigger || null;
    const work = cfg.works.items[state.workIndex];

    $("#work-dialog-image").src = work.image;
    $("#work-dialog-image").alt = work.alt || "";
    setText("work-dialog-index", pad(state.workIndex + 1));
    setText("work-dialog-category", work.category);
    setText("work-dialog-title", work.title);
    setText("work-dialog-en", work.en);
    setText("work-dialog-desc", work.description);
    setText("work-dialog-year", work.year);

    state.slidesPaused = true;
    window.clearTimeout(slideTimer);

    if (typeof workDialog.showModal === "function") {
      if (!workDialog.open) workDialog.showModal();
    } else {
      workDialog.setAttribute("open", "");
    }
    state.dialogOpen = true;
    updateBodyLock();
  }

  function closeWork() {
    if (!workDialog) return;
    if (typeof workDialog.close === "function" && workDialog.open) {
      workDialog.close();
    } else {
      workDialog.removeAttribute("open");
    }
    state.dialogOpen = false;
    state.slidesPaused = false;
    updateBodyLock();
    if (state.lastWorkTrigger) state.lastWorkTrigger.focus({ preventScroll: true });
    scheduleSlide();
  }

  function stepWork(direction) {
    openWork(state.workIndex + direction, state.lastWorkTrigger);
  }

  function bindDialog() {
    if (!workDialog) return;
    $("#work-dialog-close").addEventListener("click", closeWork);
    $("#work-dialog-prev").addEventListener("click", () => stepWork(-1));
    $("#work-dialog-next").addEventListener("click", () => stepWork(1));

    workDialog.addEventListener("click", (event) => {
      if (event.target === workDialog) closeWork();
    });
    workDialog.addEventListener("close", () => {
      state.dialogOpen = false;
      state.slidesPaused = false;
      updateBodyLock();
      if (state.lastWorkTrigger) state.lastWorkTrigger.focus({ preventScroll: true });
      scheduleSlide();
    });
    workDialog.addEventListener("keydown", (event) => {
      if (event.key === "ArrowRight") {
        event.preventDefault();
        stepWork(1);
      } else if (event.key === "ArrowLeft") {
        event.preventDefault();
        stepWork(-1);
      }
    });
  }

  /* ─────────────────────────  ENTRY FLOW  ───────────────────────── */

  function sanitizeName(raw) {
    return String(raw || "")
      .replace(/[<>]/g, "")
      .replace(/\s+/g, " ")
      .trim()
      .slice(0, 18);
  }

  function setEntryBusy(isBusy) {
    entrySubmit.disabled = isBusy;
    entrySubmit.classList.toggle("is-loading", isBusy);
    nameInput.disabled = isBusy;
  }

  function beginVerification(event) {
    event.preventDefault();
    if (!entry || entry.classList.contains("is-verifying")) return;

    const visitor = sanitizeName(nameInput.value);
    state.visitor = visitor || cfg.entry.anonymous;
    entry.classList.add("is-verifying");
    setEntryBusy(true);
    setText("entry-submit-label", cfg.entry.verifying);
    entryProtocol.textContent = "IDENTITY HANDSHAKE / 正在核对";
    entryStatus.textContent = "READING THE RAIN / 正在读取你的名字…";

    window.setTimeout(() => {
      setText("entry-confirm-name", state.visitor);
      setText("entry-visitor-echo", state.visitor);
      entryProtocol.textContent = "IDENTITY VERIFIED / 身份已确认";
      identityPanel.inert = true;
      confirmPanel.hidden = false;
      // Force a frame so the transition plays.
      requestAnimationFrame(() => confirmPanel.classList.add("is-visible"));
      entryStatus.textContent = `身份确认完成：${state.visitor}。正在打开声音选择。`;
      entry.classList.remove("is-verifying");
      setEntryBusy(false);
      setText("entry-submit-label", cfg.entry.verify);

      window.setTimeout(showSoundStep, 1150);
    }, 1050);
  }

  function showSoundStep() {
    confirmPanel.classList.remove("is-visible");
    confirmPanel.setAttribute("aria-hidden", "true");
    window.setTimeout(() => {
      confirmPanel.hidden = true;
    }, 420);

    identityPanel.hidden = true;
    identityPanel.inert = false;
    soundPanel.hidden = false;
    entryStatus.textContent = "";
    setText("entry-protocol", "ACCESS GRANTED / 身份已确认");
    setText("entry-protocol-no", "02 / 02");
    setText("entry-step-label", "02 / 02 — AUDIO");
    entry.setAttribute("aria-labelledby", "entry-sound-title");
    const firstOption = soundPanel.querySelector("button[data-sound]");
    if (firstOption) firstOption.focus({ preventScroll: true });
  }

  function bindEntry() {
    entryForm.addEventListener("submit", beginVerification);

    entryForm.addEventListener("keydown", (event) => {
      if (event.key === "Escape") event.preventDefault();
    });

    $$("[data-sound]", soundPanel).forEach((button) => {
      button.addEventListener("click", () => {
        if (state.entryComplete) return;
        const withSound = button.dataset.sound === "on";
        state.entryComplete = true;
        if (withSound) {
          SoundEngine.enable();
        }
        completeEntry();
      });
    });
  }

  function completeEntry() {
    if (!entry || !site) return;
    entry.classList.add("entry--leaving");
    entry.setAttribute("aria-busy", "true");

    window.setTimeout(() => {
      state.siteRevealed = true;
      site.classList.add("is-revealed");
      site.removeAttribute("aria-hidden");
      site.inert = false;
      updateBodyLock();
      window.scrollTo({ top: 0, behavior: "auto" });
      revealSlideshow();
      const brand = $(".brand", site);
      if (brand) brand.focus({ preventScroll: true });
      setTimeout(() => {
        entry.hidden = true;
        entry.inert = true;
        entry.setAttribute("aria-hidden", "true");
        entry.removeAttribute("aria-busy");
        updateBodyLock();
      }, 900);
    }, 650);
  }

  function updateBodyLock() {
    const shouldLock = !entry.hidden || state.menuOpen || state.dialogOpen;
    document.body.classList.toggle("is-locked", shouldLock);
  }

  /* ─────────────────────────  SOUND  ───────────────────────── */

  const SoundEngine = (() => {
    const volume = Number.isFinite(cfg.audio.volume) ? Math.min(1, Math.max(0, cfg.audio.volume)) : 0.3;
    const tracks = Array.isArray(cfg.audio.tracks)
      ? cfg.audio.tracks.filter((track) => track && track.file)
      : [];

    let context = null;
    let master = null;
    let procedural = null;
    let audioEl = null;
    let active = false;
    let usingFile = false;
    let fadeTimer = null;
    let trackIndex = 0;
    let failures = 0;
    let lastFailedTrack = -1;

    function currentTrack() {
      return tracks[trackIndex] || null;
    }

    function setUI(on) {
      soundToggle.classList.toggle("is-on", on);
      soundToggle.setAttribute("aria-pressed", on ? "true" : "false");
      const track = on ? currentTrack() : null;
      soundToggle.setAttribute(
        "aria-label",
        on && track ? `关闭背景声音，正在播放 ${track.title}` : "开启背景声音"
      );
      soundToggle.title = on && track ? `${track.title} — ${track.artist}` : "背景声音";
      soundLabel.textContent = on ? "SOUND ON" : "SOUND OFF";
    }

    function ensureContext() {
      if (!context) {
        const Ctx = window.AudioContext || window.webkitAudioContext;
        if (!Ctx) return null;
        context = new Ctx();
        master = context.createGain();
        master.gain.value = 0;
        master.connect(context.destination);
      }
      if (context.state === "suspended") context.resume();
      return context;
    }

    function createNoiseBuffer(ctx) {
      const seconds = 4;
      const buffer = ctx.createBuffer(1, ctx.sampleRate * seconds, ctx.sampleRate);
      const data = buffer.getChannelData(0);
      let last = 0;
      for (let i = 0; i < data.length; i += 1) {
        const white = Math.random() * 2 - 1;
        last = (last + 0.02 * white) / 1.02;
        data[i] = last * 3.2;
      }
      return buffer;
    }

    function startProcedural() {
      const ctx = ensureContext();
      if (!ctx || procedural) return;
      try {
        const rain = ctx.createBufferSource();
        rain.buffer = createNoiseBuffer(ctx);
        rain.loop = true;

        const highpass = ctx.createBiquadFilter();
        highpass.type = "highpass";
        highpass.frequency.value = 260;
        highpass.Q.value = 0.4;

        const lowpass = ctx.createBiquadFilter();
        lowpass.type = "lowpass";
        lowpass.frequency.value = 1700;
        lowpass.Q.value = 0.35;

        const rainGain = ctx.createGain();
        rainGain.gain.value = 0.115;

        rain.connect(highpass).connect(lowpass).connect(rainGain).connect(master);
        rain.start();

        const droneGain = ctx.createGain();
        droneGain.gain.value = 0.038;
        droneGain.connect(master);

        const drones = [];
        [
          { freq: 55, type: "sine", gain: 0.7 },
          { freq: 82.5, type: "triangle", gain: 0.28 },
          { freq: 110, type: "sine", gain: 0.2 }
        ].forEach((spec, index) => {
          const osc = ctx.createOscillator();
          const gain = ctx.createGain();
          osc.type = spec.type;
          osc.frequency.value = spec.freq;
          gain.gain.value = spec.gain;
          osc.connect(gain).connect(droneGain);
          // Very slow detune drift, different for each voice.
          const lfo = ctx.createOscillator();
          const lfoGain = ctx.createGain();
          lfo.frequency.value = 0.018 + index * 0.009;
          lfoGain.gain.value = 1.8 + index;
          lfo.connect(lfoGain).connect(osc.detune);
          lfo.start();
          osc.start();
          drones.push(osc, lfo);
        });

        procedural = { rain, drones };
      } catch (error) {
        console.warn("Procedural ambience unavailable.", error);
      }
    }

    function stopProcedural() {
      if (!procedural) return;
      try {
        procedural.rain.stop();
        procedural.drones.forEach((node) => node.stop());
      } catch {
        /* already stopped */
      }
      procedural = null;
    }

    function fadeTo(target, seconds = 0.9) {
      if (!master || !context) return;
      const now = context.currentTime;
      master.gain.cancelScheduledValues(now);
      master.gain.setValueAtTime(master.gain.value, now);
      master.gain.linearRampToValueAtTime(target, now + seconds);
    }

    function fadeMedia(target, seconds = 0.9) {
      if (!audioEl) return;
      window.clearInterval(fadeTimer);
      const start = audioEl.volume;
      const started = performance.now();
      fadeTimer = window.setInterval(() => {
        const t = Math.min(1, (performance.now() - started) / (seconds * 1000));
        audioEl.volume = Math.max(0, Math.min(1, start + (target - start) * t));
        if (t >= 1) window.clearInterval(fadeTimer);
      }, 40);
    }

    function createAudioElement() {
      if (audioEl) return;
      audioEl = new Audio();
      audioEl.preload = "auto";
      audioEl.volume = 0;
      audioEl.addEventListener("ended", handleEnded);
      audioEl.addEventListener("error", handleTrackFailure);
      audioEl.addEventListener("play", () => {
        failures = 0;
      });
    }

    function setMediaSource(index) {
      if (!tracks.length) return null;
      trackIndex = ((index % tracks.length) + tracks.length) % tracks.length;
      const track = currentTrack();
      if (!audioEl) createAudioElement();
      if (audioEl.dataset.track !== track.file) {
        audioEl.dataset.track = track.file;
        audioEl.src = track.file;
        audioEl.load();
        lastFailedTrack = -1;
      }
      if ("mediaSession" in navigator && "MediaMetadata" in window) {
        try {
          navigator.mediaSession.metadata = new MediaMetadata({
            title: track.title,
            artist: track.artist,
            album: "朝闻道"
          });
        } catch {
          /* Media Session is optional. */
        }
      }
      updateUI(active);
      return track;
    }

    function fallbackToProcedural() {
      usingFile = false;
      if (audioEl) audioEl.pause();
      startProcedural();
      if (master && context) fadeTo(volume, 1.2);
    }

    function handleTrackFailure() {
      if (!active || !usingFile) return;
      if (lastFailedTrack === trackIndex) return;
      lastFailedTrack = trackIndex;
      failures += 1;
      if (failures < tracks.length) {
        setMediaSource(trackIndex + 1);
        playCurrent(false);
      } else {
        fallbackToProcedural();
      }
    }

    function playCurrent(fade = true) {
      if (!active || !usingFile || !audioEl) return;
      const playPromise = audioEl.play();
      if (playPromise && typeof playPromise.catch === "function") {
        playPromise.catch(handleTrackFailure);
      }
      fadeMedia(volume, fade ? 1.3 : 0.6);
    }

    function handleEnded() {
      if (!active || !usingFile) return;
      fadeMedia(0, 0.6);
      window.setTimeout(() => {
        if (!active) return;
        setMediaSource(trackIndex + 1);
        audioEl.currentTime = 0;
        playCurrent(true);
      }, 650);
    }

    function startFile() {
      createAudioElement();
      usingFile = true;
      setMediaSource(trackIndex);
      playCurrent(true);
    }

    function enable() {
      active = true;
      failures = 0;
      setUI(true);
      if (tracks.length) {
        startFile();
        return;
      }
      usingFile = false;
      startProcedural();
      if (master && context) fadeTo(volume, 1.2);
    }

    function disable() {
      active = false;
      setUI(false);
      if (usingFile) {
        fadeMedia(0, 0.65);
        window.setTimeout(() => {
          if (audioEl && !active) audioEl.pause();
        }, 720);
      }
      if (master && context) {
        fadeTo(0, 0.65);
        window.setTimeout(() => {
          if (!active) stopProcedural();
        }, 750);
      }
    }

    function toggle() {
      if (active) disable();
      else enable();
    }

    function updateUI(on) {
      setUI(on);
    }

    setUI(false);
    return { enable, disable, toggle, setUI };
  })();

  function bindSound() {
    soundToggle.addEventListener("click", () => SoundEngine.toggle());
    document.addEventListener("visibilitychange", () => {
      if (!document.hidden) return;
      state.slidesPaused = true;
      window.clearTimeout(slideTimer);
    });
    document.addEventListener("visibilitychange", () => {
      if (document.hidden || !state.siteRevealed) return;
      state.slidesPaused = state.dialogOpen || state.menuOpen;
      scheduleSlide();
    });
  }

  /* ─────────────────────────  MOBILE MENU  ───────────────────────── */

  let menuLastFocus = null;

  function setMenu(open) {
    if (!mobileMenu || !menuToggle) return;
    state.menuOpen = open;
    state.slidesPaused = open || state.dialogOpen;
    mobileMenu.classList.toggle("is-open", open);
    mobileMenu.setAttribute("aria-hidden", open ? "false" : "true");
    menuToggle.setAttribute("aria-expanded", open ? "true" : "false");
    menuToggle.setAttribute("aria-label", open ? "关闭菜单" : "打开菜单");
    updateBodyLock();

    if (open) {
      menuLastFocus = document.activeElement;
      const firstLink = mobileMenu.querySelector("a");
      if (firstLink) firstLink.focus({ preventScroll: true });
      window.clearTimeout(slideTimer);
    } else {
      if (menuLastFocus) menuLastFocus.focus({ preventScroll: true });
      scheduleSlide();
    }
  }

  function bindMenu() {
    if (!menuToggle || !mobileMenu) return;
    menuToggle.addEventListener("click", () => setMenu(!state.menuOpen));
    $$("a", mobileMenu).forEach((link) => {
      link.addEventListener("click", () => setMenu(false));
    });
    document.addEventListener("keydown", (event) => {
      if (event.key === "Escape" && state.menuOpen) setMenu(false);
    });
  }

  /* ─────────────────────────  SCROLL / HEADER  ───────────────────────── */

  function bindHeader() {
    let lastScrollY = -1;
    let ticking = false;

    function update() {
      const y = window.scrollY;
      if (y !== lastScrollY) {
        header.classList.toggle("is-scrolled", y > 40);
        lastScrollY = y;
      }
      ticking = false;
    }

    window.addEventListener("scroll", () => {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(update);
    }, { passive: true });
    update();

    const navBySection = new Map(
      $$(".main-nav a[data-nav]").map((link) => [link.dataset.nav, link])
    );
    const sectionObserver = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        navBySection.forEach((link, key) => {
          link.classList.toggle("is-active", key === entry.target.id);
        });
      });
    }, { rootMargin: "-40% 0px -52% 0px", threshold: 0 });
    navBySection.forEach((link, id) => {
      const section = document.getElementById(id);
      if (section) sectionObserver.observe(section);
    });
  }

  /* ─────────────────────────  REVEALS  ───────────────────────── */

  function prepareReveals() {
    const headingBlock = $(".works__head");
    if (headingBlock) headingBlock.classList.add("reveal");
    const lede = $(".works__lede");
    if (lede) lede.classList.add("reveal", "reveal-delay-1");
    const futureHead = $(".future__head");
    if (futureHead) futureHead.classList.add("reveal");
    const discussionHead = $(".discussion__head");
    if (discussionHead) discussionHead.classList.add("reveal");
    const aboutCopy = $(".about__copy");
    if (aboutCopy) aboutCopy.classList.add("reveal");
    const aboutFigure = $(".about__figure");
    if (aboutFigure) aboutFigure.classList.add("reveal", "reveal-delay-1");
    const quote = $(".about__quote");
    if (quote) quote.classList.add("reveal");
    const contactInner = $(".contact__inner");
    if (contactInner) contactInner.classList.add("reveal");
  }

  function initReveals() {
    const items = $$(".reveal");
    if (!items.length) return;
    if (!("IntersectionObserver" in window) || reducedMotion.matches) {
      items.forEach((item) => item.classList.add("is-visible"));
      return;
    }
    const observer = new IntersectionObserver((entries, obs) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add("is-visible");
        obs.unobserve(entry.target);
      });
    }, { threshold: 0.12, rootMargin: "0px 0px -8% 0px" });
    items.forEach((item) => observer.observe(item));
  }

  /* ─────────────────────────  FOCUS TRAP  ───────────────────────── */

  function trapFocus(container, event) {
    if (event.key !== "Tab") return;
    const focusables = $$(
      'a[href], button:not([disabled]), input:not([disabled]), [tabindex]:not([tabindex="-1"])',
      container
    ).filter((el) => el.offsetParent !== null && !el.closest("[hidden]"));
    if (!focusables.length) return;
    const first = focusables[0];
    const last = focusables[focusables.length - 1];
    if (event.shiftKey && document.activeElement === first) {
      event.preventDefault();
      last.focus();
    } else if (!event.shiftKey && document.activeElement === last) {
      event.preventDefault();
      first.focus();
    }
  }

  /* ─────────────────────────  RAIN CANVAS  ───────────────────────── */

  function initRain() {
    const canvas = $("#rain-canvas");
    if (!canvas) return;
    const ctx = canvas.getContext("2d", { alpha: true });
    if (!ctx) return;

    let width = 0;
    let height = 0;
    let dpr = 1;
    let drops = [];
    let frame = null;
    let lastTime = 0;

    function createDrops() {
      const count = Math.max(34, Math.min(150, Math.round((width * height) / 11500)));
      drops = Array.from({ length: count }, () => ({
        x: Math.random() * width,
        y: Math.random() * height,
        len: 8 + Math.random() * 28,
        speed: 80 + Math.random() * 140,
        alpha: 0.12 + Math.random() * 0.42,
        warm: Math.random() > 0.84,
        drift: 0.14 + Math.random() * 0.1
      }));
    }

    function resize() {
      dpr = Math.min(2, window.devicePixelRatio || 1);
      width = window.innerWidth;
      height = window.innerHeight;
      canvas.width = Math.floor(width * dpr);
      canvas.height = Math.floor(height * dpr);
      canvas.style.width = width + "px";
      canvas.style.height = height + "px";
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      createDrops();
      if (reducedMotion.matches) drawStatic();
    }

    function drawStatic() {
      ctx.clearRect(0, 0, width, height);
      drops.forEach((drop) => {
        ctx.beginPath();
        ctx.strokeStyle = drop.warm
          ? `rgba(255, 162, 91, ${drop.alpha * 0.6})`
          : `rgba(147, 211, 205, ${drop.alpha * 0.75})`;
        ctx.lineWidth = 0.7;
        ctx.moveTo(drop.x, drop.y);
        ctx.lineTo(drop.x - drop.len * drop.drift, drop.y + drop.len);
        ctx.stroke();
      });
    }

    function tick(time) {
      if (document.hidden) {
        frame = requestAnimationFrame(tick);
        return;
      }
      if (time - lastTime < 33) {
        frame = requestAnimationFrame(tick);
        return;
      }
      const delta = Math.min(0.06, (time - lastTime) / 1000);
      lastTime = time;
      ctx.clearRect(0, 0, width, height);
      drops.forEach((drop) => {
        drop.y += drop.speed * delta;
        drop.x -= drop.speed * drop.drift * 0.22 * delta;
        if (drop.y > height + 40) {
          drop.y = -40 - Math.random() * 80;
          drop.x = Math.random() * (width + 120);
        }
        if (drop.x < -50) drop.x = width + 20;
        ctx.beginPath();
        ctx.strokeStyle = drop.warm
          ? `rgba(255, 162, 91, ${drop.alpha * 0.48})`
          : `rgba(147, 211, 205, ${drop.alpha * 0.55})`;
        ctx.lineWidth = 0.65;
        ctx.moveTo(drop.x, drop.y);
        ctx.lineTo(drop.x - drop.len * drop.drift, drop.y + drop.len);
        ctx.stroke();
      });
      frame = requestAnimationFrame(tick);
    }

    function start() {
      if (frame || reducedMotion.matches) {
        drawStatic();
        return;
      }
      lastTime = 0;
      frame = requestAnimationFrame(tick);
    }

    function stop() {
      if (frame) cancelAnimationFrame(frame);
      frame = null;
    }

    resize();
    start();

    let resizeTimer = null;
    window.addEventListener("resize", () => {
      window.clearTimeout(resizeTimer);
      resizeTimer = window.setTimeout(() => {
        stop();
        resize();
        start();
      }, 180);
    }, { passive: true });

    reducedMotion.addEventListener?.("change", () => {
      stop();
      if (reducedMotion.matches) drawStatic();
      else start();
    });
  }

  /* ─────────────────────────  HERO PARALLAX  ───────────────────────── */

  function initParallax() {
    const hero = $(".hero");
    if (!hero || reducedMotion.matches || !finePointer.matches) return;
    let raf = null;
    let targetX = 0;
    let targetY = 0;

    function render() {
      hero.style.setProperty("--parallax-x", targetX.toFixed(2));
      hero.style.setProperty("--parallax-y", targetY.toFixed(2));
      raf = null;
    }

    hero.addEventListener("pointermove", (event) => {
      const rect = hero.getBoundingClientRect();
      targetX = ((event.clientX - rect.left) / rect.width - 0.5) * 18;
      targetY = ((event.clientY - rect.top) / rect.height - 0.5) * 12;
      if (!raf) raf = requestAnimationFrame(render);
    }, { passive: true });

    hero.addEventListener("pointerleave", () => {
      targetX = 0;
      targetY = 0;
      if (!raf) raf = requestAnimationFrame(render);
    });
  }

  /* ─────────────────────────  MISC  ───────────────────────── */

  function bindSlideshow() {
    const prevButton = $("#hero-prev");
    const nextButton = $("#hero-next");
    if (prevButton) prevButton.addEventListener("click", () => goToSlide(slideIndex - 1, true));
    if (nextButton) nextButton.addEventListener("click", () => goToSlide(slideIndex + 1, true));
    document.addEventListener("keydown", (event) => {
      if (!state.siteRevealed || state.dialogOpen || state.menuOpen) return;
      const tag = document.activeElement?.tagName;
      if (tag === "INPUT" || tag === "TEXTAREA") return;
      if (event.key === "ArrowLeft") goToSlide(slideIndex - 1, true);
      if (event.key === "ArrowRight") goToSlide(slideIndex + 1, true);
    });
  }

  function bindGlobalFocusTraps() {
    document.addEventListener("keydown", (event) => {
      if (!entry.hidden && !state.entryComplete) {
        trapFocus(entry, event);
      } else if (state.menuOpen) {
        trapFocus(mobileMenu, event);
      }
    });
  }

  function initFragments() {
    const viewer = $("#fragment-viewer");
    const frame = $("#fragment-frame");
    const image = $("#fragment-image");
    const trigger = $("#fragment-trigger");
    const tiles = $("#fragment-tiles");
    const prompt = $("#fragment-prompt");
    const dots = $("#fragment-dots");
    const promptTitle = $("#fragment-prompt-title");
    const promptText = $("#fragment-prompt-text");
    const promptMeta = $("#fragment-prompt-meta");
    const copyButton = $("#fragment-copy");
    const closeButton = $("#fragment-close");
    if (!viewer || !frame || !image || !trigger || !tiles || !prompt || !dots) return;

    const items = (cfg.works.items || []).filter((item) => item && item.image && item.prompt);
    if (!items.length) return;

    const local = { index: 0, open: false, animating: false, visible: false, timer: null, focus: null };
    const interval = Math.max(2400, Number(cfg.fragment && cfg.fragment.interval) || 4200);

    items.forEach((item, index) => {
      const dot = document.createElement("button");
      dot.type = "button";
      dot.setAttribute("aria-label", `查看第 ${index + 1} 件作品：${item.title}`);
      dot.addEventListener("click", () => {
        if (local.open || local.animating) return;
        show(index);
        startAuto();
      });
      dots.append(dot);
    });

    function show(index) {
      local.index = (index + items.length) % items.length;
      const item = items[local.index];
      image.src = item.image;
      image.alt = item.alt || item.title;
      image.style.objectPosition = item.position || "center";
      setText("fragment-slide-title", item.title);
      setText("fragment-en", item.en || "");
      setText("fragment-count", `${pad(local.index + 1)} / ${pad(items.length)}`);
      promptTitle.textContent = item.title;
      promptText.textContent = item.prompt;
      promptMeta.textContent = `${item.category || ""}${item.year ? " / " + item.year : ""}`;
      trigger.setAttribute("aria-label", `拆解「${item.title}」，查看提示词`);
      Array.from(dots.children).forEach((dot, dotIndex) => {
        dot.classList.toggle("is-active", dotIndex === local.index);
        dot.setAttribute("aria-current", dotIndex === local.index ? "true" : "false");
      });
    }

    function stopAuto() {
      if (local.timer) {
        window.clearTimeout(local.timer);
        local.timer = null;
      }
    }

    function startAuto() {
      stopAuto();
      if (local.open || local.animating || !local.visible || document.hidden || reducedMotion.matches) return;
      local.timer = window.setTimeout(() => {
        local.timer = null;
        show(local.index + 1);
        startAuto();
      }, interval);
    }

    function buildTiles() {
      const rect = frame.getBoundingClientRect();
      const imageWidth = image.naturalWidth;
      const imageHeight = image.naturalHeight;
      const source = image.currentSrc || image.src;
      if (!imageWidth || !imageHeight || !source) return false;

      const cell = Math.max(14, Math.round(rect.width / 22));
      const columns = Math.ceil(rect.width / cell);
      const rows = Math.ceil(rect.height / cell);
      const scale = Math.max(rect.width / imageWidth, rect.height / imageHeight);
      const backgroundWidth = imageWidth * scale;
      const backgroundHeight = imageHeight * scale;
      const offsetX = (rect.width - backgroundWidth) / 2;
      const offsetY = (rect.height - backgroundHeight) / 2;
      const fragment = document.createDocumentFragment();

      for (let row = 0; row < rows; row += 1) {
        for (let column = 0; column < columns; column += 1) {
          const x = column * cell;
          const y = row * cell;
          const tile = document.createElement("span");
          tile.className = "fragment-tile";
          tile.style.left = `${x}px`;
          tile.style.top = `${y}px`;
          tile.style.width = `${cell + 0.8}px`;
          tile.style.height = `${cell + 0.8}px`;
          tile.style.backgroundImage = `url("${source}")`;
          tile.style.backgroundSize = `${backgroundWidth}px ${backgroundHeight}px`;
          tile.style.backgroundPosition = `${-(x - offsetX)}px ${-(y - offsetY)}px`;
          tile.style.setProperty("--tx", `${((x + cell / 2) - rect.width / 2) * 0.55 + (Math.random() * 60 - 30)}px`);
          tile.style.setProperty("--ty", `${((y + cell / 2) - rect.height / 2) * 0.4 + (Math.random() * 80 - 40)}px`);
          tile.style.setProperty("--rot", `${Math.random() * 16 - 8}deg`);
          tile.style.setProperty("--delay", `${Math.round((row / Math.max(1, rows)) * 130 + Math.random() * 80)}ms`);
          fragment.append(tile);
        }
      }

      tiles.replaceChildren(fragment);
      void tiles.offsetWidth;
      tiles.classList.add("is-active");
      return true;
    }

    function showPrompt() {
      local.animating = false;
      local.open = true;
      stopAuto();
      frame.classList.remove("is-deconstructing");
      tiles.classList.remove("is-active");
      tiles.replaceChildren();
      prompt.hidden = false;
      frame.classList.add("is-prompt-open");
      trigger.disabled = true;
      trigger.tabIndex = -1;
      trigger.setAttribute("aria-expanded", "true");
      closeButton.focus({ preventScroll: true });
    }

    function openPrompt() {
      if (local.open || local.animating) return;
      local.animating = true;
      local.focus = document.activeElement;
      stopAuto();
      trigger.disabled = true;
      if (reducedMotion.matches) {
        showPrompt();
        return;
      }
      frame.classList.add("is-deconstructing");
      if (!buildTiles()) {
        showPrompt();
        return;
      }
      window.setTimeout(showPrompt, 980);
    }

    function closePrompt() {
      prompt.hidden = true;
      frame.classList.remove("is-prompt-open");
      trigger.disabled = false;
      trigger.tabIndex = 0;
      trigger.setAttribute("aria-expanded", "false");
      local.open = false;
      local.animating = false;
      trigger.focus({ preventScroll: true });
      startAuto();
    }

    function copyPrompt() {
      const value = promptText.textContent || "";
      if (!value) return;
      const original = (cfg.fragment && cfg.fragment.copy) || "复制提示词";
      const done = (cfg.fragment && cfg.fragment.copied) || "已复制";
      const fail = () => {
        copyButton.textContent = "复制失败";
        window.setTimeout(() => { copyButton.textContent = original; }, 1600);
      };
      if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(value).then(() => {
          copyButton.textContent = done;
          window.setTimeout(() => { copyButton.textContent = original; }, 1600);
        }).catch(fail);
      } else {
        fail();
      }
    }

    trigger.addEventListener("click", openPrompt);
    closeButton.addEventListener("click", closePrompt);
    copyButton.addEventListener("click", copyPrompt);
    prompt.addEventListener("keydown", (event) => {
      if (event.key === "Escape") {
        event.preventDefault();
        closePrompt();
      }
    });

    show(0);

    if ("IntersectionObserver" in window) {
      const observer = new IntersectionObserver((entries) => {
        local.visible = entries.some((entry) => entry.isIntersecting);
        if (local.visible) startAuto();
        else stopAuto();
      }, { threshold: 0.25 });
      observer.observe(viewer);
    } else {
      local.visible = true;
      startAuto();
    }

    document.addEventListener("visibilitychange", () => {
      if (document.hidden) stopAuto();
      else startAuto();
    });

    items.slice(1).forEach((item) => {
      const preload = new Image();
      preload.src = item.image;
    });
  }

  function initOpenCall() {
    const form = $("#submission-form");
    const fileInput = $("#submission-image");
    const drop = $("#submission-drop");
    const preview = $("#submission-preview");
    const dropEmpty = $("#submission-drop-empty");
    const dropChange = $("#submission-change");
    const status = $("#submission-status");
    if (!form || !fileInput || !drop || !preview || !status) return;

    const github = (cfg.openCall && cfg.openCall.github) || {};
    const configured = Boolean(github.owner && github.repo);
    let selectedFile = null;
    let previewUrl = "";

    function setStatus(message, isError = false) {
      status.textContent = message || "";
      status.classList.toggle("is-error", Boolean(isError));
    }

    function handleFile(file) {
      if (!file) return;
      if (!file.type || !file.type.startsWith("image/")) {
        setStatus("请选择 JPG、PNG 或 WEBP 图片。", true);
        return;
      }
      selectedFile = file;
      if (previewUrl) URL.revokeObjectURL(previewUrl);
      previewUrl = URL.createObjectURL(file);
      preview.src = previewUrl;
      preview.hidden = false;
      dropEmpty.hidden = true;
      dropChange.hidden = false;
      setStatus("");
    }

    fileInput.addEventListener("change", () => handleFile(fileInput.files && fileInput.files[0]));
    drop.addEventListener("keydown", (event) => {
      if (event.key === "Enter" || event.key === " ") {
        event.preventDefault();
        fileInput.click();
      }
    });

    ["dragenter", "dragover"].forEach((eventName) => {
      drop.addEventListener(eventName, (event) => {
        event.preventDefault();
        drop.classList.add("is-dragging");
      });
    });
    ["dragleave", "drop"].forEach((eventName) => {
      drop.addEventListener(eventName, (event) => {
        event.preventDefault();
        drop.classList.remove("is-dragging");
      });
    });
    drop.addEventListener("drop", (event) => {
      const file = event.dataTransfer && event.dataTransfer.files && event.dataTransfer.files[0];
      if (!file) return;
      try {
        const transfer = new DataTransfer();
        transfer.items.add(file);
        fileInput.files = transfer.files;
      } catch {
        /* The preview still works if the browser refuses to write input.files. */
      }
      handleFile(file);
    });

    form.addEventListener("submit", (event) => {
      event.preventDefault();
      const author = $("#submission-author").value.trim();
      const workTitle = $("#submission-work-title").value.trim();
      const year = $("#submission-year").value.trim();
      const promptValue = $("#submission-prompt").value.trim();
      const contact = $("#submission-contact").value.trim();

      if (!selectedFile || !author || !workTitle || !promptValue) {
        setStatus((cfg.openCall.form && cfg.openCall.form.error) || "请先选择图片，并填写作者、作品名与提示词。", true);
        return;
      }
      if (!configured) {
        setStatus("投稿入口还没有接好，请先写邮件联系。", true);
        return;
      }

      const body = [
        `### 作者`,
        author,
        ``,
        `### 作品名`,
        workTitle,
        ``,
        `### 年份`,
        year || "—",
        ``,
        `### 提示词`,
        promptValue,
        ``,
        `### 联系方式`,
        contact || "—",
        ``,
        `### 图片`,
        `<!-- 把作品图片拖到这里（GitHub 会自动上传）。 -->`,
        ``,
        `<!-- 本地文件名：${selectedFile.name} -->`
      ].join("\n");
      const params = new URLSearchParams({
        labels: github.submissionLabel || "submission",
        title: `[投稿] ${workTitle} — ${author}`,
        body
      });
      const repoUrl = `https://github.com/${encodeURIComponent(github.owner)}/${encodeURIComponent(github.repo)}`;
      const issueUrl = `${repoUrl}/issues/new?${params.toString()}`;
      const link = document.createElement("a");
      link.href = issueUrl;
      link.target = "_blank";
      link.rel = "noopener noreferrer";
      link.style.display = "none";
      document.body.append(link);
      link.click();
      link.remove();
      setStatus((cfg.openCall.form && cfg.openCall.form.status) || "投稿页已打开。请把图片拖进正文，然后提交。");
    });

    if (!configured) {
      setStatus("投稿入口还没有接好，请先写邮件联系。", true);
      return;
    }

    function extractImage(body) {
      if (!body) return "";
      const markdown = body.match(/!\[[^\]]*\]\((https?:\/\/[^)\s]+)\)/i);
      if (markdown) return markdown[1];
      const html = body.match(/<img[^>]+src=["'](https?:\/\/[^"']+)["']/i);
      return html ? html[1] : "";
    }

    function section(body, heading) {
      if (!body) return "";
      const pattern = new RegExp(`^###\\s*${heading}\\s*$`, "im");
      const match = body.match(pattern);
      if (!match || match.index == null) return "";
      const rest = body.slice(match.index + match[0].length);
      const next = rest.search(/^###\s+/m);
      return (next >= 0 ? rest.slice(0, next) : rest).replace(/<!--[\s\S]*?-->/g, "").trim();
    }

    function loadCommunity() {
      const grid = $("#community-grid");
      const empty = $("#community-empty");
      const count = $("#community-count");
      if (!grid || !empty) return;
      const controller = new AbortController();
      const timeout = window.setTimeout(() => controller.abort(), 10000);
      const labels = [github.submissionLabel || "submission", github.acceptedLabel || "accepted"].join(",");
      const url = `https://api.github.com/repos/${encodeURIComponent(github.owner)}/${encodeURIComponent(github.repo)}/issues?state=all&labels=${encodeURIComponent(labels)}&per_page=${Number(github.limit) || 12}`;
      fetch(url, { headers: { Accept: "application/vnd.github+json" }, signal: controller.signal })
        .then((response) => {
          if (!response.ok) throw new Error(`GitHub ${response.status}`);
          return response.json();
        })
        .then((issues) => {
          const accepted = (Array.isArray(issues) ? issues : []).filter((issue) => {
            return issue && !issue.pull_request && extractImage(issue.body);
          });
          if (!accepted.length) return;
          const fragment = document.createDocumentFragment();
          accepted.forEach((issue) => {
            const issueTitle = String(issue.title || "").replace(/^\[(投稿|submission)\]\s*/i, "");
            const workTitle = section(issue.body, "作品名") || issueTitle.split(/[—–-]/)[0].trim() || "未命名来稿";
            const author = section(issue.body, "作者") || issue.user?.login || "匿名";
            const year = section(issue.body, "年份") || "";
            const promptValue = section(issue.body, "提示词") || section(issue.body, "作品说明") || "";
            const imageUrl = extractImage(issue.body);
            const card = document.createElement("a");
            card.className = "community-card";
            card.href = issue.html_url;
            card.target = "_blank";
            card.rel = "noopener noreferrer";
            card.setAttribute("aria-label", `查看来稿：${workTitle}，作者 ${author}`);
            const media = document.createElement("div");
            media.className = "community-card__media";
            const image = document.createElement("img");
            image.src = imageUrl;
            image.alt = `${workTitle} / ${author}`;
            image.loading = "lazy";
            image.decoding = "async";
            media.append(image);
            const body = document.createElement("div");
            body.className = "community-card__body";
            const title = document.createElement("h3");
            title.textContent = workTitle;
            const meta = document.createElement("span");
            meta.className = "community-card__meta";
            meta.textContent = `${author}${year ? " / " + year : ""}`;
            body.append(title, meta);
            if (promptValue) {
              const prompt = document.createElement("p");
              prompt.className = "community-card__prompt";
              prompt.textContent = promptValue;
              body.append(prompt);
            }
            card.append(media, body);
            fragment.append(card);
          });
          if (!fragment.childNodes.length) return;
          grid.replaceChildren(fragment);
          grid.hidden = false;
          empty.hidden = true;
          if (count) count.textContent = pad(accepted.length);
        })
        .catch((error) => {
          console.warn("Community submissions unavailable.", error);
        })
        .finally(() => {
          window.clearTimeout(timeout);
        });
    }

    loadCommunity();
  }

  function initDiscussion() {
    const container = $("#discussion-container");
    const fallback = $("#discussion-fallback");
    const newTopic = $("#discussion-new-topic");
    if (!container || !fallback) return;

    const github = (cfg.discussion && cfg.discussion.github) || {};
    const configured = Boolean(github.owner && github.repo);
    if (!configured) return;

    const repoUrl = `https://github.com/${encodeURIComponent(github.owner)}/${encodeURIComponent(github.repo)}`;
    fallback.hidden = true;
    container.hidden = false;
    setText("discussion-status", "OPEN TABLE / 讨论开放");

    if (newTopic) {
      newTopic.href = buildNewIssueUrl(repoUrl, github);
      newTopic.hidden = false;
    }

    const loading = document.createElement("div");
    loading.className = "discussion__loading";
    loading.textContent = "正在读取讨论…";
    container.replaceChildren(loading);
    loadDiscussionThreads(container, github, repoUrl);
  }

  function buildNewIssueUrl(repoUrl, github) {
    const params = new URLSearchParams();
    if (github && github.label) params.set("labels", github.label);
    return `${repoUrl}/issues/new${params.toString() ? `?${params}` : ""}`;
  }

  function formatDiscussionDate(value) {
    try {
      return new Intl.DateTimeFormat("zh-CN", {
        month: "short",
        day: "numeric"
      }).format(new Date(value));
    } catch {
      return "";
    }
  }

  function createDiscussionThread(issue) {
    const link = document.createElement("a");
    link.className = "discussion-thread";
    link.href = issue.html_url;
    link.target = "_blank";
    link.rel = "noopener noreferrer";

    const number = document.createElement("span");
    number.className = "discussion-thread__no";
    number.textContent = `#${issue.number}`;

    const body = document.createElement("div");
    body.className = "discussion-thread__body";
    const title = document.createElement("h3");
    title.textContent = issue.title || "未命名话题";
    const byline = document.createElement("p");
    const author = issue.user && issue.user.login ? `@${issue.user.login}` : "GitHub";
    byline.textContent = `${author} · ${formatDiscussionDate(issue.created_at)}`;
    body.append(title, byline);

    const meta = document.createElement("div");
    meta.className = "discussion-thread__meta";
    const replies = document.createElement("span");
    replies.textContent = `${issue.comments || 0} 回复`;
    const arrow = document.createElement("i");
    arrow.setAttribute("aria-hidden", "true");
    arrow.textContent = "↗";
    meta.append(replies, arrow);

    link.append(number, body, meta);
    return link;
  }

  async function loadDiscussionThreads(container, github, repoUrl) {
    const params = new URLSearchParams({
      state: "open",
      sort: "updated",
      direction: "desc",
      per_page: String(Math.min(20, Math.max(1, Number(github.limit) || 6)))
    });
    if (github.label) params.set("labels", github.label);

    const controller = new AbortController();
    const timeout = window.setTimeout(() => controller.abort(), 10000);
    try {
      const response = await fetch(
        `https://api.github.com/repos/${encodeURIComponent(github.owner)}/${encodeURIComponent(github.repo)}/issues?${params}`,
        {
          headers: { Accept: "application/vnd.github+json" },
          signal: controller.signal
        }
      );
      if (!response.ok) throw new Error(`GitHub API ${response.status}`);
      const data = await response.json();
      const threads = Array.isArray(data) ? data.filter((issue) => !issue.pull_request) : [];
      container.replaceChildren();

      if (!threads.length) {
        const empty = document.createElement("div");
        empty.className = "discussion__empty-state";
        const kicker = document.createElement("p");
        kicker.className = "discussion__fallback-kicker";
        kicker.textContent = "OPEN CHAIR / 空位";
        const heading = document.createElement("h3");
        heading.textContent = cfg.discussion.emptyTitle || "还没有人开口。";
        const copy = document.createElement("p");
        copy.textContent = cfg.discussion.emptyText || "第一张椅子，留给你。";
        const cta = document.createElement("a");
        cta.className = "text-link";
        cta.href = buildNewIssueUrl(repoUrl, github);
        cta.target = "_blank";
        cta.rel = "noopener noreferrer";
        cta.textContent = cfg.discussion.newTopic || "发起话题";
        empty.append(kicker, heading, copy, cta);
        container.append(empty);
        return;
      }

      const list = document.createElement("div");
      list.className = "discussion__threads-list";
      threads.forEach((issue) => list.append(createDiscussionThread(issue)));
      container.append(list);

      const foot = document.createElement("div");
      foot.className = "discussion__threads-foot";
      const note = document.createElement("p");
      note.textContent = "话题与回复托管在 GitHub，点击任意话题即可参与。";
      const all = document.createElement("a");
      all.href = `${repoUrl}/issues`;
      all.target = "_blank";
      all.rel = "noopener noreferrer";
      all.textContent = cfg.discussion.allTopics || "在 GitHub 查看全部";
      foot.append(note, all);
      container.append(foot);
    } catch (error) {
      setText("discussion-status", "CONNECTION FAILED / 读取失败");
      container.replaceChildren();
      const notice = document.createElement("div");
      notice.className = "discussion__empty-state";
      const kicker = document.createElement("p");
      kicker.className = "discussion__fallback-kicker";
      kicker.textContent = "NO SIGNAL / 暂无回应";
      const heading = document.createElement("h3");
      heading.textContent = "讨论区暂时没有回应。";
      const copy = document.createElement("p");
      copy.textContent = "GitHub 仓库还没有准备就绪，或请求被限流。稍后再试，或者直接去 GitHub 看看。";
      const link = document.createElement("a");
      link.className = "text-link";
      link.href = `${repoUrl}/issues`;
      link.target = "_blank";
      link.rel = "noopener noreferrer";
      link.textContent = "在 GitHub 打开";
      notice.append(kicker, heading, copy, link);
      container.append(notice);
      console.warn("Discussion feed unavailable.", error);
    } finally {
      window.clearTimeout(timeout);
    }
  }

  function init() {
    populateContent();
    initFragments();
    initOpenCall();
    initDiscussion();
    bindEntry();
    bindSound();
    bindMenu();
    bindDialog();
    bindSlideshow();
    bindHeader();
    bindGlobalFocusTraps();
    initReveals();
    initRain();
    initParallax();
    updateBodyLock();

    // The gate is an experience, not a data collection step.
    if (entry && !entry.hidden) {
      document.body.classList.add("is-locked");
      if (finePointer.matches) {
        window.setTimeout(() => nameInput.focus({ preventScroll: true }), 500);
      }
    }
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init, { once: true });
  } else {
    init();
  }
})();
