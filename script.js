let currentLang = 'es';
const T = () => I18N[currentLang];
const WA_BASE = `https://wa.me/${WHATSAPP_NUMBER}`;
const waLink = text => `${WA_BASE}?text=${encodeURIComponent(text)}`;

// Brochures: pegar acá el link de Google Drive de cada uno (vacío = "disponible pronto").
const projects = [
  { name: 'Ulises I',   address: 'Ayacucho 3230',  area: 'La Perla', image: './ulises-1.webp', imageAlt: 'Render de la fachada de Ulises I',   brochure: 'https://drive.google.com/file/d/1R0ULkyhZIZ_J8sSDA87HNadlv-AkWVwu/view', soon: false },
  { name: 'Ulises II',  address: 'Salta 714',      area: 'La Perla', image: './ulises-2.webp', imageAlt: 'Render de la fachada de Ulises II',  brochure: 'https://drive.google.com/file/d/16AvU-sjidWsPaB0AvP2pYNmXaNJPGawL/view', soon: false },
  { name: 'Ulises III', address: 'España 1041',    area: 'La Perla', image: './ulises-3.webp', imageAlt: 'Render de la fachada de Ulises III', brochure: 'https://drive.google.com/file/d/1vK_0-EP9VOKW34vcC0ZmXYmcmtJr04Dr/view', soon: false },
  { name: 'Ulises IV',  address: 'Entre Ríos 2641', area: 'Chauvin', image: './ulises-4.webp', imageAlt: 'Render de la fachada de Ulises IV',  brochure: 'https://drive.google.com/file/d/1Yri5knhGsn-CULjtU7SYT-980JMXwAtZ/view', soon: true },
];
projects.forEach(p => { p.location = `${p.address} · Mar del Plata`; });
const projectDescription = i => T().dev.projects[i];

// Dibujos a lápiz de cada valor (en el orden de la lista).
const SKETCH_FILES = ['valor-transparencia', 'valor-compromiso', 'valor-cercania', 'valor-calidad', 'valor-respaldo'];
const SKETCHES = SKETCH_FILES.map(f => `<img src="./${f}.webp" alt="" loading="lazy" draggable="false" />`);
SKETCH_FILES.forEach(f => { const i = new Image(); i.src = `./${f}.webp`; });

const delivered = [
  { name: 'Lipari Libertad', photos: ['libertad-1.webp', 'libertad-2.webp', 'libertad-3.webp'] },
  { name: 'Lipari La Rioja', photos: ['rioja-1.webp', 'rioja-2.webp', 'rioja-3.webp'] },
  { name: 'Lipari Perla', photos: ['perla-1.webp', 'perla-2.webp', 'perla-3.webp'] },
  { name: 'KIRON', photos: [] },
];

const values = I18N.es.about.values.map((v, i) => ({ index: i }));

const deliveredContainer = document.querySelector('#delivered-tracks');
const valuesContainer = document.querySelector('#values-list');
const dialog = document.querySelector('#project-dialog');

const dialogBrochure = document.querySelector('#dialog-brochure');
const dialogWa = document.querySelector('#dialog-wa');
let dialogProject = null;
function openProjectDialog(project) {
  dialogProject = project;
  const i = projects.indexOf(project);
  document.querySelector('.dialog-image').hidden = false;
  document.querySelector('#dialog-img').src = project.image;
  document.querySelector('#dialog-img').alt = project.imageAlt;
  document.querySelector('#dialog-status').textContent = project.soon ? `${T().dev.status} · ${T().dev.soon}` : T().dev.status;
  document.querySelector('#dialog-title').textContent = project.name;
  document.querySelector('#dialog-address').textContent = `${project.address} · ${project.area} · Mar del Plata`;
  document.querySelector('#dialog-description').textContent = projectDescription(i);
  dialogBrochure.href = project.brochure || '#';
  dialogBrochure.classList.toggle('is-pending', !project.brochure);
  dialogWa.href = waLink(`${T().contact.waProject} ${project.name}.`);
  dialog.showModal();
}
dialogBrochure.addEventListener('click', event => {
  if (!dialogProject || dialogProject.brochure) return;
  event.preventDefault();
  showToast(T().dialog.noBrochure);
});

// 01 — Rueda de desarrollos: la sección queda fija y al bajar la rueda gira; el activo queda al frente.
const dev = document.querySelector('.dev');
const devSticky = dev.querySelector('.dev__sticky');
const devWheel = dev.querySelector('.dev__wheel');
const devDefs = document.querySelector('#dev-defs');
const devWedgesGroup = document.querySelector('#dev-wedges');
const devIndex = document.querySelector('#dev-index');
const devName = document.querySelector('#projects-title');
const devDesc = document.querySelector('#dev-desc');
const devLocation = document.querySelector('#dev-location');
const devCenter = dev.querySelector('.dev__center');
const SVGNS = 'http://www.w3.org/2000/svg';
dev.style.setProperty('--dev-count', projects.length);

// El aro repite la lista para que siempre haya obras alrededor (loop sin huecos).
const DEV_RING = projects.length < 6 ? projects.concat(projects) : projects;
const devShadowGroup = document.createElementNS(SVGNS, 'g');
devShadowGroup.setAttribute('filter', 'url(#dev-shadow)');
const shadowFilter = document.createElementNS(SVGNS, 'filter');
shadowFilter.id = 'dev-shadow';
shadowFilter.setAttribute('x', '-20%'); shadowFilter.setAttribute('y', '-20%');
shadowFilter.setAttribute('width', '140%'); shadowFilter.setAttribute('height', '140%');
const shadowBlur = document.createElementNS(SVGNS, 'feGaussianBlur');
shadowBlur.setAttribute('stdDeviation', '18');
shadowFilter.append(shadowBlur);
devDefs.append(shadowFilter);
devWedgesGroup.append(devShadowGroup);

const devWedges = DEV_RING.map((project, i) => {
  const clip = document.createElementNS(SVGNS, 'clipPath');
  clip.id = `dev-clip-${i}`;
  const clipPath = document.createElementNS(SVGNS, 'path');
  clip.append(clipPath);
  devDefs.append(clip);
  const shadow = document.createElementNS(SVGNS, 'path');
  shadow.setAttribute('fill', 'rgba(30,38,45,.55)');
  devShadowGroup.append(shadow);
  const wrap = document.createElementNS(SVGNS, 'g');
  const g = document.createElementNS(SVGNS, 'g');
  g.setAttribute('clip-path', `url(#dev-clip-${i})`);
  const img = document.createElementNS(SVGNS, 'image');
  img.setAttribute('href', project.image);
  img.setAttribute('preserveAspectRatio', 'xMidYMid slice');
  const veil = document.createElementNS(SVGNS, 'path');
  veil.setAttribute('fill', '#f8f7f4');
  g.append(img, veil);
  const edge = document.createElementNS(SVGNS, 'path');
  edge.setAttribute('fill', 'none');
  edge.setAttribute('stroke', '#f8f7f4');
  edge.setAttribute('stroke-width', '10');
  edge.setAttribute('stroke-linejoin', 'round');
  wrap.append(g, edge);
  devWedgesGroup.append(wrap);
  wrap.style.cursor = 'pointer';
  wrap.addEventListener('click', () => openProjectDialog(project));
  return { wrap, clipPath, img, veil, edge, shadow, k: 0 };
});

const devClamp = v => Math.max(0, Math.min(1, v));
const devSmooth = t => t * t * (3 - 2 * t);
const devEase = t => (t < .5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2);
const polar = (cx, cy, r, a) => [cx + r * Math.cos(a), cy + r * Math.sin(a)];

function wedgePath(cx, cy, r1, r2, a0, a1) {
  const [x1, y1] = polar(cx, cy, r2, a0);
  const [x2, y2] = polar(cx, cy, r2, a1);
  const [x3, y3] = polar(cx, cy, r1, a1);
  const [x4, y4] = polar(cx, cy, r1, a0);
  return `M ${x1} ${y1} A ${r2} ${r2} 0 0 1 ${x2} ${y2} L ${x3} ${y3} A ${r1} ${r1} 0 0 0 ${x4} ${y4} Z`;
}

let devActive = -1;
function setDevActive(i, force = false) {
  if (i === devActive && !force) return;
  const first = devActive === -1;
  devActive = i;
  const project = projects[i];
  devName.textContent = project.name;
  devDesc.textContent = projectDescription(i);
  devLocation.textContent = project.location;
  document.querySelector('#dev-badge').textContent = project.soon ? T().dev.soon : '';
  if (!first) [devName, devLocation, devDesc].forEach((el, n) => el.animate([{ opacity: 0, transform: 'translateY(16px)' }, { opacity: 1, transform: 'none' }], { duration: 900, delay: n * 60, easing: 'cubic-bezier(.16,1,.3,1)', fill: 'backwards' }));
}

let devF = 0;
let devAnim = null;
function renderDev() {
  const W = devSticky.clientWidth;
  const H = devSticky.clientHeight;
  const mobile = W <= 720;
  const n = projects.length;
  const f = devF;

  const N = DEV_RING.length;
  const step = (Math.PI * 2) / N;
  let cx, cy, r2, r1, baseAngle;
  if (mobile) {
    cx = W / 2; cy = H * .76; r2 = Math.min(W * .55, H * .27); r1 = r2 * .46; baseAngle = -Math.PI / 2;
  } else {
    // Aro centrado y proporcionado: el disco con el texto al medio, el activo al frente (derecha).
    cx = W * .5; cy = H / 2 + 34;
    r2 = Math.min(H * .6, W * .36);
    r1 = r2 * .5;
    baseAngle = 0;
  }
  devWheel.setAttribute('viewBox', `0 0 ${W} ${H}`);
  dev.style.setProperty('--cx', `${cx}px`);
  dev.style.setProperty('--cy', `${cy}px`);
  dev.style.setProperty('--r1', `${r1}px`);

  devWedges.forEach((w, i) => {
    let offset = ((i - f) % N + N) % N;
    if (offset >= N / 2) offset -= N;
    const k = Math.min(Math.abs(offset), N / 2);
    w.k = k;
    const near = Math.max(0, 1 - k);
    // Profundidad: el activo sale hacia afuera; los demás se hunden, se aclaran y se vuelven transparentes.
    const outer = r2 * (1 + near * .07 - Math.min(k, 3) * .06);
    const inner = r1 + (r2 - r1) * (.04 + Math.min(k, 3) * .05) - near * r1 * .02;
    const mid = baseAngle + offset * step;
    const d = wedgePath(cx, cy, inner, outer, mid - step / 2, mid + step / 2);
    w.clipPath.setAttribute('d', d);
    w.veil.setAttribute('d', d);
    w.edge.setAttribute('d', d);
    const [sx, sy] = polar(cx, cy, 16, mid);
    w.shadow.setAttribute('d', wedgePath(cx + (sx - cx), cy + (sy - cy) + 14, inner, outer, mid - step / 2, mid + step / 2));
    w.shadow.style.opacity = String(near * .9);
    const rm = inner + (outer - inner) * .55;
    const [mx, my] = polar(cx, cy, rm, mid);
    const size = Math.max(outer - inner, 2 * outer * Math.sin(step / 2)) * 1.15;
    w.img.setAttribute('x', mx - size / 2);
    w.img.setAttribute('y', my - size / 2);
    w.img.setAttribute('width', size);
    w.img.setAttribute('height', size);
    w.veil.style.opacity = String(Math.min(.62, k * .2));
    w.wrap.style.opacity = String(Math.max(.14, 1 - k * .24));
  });
  // Los más cercanos se dibujan encima.
  [...devWedges].sort((a, b) => b.k - a.k).forEach(w => devWedgesGroup.append(w.wrap));
  setDevActive(((Math.round(f) % n) + n) % n);
  renderDevControls(cx, cy, r1, baseAngle);
}
window.addEventListener('resize', renderDev);

// Botones curvos dentro del aro: giran la rueda un lugar, sin fin.
const devControls = document.querySelector('.dev__controls');
const devBtns = [...devControls.querySelectorAll('.dev__btn')];
function renderDevControls(cx, cy, r1, baseAngle) {
  devControls.setAttribute('viewBox', `0 0 ${devSticky.clientWidth} ${devSticky.clientHeight}`);
  // Aro blanco continuo alrededor del disco; en cada botón el aro se ensancha y lo abraza (una sola pieza).
  const disk = r1 - 8;
  const ringW = Math.max(12, r1 * .055);
  const size = Math.max(19, Math.min(27, r1 * .09));
  const deg = Math.PI / 180;
  const ring = devControls.querySelector('.dev__rim-ring');
  ring.setAttribute('cx', cx); ring.setAttribute('cy', cy);
  ring.setAttribute('r', disk + ringW / 2 - 1);
  ring.setAttribute('stroke-width', ringW);
  devBtns.forEach(btn => {
    const dir = Number(btn.dataset.dir);
    const ang = baseAngle + dir * 38 * deg;
    const [bx, by] = polar(cx, cy, disk + ringW * .35, ang);
    const lobe = devControls.querySelector(`.dev__rim-lobe[data-dir="${dir}"]`);
    lobe.setAttribute('cx', bx); lobe.setAttribute('cy', by); lobe.setAttribute('r', size + ringW * .62);
    const circle = btn.querySelector('.dev__btn-shape');
    circle.setAttribute('cx', bx); circle.setAttribute('cy', by); circle.setAttribute('r', size);
    const inset = btn.querySelector('.dev__btn-inset');
    inset.setAttribute('cx', bx); inset.setAttribute('cy', by); inset.setAttribute('r', size);
    const k = size / 26;
    // La flecha sigue la tangente de la rueda en la posición de cada botón (el sentido en que gira).
    btn.querySelector('.dev__btn-icon').setAttribute('transform', `translate(${bx} ${by}) rotate(${ang / deg}) scale(${k * 1.75}) translate(-5 0)`);
  });
}
function spinDev(dir) {
  cancelAnimationFrame(devAnim);
  const from = devF;
  const to = Math.round(devF) + dir;
  const start = performance.now();
  const duration = 1100;
  const step = now => {
    const t = Math.min(1, (now - start) / duration);
    devF = from + (to - from) * devEase(t);
    renderDev();
    if (t < 1) devAnim = requestAnimationFrame(step);
  };
  devAnim = requestAnimationFrame(step);
}
devBtns.forEach(btn => {
  const dir = Number(btn.dataset.dir);
  btn.addEventListener('click', () => spinDev(dir));
  btn.addEventListener('keydown', event => { if (event.key === 'Enter' || event.key === ' ') { event.preventDefault(); spinDev(dir); } });
});
dev.addEventListener('keydown', event => {
  if (event.key === 'ArrowUp' && dev.contains(document.activeElement)) { event.preventDefault(); spinDev(-1); }
  if (event.key === 'ArrowDown' && dev.contains(document.activeElement)) { event.preventDefault(); spinDev(1); }
});
// En pantallas táctiles también se puede deslizar sobre la rueda.
let devTouchY = null;
devSticky.addEventListener('touchstart', event => { devTouchY = event.touches[0].clientX; }, { passive: true });
devSticky.addEventListener('touchend', event => {
  if (devTouchY === null) return;
  const dx = event.changedTouches[0].clientX - devTouchY;
  if (Math.abs(dx) > 45) spinDev(dx < 0 ? 1 : -1);
  devTouchY = null;
}, { passive: true });
renderDev();

// Las obras entregadas tienen una entrada horizontal que se expande desde el círculo.
const gallery = document.querySelector('#delivered-gallery');
const gallerySurface = gallery.querySelector('.delivered-gallery__surface');
const galleryPhoto = document.querySelector('#gallery-photo');
const galleryEmpty = document.querySelector('#gallery-empty');
const galleryTitle = document.querySelector('#gallery-title');
const galleryCount = document.querySelector('#gallery-count');
const galleryPrev = document.querySelector('#gallery-prev');
const galleryNext = document.querySelector('#gallery-next');
const galleryReturn = document.querySelector('#gallery-return');
let activeDelivered = null;
let activePhotoIndex = 0;
let activeTrackReset = null;
let activeOpener = null;
let galleryClosing = false;
let bodyOverflowBeforeGallery = '';

function galleryImagePath(fileName) {
  return `./${fileName}`;
}

function renderGalleryPhoto() {
  const photos = activeDelivered.photos;
  const hasPhotos = photos.length > 0;
  galleryPhoto.hidden = !hasPhotos;
  galleryEmpty.hidden = hasPhotos;
  galleryPrev.hidden = photos.length < 2;
  galleryNext.hidden = photos.length < 2;
  galleryCount.textContent = hasPhotos ? `${String(activePhotoIndex + 1).padStart(2, '0')} / ${String(photos.length).padStart(2, '0')}` : T().obras.pending;
  if (hasPhotos) {
    galleryPhoto.src = galleryImagePath(photos[activePhotoIndex]);
    galleryPhoto.alt = `${T().gallery.photo} ${activePhotoIndex + 1} · ${activeDelivered.name}`;
    galleryPhoto.animate([{ opacity: 0.35, transform: 'scale(1.025)' }, { opacity: 1, transform: 'scale(1)' }], { duration: 330, easing: 'ease-out' });
  } else {
    galleryPhoto.removeAttribute('src');
    galleryPhoto.alt = '';
  }
}

function openDeliveredGallery(project, opener, resetTrack) {
  if (gallery.open) return;
  activeDelivered = project;
  activePhotoIndex = 0;
  activeTrackReset = resetTrack;
  activeOpener = opener;
  galleryClosing = false;
  const box = opener.getBoundingClientRect();
  gallery.style.setProperty('--origin-x', `${box.left + box.width / 2}px`);
  gallery.style.setProperty('--origin-y', `${box.top + box.height / 2}px`);
  galleryTitle.textContent = project.name;
  renderGalleryPhoto();
  bodyOverflowBeforeGallery = document.body.style.overflow;
  document.body.style.overflow = 'hidden';
  gallery.showModal();
  requestAnimationFrame(() => requestAnimationFrame(() => gallery.classList.add('is-open')));
  setTimeout(() => galleryReturn.focus(), 500);
}

function finishGalleryClose() {
  if (!gallery.open) return;
  gallery.close();
  gallery.classList.remove('is-open');
  document.body.style.overflow = bodyOverflowBeforeGallery;
  if (activeTrackReset) activeTrackReset();
  if (activeOpener) activeOpener.focus({ preventScroll: true });
  activeDelivered = null;
  activeTrackReset = null;
  activeOpener = null;
  galleryClosing = false;
}

function closeDeliveredGallery() {
  if (!gallery.open || galleryClosing) return;
  galleryClosing = true;
  gallery.classList.remove('is-open');
  const onEnd = event => { if (event.target === gallerySurface && event.propertyName === 'clip-path') finishGalleryClose(); };
  gallerySurface.addEventListener('transitionend', onEnd, { once: true });
  setTimeout(finishGalleryClose, 760);
}

gallery.addEventListener('cancel', event => { event.preventDefault(); closeDeliveredGallery(); });
galleryPrev.addEventListener('click', () => { activePhotoIndex = (activePhotoIndex - 1 + activeDelivered.photos.length) % activeDelivered.photos.length; renderGalleryPhoto(); });
galleryNext.addEventListener('click', () => { activePhotoIndex = (activePhotoIndex + 1) % activeDelivered.photos.length; renderGalleryPhoto(); });
gallery.addEventListener('keydown', event => {
  if (!activeDelivered || activeDelivered.photos.length < 2) return;
  if (event.key === 'ArrowLeft') galleryPrev.click();
  if (event.key === 'ArrowRight') galleryNext.click();
});

// Volver: se arrastra el círculo hacia la izquierda (o flecha izquierda / Escape).
const galleryReturnHandle = galleryReturn.querySelector('.gl-return__handle');
let returnStartX = null;
let returnProgress = 0;
const returnTravel = () => Math.max(1, galleryReturn.clientWidth - galleryReturnHandle.offsetWidth - 10);
const setReturn = value => {
  returnProgress = Math.max(0, Math.min(1, value));
  galleryReturn.style.setProperty('--rx', `${-returnProgress * returnTravel()}px`);
  galleryReturn.classList.toggle('is-armed', returnProgress > .85);
  galleryReturn.querySelector('.gl-return__label').style.opacity = String(1 - returnProgress * 1.6);
};
galleryReturnHandle.addEventListener('pointerdown', event => {
  event.preventDefault();
  returnStartX = event.clientX;
  galleryReturnHandle.setPointerCapture(event.pointerId);
  galleryReturn.classList.add('is-dragging');
});
galleryReturnHandle.addEventListener('pointermove', event => {
  if (returnStartX === null) return;
  setReturn((returnStartX - event.clientX) / returnTravel());
});
const endReturn = () => {
  if (returnStartX === null) return;
  returnStartX = null;
  galleryReturn.classList.remove('is-dragging');
  if (returnProgress > .85) { setReturn(1); closeDeliveredGallery(); setTimeout(() => setReturn(0), 1100); }
  else setReturn(0);
};
galleryReturnHandle.addEventListener('pointerup', endReturn);
galleryReturnHandle.addEventListener('pointercancel', endReturn);
galleryReturn.addEventListener('keydown', event => {
  if (event.key === 'ArrowLeft') { event.preventDefault(); setReturn(1); closeDeliveredGallery(); setTimeout(() => setReturn(0), 1100); }
});

// Obras entregadas: solo se abren deslizando el círculo. Desde la mitad del recorrido la franja crece, sutil.
const obClamp = value => Math.max(0, Math.min(1, value));
const obEase = t => (t < .5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2);
delivered.forEach((project, index) => {
  const track = document.createElement('div');
  track.className = `ob-track${project.photos.length ? '' : ' ob-track--pending'}`;
  track.tabIndex = 0;
  track.setAttribute('role', 'group');
  track.setAttribute('aria-label', `${project.name}. Deslizá el círculo hacia la derecha, o usá la flecha derecha, para abrir la galería.`);
  const first = project.photos[0];
  track.innerHTML = `${first ? `<img class="ob-track__img" src="${galleryImagePath(first)}" alt="" loading="lazy" draggable="false" />` : ''}<span class="ob-track__shade"></span><span class="ob-track__copy"><small data-track-label="${first ? 'delivered' : 'pending'}" data-index="0${index + 1}">0${index + 1} · ${first ? T().obras.delivered : T().obras.pending}</small><strong>${project.name}</strong></span><span class="ob-track__end" data-track-slide>${T().obras.slide}</span><span class="ob-track__ghost" aria-hidden="true"></span><span class="ob-track__handle" aria-hidden="true"><svg viewBox="0 0 20 20" fill="none" stroke="currentColor" stroke-width="1.1"><path d="M3 10h14M12 5l5 5-5 5"/></svg></span>`;
  const handle = track.querySelector('.ob-track__handle');
  let progress = 0;
  let startX = null;
  let from = 0;
  const travel = () => Math.max(1, track.clientWidth - handle.offsetWidth - 14);
  const set = value => {
    progress = obClamp(value);
    track.style.setProperty('--h', `${handle.offsetWidth}px`);
    track.style.setProperty('--travel', `${travel()}px`);
    track.classList.toggle('is-touched', progress > .01);
    track.style.setProperty('--x', `${progress * travel()}px`);
    track.style.setProperty('--p', progress.toFixed(4));
    track.style.setProperty('--g', obEase(obClamp((progress - .5) / .5)).toFixed(4));
    track.classList.toggle('is-armed', progress > .88);
  };
  const reset = () => set(0);
  const release = () => {
    track.classList.remove('is-dragging');
    if (progress > .88) { set(1); setTimeout(() => openDeliveredGallery(project, handle, reset), 180); }
    else set(0);
  };
  handle.addEventListener('pointerdown', event => {
    event.preventDefault();
    startX = event.clientX;
    from = progress;
    handle.setPointerCapture(event.pointerId);
    track.classList.add('is-dragging');
  });
  handle.addEventListener('pointermove', event => {
    if (startX === null) return;
    set(from + (event.clientX - startX) / travel());
  });
  const up = () => { if (startX === null) return; startX = null; release(); };
  handle.addEventListener('pointerup', up);
  handle.addEventListener('pointercancel', up);
  track.addEventListener('keydown', event => {
    if (event.key === 'ArrowRight') { event.preventDefault(); set(progress + .34); if (progress >= 1) release(); }
    if (event.key === 'ArrowLeft') { event.preventDefault(); set(progress - .34); }
  });
  window.addEventListener('resize', () => set(progress));
  deliveredContainer.append(track);
  requestAnimationFrame(() => set(0));
});

// Valores: el que está en el centro de la pantalla se activa y su descripción aparece a la izquierda.
const valueNum = document.querySelector('#vg-num');
const valueText = document.querySelector('#vg-text');
values.forEach((value, index) => {
  const item = document.createElement('li');
  item.className = 'vg__item';
  const v = T().about.values[index];
  item.innerHTML = `<span class="vg__i">0${index + 1}</span><div><h3>${v.name}</h3><p class="vg__m vg__m-label" data-i18n="about.guide">${T().about.guide}</p><p class="vg__m vg__m-num">0${index + 1}<small>/ 0${values.length}</small></p><p class="vg__mobile">${v.detail}</p><div class="vg__mobile-sketch">${SKETCHES[index]}</div></div>`;
  valuesContainer.append(item);
});
const valueItems = [...valuesContainer.children];
let activeValue = -1;
function setActiveValue(index, force = false) {
  if (index === activeValue && !force) return;
  activeValue = index;
  valueItems.forEach((item, n) => item.classList.toggle('is-active', n === index));
  valueNum.textContent = String(index + 1).padStart(2, '0');
  valueText.textContent = T().about.values[index].detail;
  const sketch = document.querySelector('#vg-sketch');
  sketch.innerHTML = SKETCHES[index];
  sketch.animate([{ opacity: 0, transform: 'translateY(10px)' }, { opacity: 1, transform: 'none' }], { duration: 900, easing: 'cubic-bezier(.16,1,.3,1)' });
  [valueNum, valueText].forEach(el => el.animate([{ opacity: 0, transform: 'translateY(12px)' }, { opacity: 1, transform: 'none' }], { duration: 800, easing: 'cubic-bezier(.16,1,.3,1)' }));
}
// La sección queda trabada: cada tramo de scroll muestra un valor; el último se sostiene hasta el final.
const aboutPin = document.querySelector('#about-pin');
const aboutBar = document.querySelector('#about-bar');
let valuesTicking = false;
function updateValues() {
  valuesTicking = false;
  const r = aboutPin.getBoundingClientRect();
  const travel = Math.max(1, aboutPin.offsetHeight - window.innerHeight);
  const p = Math.max(0, Math.min(1, -r.top / travel));
  const n = valueItems.length;
  setActiveValue(Math.min(n - 1, Math.floor(p * n * 1.08)));
  if (aboutBar) aboutBar.style.transform = `scaleY(${p})`;
}
window.addEventListener('scroll', () => { if (!valuesTicking) { valuesTicking = true; requestAnimationFrame(updateValues); } }, { passive: true });
valueItems.forEach((item, i) => item.addEventListener('click', () => {
  const travel = aboutPin.offsetHeight - window.innerHeight;
  const top = aboutPin.getBoundingClientRect().top + window.scrollY + travel * ((i + .5) / (valueItems.length * 1.08));
  window.scrollTo({ top, behavior: 'smooth' });
}));
setActiveValue(0);

document.querySelector('.dialog-close').addEventListener('click', () => dialog.close());
dialog.addEventListener('click', event => { if (event.target === dialog) dialog.close(); });

const menuToggle = document.querySelector('.menu-toggle');
const mainNav = document.querySelector('.main-nav');
menuToggle.addEventListener('click', () => {
  const expanded = menuToggle.getAttribute('aria-expanded') === 'true';
  menuToggle.setAttribute('aria-expanded', String(!expanded));
  menuToggle.setAttribute('aria-label', expanded ? 'Abrir menú' : 'Cerrar menú');
  mainNav.classList.toggle('is-open', !expanded);
});
mainNav.querySelectorAll('a').forEach(link => link.addEventListener('click', () => {
  menuToggle.setAttribute('aria-expanded', 'false');
  menuToggle.setAttribute('aria-label', 'Abrir menú');
  mainNav.classList.remove('is-open');
}));

// HERO: 1) cortina que se levanta desde el centro  2) recuadro nítido sobre el edificio  3) se abre con el scroll.
const intro = document.querySelector('.intro');
const introSticky = intro.querySelector('.intro__sticky');
const introSharp = intro.querySelector('.intro__img--sharp');
const introFrame = intro.querySelector('.intro__frame');
const curtain = intro.querySelector('.intro__curtain');
const clothSvg = intro.querySelector('.intro__cloth');
const clothBody = document.querySelector('#cloth-body');
const clothClip = document.querySelector('#cloth-clip-path');
const clothHem = document.querySelector('#cloth-hem');
const clothCast = document.querySelector('#cloth-cast');
const clothFolds = document.querySelector('#cloth-folds');
const curtainWords = intro.querySelector('.intro__words');
const pullButton = intro.querySelector('.intro__pull');
const siteHeader = document.querySelector('.site-header');
const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');

const clamp01 = v => Math.max(0, Math.min(1, v));
const lerp = (a, b, t) => a + (b - a) * t;
const easeInOut = t => (t < .5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2);
const easeOut = t => 1 - Math.pow(1 - t, 3);
const phase = (p, start, end, ease = easeInOut) => ease(clamp01((p - start) / (end - start)));

// Arrugas: solo aparecen alrededor del punto de tiro, donde la tela se junta. El resto es un paño liso.
const WRINKLES = [.12, .27, .45, .66, .86];
const wrinkleEls = [];
const foldFade = document.querySelector('#fold-fade');
[-1, 1].forEach(side => WRINKLES.forEach((t, i) => {
  const light = document.createElementNS('http://www.w3.org/2000/svg', 'path');
  const dark = document.createElementNS('http://www.w3.org/2000/svg', 'path');
  [light, dark].forEach(el => { el.setAttribute('fill', 'none'); el.setAttribute('stroke-linecap', 'round'); });
  light.setAttribute('stroke', 'rgba(255,255,255,.13)');
  dark.setAttribute('stroke', 'rgba(8,12,16,.55)');
  clothFolds.append(dark, light);
  wrinkleEls.push({ side, t, i, light, dark });
}));

const bez = (p0, p1, p2, p3, t) => {
  const u = 1 - t;
  return u * u * u * p0 + 3 * u * u * t * p1 + 3 * u * t * t * p2 + t * t * t * p3;
};

let curtainP = 0;
function renderCurtain(p) {
  curtainP = p;
  const W = introSticky.clientWidth;
  const H = introSticky.clientHeight;
  const cx = W / 2;
  const rise = phase(p, 0, .56);
  const edge = phase(p, .14, .62);
  const lift = phase(p, .56, 1);
  const cy = lerp(H - 118, H * .3, rise) - lift * H * 1.08;
  const ey = lerp(H + 24, H * .74, edge) - lift * H * 1.3;
  const d = Math.max(0, ey - cy);
  const belly = d * .14;
  const side = s => ({
    p1x: cx + s * W * .045, p1y: cy + d * .62,
    p2x: cx + s * W * .3, p2y: ey + belly,
    p3x: s < 0 ? -12 : W + 12, p3y: ey,
  });
  const L = side(-1), R = side(1);
  const hem = `M ${L.p3x} ${L.p3y} C ${L.p2x} ${L.p2y}, ${L.p1x} ${L.p1y}, ${cx} ${cy} C ${R.p1x} ${R.p1y}, ${R.p2x} ${R.p2y}, ${R.p3x} ${R.p3y}`;
  const body = `M -12 -12 H ${W + 12} V ${R.p3y} C ${R.p2x} ${R.p2y}, ${R.p1x} ${R.p1y}, ${cx} ${cy} C ${L.p1x} ${L.p1y}, ${L.p2x} ${L.p2y}, ${L.p3x} ${L.p3y} Z`;
  clothSvg.setAttribute('viewBox', `0 0 ${W} ${H}`);
  clothBody.setAttribute('d', body);
  clothClip.setAttribute('d', body);
  clothHem.setAttribute('d', hem);
  clothCast.setAttribute('d', hem);
  clothCast.setAttribute('transform', `translate(0 ${14 + d * .03})`);
  clothCast.style.opacity = String(clamp01(d / (H * .08)) * (1 - lift));

  const gather = clamp01(d / (H * .42));
  wrinkleEls.forEach(f => {
    const S = f.side < 0 ? L : R;
    const hx = bez(cx, S.p1x, S.p2x, S.p3x, f.t);
    const hy = bez(cy, S.p1y, S.p2y, S.p3y, f.t);
    const qx = lerp(cx, hx, .5);
    const qy = lerp(cy, hy, .1) - d * (.05 + f.t * .12);
    const w = [14, 26, 18, 32, 22][f.i] * (.5 + gather * .8);
    const off = f.side * (5 + f.i * 2);
    f.light.setAttribute('d', `M ${cx} ${cy - 3} Q ${qx} ${qy}, ${hx} ${hy - 12}`);
    f.dark.setAttribute('d', `M ${cx + off * .2} ${cy} Q ${qx + off} ${qy + 12}, ${hx + off} ${hy - 6}`);
    f.light.setAttribute('stroke-width', w * .7);
    f.dark.setAttribute('stroke-width', w);
    f.light.style.opacity = gather;
    f.dark.style.opacity = gather;
  });
  foldFade.setAttribute('cx', cx);
  foldFade.setAttribute('cy', cy);
  foldFade.setAttribute('r', Math.max(60, d * 1.25));

  intro.style.setProperty('--cy', `${Math.max(0, cy)}px`);
  pullButton.style.transform = `translateY(${cy - 26}px)`;
  // En reposo se respeta el fundido de entrada del CSS.
  pullButton.style.opacity = p > 0 ? String(1 - phase(p, .02, .22, easeOut)) : '';
  curtainWords.style.opacity = p > 0 ? String(1 - phase(p, .3, .56)) : '';
  curtainWords.style.transform = p > 0 ? `translateY(calc(-62% + ${-rise * 24 - lift * H * .4}px))` : '';
}

let introOpened = false;
let curtainAnim = null;

function finishCurtain() {
  introOpened = true;
  curtain.classList.add('is-gone');
  document.documentElement.classList.remove('intro-locked');
  intro.classList.add('is-open');
  renderIntroScroll();
}

function animateCurtain(to, duration) {
  cancelAnimationFrame(curtainAnim);
  const from = curtainP;
  const start = performance.now();
  const step = now => {
    const t = clamp01((now - start) / duration);
    renderCurtain(lerp(from, to, t));
    if (t < 1) curtainAnim = requestAnimationFrame(step);
    else if (to === 1) finishCurtain();
  };
  curtainAnim = requestAnimationFrame(step);
}

function openIntro(instant = false) {
  if (introOpened || curtain.classList.contains('is-lifting')) return;
  if (!instant && !intro.classList.contains('is-ready')) return;
  if (instant || reducedMotion.matches) {
    intro.classList.add('intro--instant');
    finishCurtain();
    return;
  }
  curtain.classList.add('is-lifting');
  animateCurtain(1, 3000 * (1 - curtainP));
}

// Tirar del cordón: arrastrar hacia arriba o clic.
let dragStartY = null;
let dragFrom = 0;
let dragMoved = false;
pullButton.addEventListener('pointerdown', event => {
  if (introOpened) return;
  event.preventDefault();
  cancelAnimationFrame(curtainAnim);
  dragStartY = event.clientY;
  dragFrom = curtainP;
  dragMoved = false;
  pullButton.setPointerCapture(event.pointerId);
});
pullButton.addEventListener('pointermove', event => {
  if (dragStartY === null) return;
  const dy = dragStartY - event.clientY;
  if (Math.abs(dy) > 4) dragMoved = true;
  renderCurtain(clamp01(dragFrom + dy / (introSticky.clientHeight * 1.1)) * .56);
});
const endDrag = () => {
  if (dragStartY === null) return;
  dragStartY = null;
  if (!dragMoved || curtainP > .1) openIntro();
  else animateCurtain(0, 600);
};
pullButton.addEventListener('pointerup', endDrag);
pullButton.addEventListener('pointercancel', endDrag);
pullButton.addEventListener('keydown', event => { if (event.key === 'Enter' || event.key === ' ') { event.preventDefault(); openIntro(); } });

// También se abre con la rueda, deslizando o con el teclado.
window.addEventListener('wheel', event => { if (!introOpened && event.deltaY > 8) openIntro(); }, { passive: true });
let touchStartY = null;
window.addEventListener('touchstart', event => { touchStartY = event.touches[0].clientY; }, { passive: true });
window.addEventListener('touchmove', event => {
  if (!introOpened && dragStartY === null && touchStartY !== null && touchStartY - event.touches[0].clientY > 30) openIntro();
}, { passive: true });
window.addEventListener('keydown', event => {
  if (!introOpened && ['ArrowDown', 'PageDown', ' '].includes(event.key) && document.activeElement === document.body) {
    event.preventDefault();
    openIntro();
  }
});
document.querySelectorAll('a[href^="#"]').forEach(link => link.addEventListener('click', () => {
  if (link.getAttribute('href') !== '#inicio' && !introOpened) openIntro(true);
}));

// Recuadro: ubicación del edificio dentro de la imagen (fracciones del archivo original 1672×941).
const BUILDING = { x1: .745, y1: .28, x2: .85, y2: .68 };
const BUILDING_MOBILE = BUILDING;
const IMG_RATIO = 2006 / 784;
const introNight = intro.querySelector('.intro__img--night');
const introPin = intro.querySelector('.intro__pin');

function centerIntroMobile(W, H) {
  // Solo mobile: corre la foto para que el edificio (y su recuadro) quede centrado.
  if (W > 720) return;
  const scale = Math.max(W / IMG_RATIO, H);
  const iw = scale * IMG_RATIO;
  if (iw - W < 1) return;
  const cx = (BUILDING_MOBILE.x1 + BUILDING_MOBILE.x2) / 2;
  const px = Math.min(1, Math.max(0, (W / 2 - cx * iw) / (W - iw)));
  const py = (getComputedStyle(introSharp).objectPosition.split(' ')[1]) || '50%';
  const v = `${(px * 100).toFixed(3)}% ${py}`;
  intro.querySelectorAll('.intro__img').forEach(img => { if (img.style.objectPosition !== v) img.style.objectPosition = v; });
}
function buildingRect(W, H) {
  centerIntroMobile(W, H);
  const style = getComputedStyle(introSharp).objectPosition.split(' ');
  const px = parseFloat(style[0]) / 100;
  const py = parseFloat(style[1] || '50%') / 100;
  const scale = Math.max(W / IMG_RATIO, H) ;
  const iw = scale * IMG_RATIO;
  const ih = scale;
  const ox = (W - iw) * px;
  const oy = (H - ih) * py;
  const mobile = W <= 720;
  const B = mobile ? BUILDING_MOBILE : BUILDING;
  let x = ox + B.x1 * iw;
  let y = oy + B.y1 * ih;
  let w = (B.x2 - B.x1) * iw;
  let h = (B.y2 - B.y1) * ih;
  // Margen seguro con el header, los textos y los bordes.
  const top = mobile ? 110 : Math.max(228, H * .27);
  const bottom = mobile ? H * .7 : H - Math.max(58, H * .09);
  if (y < top) { h -= top - y; y = top; }
  if (y + h > bottom) h = bottom - y;
  if (x < 20) { w -= 20 - x; x = 20; }
  if (x + w > W - 20) w = W - 20 - x;
  return { x, y, w, h };
}

let introTicking = false;
let scrollingTimer = null;
function renderIntroScroll() {
  introTicking = false;
  const W = introSticky.clientWidth;
  const H = introSticky.clientHeight;
  const rect = intro.getBoundingClientRect();
  const travel = Math.max(1, intro.offsetHeight - H);
  const s = clamp01(-rect.top / travel);
  // Tramos del scroll: abrir el recuadro → datos finales → anochecer (termina justo antes del final).
  const open = phase(s, .04, .4);
  const b = buildingRect(W, H);
  const x = lerp(b.x, 0, open);
  const y = lerp(b.y, 0, open);
  const w = lerp(b.w, W, open);
  const h = lerp(b.h, H, open);
  introSharp.style.clipPath = `inset(${y}px ${W - x - w}px ${H - y - h}px ${x}px)`;
  introFrame.style.transform = `translate(${x}px, ${y}px)`;
  introFrame.style.width = `${w}px`;
  introFrame.style.height = `${h}px`;
  intro.style.setProperty('--fx', `${b.x}px`);
  intro.style.setProperty('--fy', `${b.y}px`);
  intro.style.setProperty('--fw', `${b.w}px`);
  intro.style.setProperty('--fh', `${b.h}px`);
  intro.style.setProperty('--frame', String(1 - phase(s, .32, .41)));
  intro.style.setProperty('--side', String(1 - phase(s, .013, .13)));
  intro.style.setProperty('--brand', String(1 - phase(s, .14, .32)));
  intro.style.setProperty('--final', String(phase(s, .39, .5, easeOut)));
  // Cuando el recuadro terminó de abrirse, queda una línea marcando el edificio (con enlace a Maps).
  const pin = phase(s, .38, .46);
  intro.style.setProperty('--pin', String(pin));
  introPin.classList.toggle('is-active', pin > .5);
  introPin.tabIndex = pin > .5 ? 0 : -1;
  intro.style.setProperty('--cue', String(1 - phase(s, .955, .99)));
  // La noche avanza desde afuera (radio grande) hacia el centro del edificio (radio 0).
  const night = phase(s, .45, .95);
  const nx = b.x + b.w / 2;
  const ny = b.y + b.h / 2;
  const far = Math.hypot(Math.max(nx, W - nx), Math.max(ny, H - ny));
  const feather = Math.max(160, W * .16);
  introNight.style.setProperty('--nx', `${nx}px`);
  introNight.style.setProperty('--ny', `${ny}px`);
  introNight.style.setProperty('--nf', `${feather}px`);
  introNight.style.setProperty('--nr', `${(far + 20) * (1 - night) - feather * night}px`);
  siteHeader.classList.toggle('site-header--solid', rect.bottom <= 90);
}

window.addEventListener('scroll', () => {
  if (introOpened) {
    intro.classList.add('is-scrolling');
    clearTimeout(scrollingTimer);
    scrollingTimer = setTimeout(() => intro.classList.remove('is-scrolling'), 200);
  }
  if (introTicking) return;
  introTicking = true;
  requestAnimationFrame(renderIntroScroll);
}, { passive: true });
window.addEventListener('resize', () => { if (!introOpened) renderCurtain(curtainP); renderIntroScroll(); });

const startOpen = reducedMotion.matches || (location.hash && location.hash !== '#inicio') || window.scrollY > 0;
renderCurtain(0);
renderIntroScroll();
if (startOpen) openIntro(true);
else {
  document.documentElement.classList.add('intro-locked');
  // La escena de abajo se decodifica antes de habilitar la cortina, así se revela ya lista.
  const blurImg = intro.querySelector('.intro__img--blur');
  Promise.all([introSharp, blurImg, introNight].map(img => (img.decode ? img.decode().catch(() => {}) : Promise.resolve())))
    .then(() => { renderIntroScroll(); intro.classList.add('is-ready'); });
}
window.addEventListener('pageshow', () => { if (window.scrollY > 0 && !introOpened) openIntro(true); });


// ===== Aviso propio (sin alert) =====
const toastEl = document.querySelector('#toast');
let toastTimer = null;
function showToast(text) {
  toastEl.textContent = text;
  toastEl.classList.add('is-on');
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => toastEl.classList.remove('is-on'), 2800);
}

// ===== WhatsApp: flotante y botón de contacto =====
function updateWhatsAppLinks() {
  const text = T().contact.waText;
  document.querySelector('#wa-float').href = waLink(text);
  document.querySelector('#contact-wa').href = waLink(text);
}

// ===== Contacto: el visitante dibuja su proyecto con un lápiz; al completarlo aparece el render y luego el contacto =====
const contactSection = document.querySelector('#contacto');
const drawPaper = document.querySelector('#draw-paper');
const drawCanvas = document.querySelector('#draw-canvas');
const drawCtx = drawCanvas.getContext('2d');
const drawGuide = drawPaper.querySelector('.draw__guide');
const drawPencil = document.querySelector('#draw-pencil');
const drawRender = document.querySelector('#draw-render');
const drawMeter = document.querySelector('#draw-meter');
const drawAgain = document.querySelector('#draw-again');
const maskCanvas = document.createElement('canvas');
const maskCtx = maskCanvas.getContext('2d');
const GRID = 28;
let drawCells = null;      // celdas con líneas del boceto (las que cuentan para completar)
let drawCovered = new Set();
let drawActive = false;
let drawDown = false;
let drawLast = null;
let drawFinished = false;
let drawW = 0, drawH = 0;

function sizeDraw() {
  const r = drawPaper.getBoundingClientRect();
  const dpr = Math.min(2, window.devicePixelRatio || 1);
  drawW = r.width; drawH = r.height;
  [drawCanvas, maskCanvas].forEach(c => { c.width = Math.round(r.width * dpr); c.height = Math.round(r.height * dpr); });
  drawCanvas.style.width = `${r.width}px`; drawCanvas.style.height = `${r.height}px`;
  maskCtx.setTransform(dpr, 0, 0, dpr, 0, 0);
  drawCtx.setTransform(1, 0, 0, 1, 0, 0);
}
function computeCells() {
  if (!drawGuide.complete || !drawGuide.naturalWidth) return;
  const c = document.createElement('canvas');
  c.width = GRID; c.height = Math.round(GRID * drawGuide.naturalHeight / drawGuide.naturalWidth);
  const x = c.getContext('2d');
  x.drawImage(drawGuide, 0, 0, c.width, c.height);
  let data;
  try { data = x.getImageData(0, 0, c.width, c.height).data; } catch (e) { data = null; }
  drawCells = { cols: c.width, rows: c.height, list: new Set() };
  for (let j = 0; j < c.height; j++) for (let i = 0; i < c.width; i++) {
    const a = data ? data[(j * c.width + i) * 4 + 3] : 255;
    if (a > 40) drawCells.list.add(`${i},${j}`);
  }
}
function paintDraw() {
  const w = drawCanvas.width, h = drawCanvas.height;
  drawCtx.clearRect(0, 0, w, h);
  drawCtx.globalCompositeOperation = 'source-over';
  drawCtx.drawImage(maskCanvas, 0, 0);
  drawCtx.globalCompositeOperation = 'source-in';
  drawCtx.drawImage(drawRender, 0, 0, w, h); // se pinta directo en color
  drawCtx.globalCompositeOperation = 'source-over';
}
function markCells(x, y, radius) {
  if (!drawCells) return;
  const cw = drawW / drawCells.cols, ch = drawH / drawCells.rows;
  const r = Math.ceil(radius / Math.min(cw, ch));
  const ci = Math.floor(x / cw), cj = Math.floor(y / ch);
  for (let j = cj - r; j <= cj + r; j++) for (let i = ci - r; i <= ci + r; i++) {
    const key = `${i},${j}`;
    if (drawCells.list.has(key)) drawCovered.add(key);
  }
  const p = Math.min(1, drawCovered.size / (drawCells.list.size * .85));
  drawMeter.style.transform = `scaleX(${p})`;
  if (p >= 1 && !drawFinished) finishDraw();
}
function strokeTo(x, y) {
  const brush = Math.max(34, drawW * .085);
  maskCtx.lineCap = 'round'; maskCtx.lineJoin = 'round';
  maskCtx.strokeStyle = '#000'; maskCtx.lineWidth = brush;
  maskCtx.beginPath();
  maskCtx.moveTo(drawLast ? drawLast.x : x, drawLast ? drawLast.y : y);
  maskCtx.lineTo(x, y);
  maskCtx.stroke();
  // Marcar celdas a lo largo del trazo
  const steps = drawLast ? Math.max(1, Math.ceil(Math.hypot(x - drawLast.x, y - drawLast.y) / 8)) : 1;
  for (let s2 = 1; s2 <= steps; s2++) {
    const t = s2 / steps;
    markCells(drawLast ? drawLast.x + (x - drawLast.x) * t : x, drawLast ? drawLast.y + (y - drawLast.y) * t : y, brush / 2);
  }
  drawLast = { x, y };
  paintDraw();
}
function localPoint(event) {
  const r = drawPaper.getBoundingClientRect();
  return { x: event.clientX - r.left, y: event.clientY - r.top };
}
function startDrawing() {
  if (drawActive || drawFinished) return;
  drawActive = true;
  sizeDraw();
  if (!drawCells) computeCells();
  contactSection.classList.add('is-drawing');
}
const drawTap = document.querySelector('#draw-tap');
const isMobileView = () => window.matchMedia('(max-width: 720px)').matches;
function tapReveal() {
  if (drawActive || drawFinished) return;
  startDrawing();
  drawFinished = true;
  const t0 = performance.now();
  const D = 2600;
  const feather = Math.max(60, drawH * .14);
  const step = now => {
    const p = Math.min(1, (now - t0) / D);
    const e = p < .5 ? 2 * p * p : 1 - Math.pow(-2 * p + 2, 2) / 2;
    const y = (drawH + feather) * (1 - e) - feather;
    maskCtx.clearRect(0, 0, drawW, drawH);
    const g = maskCtx.createLinearGradient(0, y, 0, y + feather);
    g.addColorStop(0, 'rgba(0,0,0,0)');
    g.addColorStop(1, '#000');
    maskCtx.fillStyle = g;
    maskCtx.fillRect(0, y, drawW, feather);
    maskCtx.fillStyle = '#000';
    maskCtx.fillRect(0, y + feather, drawW, drawH);
    paintDraw();
    drawMeter.style.transform = `scaleX(${e})`;
    if (p < 1) { requestAnimationFrame(step); return; }
    contactSection.classList.add('is-sketched', 'is-rendered', 'is-named');
    setTimeout(() => contactSection.classList.add('is-done'), 3400);
  };
  requestAnimationFrame(step);
}
if (drawTap) drawTap.addEventListener('click', tapReveal);
drawPaper.addEventListener('pointerdown', event => {
  if (drawFinished || isMobileView()) return;
  startDrawing();
  drawDown = true;
  drawLast = null;
  drawPaper.setPointerCapture(event.pointerId);
  const p = localPoint(event);
  strokeTo(p.x, p.y);
});
drawPaper.addEventListener('pointermove', event => {
  const p = localPoint(event);
  drawPencil.style.transform = `translate(${p.x}px, ${p.y - 40}px)`;
  if (drawDown && !drawFinished) strokeTo(p.x, p.y);
});
const endDraw = () => { drawDown = false; drawLast = null; };
drawPaper.addEventListener('pointerup', endDraw);
drawPaper.addEventListener('pointercancel', endDraw);
drawPaper.addEventListener('pointerenter', () => drawPaper.classList.add('is-hover'));
drawPaper.addEventListener('pointerleave', () => drawPaper.classList.remove('is-hover'));

function finishDraw() {
  drawFinished = true;
  drawDown = false;
  drawMeter.style.transform = 'scaleX(1)';
  // Completa el boceto, luego aparece el render y por último el contacto.
  maskCtx.fillStyle = '#000';
  maskCtx.fillRect(0, 0, drawW, drawH);
  contactSection.classList.add('is-sketched');
  paintDraw();
  setTimeout(() => contactSection.classList.add('is-rendered'), 900);
  setTimeout(() => contactSection.classList.add('is-done'), 3200);
}
function resetDraw() {
  drawFinished = false; drawActive = false; drawDown = false; drawLast = null;
  drawCovered = new Set();
  maskCtx.clearRect(0, 0, drawW, drawH);
  paintDraw();
  drawMeter.style.transform = 'scaleX(0)';
  contactSection.classList.remove('is-drawing', 'is-sketched', 'is-rendered', 'is-done', 'is-named');
}
drawAgain.addEventListener('click', resetDraw);
window.addEventListener('resize', () => { if (!drawFinished) { sizeDraw(); paintDraw(); } });
if (drawGuide.complete) computeCells(); else drawGuide.addEventListener('load', computeCells);

// ===== Idiomas: ES / EN / PT =====
function applyTranslations() {
  const t = T();
  const get = key => key.split('.').reduce((o, k) => (o ? o[k] : undefined), t);
  document.querySelectorAll('[data-i18n]').forEach(el => { const v = get(el.dataset.i18n); if (v !== undefined) el.textContent = v; });
  document.querySelectorAll('[data-i18n-html]').forEach(el => { const v = get(el.dataset.i18nHtml); if (v !== undefined) el.innerHTML = v; });
  document.documentElement.lang = { es: 'es-AR', en: 'en', pt: 'pt-BR' }[currentLang];
  document.querySelectorAll('.lang button').forEach(b => b.classList.toggle('is-on', b.dataset.lang === currentLang));
  // Contenido generado por JS
  document.querySelectorAll('[data-track-label]').forEach(el => { el.textContent = `${el.dataset.index} · ${t.obras[el.dataset.trackLabel]}`; });
  document.querySelectorAll('[data-track-slide]').forEach(el => { el.textContent = t.obras.slide; });
  valueItems.forEach((item, i) => { item.querySelector('h3').textContent = t.about.values[i].name; item.querySelector('.vg__mobile').textContent = t.about.values[i].detail; });
  setActiveValue(Math.max(0, activeValue), true);
  setDevActive(Math.max(0, devActive), true);
  if (dialog.open && dialogProject) openProjectDialogTexts();
  updateWhatsAppLinks();
}
function openProjectDialogTexts() {
  const i = projects.indexOf(dialogProject);
  document.querySelector('#dialog-status').textContent = dialogProject.soon ? `${T().dev.status} · ${T().dev.soon}` : T().dev.status;
  document.querySelector('#dialog-description').textContent = projectDescription(i);
}
function setLang(lang) {
  if (!I18N[lang]) return;
  currentLang = lang;
  try { localStorage.setItem('arkhos-lang', lang); } catch (e) {}
  applyTranslations();
}
document.querySelectorAll('.lang button').forEach(btn => btn.addEventListener('click', () => setLang(btn.dataset.lang)));
(() => {
  let saved = null;
  try { saved = localStorage.getItem('arkhos-lang'); } catch (e) {}
  currentLang = saved && I18N[saved] ? saved : 'es';
  applyTranslations();
})();

// ===== Encaje por secciones (PC): cada movimiento de la rueda lleva a la siguiente parada y la sección queda encajada =====
const snapQuery = window.matchMedia('(min-width: 901px) and (hover: hover)');
let snapStops = [];
let snapAnimating = false;
let snapCooldown = 0;
const docTop = el => el.getBoundingClientRect().top + window.scrollY;

function buildSnapStops() {
  const H = window.innerHeight;
  const stops = [];
  // Hero: portada, recuadro abierto y anochecer (la animación se ve mientras se desliza).
  const introTravel = intro.offsetHeight - H;
  [0, .44, .97].forEach(p => stops.push(docTop(intro) + introTravel * p));
  stops.push(docTop(document.querySelector('#desarrollos')));
  stops.push(docTop(document.querySelector('#entregadas')));
  // Quiénes somos: una parada por valor.
  const pinTop = docTop(aboutPin);
  const pinTravel = aboutPin.offsetHeight - H;
  const n = valueItems.length;
  for (let i = 0; i < n; i++) stops.push(pinTop + pinTravel * ((i + .5) / (n * 1.08)));
  stops.push(docTop(document.querySelector('.manifesto-screen')));
  stops.push(docTop(document.querySelector('#contacto')));
  stops.push(document.documentElement.scrollHeight - H);
  snapStops = stops.map(v => Math.round(Math.max(0, v))).sort((a, b) => a - b).filter((v, i, a) => i === 0 || v - a[i - 1] > 4);
}

function snapTo(target) {
  snapAnimating = true;
  const from = window.scrollY;
  const dist = target - from;
  const duration = Math.min(1300, 650 + Math.abs(dist) * .25);
  const start = performance.now();
  const ease = t => (t < .5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2);
  const step = now => {
    const t = Math.min(1, (now - start) / duration);
    window.scrollTo(0, from + dist * ease(t));
    if (t < 1) requestAnimationFrame(step);
    else { snapAnimating = false; snapCooldown = performance.now() + 260; }
  };
  requestAnimationFrame(step);
}

function snapMove(dir) {
  if (!snapStops.length) buildSnapStops();
  const y = window.scrollY;
  let target;
  if (dir > 0) target = snapStops.find(s => s > y + 4);
  else target = [...snapStops].reverse().find(s => s < y - 4);
  if (target === undefined) return;
  snapTo(target);
}

const snapBlocked = () => !snapQuery.matches || !introOpened || dialog.open || gallery.open;

window.addEventListener('wheel', event => {
  if (snapBlocked()) return;
  event.preventDefault();
  if (snapAnimating || performance.now() < snapCooldown) return;
  if (Math.abs(event.deltaY) < 4) return;
  snapMove(event.deltaY > 0 ? 1 : -1);
}, { passive: false });

window.addEventListener('keydown', event => {
  if (snapBlocked()) return;
  const tag = (document.activeElement && document.activeElement.tagName) || '';
  if (/INPUT|TEXTAREA|SELECT/.test(tag)) return;
  const down = ['ArrowDown', 'PageDown', ' '].includes(event.key);
  const up = ['ArrowUp', 'PageUp'].includes(event.key);
  if (!down && !up) return;
  if (dev.contains(document.activeElement)) return; // la rueda usa las flechas
  event.preventDefault();
  if (!snapAnimating) snapMove(down ? 1 : -1);
});

// Los enlaces del menú también llevan al inicio exacto de cada sección.
document.querySelectorAll('.main-nav a[href^="#"], .footer-inner a[href^="#"]').forEach(link => link.addEventListener('click', event => {
  if (!snapQuery.matches) return;
  const target = document.querySelector(link.getAttribute('href'));
  if (!target) return;
  event.preventDefault();
  setTimeout(() => { buildSnapStops(); snapTo(Math.round(docTop(target))); }, 30);
}));

window.addEventListener('resize', () => { snapStops = []; });
window.addEventListener('load', buildSnapStops);
