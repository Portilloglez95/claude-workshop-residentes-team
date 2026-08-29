// ============================================================
// Control de Acceso - Demo (Paquetería + Visitas)
// Sin backend / sin integraciones: todo vive en localStorage.
//
// "Roles" (Portería / Residente) son una simulación de UI, sin
// login real. La "identidad" del residente es un texto libre que
// se compara por coincidencia contra el campo residente/destino.
// ============================================================

const STORAGE_KEYS = {
  paquetes: 'ca-demo-paquetes',
  visitas: 'ca-demo-visitas',
  notificaciones: 'ca-demo-notificaciones',
  rol: 'ca-demo-rol',
  identidad: 'ca-demo-identidad',
};

// ---------- Datos de ejemplo (solo si no hay nada guardado aún) ----------
const SEED_PAQUETES = [
  { id: crypto.randomUUID(), residente: 'Depto 302 - María López', mensajeria: 'Amazon', folio: 'MX998211', notas: 'Caja mediana', estado: 'pendiente', fecha: new Date().toISOString() },
  { id: crypto.randomUUID(), residente: 'Depto 105 - Ana Torres', mensajeria: 'DHL', folio: '', notas: '', estado: 'entregado', fecha: new Date().toISOString() },
];

const SEED_VISITAS = [
  { id: crypto.randomUUID(), nombre: 'Carlos Hernández', destino: 'Depto 402 - Jorge Ruiz', motivo: 'Personal', identificacion: 'INE 5521', fotoVisitante: null, fotoId: null, estado: 'activa', creadaEn: new Date().toISOString(), entrada: new Date().toISOString(), salida: null },
];

const SEED_NOTIFICACIONES = [];

// ---------- Persistencia ----------
function cargar(key, seed) {
  const raw = localStorage.getItem(key);
  if (raw) {
    try { return JSON.parse(raw); } catch { /* ignore, fall back to seed */ }
  }
  localStorage.setItem(key, JSON.stringify(seed));
  return seed;
}

function guardar(key, data) {
  localStorage.setItem(key, JSON.stringify(data));
}

let paquetes = cargar(STORAGE_KEYS.paquetes, SEED_PAQUETES);
let visitas = cargar(STORAGE_KEYS.visitas, SEED_VISITAS);
let notificaciones = cargar(STORAGE_KEYS.notificaciones, SEED_NOTIFICACIONES);

let rol = localStorage.getItem(STORAGE_KEYS.rol) || 'porteria';
let identidad = localStorage.getItem(STORAGE_KEYS.identidad) || '';

// ---------- Utilidades ----------
function formatHora(isoString) {
  if (!isoString) return '—';
  const d = new Date(isoString);
  return d.toLocaleString('es-MX', { day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit' });
}

function esHoy(isoString) {
  if (!isoString) return false;
  const d = new Date(isoString);
  const hoy = new Date();
  return d.toDateString() === hoy.toDateString();
}

function coincideIdentidad(campo) {
  if (!identidad.trim() || !campo) return false;
  const a = campo.toLowerCase().trim();
  const b = identidad.toLowerCase().trim();
  return a.includes(b) || b.includes(a);
}

// ============================================================
// ROLES / IDENTIDAD
// ============================================================
const roleButtons = document.querySelectorAll('.role-btn');
const identityBar = document.getElementById('identity-bar');
const identidadInput = document.getElementById('identidad-input');
const identidadGuardarBtn = document.getElementById('identidad-guardar');
const bellBtn = document.getElementById('bell-btn');

function aplicarRol() {
  document.body.dataset.rol = rol;
  roleButtons.forEach((btn) => {
    const activo = btn.dataset.role === rol;
    btn.classList.toggle('role-btn--active', activo);
  });

  identityBar.hidden = rol !== 'residente';
  bellBtn.hidden = rol !== 'residente';
  identidadInput.value = identidad;

  // Textos del formulario de visitas cambian según quién registra
  const formTitle = document.getElementById('vis-form-title');
  const formHint = document.getElementById('vis-form-hint');
  const submitBtn = document.getElementById('vis-submit-btn');
  const destinoInput = document.getElementById('vis-destino');

  if (rol === 'residente') {
    formTitle.textContent = 'Pre-autorizar visita';
    formHint.textContent = 'Agrega una foto del visitante o de su identificación para que portería lo reconozca sin pedirle la ID.';
    submitBtn.textContent = 'Pre-autorizar visita';
    if (identidad.trim() && !destinoInput.value) destinoInput.value = identidad;
  } else {
    formTitle.textContent = 'Registrar visitante';
    formHint.textContent = 'Si el visitante llega sin pre-autorización, regístralo aquí para dejarlo entrar directamente.';
    submitBtn.textContent = 'Registrar entrada';
  }

  document.getElementById('paq-scope-note').textContent = identidad.trim()
    ? `Estás viendo solo los paquetes de: ${identidad.trim()}`
    : 'Ingresa tu nombre/depto arriba para ver tus paquetes.';
  document.getElementById('vis-scope-note').textContent = identidad.trim()
    ? `Estás viendo solo las visitas relacionadas con: ${identidad.trim()}`
    : 'Ingresa tu nombre/depto arriba para ver tus visitas.';

  document.getElementById('stat-esperadas-label').textContent = rol === 'residente' ? 'Esperando llegar' : 'Esperadas';

  renderPaquetes();
  renderVisitas();
  renderNotificaciones({ silencioso: true });
}

roleButtons.forEach((btn) => {
  btn.addEventListener('click', () => {
    rol = btn.dataset.role;
    localStorage.setItem(STORAGE_KEYS.rol, rol);
    if (rol === 'residente') pedirPermisoNotificaciones();
    aplicarRol();
  });
});

identidadGuardarBtn.addEventListener('click', () => {
  identidad = identidadInput.value.trim();
  localStorage.setItem(STORAGE_KEYS.identidad, identidad);
  aplicarRol();
});

identidadInput.addEventListener('keydown', (e) => {
  if (e.key === 'Enter') {
    e.preventDefault();
    identidadGuardarBtn.click();
  }
});

// ============================================================
// NOTIFICACIONES
// ============================================================
const notifPanel = document.getElementById('notif-panel');
const notifList = document.getElementById('notif-list');
const notifEmpty = document.getElementById('notif-empty');
const notifBadge = document.getElementById('bell-badge');
const notifMarcarLeidasBtn = document.getElementById('notif-marcar-leidas');
const toastContainer = document.getElementById('toast-container');

let notifUnreadBaseline = null; // se fija la primera vez que se conoce la identidad

bellBtn.addEventListener('click', () => {
  notifPanel.hidden = !notifPanel.hidden;
});

document.addEventListener('click', (e) => {
  if (!notifPanel.hidden && !notifPanel.contains(e.target) && e.target !== bellBtn) {
    notifPanel.hidden = true;
  }
});

notifMarcarLeidasBtn.addEventListener('click', () => {
  notificaciones = notificaciones.map((n) => (coincideIdentidad(n.residente) ? { ...n, leida: true } : n));
  guardar(STORAGE_KEYS.notificaciones, notificaciones);
  renderNotificaciones({ silencioso: true });
});

function crearNotificacionPaquete(paquete) {
  notificaciones.unshift({
    id: crypto.randomUUID(),
    residente: paquete.residente,
    mensaje: `Nuevo paquete de ${paquete.mensajeria} para ${paquete.residente}.`,
    fecha: new Date().toISOString(),
    leida: false,
  });
  guardar(STORAGE_KEYS.notificaciones, notificaciones);
}

function renderNotificaciones(opts = {}) {
  const propias = identidad.trim() ? notificaciones.filter((n) => coincideIdentidad(n.residente)) : [];
  const noLeidas = propias.filter((n) => !n.leida);

  notifBadge.textContent = noLeidas.length;
  notifBadge.hidden = noLeidas.length === 0;

  notifList.innerHTML = '';
  notifEmpty.style.display = propias.length ? 'none' : 'block';

  propias.slice(0, 25).forEach((n) => {
    const li = document.createElement('li');
    li.className = `notif-item${n.leida ? '' : ' notif-item--unread'}`;
    li.innerHTML = `
      <span class="notif-item__msg">${n.mensaje}</span>
      <span class="notif-item__time">${formatHora(n.fecha)}</span>
    `;
    notifList.appendChild(li);
  });

  if (notifUnreadBaseline === null) {
    notifUnreadBaseline = noLeidas.length; // primera vez: no notificar de golpe lo ya pendiente
    return;
  }

  if (!opts.silencioso && rol === 'residente' && identidad.trim() && noLeidas.length > notifUnreadBaseline) {
    const nueva = noLeidas[0];
    mostrarToast(`📦 ${nueva.mensaje}`);
    intentarNotificacionNativa(nueva.mensaje);
  }

  notifUnreadBaseline = noLeidas.length;
}

function mostrarToast(mensaje) {
  const el = document.createElement('div');
  el.className = 'toast';
  el.textContent = mensaje;
  toastContainer.appendChild(el);
  requestAnimationFrame(() => el.classList.add('toast--show'));
  setTimeout(() => {
    el.classList.remove('toast--show');
    setTimeout(() => el.remove(), 300);
  }, 4500);
}

function pedirPermisoNotificaciones() {
  if (!('Notification' in window)) return;
  if (Notification.permission === 'default') {
    Notification.requestPermission().catch(() => {});
  }
}

function intentarNotificacionNativa(mensaje) {
  if (!('Notification' in window) || Notification.permission !== 'granted') return;
  try { new Notification('Control de Acceso', { body: mensaje }); } catch { /* algunos navegadores lo bloquean, no pasa nada */ }
}

// Sincronización entre pestañas (simula "tiempo real" sin backend)
window.addEventListener('storage', (e) => {
  if (e.key === STORAGE_KEYS.paquetes) {
    paquetes = cargar(STORAGE_KEYS.paquetes, SEED_PAQUETES);
    renderPaquetes();
  }
  if (e.key === STORAGE_KEYS.visitas) {
    visitas = cargar(STORAGE_KEYS.visitas, SEED_VISITAS);
    renderVisitas();
  }
  if (e.key === STORAGE_KEYS.notificaciones) {
    notificaciones = cargar(STORAGE_KEYS.notificaciones, SEED_NOTIFICACIONES);
    renderNotificaciones();
  }
});

// ---------- Tabs ----------
const tabs = document.querySelectorAll('.tab');
const panels = document.querySelectorAll('.panel');

tabs.forEach((tab) => {
  tab.addEventListener('click', () => {
    tabs.forEach((t) => { t.classList.remove('tab--active'); t.setAttribute('aria-selected', 'false'); });
    panels.forEach((p) => p.classList.remove('panel--active'));

    tab.classList.add('tab--active');
    tab.setAttribute('aria-selected', 'true');
    document.getElementById(tab.dataset.target).classList.add('panel--active');
  });
});

// ============================================================
// LIGHTBOX (ampliar fotos)
// ============================================================
const lightbox = document.getElementById('lightbox');
const lightboxImg = document.getElementById('lightbox-img');
const lightboxClose = document.getElementById('lightbox-close');

function abrirLightbox(src) {
  lightboxImg.src = src;
  lightbox.hidden = false;
}

function cerrarLightbox() {
  lightbox.hidden = true;
  lightboxImg.src = '';
}

lightboxClose.addEventListener('click', cerrarLightbox);
lightbox.addEventListener('click', (e) => { if (e.target === lightbox) cerrarLightbox(); });
document.addEventListener('keydown', (e) => { if (e.key === 'Escape') cerrarLightbox(); });

// ============================================================
// PAQUETERÍA
// ============================================================
const formPaquete = document.getElementById('form-paquete');
const listaPaquetes = document.getElementById('lista-paquetes');
const paqEmpty = document.getElementById('paq-empty');
const paqSinIdentidad = document.getElementById('paq-sin-identidad');
const paqBuscar = document.getElementById('paq-buscar');
const paqFiltroEstado = document.getElementById('paq-filtro-estado');

formPaquete.addEventListener('submit', (e) => {
  e.preventDefault();

  const residente = document.getElementById('paq-residente').value.trim();
  const mensajeria = document.getElementById('paq-mensajeria').value.trim();
  const folio = document.getElementById('paq-folio').value.trim();
  const notas = document.getElementById('paq-notas').value.trim();

  if (!residente || !mensajeria) return;

  const nuevoPaquete = {
    id: crypto.randomUUID(),
    residente,
    mensajeria,
    folio,
    notas,
    estado: 'pendiente',
    fecha: new Date().toISOString(),
  };

  paquetes.unshift(nuevoPaquete);
  guardar(STORAGE_KEYS.paquetes, paquetes);
  crearNotificacionPaquete(nuevoPaquete);

  formPaquete.reset();
  renderPaquetes();
  renderNotificaciones();
});

function marcarEntregado(id) {
  paquetes = paquetes.map((p) => (p.id === id ? { ...p, estado: 'entregado', entregadoEn: new Date().toISOString() } : p));
  guardar(STORAGE_KEYS.paquetes, paquetes);
  renderPaquetes();
}

function renderPaquetes() {
  const termino = paqBuscar.value.trim().toLowerCase();
  const filtro = paqFiltroEstado.value;
  const sinIdentidad = rol === 'residente' && !identidad.trim();

  paqSinIdentidad.style.display = sinIdentidad ? 'block' : 'none';
  listaPaquetes.style.display = sinIdentidad ? 'none' : '';

  const base = rol === 'residente' ? paquetes.filter((p) => coincideIdentidad(p.residente)) : paquetes;

  const filtrados = sinIdentidad ? [] : base.filter((p) => {
    const coincideTexto = !termino ||
      p.residente.toLowerCase().includes(termino) ||
      p.mensajeria.toLowerCase().includes(termino) ||
      (p.folio || '').toLowerCase().includes(termino);
    const coincideEstado = filtro === 'todos' || p.estado === filtro;
    return coincideTexto && coincideEstado;
  });

  listaPaquetes.innerHTML = '';
  paqEmpty.style.display = (!sinIdentidad && filtrados.length === 0) ? 'block' : 'none';

  filtrados.forEach((p) => {
    const li = document.createElement('li');
    li.className = 'list-item';

    const badge = p.estado === 'pendiente'
      ? '<span class="badge badge--pending">Pendiente</span>'
      : '<span class="badge badge--done">Entregado</span>';

    const accion = (rol === 'porteria' && p.estado === 'pendiente')
      ? `<button class="btn btn--ghost btn--small" data-accion="entregar" data-id="${p.id}">Marcar entregado</button>`
      : (p.estado === 'entregado' && rol === 'porteria')
        ? `<button class="btn btn--muted btn--small" disabled>Entregado</button>`
        : '';

    li.innerHTML = `
      <div class="list-item__main">
        <span class="list-item__title">${p.residente}</span>
        <span class="list-item__meta">${p.mensajeria}${p.folio ? ' · Folio: ' + p.folio : ''}</span>
        <span class="list-item__extra">Recibido: ${formatHora(p.fecha)}${p.notas ? ' · ' + p.notas : ''}</span>
      </div>
      <div class="list-item__actions">
        ${badge}
        ${accion}
      </div>
    `;
    listaPaquetes.appendChild(li);
  });

  // Stats (respetan el alcance del rol actual)
  document.getElementById('stat-pendientes').textContent = base.filter((p) => p.estado === 'pendiente').length;
  document.getElementById('stat-entregados').textContent = base.filter((p) => p.estado === 'entregado' && esHoy(p.entregadoEn)).length;
  document.getElementById('stat-total-paq').textContent = base.length;
}

listaPaquetes.addEventListener('click', (e) => {
  const btn = e.target.closest('button[data-accion="entregar"]');
  if (!btn) return;
  marcarEntregado(btn.dataset.id);
});

paqBuscar.addEventListener('input', renderPaquetes);
paqFiltroEstado.addEventListener('change', renderPaquetes);

// ============================================================
// VISITAS
// ============================================================
const formVisita = document.getElementById('form-visita');
const listaVisitas = document.getElementById('lista-visitas');
const visEmpty = document.getElementById('vis-empty');
const visSinIdentidad = document.getElementById('vis-sin-identidad');
const visBuscar = document.getElementById('vis-buscar');
const visFiltroEstado = document.getElementById('vis-filtro-estado');

// ---- Fotos: lectura a base64 + preview ----
function conectarInputFoto(inputId, previewId) {
  const input = document.getElementById(inputId);
  const preview = document.getElementById(previewId);
  input.addEventListener('change', () => {
    const file = input.files[0];
    if (!file) {
      preview.hidden = true;
      preview.src = '';
      return;
    }
    const reader = new FileReader();
    reader.onload = () => {
      preview.src = reader.result;
      preview.hidden = false;
    };
    reader.readAsDataURL(file);
  });
}

conectarInputFoto('vis-foto-visitante', 'vis-foto-visitante-preview');
conectarInputFoto('vis-foto-id', 'vis-foto-id-preview');

function limpiarFotosForm() {
  ['vis-foto-visitante', 'vis-foto-id'].forEach((id) => { document.getElementById(id).value = ''; });
  ['vis-foto-visitante-preview', 'vis-foto-id-preview'].forEach((id) => {
    const img = document.getElementById(id);
    img.hidden = true;
    img.src = '';
  });
}

formVisita.addEventListener('submit', (e) => {
  e.preventDefault();

  const nombre = document.getElementById('vis-nombre').value.trim();
  const destino = document.getElementById('vis-destino').value.trim();
  const motivo = document.getElementById('vis-motivo').value;
  const identificacion = document.getElementById('vis-identificacion').value.trim();
  const fotoVisitante = document.getElementById('vis-foto-visitante-preview').hidden
    ? null : document.getElementById('vis-foto-visitante-preview').src;
  const fotoId = document.getElementById('vis-foto-id-preview').hidden
    ? null : document.getElementById('vis-foto-id-preview').src;

  if (!nombre || !destino) return;

  const ahora = new Date().toISOString();
  const esPreautorizacion = rol === 'residente';

  visitas.unshift({
    id: crypto.randomUUID(),
    nombre,
    destino,
    motivo,
    identificacion,
    fotoVisitante,
    fotoId,
    estado: esPreautorizacion ? 'esperada' : 'activa',
    creadaEn: ahora,
    entrada: esPreautorizacion ? null : ahora,
    salida: null,
  });

  guardar(STORAGE_KEYS.visitas, visitas);
  formVisita.reset();
  limpiarFotosForm();
  if (esPreautorizacion && identidad.trim()) document.getElementById('vis-destino').value = identidad;
  renderVisitas();
});

function registrarEntradaVisita(id) {
  visitas = visitas.map((v) => (v.id === id ? { ...v, estado: 'activa', entrada: new Date().toISOString() } : v));
  guardar(STORAGE_KEYS.visitas, visitas);
  renderVisitas();
}

function registrarSalida(id) {
  visitas = visitas.map((v) => (v.id === id ? { ...v, estado: 'finalizada', salida: new Date().toISOString() } : v));
  guardar(STORAGE_KEYS.visitas, visitas);
  renderVisitas();
}

function cancelarVisita(id) {
  visitas = visitas.map((v) => (v.id === id ? { ...v, estado: 'cancelada' } : v));
  guardar(STORAGE_KEYS.visitas, visitas);
  renderVisitas();
}

const BADGES_VISITA = {
  esperada: '<span class="badge badge--pending">Esperada</span>',
  activa: '<span class="badge badge--active">En el condominio</span>',
  finalizada: '<span class="badge badge--done">Finalizada</span>',
  cancelada: '<span class="badge badge--cancelled">Cancelada</span>',
};

function renderVisitas() {
  const termino = visBuscar.value.trim().toLowerCase();
  const filtro = visFiltroEstado.value;
  const sinIdentidad = rol === 'residente' && !identidad.trim();

  visSinIdentidad.style.display = sinIdentidad ? 'block' : 'none';
  listaVisitas.style.display = sinIdentidad ? 'none' : '';

  const base = rol === 'residente' ? visitas.filter((v) => coincideIdentidad(v.destino)) : visitas;

  const filtradas = sinIdentidad ? [] : base.filter((v) => {
    const coincideTexto = !termino ||
      v.nombre.toLowerCase().includes(termino) ||
      v.destino.toLowerCase().includes(termino);
    const coincideEstado = filtro === 'todos' || v.estado === filtro;
    return coincideTexto && coincideEstado;
  });

  listaVisitas.innerHTML = '';
  visEmpty.style.display = (!sinIdentidad && filtradas.length === 0) ? 'block' : 'none';

  filtradas.forEach((v) => {
    const li = document.createElement('li');
    li.className = 'list-item';

    const badge = BADGES_VISITA[v.estado] || '';

    let fotos = '';
    if (v.fotoVisitante) fotos += `<img class="photo-thumb" src="${v.fotoVisitante}" data-full="${v.fotoVisitante}" alt="Foto del visitante" title="Foto del visitante">`;
    if (v.fotoId) fotos += `<img class="photo-thumb" src="${v.fotoId}" data-full="${v.fotoId}" alt="Foto de identificación" title="Foto de identificación">`;

    let accion = '';
    if (rol === 'porteria') {
      if (v.estado === 'esperada') accion = `<button class="btn btn--ghost btn--small" data-accion="entrada" data-id="${v.id}">Registrar entrada</button>`;
      else if (v.estado === 'activa') accion = `<button class="btn btn--ghost btn--small" data-accion="salida" data-id="${v.id}">Registrar salida</button>`;
    } else if (rol === 'residente' && v.estado === 'esperada') {
      accion = `<button class="btn btn--danger btn--small" data-accion="cancelar" data-id="${v.id}">Cancelar</button>`;
    }

    li.innerHTML = `
      <div class="list-item__main">
        <span class="list-item__title">${v.nombre}</span>
        <span class="list-item__meta">Visita a: ${v.destino} · ${v.motivo}</span>
        <span class="list-item__extra">${v.entrada ? 'Entrada: ' + formatHora(v.entrada) : 'Pre-autorizada: ' + formatHora(v.creadaEn)}${v.salida ? ' · Salida: ' + formatHora(v.salida) : ''}${v.identificacion ? ' · ID: ' + v.identificacion : ''}</span>
      </div>
      ${fotos ? `<div class="list-item__photos">${fotos}</div>` : ''}
      <div class="list-item__actions">
        ${badge}
        ${accion}
      </div>
    `;
    listaVisitas.appendChild(li);
  });

  // Stats (respetan el alcance del rol actual)
  document.getElementById('stat-esperadas').textContent = base.filter((v) => v.estado === 'esperada').length;
  document.getElementById('stat-activas').textContent = base.filter((v) => v.estado === 'activa').length;
  document.getElementById('stat-total-vis').textContent = base.length;
}

listaVisitas.addEventListener('click', (e) => {
  const thumb = e.target.closest('.photo-thumb');
  if (thumb) { abrirLightbox(thumb.dataset.full); return; }

  const btnEntrada = e.target.closest('button[data-accion="entrada"]');
  if (btnEntrada) { registrarEntradaVisita(btnEntrada.dataset.id); return; }

  const btnSalida = e.target.closest('button[data-accion="salida"]');
  if (btnSalida) { registrarSalida(btnSalida.dataset.id); return; }

  const btnCancelar = e.target.closest('button[data-accion="cancelar"]');
  if (btnCancelar) { cancelarVisita(btnCancelar.dataset.id); return; }
});

visBuscar.addEventListener('input', renderVisitas);
visFiltroEstado.addEventListener('change', renderVisitas);

// ---------- Arranque ----------
aplicarRol();
