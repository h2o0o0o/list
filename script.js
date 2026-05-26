function plainText(text) {
  return text.split('').map(ch => {
    if (ch === ' ') return '<span class="entry-space"></span>';
    const rot = (Math.random() - 0.5) * 14;
    const tx = (Math.random() - 0.5) * 5;
    const ty = (Math.random() - 0.5) * 8;
    return `<span class="wobbly-letter" style="transform:rotate(${rot}deg) translate(${tx}px,${ty}px)">${ch}</span>`;
  }).join('');
}

function levelColor(level) {
  return `rgb(${Math.round((level / 5) * 255)}, 0, 0)`;
}

function scoreSegmentColor(value) {
  const strength = value / 100;
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
  return `<div class="hate-bar" aria-hidden="true">${
    Array.from({length:20}, (_,i) =>
      `<span class="hb${i < filled ? ' on' : ''}" style="${i < filled ? `--score-color:${scoreSegmentColor((i + 1) * 5)};--score-opacity:${scoreSegmentOpacity((i + 1) * 5)}` : ''}">/</span>`
    ).join('')
  }</div><div class="hate-num" aria-label="Насколько меня бесит: ${hate} из 100">${hate}<span class="hate-denom">/100</span></div>`;
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
    <div class="entry-name">${plainText(p.name)}${mark}</div>
    <div class="entry-detail">
      <div class="entry-stars">${renderStars(p.level)}</div>
      <div class="entry-reason">${p.reason}</div>
    </div>`;

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
  el.innerHTML = `
    <div class="top-meta">
      <span class="top-rank">${String(rank).padStart(2,'0')}</span>
      <div class="entry-name">${plainText(p.name)}</div>
    </div>
    <div class="top-bar-row">${renderBar(p.hate)}</div>
    <div class="entry-detail">
      <div class="entry-reason">${p.reason}</div>
    </div>`;

  el.querySelector('.entry-name').addEventListener('click', () => {
    const was = el.classList.contains('open');
    el.parentElement.querySelectorAll('.entry.open').forEach(entry => entry.classList.remove('open'));
    if (!was) el.classList.add('open');
  });
  return el;
}

const listEl = document.getElementById('list');
if (listEl) {
  document.getElementById('countline').textContent = people.length + ' гнид';

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
    else if (mode==='alpha')     sorted = [...people].sort((a,b)=>a.name.localeCompare(b.name,'ru'));
    else if (mode==='alpha-rev') sorted = [...people].sort((a,b)=>b.name.localeCompare(a.name,'ru'));
    else if (mode==='len')       sorted = [...people].sort((a,b)=>a.name.length-b.name.length);
    else if (mode==='len-asc')   sorted = [...people].sort((a,b)=>b.name.length-a.name.length);
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
  btnStars.title='Сортировать по звёздам';
  btnStars.setAttribute('aria-label', 'Сортировать по звёздам: от меньшего к большему');
  btnStars.addEventListener('click',()=>{
    const next = currentSort === 'level' ? 'level-rev' : 'level';
    btnStars.dataset.sort = next;
    btnStars.textContent = next === 'level' ? '★↑' : '★↓';
    btnStars.setAttribute('aria-label', next === 'level' ? 'Сортировать по звёздам: от меньшего к большему' : 'Сортировать по звёздам: от большего к меньшему');
    applySort(next);
  });
  bar.appendChild(btnStars);

  const btnColor = document.createElement('button');
  btnColor.className='display-btn active';
  btnColor.textContent='★';
  btnColor.title='Скрыть звёздочки рядом с именами';
  btnColor.setAttribute('aria-label', 'Скрыть звёздочки рядом с именами');
  btnColor.addEventListener('click',()=>{
    showLevelMarks = !showLevelMarks;
    btnColor.classList.toggle('active', showLevelMarks);
    btnColor.textContent = showLevelMarks ? '★' : '☆';
    btnColor.title = showLevelMarks ? 'Скрыть звёздочки рядом с именами' : 'Показать звёздочки рядом с именами';
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
  
  applySort('random');
}

const topEl = document.getElementById('top-list');
if (topEl) {
  const entries = new Map(people.map((p,i) => [p, createEntryTop(p,i,i+1)]));

  function renderTop(dir) {
    document.querySelectorAll('.sort-btn').forEach(b => b.classList.toggle('active', b.dataset.sort===dir));
    const sorted = [...people].sort((a,b)=> dir==='desc' ? b.hate-a.hate : a.hate-b.hate);
    document.getElementById('countline').textContent = sorted.length + ' гнид';
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
  directionBtn.className='sort-btn';
  directionBtn.dataset.sort='desc';
  directionBtn.textContent='↓';
  directionBtn.addEventListener('click',()=>{
    const next = directionBtn.dataset.sort === 'desc' ? 'asc' : 'desc';
    directionBtn.dataset.sort = next;
    directionBtn.textContent = next === 'desc' ? '↓' : '↑';
    renderTop(next);
  });
  bar.appendChild(directionBtn);
  renderTop('desc');
}
