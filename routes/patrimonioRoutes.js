const { Router } = require("express");
const fs = require("fs");
const multer = require("multer");
const path = require("path");
const express = require('express');
const uploadPath = "../tempUploads";
const pdfPath = "../pdf";
const app = express();
const router = Router();
const {
  editarCategoriaPatrimonio,
  editarEstadoPatrimonio,
  editarMaterialPatrimonio,
  editarTipologiaPatrimonio,
  editarAutorPartimonio,
  editarUbicacionPatrimonio,
  crearPatrimonioImagenes,
  listarTipologiaPatrimonio,
  listarCategoriaPatrimonio,
  listarMaterialPatrimonio,
  listarEstadoPatrimonio,
  listarAutorPatrimonio,
  listarUbicacionPatrimonio,
  listarPatrimonio,
  listarPatrimonioPorId,
  listarPatrimonioBack,
  listarCategoriaPatrimonioBack,
  listarTipologiaPatrimonioBack,
  listarMaterialPatrimonioBack,
  listarEstadoPatrimonioBack,
  listarAutorPatrimonioBack,
  listarUbicacionPatrimonioBack,
  agregarPatrimonio,
  deshabilitarPatrimonio,
  agregarAutorPatrimonio,
  agregarEstadoPatrimonio,
  agregarMaterialPatrimonio,
  agregarTipologiaPatrimonio,
  agregarCategoriaPatrimonio,
  agregarUbicacionPatrimonio,
  editarPatrimonio,
  obtenerImagenCard,
  editarPatrimonioImagenes,
  renombrarPatrimonio,
  obtenerImagenesPatri,
  crearBannerImagenes,
  obtenerImagenesBanner,
  obtenerBanners,
  imagenPreview,
  deshabilitarBanner,
} = require("../controllers/patrimonioControllers");

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

const storage1 = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, uploadPath); // Usa la variable uploadPath
  },
  filename: function (req, file, cb) {
    const nombrePatrimonio = req.body.nombre_patrimonio; // Asegúrate de que esto existe
    cb(
      null,
      `${nombrePatrimonio}-${Date.now()}${path.extname(file.originalname)}`
    );
  },
});

const storagePatrimonio = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, pdfPath);
  },
  filename: (req, file, cb) => {
    console.log(req);
    const { nombre_patrimonio } = req.body;
    // console.log(req)
    if (!nombre_patrimonio) {
      return cb(
        new Error(
          "nombre_patrimonio no está definido en el cuerpo de la solicitud"
        )
      );
    }
    const finalName = nombre_patrimonio.replace(/\s+/g, "").trim();
    const nombreArchivo = `${finalName}.jpg`;
    cb(null, nombreArchivo);
  },
});

const upload1 = multer({
  storage: storage1,
  limits: { fileSize: 1000000 },
});

const parseMultipartFormData = (req, res, next) => {
  try {
    const uploadPath = path.join(__dirname, "../tempUploads");

    // Crear la carpeta si no existe
    if (!fs.existsSync(uploadPath)) {
      fs.mkdirSync(uploadPath, { recursive: true });
    }

    const contentType = req.headers["content-type"];
    if (!contentType || !contentType.startsWith("multipart/form-data")) {
      return res.status(400).json({ message: "Invalid Content-Type" });
    }

    const boundary = contentType.split("boundary=")[1];
    if (!boundary) {
      return res.status(400).json({ message: "Boundary not found" });
    }

    let rawData = Buffer.alloc(0);
    const boundaryBuffer = Buffer.from(`--${boundary}`);

    req.on("data", (chunk) => {
      rawData = Buffer.concat([rawData, chunk]);
    });

    req.on("end", () => {
      let parts = [];
      let start = 0;
      let boundaryIndex = rawData.indexOf(boundaryBuffer);

      while (boundaryIndex !== -1) {
        parts.push(rawData.slice(start, boundaryIndex));
        start = boundaryIndex + boundaryBuffer.length;
        boundaryIndex = rawData.indexOf(boundaryBuffer, start);
      }

      req.files = {};
      req.body = {};

      parts.forEach((part) => {
        const headerEndIndex = part.indexOf("\r\n\r\n");
        if (headerEndIndex === -1) return;

        const header = part.slice(0, headerEndIndex).toString();
        const body = part.slice(headerEndIndex + 4, part.length - 2); // Eliminar los CRLF al final

        const filenameMatch = header.match(/filename="(.+)"/);
        const fieldnameMatch = header.match(/name="(.+)"/);

        if (filenameMatch && fieldnameMatch) {
          const filename = filenameMatch[1];
          const fieldname = fieldnameMatch[1];
          const filePath = path.join(uploadPath, filename);

          fs.writeFileSync(filePath, body);
          req.files[fieldname] = {
            originalFilename: filename,
            filepath: filePath,
          };
        } else if (fieldnameMatch) {
          const fieldname = fieldnameMatch[1];
          req.body[fieldname] = body.toString();
        }
      });

      next();
    });
  } catch (error) {
    next(error);
  }
};

// Controlador para subir y renombrar archivos
app.post(
  "/admin/editarPatrimonioImagenes",
  parseMultipartFormData,
  (req, res) => {
    const { nombre_patrimonio } = req.body;
    const file = req.files["imagenCarrousel1"]; // El archivo que recibiste

    if (!file || !nombre_patrimonio) {
      return res
        .status(400)
        .json({ message: "Missing file or nombre_patrimonio" });
    }

    // Renombrar el archivo con el nombre del patrimonio
    const extension = path.extname(file.originalFilename); // Obtener la extensión
    const newFileName = `${nombre_patrimonio}${extension}`;
    const newPath = path.join(__dirname, "uploads", newFileName);

    // Mover el archivo a su nueva ubicación con el nombre modificado
    fs.rename(file.filepath, newPath, (err) => {
      if (err) {
        return res.status(500).send("Error al renombrar el archivo");
      }
      res.send("Archivo subido y renombrado correctamente");
    });
  }
);

router.get("/listarPatrimonio", listarPatrimonioBack);
router.get("/listarCategorias", listarCategoriaPatrimonioBack);
router.get("/listarTipologias", listarTipologiaPatrimonioBack);
router.get("/listarMateriales", listarMaterialPatrimonioBack);
router.get("/listarEstados", listarEstadoPatrimonioBack);
router.get("/listarAutores", listarAutorPatrimonioBack);
router.get("/listarUbicaciones", listarUbicacionPatrimonioBack);
// router.get("/obtenerImagenes", obtenerImagenes);
router.get("/obtenerImagenesPatri", obtenerImagenesPatri);
router.get("/obtenerImagenCard", obtenerImagenCard);
router.post("/agregarPatrimonio", agregarPatrimonio);
router.post(
  "/crearBannerImagenes",
  upload1.single("imagen_banner"),
  crearBannerImagenes
);
router.post("/obtenerImagenesBanner", obtenerImagenesBanner);
router.get("/obtenerBanners", obtenerBanners);
router.get("/imagenPreview", imagenPreview);
router.post("/deshabilitarBanner", deshabilitarBanner);
router.post(
  "/crearPatrimonioImagenes",
  parseMultipartFormData,
  crearPatrimonioImagenes
);
router.post("/editarPatrimonio", editarPatrimonio);
router.post(
  "/editarPatrimonioImagenes",
  parseMultipartFormData,
  editarPatrimonioImagenes
);
router.post("/renombrarPatrimonio", renombrarPatrimonio);
router.post("/editarCategoriaPatrimonio", editarCategoriaPatrimonio);
router.post("/editarTipologiaPatrimonio", editarTipologiaPatrimonio);
router.post("/editarMaterialPatrimonio", editarMaterialPatrimonio);
router.post("/editarEstadoPatrimonio", editarEstadoPatrimonio);
router.post("/editarAutorPartimonio", editarAutorPartimonio);
router.post("/editarUbicacionPatrimonio", editarUbicacionPatrimonio);

router.post("/agregarAutor", agregarAutorPatrimonio);
router.post("/agregarEstado", agregarEstadoPatrimonio);
router.post("/agregarMaterial", agregarMaterialPatrimonio);
router.post("/agregarTipologia", agregarTipologiaPatrimonio);
router.post("/agregarCategoria", agregarCategoriaPatrimonio);
router.post("/agregarUbicacion", agregarUbicacionPatrimonio);
router.post("/deshabilitarPatrimonio", deshabilitarPatrimonio);

router.get("/listarTipologiasPatrimonio", listarTipologiaPatrimonio);
router.get("/listarCategoriasPatrimonio", listarCategoriaPatrimonio);
router.get("/listarMaterialesPatrimonio", listarMaterialPatrimonio);
router.get("/listarEstadosPatrimonio", listarEstadoPatrimonio);
router.get("/listarAutoresPatrimonio", listarAutorPatrimonio);
router.get("/listarUbicacionesPatrimonio", listarUbicacionPatrimonio);
router.get("/listarPatrimonios", listarPatrimonio);
router.get("/listarPatrimoniosPorId/:id", listarPatrimonioPorId);

module.exports = {
  router,
  agregarPatrimonio,
  agregarCategoriaPatrimonio,
  agregarEstadoPatrimonio,
  agregarAutorPatrimonio,
  agregarMaterialPatrimonio,
  agregarUbicacionPatrimonio,
  agregarTipologiaPatrimonio,
  listarTipologiaPatrimonio,
  listarCategoriaPatrimonio,
  listarMaterialPatrimonio,
  listarEstadoPatrimonio,
  listarAutorPatrimonio,
  listarUbicacionPatrimonio,
  listarPatrimonio,
  listarPatrimonioPorId,
  listarPatrimonioBack,
  listarAutorPatrimonioBack,
  listarTipologiaPatrimonioBack,
  listarCategoriaPatrimonioBack,
  listarMaterialPatrimonioBack,
  listarEstadoPatrimonioBack,
  listarUbicacionPatrimonioBack,
  deshabilitarPatrimonio,
  editarPatrimonio,
  editarPatrimonioImagenes,
  crearPatrimonioImagenes,
  obtenerImagenesPatri,
  obtenerImagenCard,
  renombrarPatrimonio,
  editarCategoriaPatrimonio,
  editarTipologiaPatrimonio,
  editarMaterialPatrimonio,
  editarEstadoPatrimonio,
  editarAutorPartimonio,
  editarUbicacionPatrimonio,
  crearBannerImagenes,
  obtenerImagenesBanner,
  obtenerBanners,
  imagenPreview,
  deshabilitarBanner,
};
