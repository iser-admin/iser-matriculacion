const CARRERAS = {
  LOCUCION: {
    nombre: "Locución Integral",
    turno: true,
    pendientes: {
      "LOCUCION PRIMER AÑO": [
        "Expresión Corporal", "Tecnología I", "Informática",
        "Exp. Oral y Escrita", "Teorías de la Comunicación",
        "Pron. del Francés", "Pron. del Alemán", "Historia I", "Música"
      ],
      "LOCUCION SEGUNDO AÑO": [
        "Interpretación", "Inves y Red Periodística", "Literatura",
        "Pron. del Italiano", "Publicidad", "Tecnología II",
        "Taller de Libretos y Guiones", "Historia II",
        "Princ. de Estética e Historia del Arte"
      ],
      "LOCUCION TERCER AÑO": [
        "Oratoria", "Redacción", "Inglés", "Portugués",
        "Planific. y Gest. de Medios", "Régimen Legal",
        "Geopolítica", "Ética Profesional"
      ]
    },
    recursar: {
      "LOCUCION PRIMER AÑO": [
        "Locución I", "Foniatría I", "Expresión Corporal", "PITV I", "PIR I",
        "Tecnología I", "Informática I", "Exp. Oral y Escrita",
        "Teorías de la Comunicación", "Pron. del Francés",
        "Pron. del Alemán", "Historia I", "Música"
      ],
      "LOCUCION SEGUNDO AÑO": [
        "Locución II", "Foniatría II", "Interpretación", "PITV II", "PIR II",
        "Inves y Red Periodística", "Literatura", "Pron. del Italiano",
        "Publicidad", "Tecnología II", "Taller de Libretos y Guiones",
        "Historia II", "Princ. de Estética e Historia del Arte"
      ],
      "LOCUCION TERCER AÑO": [
        "Locución III", "Foniatría III", "Oratoria", "Doblaje", "PITV III",
        "PIR III", "Redacción", "Inglés", "Portugués",
        "Planific. y Gest. de Medios", "Régimen Legal de la Radiodifusión",
        "Geopolítica", "Ética Profesional"
      ]
    }
  },

  PRODUCCION: {
    nombre: "Producción y Dirección de Radio y TV",
    turno: false,
    pendientes: {
      "PRODUCCION PRIMER AÑO": [
        "GEI I", "Prin. edición y leng audiovisual", "Sonido y Musicalización",
        "Fundamentos de Tecnología", "Comp. e Iluminación",
        "Géneros Radiales y Televisivos", "Metodología Aplicada",
        "Vestuario y Ambientación", "Inglés I", "Historia del Arte"
      ],
      "PRODUCCION SEGUNDO AÑO": [
        "Post-Producción", "GEI II", "Puesta en Escena",
        "Realización Publicitaria", "TV de Exteriores",
        "Seminario de Creatividad", "Taller de Redacción", "Inglés II",
        "Historia Americana y Argentina", "Historia del Arte Contemporáneo",
        "Literatura I"
      ],
      "PRODUCCION TERCER AÑO": [
        "GEI III", "Radio y TV Educativa", "Gestión y Adm de Produc",
        "Dirección de Doblaje", "Régimen Legal",
        "Sem de Industrias Culturales", "Literatura II"
      ]
    },
    recursar: {
      "PRODUCCION PRIMER AÑO": [
        "GEI I", "Prin. edición y leng audiovisual", "Sonido y Musicalización",
        "Fundamentos de Tecnología", "Comp. e Iluminación", "PITV I", "PIR I",
        "Géneros Radiales y Televisivos", "Metodología Aplicada",
        "Vestuario y Ambientación", "Inglés I", "Historia del Arte"
      ],
      "PRODUCCION SEGUNDO AÑO": [
        "Post-Producción", "GEI II", "Puesta en Escena",
        "Realización Publicitaria", "TV de Exteriores", "PITV II", "PIR II",
        "Seminario de Creatividad", "Taller de Redacción", "Inglés II",
        "Historia Americana y Argentina", "Historia del Arte Contemporáneo",
        "Literatura I"
      ],
      "PRODUCCION TERCER AÑO": [
        "GEI III", "Radio y TV Educativa", "Gestión y Adm de Produc",
        "Dirección de Doblaje", "PITV III", "PIR III", "Régimen Legal",
        "Sem de Industrias Culturales", "Literatura"
      ]
    }
  },

  GUION: {
    nombre: "Guionista de Radio y Televisión",
    turno: false,
    pendientes: {
      "GUION PRIMER AÑO": [
        "Historia del espectáculo", "Taller de Escritura", "Creatividad I",
        "Inglés I", "Teorías de la Comunicación", "Informática e Internet",
        "Metodología de la Investigación"
      ],
      "GUION SEGUNDO AÑO": [
        "Creatividad II", "Inglés II", "Semiología",
        "Producción Radial y Televisiva", "Historia Social Argentina"
      ],
      "GUION TERCER AÑO": [
        "Creatividad III", "Lenguaje de las Artes Plásticas",
        "Lenguaje de la Música", "Técnicas de Actuación",
        "Introducción al Conocimiento Cultural"
      ]
    },
    recursar: {
      "GUION PRIMER AÑO": [
        "Guión I", "Lenguaje Audiovisual I", "Literatura Dramática",
        "Taller de Práctica Profesional I", "Historia del espectáculo",
        "Taller de Escritura", "Creatividad I", "Inglés I",
        "Teorías de la Comunicación", "Informática e Internet",
        "Metodología de la Investigación"
      ],
      "GUION SEGUNDO AÑO": [
        "Guión II", "Lenguaje Audiovisual II",
        "Géneros Literarios y Audiovisuales", "Taller de Práctica Profesional II",
        "Creatividad II", "Inglés II", "Semiología",
        "Producción Radial y Televisiva", "Historia Social Argentina"
      ],
      "GUION TERCER AÑO": [
        "Guión III", "Lenguaje Audiovisual III",
        "Taller de Práctica Profesional III", "Creatividad III",
        "Lenguaje de las Artes Plásticas", "Lenguaje de la Música",
        "Técnicas de Actuación", "Introducción al Conocimiento Cultural"
      ]
    }
  },

  OPERACION_RADIO: {
    nombre: "Operador/a Técnico/a - Orientación Estudio de Radio",
    turno: false,
    pendientes: {
      "O. RADIO PRIMER AÑO": [
        "Electroacústica", "Inglés técnico I", "Introducción a la electrónica",
        "Introducción a las Tecn. digitales",
        "Sistemas operativos de computación",
        "Eq. e Inst. de estudios de radio"
      ],
      "O. RADIO SEGUNDO AÑO": [
        "Régimen Legal de la Radiodif.", "Inglés técnico II",
        "Historia de la cultura", "Práctica profesional I",
        "Sistemas digitalización de audio"
      ],
      "O. RADIO TERCER AÑO": [
        "Semiología", "Inglés técnico III",
        "Metodología de la investigación",
        "Nuevas tecnologías de comunicaciones",
        "Práctica profesional II"
      ]
    },
    recursar: {
      "O. RADIO PRIMER AÑO": [
        "Electroacústica", "Inglés técnico I", "Introducción a la electrónica",
        "Introducción a las Tecn. Digitales",
        "Sistemas operativos de computación",
        "Operación estudio radio I", "Eq. e Inst. de estudios de radio"
      ],
      "O. RADIO SEGUNDO AÑO": [
        "Régimen Legal de la Radiodif.", "Inglés técnico II",
        "Operación estudio radio II", "Historia de la cultura",
        "Práctica profesional I", "Sistemas digitalización de audio"
      ],
      "O. RADIO TERCER AÑO": [
        "Semiología", "Inglés técnico III",
        "Metodología de la investigación",
        "Nuevas tecnologías de comunicaciones",
        "Op. de Sist. de audio profesional",
        "Sistema de edición digital", "Práctica profesional II"
      ]
    }
  },

  OPERACION_TV: {
    nombre: "Operador/a Técnico/a - Orientación Estudio de Televisión",
    turno: false,
    pendientes: {
      "OP. TV PRIMER AÑO": [
        "Electroacústica", "Inglés técnico I", "Introducción a la electrónica",
        "Introducción a las Tecn. digitales",
        "Sistemas operativos de computación",
        "Composición y fotografía", "Eq. e Inst. de estudios de TV",
        "Intro. a las Posproducción de video"
      ],
      "OP. TV SEGUNDO AÑO": [
        "Régimen Legal de la Radiodif.", "Inglés técnico II",
        "Historia de la cultura", "GEI",
        "Introducción a la producción TV"
      ],
      "OP. TV TERCER AÑO": [
        "Semiología", "Inglés técnico III",
        "Metodología de la investigación",
        "Nuevas tecnologías de comunicaciones",
        "Posproducción", "GEI 2", "Montaje"
      ]
    },
    recursar: {
      "OP. TV PRIMER AÑO": [
        "Electroacústica", "Inglés técnico I", "Introducción a la electrónica",
        "Introducción a las Tecn. digitales",
        "Sistemas operativos de computación",
        "Operación estudio TV 1", "Composición y fotografía",
        "Eq. e Inst. de estudios de TV",
        "Intro. a las Posproducción de video"
      ],
      "OP. TV SEGUNDO AÑO": [
        "Régimen Legal de la Radiodif.", "Inglés técnico II", "Audio",
        "Historia de la cultura", "Cámara", "Iluminación",
        "Posproducción de video", "GEI",
        "Introducción a la producción TV"
      ],
      "OP. TV TERCER AÑO": [
        "Semiología", "Inglés técnico III",
        "Metodología de la investigación",
        "Nuevas tecnologías de comunicaciones",
        "Práctica de posproducción", "Posproducción",
        "GEI II", "Montaje"
      ]
    }
  },

  OPERACION_PLANTA: {
    nombre: "Operador/a Técnico/a - Orientación Planta Transmisora",
    turno: false,
    pendientes: {
      "O. PLANTA PRIMER AÑO": [
        "Electroacústica", "Inglés técnico I",
        "Introducción a la electrónica",
        "Introducción a las Tecn. digitales",
        "Sistemas operativos de computación",
        "Electrónica aplicada a planta AM", "Suministro de energía"
      ],
      "O. PLANTA SEGUNDO AÑO": [
        "Régimen Legal de la Radiodifusión", "Inglés técnico II",
        "Electro. Aplic. a planta FM y TV", "Eq. Estudio radio y TV",
        "Mediciones prácticas electrónicas",
        "Tec. Dig. Aplic a planta FM y TV"
      ]
    },
    recursar: {
      "O. PLANTA PRIMER AÑO": [
        "Electroacústica", "Inglés técnico I",
        "Introducción a la electrónica",
        "Introducción a las Tecn. digitales",
        "Sistemas operativos de computación",
        "Tecn. Oper. y Mant. de planta AM",
        "Electrónica aplicada a planta AM", "Suministro de energía"
      ],
      "O. PLANTA SEGUNDO AÑO": [
        "Régimen Legal de la Radiodifusión", "Inglés técnico II",
        "Tecn. Oper. y Mant. de planta CATV",
        "Tecn. Oper. y Mant. de planta FM",
        "Tecn. Oper. y Mant. de planta TV",
        "Electro. Aplic. a planta FM y TV", "Eq. Estudio radio y TV",
        "Mediciones y prácticas electrónicas",
        "Tec. Dig. Aplic a planta FM y TV"
      ]
    }
  },

  CONVERGENCIA: {
    nombre: "Convergencia",
    turno: false,
    pendientes: {
      "CONVERGENCIA PRIMER AÑO": [],
      "CONVERGENCIA SEGUNDO AÑO": [],
      "CONVERGENCIA TERCER AÑO": []
    },
    recursar: {
      "CONVERGENCIA PRIMER AÑO": [],
      "CONVERGENCIA SEGUNDO AÑO": [],
      "CONVERGENCIA TERCER AÑO": []
    }
  }
};
