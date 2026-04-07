// api/panel.js - Endpoint para el panel de bedeles

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

// Claves de acceso por panel
const ACCESOS = {
  LOCUCIONTM2026: { sheets: ["locucion_TM"], nombre: "Locución - Turno Mañana" },
  LOCUCIONTT2026: { sheets: ["locucion_TT", "produccion"], nombre: "Locución Tarde / Producción", selector: true },
  LOCUCIONTN2026: { sheets: ["locucion_TN"], nombre: "Locución - Turno Noche" },
  GUION2026: { sheets: ["guion"], nombre: "Guionista" },
  CONVERGENCIA2026: { sheets: ["convergencia"], nombre: "Convergencia" },
  OPERACION2026: { sheets: ["operacion_radio", "operacion_tv", "operacion_planta"], nombre: "Operación", selector: true },
  DIRECTOR2026: {
    sheets: ["locucion_TM", "locucion_TT", "locucion_TN", "produccion", "guion", "convergencia", "operacion_radio", "operacion_tv", "operacion_planta"],
    nombre: "Dirección — Vista General",
  },
};

const NOMBRES_SHEET = {
  locucion_TM: "Locución Turno Mañana",
  locucion_TT: "Locución Turno Tarde",
  locucion_TN: "Locución Turno Noche",
  produccion: "Producción y Dirección",
  guion: "Guionista",
  convergencia: "Convergencia",
  operacion_radio: "Operación Radio",
  operacion_tv: "Operación TV",
  operacion_planta: "Operación Planta",
};

async function getAuthClient() {
  const credentials = JSON.parse(process.env.GOOGLE_SERVICE_ACCOUNT);
  const auth = new google.auth.GoogleAuth({
    credentials,
    scopes: ["https://www.googleapis.com/auth/spreadsheets"],
  });
  return auth.getClient();
}

async function leerSheet(sheets, sheetId) {
  try {
    const res = await sheets.spreadsheets.values.get({
      spreadsheetId: sheetId,
      range: "A1:Z1000",
    });
    const rows = res.data.values || [];
    if (rows.length < 2) return [];
    const headers = rows[0];
    return rows.slice(1).map((row, idx) => {
      const obj = { _rowIndex: idx + 2 };
      headers.forEach((h, i) => {
        obj[h] = row[i] || "";
      });
      return obj;
    });
  } catch {
    return [];
  }
}

async function actualizarEstado(sheets, sheetId, rowIndex, nuevoEstado) {
  // La columna "Estado" es la C (índice 3, columna C)
  await sheets.spreadsheets.values.update({
    spreadsheetId: sheetId,
    range: `C${rowIndex}`,
    valueInputOption: "RAW",
    requestBody: { values: [[nuevoEstado]] },
  });
}

module.exports = async function handler(req, res) {
  const { clave, accion, sheetKey, rowIndex, estado } = req.method === "GET" ? req.query : req.body;

  // Verificar acceso
  const acceso = ACCESOS[clave?.toUpperCase()];
  if (!acceso) {
    return res.status(401).json({ error: "Clave incorrecta" });
  }

  try {
    const authClient = await getAuthClient();
    const sheets = google.sheets({ version: "v4", auth: authClient });

    // Actualizar estado de un alumno
    if (accion === "actualizar" && sheetKey && rowIndex && estado) {
      if (!acceso.sheets.includes(sheetKey)) {
        return res.status(403).json({ error: "Sin acceso a esa carrera" });
      }
      const sheetId = SHEET_IDS[sheetKey];
      await actualizarEstado(sheets, sheetId, parseInt(rowIndex), estado);
      return res.status(200).json({ ok: true });
    }

    // Leer datos
    const resultado = {};
    for (const sk of acceso.sheets) {
      const sheetId = SHEET_IDS[sk];
      if (!sheetId) continue;
      resultado[sk] = {
        nombre: NOMBRES_SHEET[sk],
        datos: await leerSheet(sheets, sheetId),
      };
    }

    return res.status(200).json({
      ok: true,
      nombre: acceso.nombre,
      selector: acceso.selector || false,
      sheets: resultado,
    });
  } catch (err) {
    console.error("Error en /api/panel:", err);
    return res.status(500).json({ error: err.message });
  }
};
