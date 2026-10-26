/* ================================================================
   朝闻道 · accounts + guestbook
   Anonymous Supabase sessions, code avatars, profiles and comments.
   ================================================================ */
(() => {
  "use strict";

  const cfg = window.SITE_CONFIG;
  if (!cfg || !cfg.auth || !window.supabase) {
    console.error("Community auth is not configured.");
    return;
  }

  const $ = (selector, root = document) => root.querySelector(selector);
  const $$ = (selector, root = document) => Array.from(root.querySelectorAll(selector));
  const pad = (value) => String(value).padStart(2, "0");
  const client = window.supabase.createClient(cfg.auth.supabaseUrl, cfg.auth.supabaseKey, {
    auth: {
      persistSession: true,
      autoRefreshToken: true,
      detectSessionInUrl: true
    }
  });

  const state = {
    user: null,
    profile: null,
    comments: [],
    draft: {
      seed: "",
      style: cfg.auth.defaultAvatarStyle || "rain",
      gender: "",
      name: cfg.auth.defaultName || "Nameless."
    },
    loading: false,
    authBusy: false,
    initialized: false
  };

  const els = {
    headerTrigger: $("#account-trigger"),
    headerAvatar: $("#account-avatar"),
    headerLabel: $("#account-label"),
    mobileTrigger: $("#mobile-account-trigger"),
    mobileLabel: $("#mobile-account-label"),
    dialog: $("#account-dialog"),
    close: $("#account-close"),
    guestView: $("#account-guest-view"),
    profileView: $("#account-profile-view"),
    guestEmailForm: $("#account-email-form"),
    guestEmail: $("#account-email"),
    guestEmailSubmit: $("#account-email-submit"),
    guestEmailStatus: $("#account-email-status"),
    anonymousButton: $("#account-anonymous"),
    profileKicker: $("#account-profile-kicker"),
    profileTitle: $("#account-profile-title"),
    profileNote: $("#account-profile-note"),
    accountAvatar: $("#account-avatar-large"),
    upgradeBlock: $("#account-upgrade-block"),
    upgradeForm: $("#account-upgrade-form"),
    upgradeEmail: $("#account-upgrade-email"),
    upgradeSubmit: $("#account-upgrade-submit"),
    upgradeStatus: $("#account-upgrade-status"),
    profileForm: $("#account-profile-form"),
    nameInput: $("#account-name"),
    genderSelect: $("#account-gender"),
    avatarOptions: $("#avatar-options"),
    reroll: $("#avatar-reroll"),
    save: $("#account-save"),
    logout: $("#account-logout"),
    accountStatus: $("#account-status"),
    composerAvatar: $("#composer-avatar"),
    composerName: $("#composer-name"),
    composerLogin: $("#composer-login"),
    composerNote: $("#composer-note"),
    form: $("#comment-form"),
    body: $("#comment-body"),
    length: $("#comment-length"),
    submit: $("#comment-submit"),
    list: $("#comment-list"),
    empty: $("#comment-empty"),
    emptyTitle: $("#comment-empty-title"),
    emptyText: $("#comment-empty-text"),
    loading: $("#comment-loading"),
    status: $("#comment-status"),
    count: $("#guestbook-count"),
    refresh: $("#guestbook-refresh")
  };

  const copy = cfg.comments || {};
  const accountCopy = copy.account || {};
  const defaultName = cfg.auth.defaultName || "Nameless.";
  const defaultStyle = cfg.auth.defaultAvatarStyle || "rain";
  const styles = new Map((cfg.auth.avatarStyles || []).map((item) => [item.id, item]));
  const glyphs = "01<>[]{}/\\#*+=";

  /* ── small helpers ───────────────────────────────────────────── */

  function randomSeed() {
    if (window.crypto && window.crypto.getRandomValues) {
      const bytes = new Uint8Array(8);
      window.crypto.getRandomValues(bytes);
      return Array.from(bytes, (byte) => byte.toString(16).padStart(2, "0")).join("");
    }
    return Math.random().toString(16).slice(2, 18);
  }

  function hashString(value) {
    let hash = 2166136261;
    for (let index = 0; index < value.length; index += 1) {
      hash ^= value.charCodeAt(index);
      hash = Math.imul(hash, 16777619);
    }
    return hash >>> 0;
  }

  function setText(el, value) {
    if (el && value != null) el.textContent = value;
  }

  function setStatus(el, message, isError = false) {
    if (!el) return;
    el.textContent = message || "";
    el.classList.toggle("is-error", Boolean(isError));
  }

  function formatDate(value) {
    try {
      return new Intl.DateTimeFormat("zh-CN", {
        month: "2-digit",
        day: "2-digit",
        hour: "2-digit",
        minute: "2-digit"
      }).format(new Date(value));
    } catch {
      return "";
    }
  }

  function isAnonymous(user) {
    return Boolean(user && user.is_anonymous);
  }

  function profileFor(user) {
    return {
      id: user ? user.id : null,
      display_name: defaultName,
      avatar_seed: randomSeed(),
      avatar_style: defaultStyle,
      gender: null,
      is_anonymous: user ? isAnonymous(user) : true
    };
  }

  /* ── code avatar ────────────────────────────────────────────── */

  function codeAvatar(el, seed, styleId) {
    if (!el) return;
    const palette = styles.get(styleId) || styles.get(defaultStyle) || {
      bg: "#041b1d",
      fg: "#71ded6",
      accent: "#ff7b32"
    };
    const source = String(seed || "nameless");
    const hash = hashString(source + styleId);
    el.replaceChildren();
    el.style.setProperty("--avatar-bg", palette.bg);
    el.style.setProperty("--avatar-fg", palette.fg);
    el.style.setProperty("--avatar-accent", palette.accent);
    for (let index = 0; index < 49; index += 1) {
      const char = document.createElement("span");
      const value = glyphs[Math.floor((hash / (index + 3)) + index * 7) % glyphs.length];
      char.textContent = value;
      if ((hash + index * 13) % 11 === 0) char.classList.add("is-accent");
      el.append(char);
    }
  }

  /* ── profiles / session ─────────────────────────────────────── */

  async function readProfile(id) {
    const { data, error } = await client.from("profiles").select("*").eq("id", id).maybeSingle();
    if (error) {
      console.warn("Profile read failed.", error);
      return null;
    }
    return data || null;
  }

  async function ensureProfile(user) {
    let profile = await readProfile(user.id);
    if (!profile) {
      // The auth trigger normally creates this row. If it has not landed yet,
      // retry once before inserting a fallback profile.
      await new Promise((resolve) => window.setTimeout(resolve, 320));
      profile = await readProfile(user.id);
    }
    if (!profile) {
      const fallback = profileFor(user);
      const { data, error } = await client
        .from("profiles")
        .insert({
          id: user.id,
          display_name: fallback.display_name,
          avatar_seed: fallback.avatar_seed,
          avatar_style: fallback.avatar_style,
          gender: null,
          is_anonymous: fallback.is_anonymous
        })
        .select("*")
        .maybeSingle();
      if (!error) profile = data;
      else profile = await readProfile(user.id);
    }
    if (profile && profile.is_anonymous && !isAnonymous(user)) {
      const { data } = await client
        .from("profiles")
        .update({ is_anonymous: false })
        .eq("id", user.id)
        .select("*")
        .maybeSingle();
      if (data) profile = data;
    }
    return profile;
  }

  async function applySession(user) {
    const previousId = state.user && state.user.id;
    state.user = user || null;
    state.profile = null;
    if (user) {
      state.profile = await ensureProfile(user);
      if (!state.profile) state.profile = profileFor(user);
      if (!state.draft.seed || previousId !== user.id) {
        state.draft = {
          seed: state.profile.avatar_seed || randomSeed(),
          style: state.profile.avatar_style || defaultStyle,
          gender: state.profile.gender || "",
          name: state.profile.display_name || defaultName
        };
      }
    } else {
      state.draft = { seed: randomSeed(), style: defaultStyle, gender: "", name: defaultName };
    }
    renderIdentity();
    renderHeader();
    renderAccount();
    renderComments();
  }

  async function loadSession() {
    try {
      const { data, error } = await client.auth.getSession();
      if (error) console.warn("Session read failed.", error);
      await applySession(data && data.session ? data.session.user : null);
    } catch (error) {
      console.warn("Session unavailable.", error);
      await applySession(null);
    }
  }

  /* ── rendering identity ─────────────────────────────────────── */

  function renderIdentity() {
    const profile = state.profile;
    const name = profile ? profile.display_name : defaultName;
    const seed = state.draft.seed || (profile && profile.avatar_seed) || "nameless";
    const style = state.draft.style || (profile && profile.avatar_style) || defaultStyle;
    codeAvatar(els.headerAvatar, seed, style);
    codeAvatar(els.composerAvatar, seed, style);
    setText(els.headerLabel, state.user ? name : "登录");
    setText(els.mobileLabel, state.user ? `${name} / ${isAnonymous(state.user) ? "匿名" : "账号"}` : copy.login || "登录 / 留下名字");
    setText(els.composerName, state.user ? name : defaultName);
    if (els.composerLogin) {
      els.composerLogin.hidden = Boolean(state.user && !isAnonymous(state.user));
      els.composerLogin.textContent = isAnonymous(state.user)
        ? accountCopy.upgrade || "登录，保留这个名字"
        : copy.login || "登录 / 留下名字";
    }
    if (els.composerNote) {
      if (!state.user) els.composerNote.textContent = copy.guestNote || "匿名发言 · 名字会显示为 Nameless.";
      else if (isAnonymous(state.user)) els.composerNote.textContent = copy.anonymousNote || "你正以 Nameless. 发言。登录后可保留自己的名字。";
      else els.composerNote.textContent = `${copy.memberNote || "以你的名字发言。"}（${name}）`;
    }
  }

  function renderHeader() {
    if (!els.headerTrigger) return;
    const name = state.profile ? state.profile.display_name : defaultName;
    els.headerTrigger.setAttribute("aria-label", state.user ? `打开账号：${name}` : "登录或留下名字");
  }

  /* ── account dialog ─────────────────────────────────────────── */

  function buildAvatarOptions() {
    if (!els.avatarOptions || els.avatarOptions.childElementCount) return;
    (cfg.auth.avatarStyles || []).forEach((item) => {
      const button = document.createElement("button");
      button.type = "button";
      button.className = "account-avatar-option";
      button.dataset.style = item.id;
      button.setAttribute("aria-label", `选择${item.label}色代码头像`);
      const preview = document.createElement("span");
      preview.className = "code-avatar code-avatar--option";
      codeAvatar(preview, state.draft.seed, item.id);
      const label = document.createElement("span");
      label.textContent = item.label;
      button.append(preview, label);
      button.addEventListener("click", () => {
        state.draft.style = item.id;
        renderAvatarOptions();
        renderDraftAvatar();
      });
      els.avatarOptions.append(button);
    });
    renderAvatarOptions();
  }

  function renderAvatarOptions() {
    $$(".account-avatar-option", els.avatarOptions).forEach((button) => {
      const selected = button.dataset.style === state.draft.style;
      button.classList.toggle("is-selected", selected);
      button.setAttribute("aria-pressed", selected ? "true" : "false");
    });
  }

  function renderDraftAvatar() {
    codeAvatar(els.accountAvatar, state.draft.seed, state.draft.style);
  }

  function renderAccount() {
    if (!els.guestView || !els.profileView) return;
    const logged = Boolean(state.user);
    els.guestView.hidden = logged;
    els.profileView.hidden = !logged;
    setStatus(els.accountStatus, "");
    if (!logged) return;

    const anonymous = isAnonymous(state.user);
    const profile = state.profile || profileFor(state.user);
    const name = profile.display_name || defaultName;
    if (!state.draft.seed && profile.avatar_seed) {
      state.draft = {
        seed: profile.avatar_seed,
        style: profile.avatar_style || defaultStyle,
        gender: profile.gender || "",
        name
      };
    }
    setText(els.profileKicker, anonymous ? "ANONYMOUS / 匿名身份" : "SIGNED IN / 已登录");
    setText(els.profileTitle, name);
    setText(
      els.profileNote,
      anonymous
        ? accountCopy.anonymousText || "这是一个匿名身份。登录后，名字和留言都会保留。"
        : accountCopy.profileText || "你可以选择名字、代码头像与性别。"
    );
    renderDraftAvatar();
    els.upgradeBlock.hidden = !anonymous;
    els.profileForm.hidden = anonymous;
    els.logout.hidden = false;
    if (els.profileForm && !anonymous) {
      els.nameInput.value = name;
      els.genderSelect.value = profile.gender || "";
      state.draft.name = name;
      state.draft.gender = profile.gender || "";
      state.draft.seed = state.draft.seed || profile.avatar_seed || randomSeed();
      state.draft.style = state.draft.style || profile.avatar_style || defaultStyle;
      buildAvatarOptions();
      renderAvatarOptions();
      renderDraftAvatar();
    }
    if (els.upgradeBlock && anonymous) {
      els.upgradeEmail.value = "";
      setStatus(els.upgradeStatus, "");
    }
  }

  function openAccount() {
    if (!els.dialog) return;
    const menu = $("#mobile-menu");
    if (menu && menu.getAttribute("aria-hidden") === "false") {
      const toggle = $("#menu-toggle");
      if (toggle) toggle.click();
    }
    renderAccount();
    if (typeof els.dialog.showModal === "function") {
      if (!els.dialog.open) els.dialog.showModal();
    } else {
      els.dialog.setAttribute("open", "");
    }
    document.body.classList.add("account-open");
    if (!state.user && els.guestEmail) {
      window.setTimeout(() => els.guestEmail.focus({ preventScroll: true }), 180);
    }
  }

  function closeAccount() {
    if (!els.dialog) return;
    if (typeof els.dialog.close === "function" && els.dialog.open) els.dialog.close();
    else els.dialog.removeAttribute("open");
    document.body.classList.remove("account-open");
  }

  /* ── auth actions ───────────────────────────────────────────── */

  async function signInAnonymously() {
    try {
      const { data, error } = await client.auth.signInAnonymously();
      if (error) throw error;
      if (data && data.user) await applySession(data.user);
      return data && data.user ? data.user : null;
    } catch (error) {
      console.warn("Anonymous sign-in failed.", error);
      setStatus(els.commentStatus, copy.postError || "发布失败，请稍后再试。", true);
      return null;
    }
  }

  async function sendGuestLink(event) {
    event.preventDefault();
    const email = els.guestEmail.value.trim();
    if (!email || !els.guestEmail.checkValidity()) {
      els.guestEmail.reportValidity();
      return;
    }
    els.guestEmailSubmit.disabled = true;
    setStatus(els.guestEmailStatus, accountCopy.sending || "正在发送…");
    try {
      const { error } = await client.auth.signInWithOtp({
        email,
        options: {
          shouldCreateUser: true,
          emailRedirectTo: cfg.auth.siteUrl
        }
      });
      if (error) throw error;
      setStatus(els.guestEmailStatus, accountCopy.sent || "登录链接已发送，请去邮箱点击。");
    } catch (error) {
      console.warn("Magic link failed.", error);
      setStatus(els.guestEmailStatus, accountCopy.loginError || "登录失败，请检查邮箱后再试。", true);
    } finally {
      els.guestEmailSubmit.disabled = false;
    }
  }

  async function upgradeAnonymous(event) {
    event.preventDefault();
    if (!state.user || !isAnonymous(state.user)) return;
    const email = els.upgradeEmail.value.trim();
    if (!email || !els.upgradeEmail.checkValidity()) {
      els.upgradeEmail.reportValidity();
      return;
    }
    els.upgradeSubmit.disabled = true;
    setStatus(els.upgradeStatus, accountCopy.sending || "正在发送…");
    try {
      const { error } = await client.auth.updateUser({ email });
      if (error) throw error;
      setStatus(els.upgradeStatus, accountCopy.upgradeSent || "确认链接已发送，请去邮箱点击。");
    } catch (error) {
      console.warn("Anonymous upgrade failed.", error);
      setStatus(els.upgradeStatus, accountCopy.loginError || "登录失败，请检查邮箱后再试。", true);
    } finally {
      els.upgradeSubmit.disabled = false;
    }
  }

  async function saveProfile(event) {
    event.preventDefault();
    if (!state.user || isAnonymous(state.user)) return;
    const name = (els.nameInput.value || "").trim();
    if (!name || name.length > 40) {
      els.nameInput.reportValidity();
      return;
    }
    els.save.disabled = true;
    setStatus(els.accountStatus, accountCopy.saving || "正在保存…");
    const { data, error } = await client
      .from("profiles")
      .update({
        display_name: name,
        avatar_seed: state.draft.seed,
        avatar_style: state.draft.style,
        gender: els.genderSelect.value || null,
        is_anonymous: false
      })
      .eq("id", state.user.id)
      .select("*")
      .maybeSingle();
    els.save.disabled = false;
    if (error) {
      console.warn("Profile save failed.", error);
      setStatus(els.accountStatus, accountCopy.saveError || "保存失败，请稍后再试。", true);
      return;
    }
    if (data) state.profile = data;
    state.draft.name = name;
    state.draft.gender = els.genderSelect.value || "";
    if (state.profileMap && state.user) state.profileMap.set(state.user.id, state.profile);
    renderIdentity();
    renderHeader();
    renderAccount();
    renderComments();
    setStatus(els.accountStatus, accountCopy.saved || "资料已保存。");
  }

  async function logout() {
    try {
      await client.auth.signOut();
    } catch (error) {
      console.warn("Sign out failed.", error);
    }
    await applySession(null);
    closeAccount();
    loadComments();
  }

  /* ── comments ───────────────────────────────────────────────── */

  function commentProfile(comment) {
    return state.profileMap && state.profileMap.get(comment.user_id)
      ? state.profileMap.get(comment.user_id)
      : null;
  }

  function renderComments() {
    if (!els.list || !els.empty) return;
    const comments = state.comments || [];
    els.list.replaceChildren();
    els.loading.hidden = true;
    if (comments.length === 0) {
      els.list.hidden = true;
      els.empty.hidden = false;
      setText(els.emptyTitle, copy.emptyTitle || "还没有人开口。");
      setText(els.emptyText, copy.emptyText || "第一张椅子，留给你。");
      if (els.count) els.count.textContent = `00 ${copy.countSuffix || "MESSAGES"}`;
      return;
    }
    els.empty.hidden = true;
    els.list.hidden = false;
    const fragment = document.createDocumentFragment();
    comments.forEach((comment) => {
      const profile = commentProfile(comment) || {
        display_name: defaultName,
        avatar_seed: String(comment.user_id || "nameless"),
        avatar_style: defaultStyle,
        is_anonymous: true
      };
      const card = document.createElement("article");
      card.className = "comment";
      const avatar = document.createElement("span");
      avatar.className = "code-avatar code-avatar--comment";
      codeAvatar(avatar, profile.avatar_seed, profile.avatar_style);
      const content = document.createElement("div");
      content.className = "comment__body";
      const head = document.createElement("div");
      head.className = "comment__head";
      const name = document.createElement("span");
      name.className = "comment__name";
      name.textContent = profile.display_name || defaultName;
      const meta = document.createElement("span");
      meta.className = "comment__meta";
      meta.textContent = `${profile.is_anonymous ? "ANON / " : ""}${formatDate(comment.created_at)}`;
      head.append(name, meta);
      const body = document.createElement("p");
      body.className = "comment__text";
      body.textContent = comment.body;
      content.append(head, body);
      if (state.user && comment.user_id === state.user.id) {
        const remove = document.createElement("button");
        remove.className = "comment__delete";
        remove.type = "button";
        remove.textContent = copy.delete || "删除";
        remove.addEventListener("click", () => deleteComment(comment.id));
        content.append(remove);
      }
      card.append(avatar, content);
      fragment.append(card);
    });
    els.list.append(fragment);
    if (els.count) els.count.textContent = `${pad(comments.length)} ${copy.countSuffix || "MESSAGES"}`;
  }

  async function loadComments() {
    if (!els.list || !els.empty) return;
    els.loading.hidden = false;
    els.list.hidden = true;
    els.empty.hidden = true;
    try {
      const { data, error } = await client
        .from("comments")
        .select("id,user_id,body,created_at")
        .order("created_at", { ascending: false })
        .limit(80);
      if (error) throw error;
      const comments = Array.isArray(data) ? data : [];
      const ids = [...new Set(comments.map((comment) => comment.user_id).filter(Boolean))];
      state.profileMap = new Map();
      if (ids.length) {
        const { data: profiles, error: profileError } = await client
          .from("profiles")
          .select("id,display_name,avatar_seed,avatar_style,gender,is_anonymous")
          .in("id", ids);
        if (!profileError && Array.isArray(profiles)) {
          profiles.forEach((profile) => state.profileMap.set(profile.id, profile));
        }
      }
      state.comments = comments;
      renderComments();
      setStatus(els.status, "");
    } catch (error) {
      console.warn("Comments unavailable.", error);
      state.comments = [];
      els.loading.hidden = true;
      els.empty.hidden = false;
      setText(els.emptyTitle, copy.emptyTitle || "还没有人开口。");
      setText(els.emptyText, copy.error || "留言暂时读不到，请稍后再试。");
      setStatus(els.status, copy.error || "留言暂时读不到，请稍后再试。", true);
    }
  }

  async function postComment(event) {
    event.preventDefault();
    const body = (els.body.value || "").trim();
    if (!body) {
      els.body.focus();
      return;
    }
    els.submit.disabled = true;
    setStatus(els.status, copy.submitting || "正在发布…");
    try {
      let user = state.user;
      if (!user) user = await signInAnonymously();
      if (!user) throw new Error("No session");
      if (!state.profile) {
        state.profile = await ensureProfile(user);
      }
      const { error } = await client.from("comments").insert({
        user_id: user.id,
        body
      });
      if (error) throw error;
      els.body.value = "";
      updateLength();
      setStatus(els.status, copy.posted || "留言已发布。");
      await loadComments();
      renderIdentity();
    } catch (error) {
      console.warn("Comment post failed.", error);
      setStatus(els.status, copy.postError || "发布失败，请稍后再试。", true);
    } finally {
      els.submit.disabled = false;
    }
  }

  async function deleteComment(id) {
    if (!state.user) return;
    if (window.confirm(copy.confirmDelete || "删除这条留言？")) {
      const { error } = await client.from("comments").delete().eq("id", id);
      if (error) {
        console.warn("Comment delete failed.", error);
        setStatus(els.status, copy.postError || "操作失败，请稍后再试。", true);
        return;
      }
      await loadComments();
    }
  }

  function updateLength() {
    if (els.length && els.body) els.length.textContent = `${els.body.value.length} / 800`;
  }

  /* ── bindings ───────────────────────────────────────────────── */

  function bind() {
    if (els.headerTrigger) els.headerTrigger.addEventListener("click", openAccount);
    if (els.mobileTrigger) els.mobileTrigger.addEventListener("click", openAccount);
    if (els.composerLogin) els.composerLogin.addEventListener("click", openAccount);
    if (els.close) els.close.addEventListener("click", closeAccount);
    if (els.dialog) {
      els.dialog.addEventListener("click", (event) => {
        if (event.target === els.dialog) closeAccount();
      });
      els.dialog.addEventListener("close", () => document.body.classList.remove("account-open"));
    }
    if (els.guestEmailForm) els.guestEmailForm.addEventListener("submit", sendGuestLink);
    if (els.upgradeForm) els.upgradeForm.addEventListener("submit", upgradeAnonymous);
    if (els.profileForm) els.profileForm.addEventListener("submit", saveProfile);
    if (els.logout) els.logout.addEventListener("click", logout);
    if (els.anonymousButton) {
      els.anonymousButton.addEventListener("click", async () => {
        if (state.user) {
          closeAccount();
          return;
        }
        els.anonymousButton.disabled = true;
        const user = await signInAnonymously();
        els.anonymousButton.disabled = false;
        if (user) {
          setStatus(els.commentStatus, accountCopy.anonymousStatus || "你现在是 Nameless.，可以直接留言。");
          closeAccount();
        }
      });
    }
    if (els.reroll) {
      els.reroll.addEventListener("click", () => {
        state.draft.seed = randomSeed();
        renderDraftAvatar();
        $$(".account-avatar-option", els.avatarOptions).forEach((button) => {
          const preview = $(".code-avatar", button);
          if (preview) codeAvatar(preview, state.draft.seed, button.dataset.style);
        });
      });
    }
    if (els.form) els.form.addEventListener("submit", postComment);
    if (els.body) {
      els.body.addEventListener("input", updateLength);
    }
    if (els.refresh) els.refresh.addEventListener("click", loadComments);
  }

  async function init() {
    if (state.initialized) return;
    state.initialized = true;
    bind();
    buildAvatarOptions();
    updateLength();
    setText(els.emptyTitle, copy.emptyTitle || "还没有人开口。");
    setText(els.emptyText, copy.emptyText || "第一张椅子，留给你。");
    setText(els.loading, copy.loading || "正在读取留言…");
    setText(els.guestEmailSubmit, accountCopy.sendLink || "发送登录链接");
    setText(els.upgradeSubmit, accountCopy.upgradeButton || "发送保存链接");
    setText(els.save, accountCopy.save || "保存资料");
    setText(els.logout, accountCopy.logout || "退出登录");
    setText(els.composerLogin, copy.login || "登录 / 留下名字");
    setText(els.accountStatus, "");
    codeAvatar(els.headerAvatar, "nameless", defaultStyle);
    codeAvatar(els.composerAvatar, "nameless", defaultStyle);
    codeAvatar(els.accountAvatar, "nameless", defaultStyle);

    client.auth.onAuthStateChange((event, session) => {
      if (event === "SIGNED_OUT") {
        applySession(null);
      } else if (session && session.user) {
        applySession(session.user);
      }
    });

    await loadSession();
    await loadComments();
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init, { once: true });
  } else {
    init();
  }
})();
