// api/submit.js - Endpoint principal de Vercel
// Recibe datos del formulario, guarda en Google Sheets y genera PDF en Drive

const { google } = require("googleapis");

// IDs de Google Sheets por carrera
const SHEET_IDS = {
  locucion_TM: "1oldn5a_IuUMXfsJy61AC6u4Ri9v2tztr4y0IwE6XYZ0",
  locucion_TT: "1hJXQJPUIoVgtKMcq6vM6dzvcAhp5KfeElPNAGVmyn4Y",
  locucion_TN: "1L7MJ-VPr49b95C9tRvg9eN4EAlv2Ky0dHSxo2sTm3Mk",
  produccion: "1fcAlvgtKZkfKr5vcqVuxJp_XbulXGKNXK7nb05IIP44",
  guion: "1-gQUz98J6zXMN3hegqcn3OdXKQ9rsWWHJE9yxJosfF8",
  convergencia: "19Zs_T4-3RfYfoVIjJ6LJ_Qx0Cu-Lgl0SI_G2X6AwVeg",
  operacion_radio: "1kERlIgGAzd853vyiAV3kLGxIXJ0e2cACKsZK4RKztcw",
  operacion_tv: "1fHlfDWqBHxi6nko3VR-9KZUZIoGILa-nqmQOseVQFpw",
  operacion_planta: "1qdz-vK005obrUi9czpOR8-4Ey7wMCFp0gQayuXafxME",
};

// IDs de carpetas Drive por carrera
const FOLDER_IDS = {
  locucion_TM: "1Okms-Ia9ahMAFQX593VM5ijWR-LLJK_j",
  locucion_TT: "1ciNrDCW5jnb3y5cc0lBpxaFvhfBnxCz1",
  locucion_TN: "1K5pIBB00AI0azr21lqUDQrxThYCG3ZoH",
  produccion: "16ci5U_1DyE9vLjPbxIyBNxVMpZMbcOP3",
  guion: "1pzZnxR1CAcxEhiC0687D2L9fYD0CvcKk",
  convergencia: "1JPGgS0e_uyj0xYzdIY1phbhHuNd8UnfL",
  operacion_radio: "1tnU1QgJ0tgy6th-eg6waUmdMIGQepSZM",
  operacion_tv: "1FldpevsgG5ldu6Ail9CeIcmYKZ_5yCLU",
  operacion_planta: "1yk7EG39Vrz4fS7yEA5djY-p_cC5KoSRj",
};

// Columnas del Sheet
const HEADERS = [
  "Timestamp",
  "Fecha Formulario",
  "Estado",
  "Carrera",
  "Turno",
  "Apellidos",
  "Nombres",
  "Fecha Nacimiento",
  "Nacionalidad",
  "DNI",
  "Domicilio",
  "Localidad",
  "CP",
  "Tel Celular",
  "Tel Alternativo",
  "Email",
  "Año Matrícula",
  "Pendientes - 1er Año",
  "Pendientes - 2do Año",
  "Pendientes - 3er Año",
  "Recursar - 1er Año",
  "Recursar - 2do Año",
  "Recursar - 3er Año",
  "PDF URL",
];

function getClaveSheet(carrera, turno) {
  const c = (carrera || "").toLowerCase();
  if (c === "locucion" && turno) return `locucion_${turno}`;
  return c;
}

async function getAuthClient() {
  const credentials = JSON.parse(process.env.GOOGLE_SERVICE_ACCOUNT);
  const auth = new google.auth.GoogleAuth({
    credentials,
    scopes: [
      "https://www.googleapis.com/auth/spreadsheets",
      "https://www.googleapis.com/auth/drive",
    ],
  });
  return auth.getClient();
}

async function asegurarHeaders(sheets, sheetId) {
  const res = await sheets.spreadsheets.values.get({
    spreadsheetId: sheetId,
    range: "A1:Z1",
  });
  const primeraFila = res.data.values?.[0];
  if (!primeraFila || primeraFila.length === 0) {
    await sheets.spreadsheets.values.update({
      spreadsheetId: sheetId,
      range: "A1",
      valueInputOption: "RAW",
      requestBody: { values: [HEADERS] },
    });
  }
}

async function guardarEnSheet(sheets, sheetId, datos, pdfUrl) {
  await asegurarHeaders(sheets, sheetId);

  const mat = datos.materias || {};
  const pend = mat.pendientes || {};
  const recu = mat.recursar || {};

  const fila = [
    datos.timestamp || new Date().toISOString(),
    datos.fechaFormulario || "",
    "Pendiente de firma",
    datos.carrera || "",
    datos.turno || "",
    datos.apellidos || "",
    datos.nombres || "",
    datos.fechaNacimiento || "",
    datos.nacionalidad || "",
    datos.dni || "",
    datos.domicilio || "",
    datos.localidad || "",
    datos.cp || "",
    datos.telCel || "",
    datos.telAlt || "",
    datos.email || "",
    datos.anioMatricula || "",
    (pend["Primer Año"] || []).join(" | "),
    (pend["Segundo Año"] || []).join(" | "),
    (pend["Tercer Año"] || []).join(" | "),
    (recu["Primer Año"] || []).join(" | "),
    (recu["Segundo Año"] || []).join(" | "),
    (recu["Tercer Año"] || []).join(" | "),
    pdfUrl || "",
  ];

  await sheets.spreadsheets.values.append({
    spreadsheetId: sheetId,
    range: "A1",
    valueInputOption: "RAW",
    insertDataOption: "INSERT_ROWS",
    requestBody: { values: [fila] },
  });
}

async function subirPDFMarcador(drive, folderId, nombre) {
  // Sube un archivo de texto como marcador hasta que el PDF real se genere desde el cliente
  const { Readable } = require("stream");
  const contenido = `PDF pendiente de generacion - ${nombre} - ${new Date().toISOString()}`;
  const stream = Readable.from([contenido]);

  const res = await drive.files.create({
    requestBody: {
      name: nombre,
      parents: [folderId],
      mimeType: "text/plain",
    },
    media: {
      mimeType: "text/plain",
      body: stream,
    },
    fields: "id, webViewLink",
  });

  return res.data.webViewLink || `https://drive.google.com/file/d/${res.data.id}/view`;
}

module.exports = async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Método no permitido" });
  }

  try {
    const datos = req.body;

    if (!datos.apellidos || !datos.dni || !datos.carrera) {
      return res.status(400).json({ error: "Datos incompletos" });
    }

    const clave = getClaveSheet(datos.carrera, datos.turno);
    const sheetId = SHEET_IDS[clave];
    const folderId = FOLDER_IDS[clave];

    if (!sheetId || !folderId) {
      return res.status(400).json({ error: `Carrera no reconocida: ${clave}` });
    }

    const authClient = await getAuthClient();
    const sheets = google.sheets({ version: "v4", auth: authClient });
    const drive = google.drive({ version: "v3", auth: authClient });

    const nombrePDF = `${datos.apellidos}_${datos.nombres}_${datos.carrera.toUpperCase()}_2026.pdf`;
    const pdfUrl = await subirPDFMarcador(drive, folderId, nombrePDF.replace(".pdf", ".txt"));

    await guardarEnSheet(sheets, sheetId, datos, pdfUrl);

    return res.status(200).json({
      ok: true,
      mensaje: "Formulario guardado correctamente",
      pdfUrl,
    });
  } catch (err) {
    console.error("Error en /api/submit:", err);
    return res.status(500).json({ error: err.message || "Error interno del servidor" });
  }
};
