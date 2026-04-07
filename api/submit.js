// api/submit.js - Endpoint principal de Vercel
// Recibe datos del formulario y guarda en Google Sheets

const { google } = require("googleapis");

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

const HEADERS = [
  "Timestamp", "Fecha Formulario", "Estado", "Carrera", "Turno",
  "Apellidos", "Nombres", "Fecha Nacimiento", "Nacionalidad", "DNI",
  "Domicilio", "Localidad", "CP", "Tel Celular", "Tel Alternativo", "Email",
  "Año Matrícula",
  "Pendientes - 1er Año", "Pendientes - 2do Año", "Pendientes - 3er Año",
  "Recursar - 1er Año", "Recursar - 2do Año", "Recursar - 3er Año",
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
    scopes: ["https://www.googleapis.com/auth/spreadsheets"],
  });
  return auth.getClient();
}

async function asegurarHeaders(sheets, sheetId) {
  try {
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
  } catch (e) {
    console.error("Error asegurando headers:", e.message);
  }
}

async function guardarEnSheet(sheets, sheetId, datos) {
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
    Object.values(pend)[0]?.join(" | ") || "",
    Object.values(pend)[1]?.join(" | ") || "",
    Object.values(pend)[2]?.join(" | ") || "",
    Object.values(recu)[0]?.join(" | ") || "",
    Object.values(recu)[1]?.join(" | ") || "",
    Object.values(recu)[2]?.join(" | ") || "",
  ];

  await sheets.spreadsheets.values.append({
    spreadsheetId: sheetId,
    range: "A1",
    valueInputOption: "RAW",
    insertDataOption: "INSERT_ROWS",
    requestBody: { values: [fila] },
  });
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

    if (!sheetId) {
      return res.status(400).json({ error: `Carrera no reconocida: ${clave}` });
    }

    const authClient = await getAuthClient();
    const sheets = google.sheets({ version: "v4", auth: authClient });

    await guardarEnSheet(sheets, sheetId, datos);

    return res.status(200).json({
      ok: true,
      mensaje: "Formulario guardado correctamente",
      pdfUrl: "",
    });
  } catch (err) {
    console.error("Error en /api/submit:", err);
    return res.status(500).json({ error: err.message || "Error interno del servidor" });
  }
};
