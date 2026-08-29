// ============================================================
// Control de Acceso - Demo (Paquetería + Visitas)
// Sin backend / sin integraciones: todo vive en localStorage.
// ============================================================

const STORAGE_KEYS = {
  paquetes: 'ca-demo-paquetes',
  visitas: 'ca-demo-visitas',
};

// ---------- Datos de ejemplo (solo si no hay nada guardado aún) ----------
const SEED_PAQUETES = [
  { id: crypto.randomUUID(), residente: 'Depto 302 - María López', mensajeria: 'Amazon', folio: 'MX998211', notas: 'Caja mediana', estado: 'pendiente', fecha: new Date().toISOString() },
  { id: crypto.randomUUID(), residente: 'Depto 105 - Ana Torres', mensajeria: 'DHL', folio: '', notas: '', estado: 'entregado', fecha: new Date().toISOString() },
];

const SEED_VISITAS = [
  { id: crypto.randomUUID(), nombre: 'Carlos Hernández', destino: 'Depto 402 - Jorge Ruiz', motivo: 'Personal', identificacion: 'INE 5521', estado: 'activa', entrada: new Date().toISOString(), salida: null },
];

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
// PAQUETERÍA
// ============================================================
const formPaquete = document.getElementById('form-paquete');
const listaPaquetes = document.getElementById('lista-paquetes');
const paqEmpty = document.getElementById('paq-empty');
const paqBuscar = document.getElementById('paq-buscar');
const paqFiltroEstado = document.getElementById('paq-filtro-estado');

formPaquete.addEventListener('submit', (e) => {
  e.preventDefault();

  const residente = document.getElementById('paq-residente').value.trim();
  const mensajeria = document.getElementById('paq-mensajeria').value.trim();
  const folio = document.getElementById('paq-folio').value.trim();
  const notas = document.getElementById('paq-notas').value.trim();

  if (!residente || !mensajeria) return;

  paquetes.unshift({
    id: crypto.randomUUID(),
    residente,
    mensajeria,
    folio,
    notas,
    estado: 'pendiente',
    fecha: new Date().toISOString(),
  });

  guardar(STORAGE_KEYS.paquetes, paquetes);
  formPaquete.reset();
  renderPaquetes();
});

function marcarEntregado(id) {
  paquetes = paquetes.map((p) => (p.id === id ? { ...p, estado: 'entregado', entregadoEn: new Date().toISOString() } : p));
  guardar(STORAGE_KEYS.paquetes, paquetes);
  renderPaquetes();
}

function renderPaquetes() {
  const termino = paqBuscar.value.trim().toLowerCase();
  const filtro = paqFiltroEstado.value;

  const filtrados = paquetes.filter((p) => {
    const coincideTexto = !termino ||
      p.residente.toLowerCase().includes(termino) ||
      p.mensajeria.toLowerCase().includes(termino) ||
      (p.folio || '').toLowerCase().includes(termino);
    const coincideEstado = filtro === 'todos' || p.estado === filtro;
    return coincideTexto && coincideEstado;
  });

  listaPaquetes.innerHTML = '';
  paqEmpty.style.display = filtrados.length ? 'none' : 'block';

  filtrados.forEach((p) => {
    const li = document.createElement('li');
    li.className = 'list-item';

    const badge = p.estado === 'pendiente'
      ? '<span class="badge badge--pending">Pendiente</span>'
      : '<span class="badge badge--done">Entregado</span>';

    const accion = p.estado === 'pendiente'
      ? `<button class="btn btn--ghost btn--small" data-accion="entregar" data-id="${p.id}">Marcar entregado</button>`
      : `<button class="btn btn--muted btn--small" disabled>Entregado</button>`;

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

  // Stats
  document.getElementById('stat-pendientes').textContent = paquetes.filter((p) => p.estado === 'pendiente').length;
  document.getElementById('stat-entregados').textContent = paquetes.filter((p) => p.estado === 'entregado' && esHoy(p.entregadoEn)).length;
  document.getElementById('stat-total-paq').textContent = paquetes.length;
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
const visBuscar = document.getElementById('vis-buscar');
const visFiltroEstado = document.getElementById('vis-filtro-estado');

formVisita.addEventListener('submit', (e) => {
  e.preventDefault();

  const nombre = document.getElementById('vis-nombre').value.trim();
  const destino = document.getElementById('vis-destino').value.trim();
  const motivo = document.getElementById('vis-motivo').value;
  const identificacion = document.getElementById('vis-identificacion').value.trim();

  if (!nombre || !destino) return;

  visitas.unshift({
    id: crypto.randomUUID(),
    nombre,
    destino,
    motivo,
    identificacion,
    estado: 'activa',
    entrada: new Date().toISOString(),
    salida: null,
  });

  guardar(STORAGE_KEYS.visitas, visitas);
  formVisita.reset();
  renderVisitas();
});

function registrarSalida(id) {
  visitas = visitas.map((v) => (v.id === id ? { ...v, estado: 'finalizada', salida: new Date().toISOString() } : v));
  guardar(STORAGE_KEYS.visitas, visitas);
  renderVisitas();
}

function renderVisitas() {
  const termino = visBuscar.value.trim().toLowerCase();
  const filtro = visFiltroEstado.value;

  const filtradas = visitas.filter((v) => {
    const coincideTexto = !termino ||
      v.nombre.toLowerCase().includes(termino) ||
      v.destino.toLowerCase().includes(termino);
    const coincideEstado = filtro === 'todos' || v.estado === filtro;
    return coincideTexto && coincideEstado;
  });

  listaVisitas.innerHTML = '';
  visEmpty.style.display = filtradas.length ? 'none' : 'block';

  filtradas.forEach((v) => {
    const li = document.createElement('li');
    li.className = 'list-item';

    const badge = v.estado === 'activa'
      ? '<span class="badge badge--pending">Activa</span>'
      : '<span class="badge badge--done">Finalizada</span>';

    const accion = v.estado === 'activa'
      ? `<button class="btn btn--ghost btn--small" data-accion="salida" data-id="${v.id}">Registrar salida</button>`
      : `<button class="btn btn--muted btn--small" disabled>Finalizada</button>`;

    li.innerHTML = `
      <div class="list-item__main">
        <span class="list-item__title">${v.nombre}</span>
        <span class="list-item__meta">Visita a: ${v.destino} · ${v.motivo}</span>
        <span class="list-item__extra">Entrada: ${formatHora(v.entrada)}${v.salida ? ' · Salida: ' + formatHora(v.salida) : ''}${v.identificacion ? ' · ID: ' + v.identificacion : ''}</span>
      </div>
      <div class="list-item__actions">
        ${badge}
        ${accion}
      </div>
    `;
    listaVisitas.appendChild(li);
  });

  // Stats
  document.getElementById('stat-activas').textContent = visitas.filter((v) => v.estado === 'activa').length;
  document.getElementById('stat-finalizadas').textContent = visitas.filter((v) => v.estado === 'finalizada' && esHoy(v.salida)).length;
  document.getElementById('stat-total-vis').textContent = visitas.length;
}

listaVisitas.addEventListener('click', (e) => {
  const btn = e.target.closest('button[data-accion="salida"]');
  if (!btn) return;
  registrarSalida(btn.dataset.id);
});

visBuscar.addEventListener('input', renderVisitas);
visFiltroEstado.addEventListener('change', renderVisitas);

// ---------- Render inicial ----------
renderPaquetes();
renderVisitas();
