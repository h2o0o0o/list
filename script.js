function readTheme() {
  try {
    return localStorage.getItem('theme') === 'light' ? 'light' : 'dark';
  } catch {
    return 'dark';
  }
}

function currentTheme() {
  return document.documentElement.dataset.theme === 'dark' ? 'dark' : 'light';
}

function applyTheme(theme, persist = true) {
  document.documentElement.dataset.theme = theme;
  if (!persist) return;
  try {
    localStorage.setItem('theme', theme);
  } catch {}
}

applyTheme(readTheme(), false);

const LANGUAGE_COOKIE = 'site_language';
const LANGUAGE_COOKIE_MAX_AGE = 60 * 60 * 24 * 365;

function getCookie(name) {
  const prefix = `${encodeURIComponent(name)}=`;
  const value = document.cookie
    .split(';')
    .map(cookie => cookie.trim())
    .find(cookie => cookie.startsWith(prefix))
    ?.slice(prefix.length) || '';
  return value ? decodeURIComponent(value) : '';
}

function setCookie(name, value, maxAge = LANGUAGE_COOKIE_MAX_AGE) {
  document.cookie = `${encodeURIComponent(name)}=${encodeURIComponent(value)}; max-age=${maxAge}; path=/; samesite=lax`;
}

function hasLanguageCookie() {
  const saved = getCookie(LANGUAGE_COOKIE);
  return supportedLanguageCodes.has(saved);
}

function hasSavedLanguage() {
  if (hasLanguageCookie()) return true;
  try {
    const legacy = localStorage.getItem('language');
    return supportedLanguageCodes.has(legacy);
  } catch {
    return false;
  }
}

function readLanguage() {
  const saved = getCookie(LANGUAGE_COOKIE);
  if (supportedLanguageCodes.has(saved)) return saved;
  try {
    const legacy = localStorage.getItem('language');
    if (supportedLanguageCodes.has(legacy)) {
      setCookie(LANGUAGE_COOKIE, legacy);
      return legacy;
    }
  } catch {}
  return 'ru';
}

let language = readLanguage();
let animateLanguageSwap = false;
const translatedTexts = new Map();

Object.entries(peopleTranslations).forEach(([code, translations]) => {
  const textMap = new Map();
  people.forEach((person, index) => {
    const translated = translations[index];
    if (!translated) return;
    textMap.set(person.name, translated.name || person.name);
    textMap.set(person.reason, translated.reason || person.reason);
  });
  translatedTexts.set(code, textMap);
});

function textLabel(key) {
  const labels = languageLabels[key];
  return labels?.[language] || labels?.en || labels?.ru || key;
}

function countLabel(count) {
  return `${count} ${textLabel('entryCount')}`;
}

function saveLanguage() {
  setCookie(LANGUAGE_COOKIE, language);
  try {
    localStorage.setItem('language', language);
  } catch {}
}

function translatedText(text) {
  if (language === 'ru') return text;
  return translatedTexts.get(language)?.get(text) || text;
}

function currentLanguageOption() {
  return siteLanguages.find(option => option.code === language) || siteLanguages[0];
}

function applyDocumentLanguage() {
  const option = currentLanguageOption();
  document.documentElement.lang = option.locale || option.code;
  document.documentElement.dir = option.dir || 'ltr';
}

function escapeHtml(text) {
  return String(text).replaceAll('&', '&amp;').replaceAll('<', '&lt;').replaceAll('>', '&gt;').replaceAll('"', '&quot;').replaceAll("'", '&#39;');
}

function plainText(text) {
  return text.split('').map(ch => {
    if (ch === ' ') return '<span class="entry-space"></span>';
    const rot = (Math.random() - 0.5) * 14;
    const tx = (Math.random() - 0.5) * 5;
    const ty = (Math.random() - 0.5) * 8;
    return `<span class="wobbly-letter" style="transform:rotate(${rot}deg) translate(${tx}px,${ty}px)">${escapeHtml(ch)}</span>`;
  }).join('');
}

function reducedMotion() {
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}

function clearTextSwitch(el) {
  el._textSwitchTimers?.forEach(timer => window.clearTimeout(timer));
  el._textSwitchTimers = null;
  el.classList.remove('text-switching', 'text-switch-out', 'text-switch-in');
  el.style.minHeight = '';
}

function animateTextSwitch(el, updateText) {
  clearTextSwitch(el);
  el.classList.add('text-switching', 'text-switch-out');
  el.style.minHeight = `${el.offsetHeight}px`;

  const enterTimer = window.setTimeout(() => {
    updateText();
    el.classList.remove('text-switch-out');
    el.classList.add('text-switch-in');
  }, 150);

  const finishTimer = window.setTimeout(() => {
    clearTextSwitch(el);
  }, 430);

  el._textSwitchTimers = [enterTimer, finishTimer];
}

function setNameText(el, text, mark = null, animated = false) {
  const currentText = el.dataset.text || el.textContent;
  clearTextSwitch(el);
  if (!animated || reducedMotion() || currentText === text) {
    el.innerHTML = plainText(text);
    if (mark) el.appendChild(mark);
    el.dataset.text = text;
    return;
  }

  el.dataset.text = text;
  animateTextSwitch(el, () => {
    el.innerHTML = plainText(text);
    if (mark) el.appendChild(mark);
  });
}

function setReasonText(el, text, animated = false) {
  const currentText = el.dataset.text || el.textContent;
  clearTextSwitch(el);
  if (!animated || reducedMotion() || currentText === text) {
    el.textContent = text;
    el.dataset.text = text;
    return;
  }

  el.dataset.text = text;
  animateTextSwitch(el, () => {
    el.textContent = text;
  });
}

function levelColor(level) {
  if (currentTheme() === 'dark') {
    const strength = level / 5;
    return `rgb(${Math.round(170 + 60 * strength)}, ${Math.round(84 - 38 * strength)}, ${Math.round(77 - 34 * strength)})`;
  }
  return `rgb(${Math.round((level / 5) * 255)}, 0, 0)`;
}

function hateColor(hate) {
  if (currentTheme() === 'dark') {
    if (hate >= 90) return '#f05b52';
    if (hate >= 70) return '#de6b62';
    if (hate >= 45) return '#cb7d75';
    return '#bd8b85';
  }
  if (hate >= 90) return '#b71c1c';
  if (hate >= 70) return '#8b1a1a';
  if (hate >= 45) return '#a24740';
  return '#a56c67';
}

function scoreSegmentColor(value) {
  const strength = value / 100;
  if (currentTheme() === 'dark') {
    const red = Math.round(188 + 48 * strength);
    const green = Math.round(113 - 60 * strength);
    const blue = Math.round(105 - 55 * strength);
    return `rgb(${red}, ${green}, ${blue})`;
  }
  const red = Math.round(150 + 33 * strength);
  const green = Math.round(120 - 92 * strength);
  const blue = Math.round(114 - 86 * strength);
  return `rgb(${red}, ${green}, ${blue})`;
}

function scoreSegmentOpacity(value) {
  return (0.5 + value / 200).toFixed(2);
}

function renderStars(level) {
  const value = Math.max(0, Math.min(5, Number(level)));
  const fullStars = Math.floor(value);
  const hasHalf = value - fullStars >= 0.5;
  const redColor = levelColor(value);
  return Array.from({length:5}, (_, i) => {
    if (i < fullStars) return `<span class="star rated on" style="color:${redColor}">★</span>`;
    if (i === fullStars && hasHalf) return `<span class="star rated half" style="--star-color:${redColor}">☆</span>`;
    return '<span class="star">☆</span>';
  }).join('');
}

function renderBar(hate) {
  const filled = Math.round(hate / 5);
  const col = hateColor(hate);
  return `<div class="hate-bar" aria-hidden="true">${
    Array.from({length:20}, (_,i) =>
      `<span class="hb${i < filled ? ' on' : ''}" style="${i < filled ? `--score-color:${scoreSegmentColor((i + 1) * 5)};--score-opacity:${scoreSegmentOpacity((i + 1) * 5)}` : ''}">/</span>`
    ).join('')
  }</div><div class="hate-num" style="color:${col}" aria-label="${textLabel('irritation')}: ${hate} / 100">${hate}<span class="hate-denom">/100</span></div>`;
}

function refreshThemeColors() {
  document.querySelectorAll('.entry').forEach(el => {
    const level = Number(el.dataset.level);
    if (!Number.isNaN(level)) {
      const color = levelColor(level);
      el.querySelector('.entry-level-mark')?.style.setProperty('color', color);
      el.querySelectorAll('.star.on').forEach(star => star.style.color = color);
      el.querySelector('.star.half')?.style.setProperty('--star-color', color);
    }

    const hate = Number(el.dataset.hate);
    if (!Number.isNaN(hate)) {
      const color = hateColor(hate);
      el.querySelector('.top-rank')?.style.setProperty('color', color);
      el.querySelector('.hate-num')?.style.setProperty('color', color);
      el.querySelectorAll('.hb.on').forEach((segment, i) => {
        segment.style.setProperty('--score-color', scoreSegmentColor((i + 1) * 5));
      });
    }
  });
}

function animateEntryIn(el, i) {
  el.classList.add('entry-in');
  el.style.animationDelay = `${i * 0.035}s`;
  const clear = event => {
    if (event.target !== el || event.animationName !== 'fadeUp') return;
    el.classList.remove('entry-in');
    el.style.animationDelay = '';
    el.removeEventListener('animationend', clear);
  };
  el.addEventListener('animationend', clear);
}

function moveEntries(container, entries, animated) {
  const canAnimate = animated && !window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const positions = canAnimate ? new Map(entries.map(el => [el, el.getBoundingClientRect()])) : null;

  entries.forEach(el => {
    el._sortAnimation?.cancel();
    el._sortAnimation = null;
    el.style.zIndex = '';
    container.appendChild(el);
  });

  if (!canAnimate) return;

  entries.forEach(el => {
    const first = positions.get(el);
    const last = el.getBoundingClientRect();
    const x = first.left - last.left;
    const y = first.top - last.top;
    const distance = Math.hypot(x, y);
    if (distance < 1) return;

    el.style.zIndex = y > 0 ? '2' : '1';
    const animation = el.animate([
      {transform:`translate(${x}px, ${y}px) scale(1)`},
      {transform:`translate(${x * 0.45}px, ${y * 0.45}px) scale(1.008)`, offset:0.52},
      {transform:'translate(0, 0) scale(1)'}
    ], {
      duration:Math.min(680, 320 + distance * 0.18),
      easing:'cubic-bezier(.2,.72,.18,1)'
    });
    el._sortAnimation = animation;
    const clear = () => {
      if (el._sortAnimation !== animation) return;
      el._sortAnimation = null;
      el.style.zIndex = '';
    };
    animation.addEventListener('finish', clear, {once:true});
    animation.addEventListener('cancel', clear, {once:true});
  });
}

function clearStarTransfer(el) {
  const transfer = el._starTransfer;
  if (!transfer) return;
  transfer.animations.forEach(animation => animation.cancel());
  transfer.traveler.remove();
  el.classList.remove('stars-flight');
  el._starTransfer = null;
}

function animateOpenLayout(container, entries, positions) {
  entries.forEach(el => {
    el._sortAnimation?.cancel();
    const first = positions.get(el);
    const last = el.getBoundingClientRect();
    const x = first.left - last.left;
    const y = first.top - last.top;
    if (Math.hypot(x, y) < 1) return;
    const animation = el.animate([
      {transform:`translate(${x}px, ${y}px)`},
      {transform:'translate(0, 0)'}
    ], {
      duration:400,
      easing:'cubic-bezier(.2,.72,.18,1)'
    });
    el._sortAnimation = animation;
    animation.addEventListener('finish', () => {
      if (el._sortAnimation === animation) el._sortAnimation = null;
    }, {once:true});
  });
}

function animateStarTransfer(el, start, starTargets) {
  const stars = [...el.querySelectorAll('.entry-stars .star')];
  const filled = stars.filter(star => star.classList.contains('rated'));
  if (!filled.length) return;

  const firstTarget = starTargets[0];
  const traveler = document.createElement('span');
  traveler.className = 'star-traveler';
  traveler.textContent = '★';
  traveler.style.color = levelColor(Number(el.dataset.level));
  const targetStyle = getComputedStyle(stars[0]);
  traveler.style.fontFamily = targetStyle.fontFamily;
  traveler.style.fontSize = targetStyle.fontSize;
  traveler.style.fontWeight = targetStyle.fontWeight;
  traveler.style.lineHeight = targetStyle.lineHeight;
  traveler.style.left = '0';
  traveler.style.top = '0';
  document.body.appendChild(traveler);

  const travelerRect = traveler.getBoundingClientRect();
  const startX = start.left + start.width / 2 - travelerRect.width / 2;
  const startY = start.top + start.height / 2 - travelerRect.height / 2;
  traveler.style.left = `${startX}px`;
  traveler.style.top = `${startY}px`;
  const x = firstTarget.left + firstTarget.width / 2 - start.left - start.width / 2;
  const y = firstTarget.top + firstTarget.height / 2 - start.top - start.height / 2;
  const startScale = Math.max(0.78, Math.min(1.18, start.height / travelerRect.height));
  const animations = [];
  const flight = traveler.animate([
    {opacity:1, transform:`translate(0, 0) scale(${startScale})`},
    {opacity:1, transform:`translate(${x * 0.55}px, ${y * 0.55}px) scale(1.04)`, offset:0.56},
    {opacity:1, transform:`translate(${x}px, ${y}px) scale(1)`, offset:0.9},
    {opacity:0, transform:`translate(${x}px, ${y}px) scale(1)`}
  ], {
    duration:400,
    easing:'cubic-bezier(.2,.72,.18,1)',
    fill:'forwards'
  });
  animations.push(flight);

  filled.forEach((star, i) => {
    const target = starTargets[i];
    const fromX = firstTarget.left + firstTarget.width / 2 - target.left - target.width / 2;
    const keyframes = i === 0 ? [
      {opacity:0, transform:'scale(.96)'},
      {opacity:0, transform:'scale(.96)', offset:0.93},
      {opacity:1, transform:'scale(1)'}
    ] : [
      {opacity:0, transform:`translateX(${fromX}px) scale(.88)`},
      {opacity:1, transform:'translateX(0) scale(1)'}
    ];
    const animation = star.animate(keyframes, {
      duration:i === 0 ? 420 : 270,
      delay:i === 0 ? 0 : 370 + (i - 1) * 38,
      easing:'cubic-bezier(.2,.72,.18,1)',
      fill:'both'
    });
    animations.push(animation);
  });

  stars.slice(filled.length).forEach((star, i) => {
    const animation = star.animate([
      {opacity:0, transform:'translateX(-5px) scale(.94)'},
      {opacity:1, transform:'translateX(0) scale(1)'}
    ], {
      duration:240,
      delay:405 + Math.max(0, filled.length - 1) * 38 + i * 24,
      easing:'cubic-bezier(.2,.72,.18,1)',
      fill:'both'
    });
    animations.push(animation);
  });

  const transfer = {traveler, animations};
  el._starTransfer = transfer;
  flight.finished.then(() => {
    if (el._starTransfer === transfer) traveler.remove();
  }).catch(() => null);
  Promise.all(animations.map(animation => animation.finished.catch(() => null))).then(() => {
    if (el._starTransfer !== transfer) return;
    el.classList.remove('stars-flight');
    animations.forEach(animation => animation.cancel());
    traveler.remove();
    el._starTransfer = null;
  });
}

function createEntryMain(p, i, showLevelMark) {
  const el = document.createElement('div');
  el.className = 'entry';
  el.classList.toggle('level-marks-visible', showLevelMark);
  el.dataset.level = p.level;
  el.dataset.name  = p.name;
  animateEntryIn(el, i);
  const mark = showLevelMark ? `<span class="entry-level-mark" style="color:${levelColor(p.level)}">★</span>` : '';

  el.innerHTML = `
    <div class="entry-name">${plainText(translatedText(p.name))}${mark}</div>
    <div class="entry-detail">
      <div class="entry-stars">${renderStars(p.level)}</div>
      <div class="entry-reason">${escapeHtml(translatedText(p.reason))}</div>
    </div>`;
  el.querySelector('.entry-name').dataset.text = translatedText(p.name);
  el.querySelector('.entry-reason').dataset.text = translatedText(p.reason);

  el.querySelector('.entry-name').addEventListener('click', () => {
    const was = el.classList.contains('open');
    const container = el.parentElement;
    const opened = [...container.querySelectorAll('.entry.open')];
    opened.forEach(clearStarTransfer);
    clearStarTransfer(el);
    if (was) {
      el.classList.remove('open');
      return;
    }

    const marker = el.querySelector('.entry-level-mark');
    const useTransfer = marker && el.classList.contains('level-marks-visible') && !window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (useTransfer) {
      const entries = [...container.querySelectorAll('.entry')];
      const positions = new Map(entries.map(entry => [entry, entry.getBoundingClientRect()]));
      const start = marker.getBoundingClientRect();
      container.classList.add('measure-details');
      opened.forEach(entry => entry.classList.remove('open'));
      el.classList.add('stars-flight');
      el.classList.add('open');
      void container.offsetHeight;
      const targets = [...el.querySelectorAll('.entry-stars .star')].map(star => star.getBoundingClientRect());
      container.classList.remove('measure-details');
      animateOpenLayout(container, entries, positions);
      animateStarTransfer(el, start, targets);
      return;
    }

    opened.forEach(entry => entry.classList.remove('open'));
    el.classList.add('open');
  });
  return el;
}

function createEntryTop(p, i, rank) {
  const el = document.createElement('div');
  el.className = 'entry top-entry';
  el.dataset.hate = p.hate;
  animateEntryIn(el, i);
  const col = hateColor(p.hate);
  el.innerHTML = `
    <div class="top-meta">
      <span class="top-rank" style="color:${col}">${String(rank).padStart(2,'0')}</span>
      <div class="entry-name">${plainText(translatedText(p.name))}</div>
    </div>
    <div class="top-bar-row">${renderBar(p.hate)}</div>
    <div class="entry-detail">
      <div class="entry-reason">${escapeHtml(translatedText(p.reason))}</div>
    </div>`;
  el.querySelector('.entry-name').dataset.text = translatedText(p.name);
  el.querySelector('.entry-reason').dataset.text = translatedText(p.reason);

  el.querySelector('.entry-name').addEventListener('click', () => {
    const was = el.classList.contains('open');
    el.parentElement.querySelectorAll('.entry.open').forEach(entry => entry.classList.remove('open'));
    if (!was) el.classList.add('open');
  });
  return el;
}

function updateMainEntryText(el, person) {
  clearStarTransfer(el);
  const name = el.querySelector('.entry-name');
  const mark = name.querySelector('.entry-level-mark');
  if (mark) mark.remove();
  setNameText(name, translatedText(person.name), mark, animateLanguageSwap);
  setReasonText(el.querySelector('.entry-reason'), translatedText(person.reason), animateLanguageSwap);
}

function updateTopEntryText(el, person) {
  setNameText(el.querySelector('.entry-name'), translatedText(person.name), null, animateLanguageSwap);
  setReasonText(el.querySelector('.entry-reason'), translatedText(person.reason), animateLanguageSwap);
  el.querySelector('.hate-num').setAttribute('aria-label', `${textLabel('irritation')}: ${person.hate} / 100`);
}

function mountLanguageButton(bar, refresh) {
  const menu = document.createElement('div');
  menu.className = 'language-menu';

  const button = document.createElement('button');
  button.className = 'language-btn';
  button.type = 'button';
  button.setAttribute('aria-haspopup', 'true');
  button.setAttribute('aria-expanded', 'false');
  let languageTextTimer = null;

  function makeLanguageLetters(text, className = '') {
    return text.split('').map((letter, i) => {
      const x = Math.round((Math.random() - 0.5) * 34);
      const y = Math.round(-12 - Math.random() * 18);
      const r = Math.round((Math.random() - 0.5) * 70);
      const span = document.createElement('span');
      span.className = `language-letter${className ? ` ${className}` : ''}`;
      span.textContent = letter;
      span.style.setProperty('--i', i);
      span.style.setProperty('--delay', `${i * 32}ms`);
      span.style.setProperty('--x', `${x}px`);
      span.style.setProperty('--y', `${y}px`);
      span.style.setProperty('--r', `${r}deg`);
      span.style.setProperty('--from-x', `${-x}px`);
      span.style.setProperty('--from-y', `${-y}px`);
      span.style.setProperty('--from-r', `${-r}deg`);
      return span;
    });
  }

  function setButtonText(nextText, animated = false) {
    const previousText = button.dataset.label || '';
    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (languageTextTimer) {
      window.clearTimeout(languageTextTimer);
      languageTextTimer = null;
    }
    if (!animated || reduceMotion || !previousText || previousText === nextText) {
      button.replaceChildren(...makeLanguageLetters(nextText));
      button.dataset.label = nextText;
      return;
    }

    button.querySelectorAll('.language-letter').forEach((letter, i) => {
      letter.style.setProperty('--i', i);
      letter.style.setProperty('--delay', `${i * 24}ms`);
      letter.style.setProperty('--x', `${Math.round((Math.random() - 0.5) * 42)}px`);
      letter.style.setProperty('--y', `${Math.round(-14 - Math.random() * 22)}px`);
      letter.style.setProperty('--r', `${Math.round((Math.random() - 0.5) * 100)}deg`);
      letter.classList.add('leaving');
    });

    languageTextTimer = window.setTimeout(() => {
      button.replaceChildren(...makeLanguageLetters(nextText, 'entering'));
      button.dataset.label = nextText;
      languageTextTimer = null;
    }, 190);
  }

  function sync(animated = false) {
    const option = currentLanguageOption();
    setButtonText(option.short, animated);
    button.classList.add('active');
    button.title = option.label;
    button.dataset.tooltip = button.title;
    button.setAttribute('aria-label', button.title);
    menu.querySelectorAll('.language-menu-option').forEach(option => {
      const active = option.dataset.language === language;
      option.classList.toggle('active', active);
      option.setAttribute('aria-pressed', String(active));
    });
  }

  function closeMenu() {
    bar.classList.remove('menu-open');
    button.setAttribute('aria-expanded', 'false');
  }

  function toggleMenu() {
    const open = bar.classList.toggle('menu-open');
    button.setAttribute('aria-expanded', String(open));
  }

  function selectLanguage(nextLanguage) {
    if (language === nextLanguage) {
      closeMenu();
      return;
    }

    language = nextLanguage;
    saveLanguage();
    animateLanguageSwap = true;
    refresh();
    animateLanguageSwap = false;
    sync(true);
    closeMenu();
  }

  siteLanguages.forEach(option => {
    const choice = document.createElement('button');
    choice.className = 'language-menu-option';
    choice.type = 'button';
    choice.dataset.language = option.code;
    choice.lang = option.locale || option.code;
    choice.dir = option.dir || 'ltr';
    choice.textContent = option.label;
    choice.addEventListener('click', () => selectLanguage(option.code));
    menu.appendChild(choice);
  });

  button.addEventListener('click', event => {
    event.stopPropagation();
    toggleMenu();
  });

  menu.addEventListener('click', event => {
    event.stopPropagation();
  });

  document.addEventListener('click', closeMenu);
  document.addEventListener('keydown', event => {
    if (event.key === 'Escape') closeMenu();
  });

  bar.appendChild(button);
  bar.appendChild(menu);
  refresh();
  sync();
  button.syncLanguage = sync;
  return button;
}

function mountLanguageGate(refresh, languageButton) {
  if (hasSavedLanguage()) {
    document.documentElement.classList.remove('language-pending');
    return;
  }

  const gate = document.createElement('div');
  gate.className = 'language-gate';
  gate.setAttribute('role', 'dialog');
  gate.setAttribute('aria-modal', 'true');
  gate.setAttribute('aria-label', 'Language');

  const panel = document.createElement('div');
  panel.className = 'language-gate-panel';

  const actions = document.createElement('div');
  actions.className = 'language-gate-actions';

  siteLanguages.forEach(option => {
    const choice = document.createElement('button');
    choice.className = 'language-choice';
    choice.type = 'button';
    choice.lang = option.locale || option.code;
    choice.dir = option.dir || 'ltr';
    choice.textContent = option.label;
    choice.addEventListener('click', () => {
      language = option.code;
      saveLanguage();
      animateLanguageSwap = true;
      refresh();
      animateLanguageSwap = false;
      languageButton?.syncLanguage?.(true);
      document.documentElement.classList.remove('language-pending');
      gate.classList.add('closing');
      window.setTimeout(() => gate.remove(), reducedMotion() ? 0 : 220);
    });
    actions.appendChild(choice);
  });

  panel.appendChild(actions);
  gate.appendChild(panel);
  document.body.appendChild(gate);
  actions.querySelector('button')?.focus();
}

const listEl = document.getElementById('list');
if (listEl) {
  document.getElementById('countline').textContent = countLabel(people.length);

  function shuffle(a) {
    const r = [...a];
    for (let i = r.length-1; i>0; i--) {
      const j = Math.floor(Math.random()*(i+1));
      [r[i],r[j]]=[r[j],r[i]];
    }
    return r;
  }

  let currentSort = 'random';
  let showLevelMarks = true;
  const entries = new Map(people.map((p,i) => [p, createEntryMain(p,i,showLevelMarks)]));
  
  function applySort(mode) {
    currentSort = mode;
    document.querySelectorAll('.sort-btn').forEach(b => b.classList.remove('active'));
    document.querySelector(`[data-sort="${mode}"]`)?.classList.add('active');
    
    let sorted;
    if      (mode==='random')    sorted = shuffle(people);
    else if (mode==='level')     sorted = [...people].sort((a,b)=>a.level-b.level);
    else if (mode==='level-rev') sorted = [...people].sort((a,b)=>b.level-a.level);
    else if (mode==='alpha')     sorted = [...people].sort((a,b)=>translatedText(a.name).localeCompare(translatedText(b.name),currentLanguageOption().locale || language));
    else if (mode==='alpha-rev') sorted = [...people].sort((a,b)=>translatedText(b.name).localeCompare(translatedText(a.name),currentLanguageOption().locale || language));
    else if (mode==='len')       sorted = [...people].sort((a,b)=>translatedText(a.name).length-translatedText(b.name).length);
    else if (mode==='len-asc')   sorted = [...people].sort((a,b)=>translatedText(b.name).length-translatedText(a.name).length);
    const ordered = sorted.map(p => entries.get(p));
    ordered.forEach(clearStarTransfer);
    if (!listEl.childElementCount) ordered.forEach((el,i) => el.style.animationDelay = `${i * 0.035}s`);
    moveEntries(listEl, ordered, listEl.childElementCount > 0);
  }

  function toggleLevelMarks() {
    listEl.querySelectorAll('.entry').forEach(el => {
      clearStarTransfer(el);
      el.classList.toggle('level-marks-visible', showLevelMarks);
      const mark = el.querySelector('.entry-level-mark');
      if (!showLevelMarks) {
        mark?.remove();
        return;
      }
      if (mark) return;
      const nextMark = document.createElement('span');
      nextMark.className = 'entry-level-mark entering';
      nextMark.style.color = levelColor(Number(el.dataset.level));
      nextMark.textContent = '★';
      nextMark.addEventListener('animationend', () => nextMark.classList.remove('entering'), {once:true});
      el.querySelector('.entry-name').appendChild(nextMark);
    });
  }

  const bar = document.getElementById('sort-bar');
  document.getElementById('shuffle-title').addEventListener('click',()=>applySort('random'));
  
  const btnStars = document.createElement('button');
  btnStars.className='sort-btn';
  btnStars.dataset.sort='level';
  btnStars.textContent='★↑';
  btnStars.title=textLabel('sortStarsAsc');
  btnStars.setAttribute('aria-label', textLabel('sortStarsAsc'));
  btnStars.addEventListener('click',()=>{
    const next = currentSort === 'level' ? 'level-rev' : 'level';
    btnStars.dataset.sort = next;
    btnStars.textContent = next === 'level' ? '★↑' : '★↓';
    btnStars.title = next === 'level' ? textLabel('sortStarsAsc') : textLabel('sortStarsDesc');
    btnStars.setAttribute('aria-label', btnStars.title);
    applySort(next);
  });
  bar.appendChild(btnStars);

  const btnColor = document.createElement('button');
  btnColor.className='display-btn active';
  btnColor.textContent='★';
  btnColor.title=textLabel('hideStars');
  btnColor.setAttribute('aria-label', textLabel('hideStars'));
  btnColor.addEventListener('click',()=>{
    showLevelMarks = !showLevelMarks;
    btnColor.classList.toggle('active', showLevelMarks);
    btnColor.textContent = showLevelMarks ? '★' : '☆';
    btnColor.title = showLevelMarks ? textLabel('hideStars') : textLabel('showStars');
    btnColor.setAttribute('aria-label', btnColor.title);
    toggleLevelMarks();
  });
  bar.appendChild(btnColor);
  
  const btnAlpha = document.createElement('button');
  btnAlpha.className='sort-btn'; 
  btnAlpha.dataset.sort='alpha';
  btnAlpha.textContent='A→Z';
  btnAlpha.addEventListener('click',()=>{
    const next = currentSort === 'alpha' ? 'alpha-rev' : 'alpha';
    btnAlpha.textContent = next === 'alpha' ? 'A→Z' : 'Z→A';
    applySort(next);
  });
  bar.appendChild(btnAlpha);
  
  const btnLen = document.createElement('button');
  btnLen.className='sort-btn'; 
  btnLen.dataset.sort='len';
  btnLen.textContent='LEN↓';
  btnLen.addEventListener('click',()=>{
    const next = currentSort === 'len' ? 'len-asc' : 'len';
    btnLen.textContent = next === 'len' ? 'LEN↓' : 'LEN↑';
    applySort(next);
  });
  bar.appendChild(btnLen);

  const btnTheme = document.createElement('button');
  btnTheme.className='theme-btn';
  const syncThemeButton = () => {
    const dark = currentTheme() === 'dark';
    btnTheme.textContent = dark ? '☀' : '☾';
    btnTheme.title = dark ? textLabel('lightTheme') : textLabel('darkTheme');
    btnTheme.setAttribute('aria-label', btnTheme.title);
  };
  syncThemeButton();
  btnTheme.addEventListener('click',()=>{
    document.querySelectorAll('.entry').forEach(clearStarTransfer);
    applyTheme(currentTheme() === 'dark' ? 'light' : 'dark');
    refreshThemeColors();
    syncThemeButton();
  });
  bar.appendChild(btnTheme);

  function refreshListLanguage() {
    applyDocumentLanguage();
    document.title = textLabel('listDocumentTitle');
    document.querySelector('.nav-link-top').textContent = textLabel('topLink');
    document.getElementById('shuffle-title').textContent = textLabel('listTitle');
    document.getElementById('countline').textContent = countLabel(people.length);
    btnStars.title = currentSort === 'level-rev' ? textLabel('sortStarsDesc') : textLabel('sortStarsAsc');
    btnStars.setAttribute('aria-label', btnStars.title);
    btnColor.title = showLevelMarks ? textLabel('hideStars') : textLabel('showStars');
    btnColor.setAttribute('aria-label', btnColor.title);
    syncThemeButton();
    const visible = [...listEl.children];
    const positions = new Map(visible.map(el => [el, el.getBoundingClientRect()]));
    entries.forEach((el, person) => updateMainEntryText(el, person));
    if (currentSort === 'alpha' || currentSort === 'alpha-rev' || currentSort === 'len' || currentSort === 'len-asc') {
      applySort(currentSort);
      return;
    }
    if (visible.length) animateOpenLayout(listEl, visible, positions);
  }

  applySort('random');
  const languageButton = mountLanguageButton(document.getElementById('language-bar'), refreshListLanguage);
  mountLanguageGate(refreshListLanguage, languageButton);
}

const topEl = document.getElementById('top-list');
if (topEl) {
  const entries = new Map(people.map((p,i) => [p, createEntryTop(p,i,i+1)]));
  let currentDirection = 'desc';

  function renderTop(dir) {
    currentDirection = dir;
    document.querySelectorAll('.sort-btn').forEach(b => b.classList.toggle('active', b.dataset.sort===dir));
    const sorted = [...people].sort((a,b)=> dir==='desc' ? b.hate-a.hate : a.hate-b.hate);
    document.getElementById('countline').textContent = countLabel(sorted.length);
    const ordered = sorted.map((p,i) => {
      const el = entries.get(p);
      el.querySelector('.top-rank').textContent = String(i + 1).padStart(2,'0');
      return el;
    });
    if (!topEl.childElementCount) ordered.forEach((el,i) => el.style.animationDelay = `${i * 0.035}s`);
    moveEntries(topEl, ordered, topEl.childElementCount > 0);
  }
  const bar = document.getElementById('sort-bar');
  const directionBtn = document.createElement('button');
  directionBtn.className='sort-btn top-direction-btn';
  directionBtn.dataset.sort='desc';
  directionBtn.textContent='↓';
  directionBtn.title=textLabel('topSort');
  directionBtn.setAttribute('aria-label', textLabel('topSort'));
  directionBtn.addEventListener('click',()=>{
    const next = directionBtn.dataset.sort === 'desc' ? 'asc' : 'desc';
    directionBtn.dataset.sort = next;
    directionBtn.textContent = next === 'desc' ? '↓' : '↑';
    renderTop(next);
  });
  bar.appendChild(directionBtn);

  function refreshTopLanguage() {
    applyDocumentLanguage();
    document.title = textLabel('topDocumentTitle');
    document.querySelector('.nav-link-top').textContent = textLabel('backLink');
    document.querySelector('.site-title').textContent = textLabel('topTitle');
    document.querySelector('.top-note').textContent = textLabel('topNote');
    document.getElementById('countline').textContent = countLabel(people.length);
    directionBtn.title = textLabel('topSort');
    directionBtn.setAttribute('aria-label', directionBtn.title);
    const visible = [...topEl.children];
    const positions = new Map(visible.map(el => [el, el.getBoundingClientRect()]));
    entries.forEach((el, person) => updateTopEntryText(el, person));
    if (visible.length) animateOpenLayout(topEl, visible, positions);
  }

  renderTop('desc');
  const languageButton = mountLanguageButton(document.getElementById('language-bar'), refreshTopLanguage);
  mountLanguageGate(refreshTopLanguage, languageButton);
}
