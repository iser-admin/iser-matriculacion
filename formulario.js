// ================================================
// ISER MATRICULACION 2026 - LOGICA DEL FORMULARIO
// ================================================

const estado = {
  carrera: null,
  turno: null,
  datos: {},
  materias: { pendientes: {}, recursar: {} },
  submittedData: null,
};

// Mapeo de data-carrera del HTML a clave en CARRERAS
const CARRERA_MAP = {
  locucion: "LOCUCION",
  produccion: "PRODUCCION",
  guion: "GUION",
  convergencia: "CONVERGENCIA",
  operacion_radio: "OPERACION_RADIO",
  operacion_tv: "OPERACION_TV",
  operacion_planta: "OPERACION_PLANTA",
};

document.addEventListener("DOMContentLoaded", () => {
  document.querySelectorAll("[data-carrera]").forEach((btn) => {
    btn.addEventListener("click", () => seleccionarCarrera(btn.dataset.carrera));
  });
  document.querySelectorAll("[data-orientacion]").forEach((btn) => {
    btn.addEventListener("click", () => seleccionarOrientacion(btn.dataset.orientacion));
  });
  document.querySelectorAll("[data-turno]").forEach((btn) => {
    btn.addEventListener("click", () => seleccionarTurno(btn.dataset.turno));
  });

  document.getElementById("btn-volver-orientacion").addEventListener("click", volverCarrera);
  document.getElementById("btn-volver-turno").addEventListener("click", volverCarrera);
  document.getElementById("btn-volver-datos").addEventListener("click", volverDesdeDatos);
  document.getElementById("btn-ir-materias").addEventListener("click", irAMaterias);
  document.getElementById("btn-volver-materias").addEventListener("click", () => irPaso("paso-datos"));
  document.getElementById("btn-ir-resumen").addEventListener("click", mostrarResumen);
  document.getElementById("btn-volver-resumen").addEventListener("click", () => irPaso("paso-materias"));
  document.getElementById("btn-enviar").addEventListener("click", enviarFormulario);
  document.getElementById("btn-descargar-pdf").addEventListener("click", descargarPDF);
  document.getElementById("btn-nuevo-formulario").addEventListener("click", nuevoFormulario);

  ["apellidos", "nombres", "nacionalidad", "domicilio", "localidad"].forEach((id) => {
    const el = document.getElementById(id);
    if (el) {
      el.addEventListener("input", () => {
        const pos = el.selectionStart;
        el.value = el.value.toUpperCase().replace(/\s{2,}/g, " ").trimStart();
        el.setSelectionRange(pos, pos);
      });
    }
  });

  document.getElementById("dni").addEventListener("input", (e) => {
    e.target.value = e.target.value.replace(/[^0-9]/g, "");
  });
});

// ---- NAVEGACION ----
function irPaso(idPaso) {
  document.querySelectorAll(".paso").forEach((p) => p.classList.remove("activo"));
  document.getElementById(idPaso).classList.add("activo");
  window.scrollTo({ top: 0, behavior: "smooth" });
}

function seleccionarCarrera(carrera) {
  if (carrera === "convergencia") {
    alert("La carrera Convergencia estará disponible próximamente.");
    return;
  }
  estado.carreraRaw = carrera;
  estado.turno = null;

  if (carrera === "operacion") {
    irPaso("paso-orientacion");
  } else if (carrera === "locucion") {
    irPaso("paso-turno");
  } else {
    estado.carrera = CARRERA_MAP[carrera];
    irPaso("paso-datos");
    actualizarBadge();
    actualizarAnioOpciones();
  }
}

function seleccionarOrientacion(orientacion) {
  estado.carreraRaw = orientacion;
  estado.carrera = CARRERA_MAP[orientacion];
  irPaso("paso-datos");
  actualizarBadge();
  actualizarAnioOpciones();
}

function seleccionarTurno(turno) {
  estado.turno = turno;
  estado.carrera = CARRERA_MAP["locucion"];
  irPaso("paso-datos");
  actualizarBadge();
  actualizarAnioOpciones();
}

function volverCarrera() {
  irPaso("paso-carrera");
  estado.carrera = null;
  estado.carreraRaw = null;
  estado.turno = null;
}

function volverDesdeDatos() {
  if (estado.carreraRaw === "locucion") {
    irPaso("paso-turno");
  } else if (["operacion_radio","operacion_tv","operacion_planta"].includes(estado.carreraRaw)) {
    irPaso("paso-orientacion");
  } else {
    irPaso("paso-carrera");
  }
}

function getCarreraDatos() {
  return CARRERAS[estado.carrera];
}

function actualizarBadge() {
  const datos = getCarreraDatos();
  if (!datos) return;
  let texto = datos.nombre;
  if (estado.turno) {
    const turnos = { TM: "Turno Mañana", TT: "Turno Tarde", TN: "Turno Noche" };
    texto += ` — ${turnos[estado.turno]}`;
  }
  document.getElementById("carrera-badge").textContent = texto;
  document.getElementById("carrera-badge-2").textContent = texto;
}

function actualizarAnioOpciones() {
  const sel = document.getElementById("anio-matricula");
  const datos = getCarreraDatos();
  if (!datos) return;
  const anios = Object.keys(datos.pendientes);
  sel.innerHTML = '<option value="">Seleccioná...</option>';
  anios.forEach((anio, i) => {
    const opt = document.createElement("option");
    opt.value = i + 1;
    opt.textContent = `${i + 1}° Año`;
    sel.appendChild(opt);
  });
}

// ---- DATOS PERSONALES ----
function irAMaterias() {
  if (!validarDatos()) return;
  guardarDatos();
  renderizarMaterias();
  irPaso("paso-materias");
}

function validarDatos() {
  const campos = [
    { id: "apellidos", label: "Apellidos" },
    { id: "nombres", label: "Nombres" },
    { id: "fecha-nacimiento", label: "Fecha de nacimiento" },
    { id: "nacionalidad", label: "Nacionalidad" },
    { id: "dni", label: "DNI" },
    { id: "domicilio", label: "Domicilio" },
    { id: "localidad", label: "Localidad" },
    { id: "tel-cel", label: "Teléfono celular" },
    { id: "email", label: "E-mail" },
    { id: "anio-matricula", label: "Año al que se matricula" },
  ];

  let valido = true;
  const errores = [];

  campos.forEach(({ id, label }) => {
    const el = document.getElementById(id);
    const valor = el.value.trim();
    el.classList.remove("error");
    if (!valor) {
      el.classList.add("error");
      errores.push(label);
      valido = false;
    }
  });

  const emailEl = document.getElementById("email");
  if (emailEl.value && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(emailEl.value)) {
    emailEl.classList.add("error");
    errores.push("E-mail (formato inválido)");
    valido = false;
  }

  const dniEl = document.getElementById("dni");
  if (dniEl.value && (dniEl.value.length < 7 || dniEl.value.length > 9)) {
    dniEl.classList.add("error");
    errores.push("DNI (debe tener entre 7 y 9 dígitos)");
    valido = false;
  }

  if (!valido) {
    alert(`Por favor completá los siguientes campos obligatorios:\n\n• ${errores.join("\n• ")}`);
  }
  return valido;
}

function guardarDatos() {
  estado.datos = {
    apellidos: document.getElementById("apellidos").value.trim(),
    nombres: document.getElementById("nombres").value.trim(),
    fechaNacimiento: document.getElementById("fecha-nacimiento").value,
    nacionalidad: document.getElementById("nacionalidad").value.trim(),
    dni: document.getElementById("dni").value.trim(),
    domicilio: document.getElementById("domicilio").value.trim(),
    localidad: document.getElementById("localidad").value.trim(),
    cp: document.getElementById("cp").value.trim(),
    telCel: document.getElementById("tel-cel").value.trim(),
    telAlt: document.getElementById("tel-alt").value.trim(),
    email: document.getElementById("email").value.trim(),
    anioMatricula: document.getElementById("anio-matricula").value,
    carrera: estado.carrera,
    carreraRaw: estado.carreraRaw,
    turno: estado.turno,
    fechaFormulario: new Date().toLocaleDateString("es-AR"),
  };
}

// ---- MATERIAS ----
function renderizarMaterias() {
  const container = document.getElementById("materias-container");
  container.innerHTML = "";
  const datos = getCarreraDatos();
  if (!datos) return;

  estado.materias = { pendientes: {}, recursar: {} };

  const anios = Object.keys(datos.pendientes);
  anios.forEach((anio) => {
    const pendientes = datos.pendientes[anio] || [];
    const recursar = datos.recursar[anio] || [];

    const bloque = document.createElement("div");
    bloque.className = "anio-bloque";
    bloque.innerHTML = `
      <div class="anio-header">${anio}</div>
      <div class="anio-body">
        <div class="materias-columna">
          <div class="columna-titulo pendiente">📋 Pendientes a Rendir</div>
          ${pendientes.length
            ? pendientes.map((m) => crearCheckbox(m, "pendientes", anio)).join("")
            : '<p style="font-size:0.82rem;color:#999;">Sin materias disponibles</p>'}
        </div>
        <div class="materias-columna">
          <div class="columna-titulo recursar">🔄 A Recursar</div>
          ${recursar.length
            ? recursar.map((m) => crearCheckbox(m, "recursar", anio)).join("")
            : '<p style="font-size:0.82rem;color:#999;">Sin materias disponibles</p>'}
        </div>
      </div>
    `;
    container.appendChild(bloque);
  });

  container.querySelectorAll('input[type="checkbox"]').forEach((cb) => {
    cb.addEventListener("change", (e) => {
      const { tipo, anio, materia } = e.target.dataset;
      if (!estado.materias[tipo][anio]) estado.materias[tipo][anio] = [];
      if (e.target.checked) {
        estado.materias[tipo][anio].push(materia);
      } else {
        estado.materias[tipo][anio] = estado.materias[tipo][anio].filter((m) => m !== materia);
      }
    });
  });
}

function crearCheckbox(materia, tipo, anio) {
  const claseItem = tipo === "pendientes" ? "pendiente-check" : "recursar-check";
  const id = `cb-${tipo}-${anio}-${materia}`.replace(/[\s\/\.]/g, "-").replace(/[^a-zA-Z0-9-]/g, "");
  return `
    <label class="materia-item ${claseItem}" for="${id}">
      <input type="checkbox" id="${id}"
        data-tipo="${tipo}" data-anio="${anio}" data-materia="${materia}" />
      ${materia}
    </label>
  `;
}

// ---- RESUMEN ----
function mostrarResumen() {
  guardarDatos();
  const datos = estado.datos;
  const turnos = { TM: "Turno Mañana", TT: "Turno Tarde", TN: "Turno Noche" };
  const carreraDatos = getCarreraDatos();

  let html = `
    <div class="resumen-datos">
      <h3>📋 Datos personales</h3>
      <div class="resumen-fila"><span class="resumen-label">Carrera</span><span>${carreraDatos.nombre}</span></div>
      ${datos.turno ? `<div class="resumen-fila"><span class="resumen-label">Turno</span><span>${turnos[datos.turno]}</span></div>` : ""}
      <div class="resumen-fila"><span class="resumen-label">Apellidos</span><span>${datos.apellidos}</span></div>
      <div class="resumen-fila"><span class="resumen-label">Nombres</span><span>${datos.nombres}</span></div>
      <div class="resumen-fila"><span class="resumen-label">Fecha de nac.</span><span>${formatearFecha(datos.fechaNacimiento)}</span></div>
      <div class="resumen-fila"><span class="resumen-label">Nacionalidad</span><span>${datos.nacionalidad}</span></div>
      <div class="resumen-fila"><span class="resumen-label">DNI</span><span>${datos.dni}</span></div>
      <div class="resumen-fila"><span class="resumen-label">Domicilio</span><span>${datos.domicilio}</span></div>
      <div class="resumen-fila"><span class="resumen-label">Localidad</span><span>${datos.localidad}${datos.cp ? ` (CP: ${datos.cp})` : ""}</span></div>
      <div class="resumen-fila"><span class="resumen-label">Tel. celular</span><span>${datos.telCel}</span></div>
      ${datos.telAlt ? `<div class="resumen-fila"><span class="resumen-label">Tel. alternativo</span><span>${datos.telAlt}</span></div>` : ""}
      <div class="resumen-fila"><span class="resumen-label">E-mail</span><span>${datos.email}</span></div>
      <div class="resumen-fila"><span class="resumen-label">Año que cursa</span><span>${datos.anioMatricula}° Año</span></div>
      <div class="resumen-fila"><span class="resumen-label">Fecha formulario</span><span>${datos.fechaFormulario}</span></div>
    </div>
  `;

  const anios = Object.keys(carreraDatos.pendientes);
  let hayMaterias = false;
  let htmlMaterias = '<div class="resumen-materias"><h3>📚 Materias seleccionadas</h3>';

  anios.forEach((anio) => {
    const pend = estado.materias.pendientes[anio] || [];
    const recu = estado.materias.recursar[anio] || [];
    if (pend.length === 0 && recu.length === 0) return;
    hayMaterias = true;
    htmlMaterias += `<div class="resumen-anio-titulo">${anio}</div>`;
    pend.forEach((m) => { htmlMaterias += `<span class="resumen-tag tag-pendiente">P: ${m}</span>`; });
    recu.forEach((m) => { htmlMaterias += `<span class="resumen-tag tag-recursar">R: ${m}</span>`; });
  });

  if (!hayMaterias) {
    htmlMaterias += '<p style="color:#888;font-size:0.9rem;">No seleccionaste materias.</p>';
  }
  htmlMaterias += "</div>";
  html += htmlMaterias;

  document.getElementById("resumen-container").innerHTML = html;
  irPaso("paso-resumen");
}

// ---- ENVIO ----
async function enviarFormulario() {
  const checkbox = document.getElementById("acepto-ddjj");
  if (!checkbox.checked) {
    alert("Debés aceptar la declaración jurada para continuar.");
    return;
  }

  mostrarLoading(true);

  const payload = {
    ...estado.datos,
    materias: estado.materias,
    timestamp: new Date().toISOString(),
  };

  try {
    const res = await fetch("/api/submit", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    const result = await res.json();
    if (!res.ok) throw new Error(result.error || "Error al enviar");

    estado.submittedData = { ...payload, pdfUrl: result.pdfUrl };
    mostrarLoading(false);
    mostrarConfirmacion(payload);
  } catch (err) {
    mostrarLoading(false);
    alert("Hubo un error al enviar el formulario. Por favor intentá nuevamente.\n\nError: " + err.message);
  }
}

function mostrarConfirmacion(datos) {
  const turnos = { TM: "Turno Mañana", TT: "Turno Tarde", TN: "Turno Noche" };
  const carreraDatos = getCarreraDatos();
  document.getElementById("enviado-info").innerHTML = `
    <strong>${datos.apellidos}, ${datos.nombres}</strong><br>
    ${carreraDatos.nombre}${datos.turno ? " — " + turnos[datos.turno] : ""}<br>
    ${datos.anioMatricula}° Año | DNI: ${datos.dni}<br>
    <small style="color:#888">Enviado el ${datos.fechaFormulario}</small>
  `;
  irPaso("paso-enviado");
}

// ---- PDF ----
async function descargarPDF() {
  const { jsPDF } = window.jspdf;
  const datos = estado.submittedData || estado.datos;
  const carreraDatos = getCarreraDatos();
  const turnos = { TM: "Turno Mañana", TT: "Turno Tarde", TN: "Turno Noche" };

  const doc = new jsPDF({ orientation: "portrait", unit: "mm", format: "a4" });
  const pageW = 210;
  const margin = 20;
  let y = 15;

  // Encabezado
  doc.setDrawColor(0, 48, 135);
  doc.setLineWidth(0.5);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(7.5);
  doc.setTextColor(0, 48, 135);
  doc.text("Presidencia de la Nación", margin, y + 5);
  doc.text("ENACOM", margin, y + 9);
  doc.setFont("helvetica", "normal");
  doc.setFontSize(6.5);
  doc.setTextColor(80, 80, 80);
  doc.text("INSTITUTO SUPERIOR DE ENSEÑANZA RADIOFÓNICA", margin, y + 13);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(18);
  doc.setTextColor(0, 48, 135);
  doc.text("ISER", pageW - margin, y + 9, { align: "right" });
  y += 18;
  doc.line(margin, y, pageW - margin, y);
  y += 6;

  doc.setFont("helvetica", "bold");
  doc.setFontSize(13);
  doc.setTextColor(0, 48, 135);
  doc.text("FORMULARIO DE MATRICULACIÓN", pageW / 2, y, { align: "center" });
  y += 8;

  doc.setFont("helvetica", "normal");
  doc.setFontSize(9);
  doc.setTextColor(50, 50, 50);
  doc.text(`Fecha de Matriculación: ${datos.fechaFormulario}`, margin, y);
  y += 5;
  doc.setFont("helvetica", "bold");
  doc.text(`Carrera: ${carreraDatos.nombre}`, margin, y);
  y += 5;
  doc.setFont("helvetica", "normal");
  doc.text(`Año al que se matricula: ${datos.anioMatricula}°`, margin, y);
  if (datos.turno) doc.text(`Turno: ${turnos[datos.turno]}`, margin + 70, y);
  y += 8;
  doc.line(margin, y, pageW - margin, y);
  y += 5;

  // Datos personales
  doc.setFont("helvetica", "bold");
  doc.setFontSize(10);
  doc.setTextColor(0, 48, 135);
  doc.text("DATOS PERSONALES", margin, y);
  y += 6;
  doc.setFont("helvetica", "normal");
  doc.setFontSize(9);
  doc.setTextColor(30, 30, 30);

  const filasDatos = [
    [`Apellidos: ${datos.apellidos}`, `Nombres: ${datos.nombres}`],
    [`Fecha de Nacimiento: ${formatearFecha(datos.fechaNacimiento)}`, `Nacionalidad: ${datos.nacionalidad}`, `DNI Nº: ${datos.dni}`],
    [`Domicilio: ${datos.domicilio}`, `Localidad: ${datos.localidad}`, `C.P.: ${datos.cp || "—"}`],
    [`Tel. cel.: ${datos.telCel}`, `Tel. alternativo: ${datos.telAlt || "—"}`],
    [`E-Mail: ${datos.email}`],
  ];

  filasDatos.forEach((fila) => {
    const partW = (pageW - margin * 2) / fila.length;
    fila.forEach((texto, i) => {
      doc.text(texto, margin + i * partW, y, { maxWidth: partW - 4 });
    });
    y += 6;
  });

  y += 3;
  doc.line(margin, y, pageW - margin, y);
  y += 5;

  // Materias pendientes
  doc.setFont("helvetica", "bold");
  doc.setFontSize(10);
  doc.setTextColor(0, 48, 135);
  doc.text("ASIGNATURAS PENDIENTES A RENDIR  (marcar con una X)", margin, y);
  y += 6;
  y = renderMateriasEnPDF(doc, carreraDatos, "pendientes", margin, y, pageW);

  y += 3;
  doc.line(margin, y, pageW - margin, y);
  y += 5;

  // Materias recursar
  doc.setFont("helvetica", "bold");
  doc.setFontSize(10);
  doc.setTextColor(0, 48, 135);
  doc.text("ASIGNATURAS A RECURSAR  (marcar con una X)", margin, y);
  y += 6;
  y = renderMateriasEnPDF(doc, carreraDatos, "recursar", margin, y, pageW);

  y += 6;

  // Declaracion
  doc.setFontSize(7.5);
  doc.setFont("helvetica", "bold");
  doc.setTextColor(30, 30, 30);
  const declaracion = "LA/EL FIRMANTE MANIFIESTA QUE LOS DATOS CONSIGNADOS EN EL PRESENTE FORMULARIO SON EXACTOS Y VERDADEROS. ASI MISMO SE NOTIFICA DE LA DISP. N° 196/19, CUYO TEXTO SE ENCUENTRA A DISPOSICIÓN DE LOS INTERESADOS EN BEDELÍA.";
  const splitDecl = doc.splitTextToSize(declaracion, pageW - margin * 2);
  doc.text(splitDecl, margin, y);
  y += splitDecl.length * 4 + 3;

  doc.setDrawColor(0, 48, 135);
  doc.setLineWidth(0.4);
  doc.rect(margin, y, pageW - margin * 2, 12);
  doc.setFont("helvetica", "normal");
  doc.setFontSize(7.5);
  const textSup = "LA PRESENTE MATRICULACIÓN QUEDA SUPEDITADA A LA CERTIFICACIÓN DE LOS DATOS APORTADOS Y LAS CONSTANCIAS OBRANTES EN EL RESPECTIVO LEGAJO.";
  doc.text(doc.splitTextToSize(textSup, pageW - margin * 2 - 6), margin + 3, y + 4);
  y += 18;

  // Firmas
  const firmaY = Math.max(y, 265);
  doc.setDrawColor(0, 0, 0);
  doc.setLineWidth(0.3);
  doc.line(margin, firmaY, margin + 60, firmaY);
  doc.line(pageW - margin - 60, firmaY, pageW - margin, firmaY);
  doc.setFontSize(8);
  doc.text("Bedel Interviniente", margin + 30, firmaY + 4, { align: "center" });
  doc.text("Firma y aclaración del Alumno", pageW - margin - 30, firmaY + 4, { align: "center" });

  const nombreArchivo = `${datos.apellidos}_${datos.nombres}_${carreraDatos.nombre.replace(/\s+/g, "_")}_2026.pdf`;
  doc.save(nombreArchivo);
}

function renderMateriasEnPDF(doc, carreraDatos, tipo, margin, y, pageW) {
  const anios = Object.keys(carreraDatos[tipo]);
  const colW = (pageW - margin * 2) / anios.length;

  doc.setFont("helvetica", "bold");
  doc.setFontSize(8);
  doc.setTextColor(0, 48, 135);
  anios.forEach((anio, i) => {
    doc.text(anio, margin + i * colW, y, { maxWidth: colW - 2 });
  });
  y += 5;

  const maxItems = Math.max(...anios.map((a) => (carreraDatos[tipo][a] || []).length));

  for (let i = 0; i < maxItems; i++) {
    anios.forEach((anio, col) => {
      const lista = carreraDatos[tipo][anio] || [];
      const seleccionadas = (estado.materias[tipo][anio] || []);
      const materia = lista[i];
      if (!materia) return;

      const x = margin + col * colW;
      const marcada = seleccionadas.includes(materia);

      doc.setDrawColor(80, 80, 80);
      doc.setLineWidth(0.3);
      doc.rect(x, y - 2.5, 3, 3);

      if (marcada) {
        doc.setFont("helvetica", "bold");
        doc.setTextColor(0, 100, 0);
        doc.text("X", x + 0.3, y - 0.2);
      } else {
        doc.setFont("helvetica", "normal");
        doc.setTextColor(30, 30, 30);
      }

      const textoM = doc.splitTextToSize(` ${materia}`, colW - 8);
      doc.text(textoM, x + 4, y - 0.5);
      doc.setFont("helvetica", "normal");
      doc.setTextColor(30, 30, 30);
    });
    y += 5;
  }
  return y;
}

// ---- UTILIDADES ----
function formatearFecha(fechaStr) {
  if (!fechaStr) return "—";
  const [y, m, d] = fechaStr.split("-");
  return `${d}/${m}/${y}`;
}

function mostrarLoading(mostrar) {
  let overlay = document.getElementById("loading-overlay");
  if (mostrar) {
    if (!overlay) {
      overlay = document.createElement("div");
      overlay.id = "loading-overlay";
      overlay.className = "loading-overlay";
      overlay.innerHTML = `<div class="loading-spinner"></div><p>Enviando formulario...</p>`;
      document.body.appendChild(overlay);
    }
    overlay.style.display = "flex";
  } else {
    if (overlay) overlay.style.display = "none";
  }
}

function nuevoFormulario() {
  location.reload();
}
