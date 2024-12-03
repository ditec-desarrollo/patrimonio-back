const {
  conectarBDEstadisticasMySql,
  conectarSMTPatrimonio,
} = require("../config/dbEstadisticasMYSQL");
const { conectarSMTContratacion } = require("../config/dbEstadisticasMYSQL");
const { sequelize_ciu_digital_derivador } = require("../config/sequelize");
const Proceso = require("../models/Derivador/Proceso");
const PermisoTUsuario = require("../models/Derivador/PermisoTUsuario");
const fs = require("fs");
const path = require("path");
const { conectarFTPCiudadano } = require("../config/winscpCiudadano");
const { conectarSFTPCondor } = require("../config/winscpCondor");
const { conectar_smt_Patrimonio_MySql } = require('../config/dbEstadisticasMYSQL');

const listarTipologiaPatrimonio = async (req, res) => {
  const connection = await conectarSMTPatrimonio();
  try {
    const [tipologias] = await connection.execute(
      "SELECT * FROM tipologia WHERE habilita = 1"
    );
    connection.end();
    res.status(200).json({ tipologias });
  } catch (error) {
    res.status(500).json({ message: error.message || "Algo salió mal :(" });
  }
};

const listarCategoriaPatrimonio = async (req, res) => {
  const connection = await conectarSMTPatrimonio();
  try {
    const [categorias] = await connection.execute(
      "SELECT * FROM categoria WHERE habilita = 1"
    );
    connection.end();
    res.status(200).json({ categorias });
  } catch (error) {
    res.status(500).json({ message: error.message || "Algo salió mal :(" });
  }
};

const listarMaterialPatrimonio = async (req, res) => {
  const connection = await conectarSMTPatrimonio();
  try {
    const [materiales] = await connection.execute(
      "SELECT * FROM material WHERE habilita = 1"
    );
    connection.end();
    res.status(200).json({ materiales });
  } catch (error) {
    res.status(500).json({ message: error.message || "Algo salió mal :(" });
  }
};

const listarEstadoPatrimonio = async (req, res) => {
  const connection = await conectarSMTPatrimonio();
  try {
    const [estados] = await connection.execute(
      "SELECT * FROM estado WHERE habilita = 1"
    );
    connection.end();
    res.status(200).json({ estados });
  } catch (error) {
    res.status(500).json({ message: error.message || "Algo salió mal :(" });
  }
};

const listarAutorPatrimonio = async (req, res) => {
  const connection = await conectarSMTPatrimonio();
  try {
    const [autores] = await connection.execute(
      "SELECT * FROM autor WHERE habilita = 1"
    );
    connection.end();
    res.status(200).json({ autores });
  } catch (error) {
    res.status(500).json({ message: error.message || "Algo salió mal :(" });
  }
};

const listarUbicacionPatrimonio = async (req, res) => {
  const connection = await conectarSMTPatrimonio();
  try {
    const [ubicaciones] = await connection.execute(
      "SELECT * FROM ubicacion WHERE habilita = 1"
    );
    connection.end();
    res.status(200).json({ ubicaciones });
  } catch (error) {
    res.status(500).json({ message: error.message || "Algo salió mal :(" });
  }
};

const listarPatrimonio = async (req, res) => {
  const connection = await conectarSMTPatrimonio();
  try {
    const [patrimonios] = await connection.execute(
      "SELECT * FROM patrimonio WHERE habilita = 1"
    );
    connection.end();
    res.status(200).json({ patrimonios });
  } catch (error) {
    res.status(500).json({ message: error.message || "Algo salió mal :(" });
  }
};

const listarPatrimonioPorId = async (req, res) => {
  const { id } = req.params;
  const sql =
    "SELECT p.*, a.nombre_autor, a.descripcion_autor, u.nombre_ubicacion, p.latylon FROM patrimonio p LEFT JOIN autor a ON p.id_autor = a.id_autor LEFT JOIN ubicacion u ON p.id_ubicacion = u.id_ubicacion WHERE p.id_patrimonio = ?";
  const values = [id];
  try {
    const connection = await conectarSMTPatrimonio();
    const [patrimonio] = await connection.execute(sql, values);
    await connection.end();
    if (patrimonio.length > 0) {
      res.status(200).json({ patrimonio });
    } else {
      res.status(400).json({ message: "No se encontró el patrimonio" });
    }
  } catch (error) {
    res.status(500).json({ message: error.message || "Algo salió mal :(" });
  }
};

const agregarCategoriaPatrimonio = async (req, res) => {
  let connection;
  try {
    const { nombre_categoria, habilita } = req.body;

    if (nombre_categoria === undefined || habilita === undefined) {
      throw new Error("Los parámetros de la solicitud son inválidos");
    }

    const sql =
      "INSERT INTO categoria (nombre_categoria, habilita) VALUES (?, ?)";
    const values = [nombre_categoria, habilita];

    connection = await conectarSMTPatrimonio();
    const [result] = await connection.execute(sql, values);
    const nuevoId = result.insertId;

    res
      .status(201)
      .json({ id: nuevoId, message: "Categoria creada con éxito" });
  } catch (error) {
    res.status(500).json({ message: error.message || "Algo salió mal :(" });
  } finally {
    connection.end();
  }
};

const agregarTipologiaPatrimonio = async (req, res) => {
  let connection;
  try {
    const { nombre_tipologia, habilita } = req.body;

    if (nombre_tipologia === undefined || habilita === undefined) {
      throw new Error("Los parámetros de la solicitud son inválidos");
    }

    const sql =
      "INSERT INTO tipologia (nombre_tipologia, habilita) VALUES (?, ?)";
    const values = [nombre_tipologia, habilita];

    connection = await conectarSMTPatrimonio();
    const [result] = await connection.execute(sql, values);
    const nuevoId = result.insertId;

    res
      .status(201)
      .json({ id: nuevoId, message: "Tipología creada con éxito" });
  } catch (error) {
    res.status(500).json({ message: error.message || "Algo salió mal :(" });
  } finally {
    connection.end();
  }
};

const agregarMaterialPatrimonio = async (req, res) => {
  let connection;
  try {
    const { nombre_material, habilita } = req.body;

    if (nombre_material === undefined || habilita === undefined) {
      throw new Error("Los parámetros de la solicitud son inválidos");
    }

    const sql =
      "INSERT INTO material (nombre_material, habilita) VALUES (?, ?)";
    const values = [nombre_material, habilita];

    connection = await conectarSMTPatrimonio();
    const [result] = await connection.execute(sql, values);
    const nuevoId = result.insertId;

    res.status(201).json({ id: nuevoId, message: "Material creado con éxito" });
  } catch (error) {
    res.status(500).json({ message: error.message || "Algo salió mal :(" });
  } finally {
    connection.end();
  }
};

const agregarEstadoPatrimonio = async (req, res) => {
  let connection;
  try {
    const { nombre_estado, habilita } = req.body;

    if (nombre_estado === undefined || habilita === undefined) {
      throw new Error("Los parámetros de la solicitud son inválidos");
    }

    const sql = "INSERT INTO estado (nombre_estado, habilita) VALUES (?, ?)";
    const values = [nombre_estado, habilita];

    connection = await conectarSMTPatrimonio();
    const [result] = await connection.execute(sql, values);
    const nuevoId = result.insertId;

    res.status(201).json({ id: nuevoId, message: "Estado creado con éxito" });
  } catch (error) {
    res.status(500).json({ message: error.message || "Algo salió mal :(" });
  } finally {
    connection.end();
  }
};

const agregarAutorPatrimonio = async (req, res) => {
  let connection;
  try {
    const { nombre_autor, descripcion_autor, habilita } = req.body;

    if (nombre_autor === undefined || habilita === undefined) {
      throw new Error("Los parámetros de la solicitud son inválidos");
    }

    const sql =
      "INSERT INTO autor (nombre_autor, descripcion_autor, habilita) VALUES (?, ?, ?)";
    const values = [nombre_autor, descripcion_autor, habilita];

    connection = await conectarSMTPatrimonio();
    const [result] = await connection.execute(sql, values);
    const nuevoId = result.insertId;

    res.status(201).json({ id: nuevoId, message: "Autor creado con éxito" });
  } catch (error) {
    res.status(500).json({ message: error.message || "Algo salió mal :(" });
  } finally {
    connection.end();
  }
};

const agregarUbicacionPatrimonio = async (req, res) => {
  let connection;
  try {
    const { nombre_ubicacion, habilita } = req.body;

    if (nombre_ubicacion === undefined || habilita === undefined) {
      throw new Error("Los parámetros de la solicitud son inválidos");
    }

    const sql =
      "INSERT INTO ubicacion (nombre_ubicacion, habilita) VALUES (?, ?)";
    const values = [nombre_ubicacion, habilita];

    connection = await conectarSMTPatrimonio();
    const [result] = await connection.execute(sql, values);
    const nuevoId = result.insertId;

    res.status(201).json({ id: nuevoId, message: "Autor creado con éxito" });
  } catch (error) {
    res.status(500).json({ message: error.message || "Algo salió mal :(" });
  } finally {
    connection.end();
  }
};

const agregarPatrimonio = async (req, res) => {
  let connection;

  try {
    const {
      nombre_patrimonio,
      anio_emplazamiento,
      descripcion,
      origen,
      id_categoria,
      id_tipologia,
      id_material,
      id_estado,
      id_autor,
      id_ubicacion,
      latylon,
      habilita,
    } = req.body;


    const nombre_archivo = nombre_patrimonio;

    const sql =
      "INSERT INTO patrimonio (nombre_patrimonio, anio_emplazamiento, descripcion, origen, id_categoria, id_tipologia, id_material, id_estado, id_autor, id_ubicacion, latylon, nombre_archivo, habilita) VALUES (?, ?, ?, ?, ?, ? , ?, ?, ?, ?, ?, ?, ?)";
    const values = [
      nombre_patrimonio,
      anio_emplazamiento,
      descripcion,
      origen,
      id_categoria,
      id_tipologia,
      id_material,
      id_estado,
      id_autor,
      id_ubicacion,
      latylon,
      nombre_archivo,
      habilita,
    ];

    connection = await conectarSMTPatrimonio();
    const [patrimonio] = await connection.execute(sql, values);
    res.status(201).json({
      message: "Patrimonio subido con éxito",
    });
  } catch (error) {
    console.error("Error al subir el patrimonio:", error);
    if (error.response) {
      console.error("Error del servidor:", error.response.data);
    }
  }
};

const crearPatrimonioImagenes = async (req, res) => {
  let sftp;

  try {
    const { nombre_patrimonio } = req.body;
    const newImage = req.files;
    console.log(newImage);
    const archivosKeys = Object.keys(newImage);

    sftp = await conectarSFTPCondor();
    for (let key of archivosKeys) {
      let archivo = newImage[key];

      if (key.includes("imagen_card")) {
        await procesarImagen(archivo, "_card", sftp, nombre_patrimonio);
      }
      if (key.includes("imagen_carrousel_1")) {
        await procesarImagen(archivo, "_1", sftp, nombre_patrimonio);
      }
      if (key.includes("imagen_carrousel_2")) {
        await procesarImagen(archivo, "_2", sftp, nombre_patrimonio);
      }
      if (key.includes("imagen_carrousel_3")) {
        await procesarImagen(archivo, "_3", sftp, nombre_patrimonio);
      }
    }

    res.status(200).json({ message: "Imagen actualizada correctamente." });
  } catch (error) {
    res.status(500).json({ message: error.message || "Algo salió mal :(" });
  } finally {
    if (sftp) sftp.end();
  }
};

const obtenerImagenesPatri = async (req, res) => {
  let sftp;
  const nombreArchivo = req.query.nombreArchivo;
  console.log(nombreArchivo, "Nombre archivo recibido ImagenesPatri");

  const archivosBuscados = [
    `${nombreArchivo}_card`,
    `${nombreArchivo}_1`,
    `${nombreArchivo}_2`,
    `${nombreArchivo}_3`,
  ];

  try {
    sftp = await conectarSFTPCondor();
    const remotePath = `/var/www/vhosts/cidituc.smt.gob.ar/Fotos-Patrimonio/${nombreArchivo}/`;

    const archivosRemotos = await sftp.list(remotePath);

    const imagenesEncontradas = {};

    for (const archivoRemoto of archivosRemotos) {
      const nombreSinExtension = archivoRemoto.name.split(".")[0];

      if (archivosBuscados.includes(nombreSinExtension)) {
        const remoteFilePath = `${remotePath}${archivoRemoto.name}`;
        const buffer = await sftp.get(remoteFilePath);

        const base64Image = buffer.toString("base64");

        imagenesEncontradas[nombreSinExtension] = {
          nombre: archivoRemoto.name,
          imagen: base64Image,
        };
      }
    }

    if (Object.keys(imagenesEncontradas).length === 0) {
      const imagenBase = archivosRemotos.find((archivoRemoto) => {
        const nombreSinExtension = archivoRemoto.name.split(".")[0];
        return nombreSinExtension === nombreArchivo; // Buscar la imagen base
      });

      if (imagenBase) {
        const remoteFilePath = `${remotePath}${imagenBase.name}`;
        const buffer = await sftp.get(remoteFilePath);
        const base64Image = buffer.toString("base64");
        imagenesEncontradas[nombreArchivo] = {
          nombre: imagenBase.name,
          imagen: base64Image,
        };
      }
    }

    const imagenesOrdenadas = archivosBuscados
      .map((nombreBuscado) => imagenesEncontradas[nombreBuscado])
      .filter(Boolean);

    res.json(imagenesOrdenadas);
  } catch (error) {
    console.error("Error fetching images:", error);
    res.status(500).json({ error: "Error fetching images" });
  } finally {
    if (sftp) {
      sftp.end();
    }
  }
};

const obtenerImagenCard = async (req, res) => {
  let sftp;
  const archivosBuscados = req.query.archivosBuscados;
  console.log(archivosBuscados, "Nombres de archivos recibidos ImagenCard");

  try {
    sftp = await conectarSFTPCondor();
    const remotePath = "/var/www/vhosts/cidituc.smt.gob.ar/Fotos-Patrimonio/";

    const imagenesEncontradas = {};

    for (const nombreArchivo of archivosBuscados) {
      const carpetaPatrimonio = `${remotePath}${nombreArchivo}/`;
      const archivoEsperado = `${nombreArchivo}_card`;

      const existeCarpeta = await sftp.exists(carpetaPatrimonio);
      if (!existeCarpeta) {
        console.log(`La carpeta ${carpetaPatrimonio} no existe.`);
        continue;
      }
      // console.log(archivoEsperado, "archivoEsperado ImagenCard");

      const archivosRemotos = await sftp.list(carpetaPatrimonio);

      const archivoRemoto = archivosRemotos.find((archivo) =>
        archivo.name.startsWith(archivoEsperado)
      );
      // console.log(archivoRemoto, "archivoRemoto ImagenCard");
      if (archivoRemoto) {
        const remoteFilePath = `${carpetaPatrimonio}${archivoRemoto.name}`;
        const buffer = await sftp.get(remoteFilePath);
        const base64Image = buffer.toString("base64");

        imagenesEncontradas[nombreArchivo] = {
          [archivoEsperado]: base64Image,
        };
      }
    }
    res.status(200).json({ imagenesEncontradas });
  } catch (error) {
    console.error("Error al obtener imágenes:", error);
    res.status(500).json({
      message: error.message || "Error al obtener imágenes.ImagenCard",
    });
  } finally {
    if (sftp) sftp.end();
  }
};

const editarPatrimonio = async (req, res) => {
  let connection;
  try {
    const {
      nombre_patrimonio,
      anio_emplazamiento,
      descripcion,
      origen,
      id_categoria,
      id_tipologia,
      id_material,
      id_estado,
      id_autor,
      id_ubicacion,
      latylon,
      habilita,
      id_patrimonio,
      oldName,
    } = req.body;

    const nombre_archivo = nombre_patrimonio;

    const sql =
      "UPDATE patrimonio SET nombre_patrimonio = ?, anio_emplazamiento = ?, descripcion = ?, origen = ?, id_categoria = ?, id_tipologia = ?, id_material = ?, id_estado = ?, id_autor = ?, id_ubicacion = ?, latylon = ?, nombre_archivo = ?, habilita = ? WHERE id_patrimonio = ?";
    const values = [
      nombre_patrimonio,
      anio_emplazamiento,
      descripcion,
      origen,
      id_categoria,
      id_tipologia,
      id_material,
      id_estado,
      id_autor,
      id_ubicacion,
      latylon,
      nombre_archivo,
      habilita,
      id_patrimonio,
    ];

    connection = await conectarSMTPatrimonio();
    const [patrimonio] = await connection.execute(sql, values);
    res.status(201).json({
      message: "Patrimonio editado con éxito",
    });
  } catch (error) {
    console.error("Error al editar el patrimonio:", error);
    if (error.response) {
      console.error("Error del servidor:", error.response.data);
    }
  } finally {
    connection.end();
  }
};

const editarPatrimonioImagenes = async (req, res) => {
  let sftp;
  let db;
  db = await conectarSMTPatrimonio();

  try {
    const { id_patrimonio, nombre_patrimonio } = req.body;
    const newImage = req.files;
    console.log(newImage);
    const archivosKeys = Object.keys(newImage);

    const [patrimonio] = await db.query(
      "SELECT nombre_archivo FROM patrimonio WHERE id_patrimonio = ?",
      [id_patrimonio]
    );
    if (!patrimonio.length) {
      return res.status(404).json({ message: "Patrimonio no encontrado" });
    }

    sftp = await conectarSFTPCondor();
    for (let key of archivosKeys) {
      let archivo = newImage[key];

      if (key.includes("imagen_card")) {
        await procesarImagen(archivo, "_card", sftp, nombre_patrimonio);
      }
      if (key.includes("imagen_carrousel_1")) {
        await procesarImagen(archivo, "_1", sftp, nombre_patrimonio);
      }
      if (key.includes("imagen_carrousel_2")) {
        await procesarImagen(archivo, "_2", sftp, nombre_patrimonio);
      }
      if (key.includes("imagen_carrousel_3")) {
        await procesarImagen(archivo, "_3", sftp, nombre_patrimonio);
      }
    }

    res.status(200).json({ message: "Imagen actualizada correctamente." });
  } catch (error) {
    res.status(500).json({ message: error.message || "Algo salió mal :(" });
  } finally {
    if (sftp) sftp.end();
  }
};

async function procesarImagen(archivo, carrouselKey, sftp, nombre) {
  const extension = path.extname(archivo.originalFilename);
  const newFilename = `${nombre}${carrouselKey}${extension}`;
  const newPath = path.join(__dirname, "../tempUploads/", newFilename);

  await new Promise((resolve, reject) => {
    fs.rename(archivo.filepath, newPath, (err) => {
      if (err) {
        console.error(`Error renombrando el archivo ${carrouselKey}:`, err);
        return reject(err);
      }
      console.log(`Archivo ${carrouselKey} renombrado a: ${newFilename}`);
      resolve();
    });
  });

  const remotePath = `/var/www/vhosts/cidituc.smt.gob.ar/Fotos-Patrimonio/${nombre}`;
  try {
    const remoteDirExists = await sftp.exists(remotePath);
    if (!remoteDirExists) {
      await sftp.mkdir(remotePath, true);
      console.log(`Carpeta creada en el servidor SFTP: ${remotePath}`);
    }
  } catch (error) {
    console.error(
      `Error comprobando o creando la carpeta ${remotePath}:`,
      error
    );
    throw error;
  }

  const rutaArchivo = `${remotePath}/${newFilename}`;
  try {
    await sftp.fastPut(newPath, rutaArchivo);
    console.log(
      `Archivo ${newFilename} subido al servidor SFTP en: ${rutaArchivo}`
    );
  } catch (error) {
    console.error(`Error subiendo ${newFilename} al servidor SFTP:`, error);
    throw error;
  }
}

const renombrarPatrimonio = async (req, res) => {
  let sftp;
  let db;
  db = await conectarSMTPatrimonio();

  try {
    const { id_patrimonio, nombre_antiguo, nombre_nuevo } = req.body;

    if (!nombre_antiguo || !nombre_nuevo) {
      return res
        .status(400)
        .json({ message: "Faltan datos para renombrar el patrimonio." });
    }

    const [patrimonio] = await db.query(
      "SELECT nombre_archivo FROM patrimonio WHERE id_patrimonio = ?",
      [id_patrimonio]
    );
    if (!patrimonio.length) {
      return res.status(404).json({ message: "Patrimonio no encontrado" });
    }

    sftp = await conectarSFTPCondor();

    const oldFolderPath = `/var/www/vhosts/cidituc.smt.gob.ar/Fotos-Patrimonio/${nombre_antiguo}`;
    const newFolderPath = `/var/www/vhosts/cidituc.smt.gob.ar/Fotos-Patrimonio/${nombre_nuevo}`;

    const oldFolderExists = await sftp.exists(oldFolderPath);

    if (!oldFolderExists) {
      console.log(
        `La carpeta ${oldFolderPath} no existe. Creando la carpeta con el nuevo nombre...`
      );
      await sftp.mkdir(newFolderPath, true);
      console.log(`Carpeta ${newFolderPath} creada exitosamente.`);
    } else {
      const newFolderExists = await sftp.exists(newFolderPath);
      if (newFolderExists) {
        console.log(`La carpeta ${newFolderPath} ya existe. Eliminándola...`);
        await sftp.rmdir(newFolderPath, true);
        console.log(`Carpeta ${newFolderPath} eliminada exitosamente.`);
      }

      await sftp.rename(oldFolderPath, newFolderPath);
      console.log(`Carpeta renombrada de ${nombre_antiguo} a ${nombre_nuevo}`);

      const files = await sftp.list(newFolderPath);

      if (!files || files.length === 0) {
        console.log("La carpeta existe pero no tiene archivos.");
      } else {
        console.log("Archivos listados:", files);
        for (let file of files) {
          if (file.name && file.name.includes(nombre_antiguo)) {
            const oldFilePath = `${newFolderPath}/${file.name}`;
            const newFilename = file.name.replace(nombre_antiguo, nombre_nuevo);
            const newFilePath = `${newFolderPath}/${newFilename}`;

            await sftp.rename(oldFilePath, newFilePath);
            console.log(`Archivo renombrado: ${file.name} a ${newFilename}`);
          } else {
            console.log(`Archivo ${file.name} no contiene el nombre antiguo.`);
          }
        }
      }
    }

    await db.query(
      "UPDATE patrimonio SET nombre_patrimonio = ? WHERE id_patrimonio = ?",
      [nombre_nuevo, id_patrimonio]
    );

    res
      .status(200)
      .json({ message: "Carpeta y archivos renombrados correctamente." });
  } catch (error) {
    console.error("Error al renombrar patrimonio:", error);
    res
      .status(500)
      .json({ message: error.message || "Error al renombrar el patrimonio." });
  } finally {
    if (sftp) sftp.end();
  }
};

const listarPatrimonioBack = async (req, res) => {
  const connection = await conectarSMTPatrimonio();
  try {
    const [patrimonios] = await connection.execute(
      "SELECT patrimonio.*, ubicacion.nombre_ubicacion, tipologia.nombre_tipologia FROM patrimonio LEFT JOIN ubicacion ON patrimonio.id_ubicacion = ubicacion.id_ubicacion LEFT JOIN tipologia ON patrimonio.id_tipologia = tipologia.id_tipologia"
    );
    patrimonios.reverse();
    connection.end();
    res.status(200).json({ patrimonios });
  } catch (error) {
    res.status(500).json({ message: error.message || "Algo salió mal :(" });

    // connection.end();
  }
};

const listarAutorPatrimonioBack = async (req, res) => {
  const connection = await conectarSMTPatrimonio();
  try {
    const [autores] = await connection.execute("SELECT * FROM autor");
    res.status(200).json({ autores });
  } catch (error) {
    res.status(500).json({ message: error.message || "Algo salió mal :(" });
  } finally {
    connection.end();
  }
};

const listarUbicacionPatrimonioBack = async (req, res) => {
  const connection = await conectarSMTPatrimonio();
  try {
    const [ubicaciones] = await connection.execute("SELECT * FROM ubicacion");
    res.status(200).json({ ubicaciones });
  } catch (error) {
    res.status(500).json({ message: error.message || "Algo salió mal :(" });
  } finally {
    connection.end();
  }
};

const listarEstadoPatrimonioBack = async (req, res) => {
  const connection = await conectarSMTPatrimonio();
  try {
    const [estados] = await connection.execute("SELECT * FROM estado");
    res.status(200).json({ estados });
  } catch (error) {
    res.status(500).json({ message: error.message || "Algo salió mal :(" });
  } finally {
    connection.end();
  }
};

const listarMaterialPatrimonioBack = async (req, res) => {
  const connection = await conectarSMTPatrimonio();
  try {
    const [materiales] = await connection.execute("SELECT * FROM material");
    res.status(200).json({ materiales });
  } catch (error) {
    res.status(500).json({ message: error.message || "Algo salió mal :(" });
  } finally {
    connection.end();
  }
};

const listarCategoriaPatrimonioBack = async (req, res) => {
  let connection;
  try {
    connection = await conectarSMTPatrimonio(); // Asignar conexión
    const [categorias] = await connection.execute("SELECT * FROM categoria");
    res.status(200).json({ categorias });
  } catch (error) {
    res.status(500).json({ message: error.message || "Algo salió mal :(" });
  } finally {
    if (connection) {
      await connection.end();
    }
  }
};

const listarTipologiaPatrimonioBack = async (req, res) => {
  const connection = await conectarSMTPatrimonio();
  try {
    const [tipologias] = await connection.execute("SELECT * FROM tipologia");
    res.status(200).json({ tipologias });
  } catch (error) {
    res.status(500).json({ message: error.message || "Algo salió mal :(" });
  } finally {
    connection.end();
  }
};

const deshabilitarPatrimonio = async (req, res) => {
  let connection;
  connection = await conectarSMTPatrimonio();

  try {
    const { id_patrimonio } = req.body;
    if (id_patrimonio === undefined || req.body == "") {
      return res
        .status(400)
        .json({ message: "El ID de patrimonio es requerido" });
    }

    const sql = "UPDATE patrimonio set habilita = 0 WHERE id_patrimonio = ?";
    const values = [id_patrimonio];

    const [result] = await connection.execute(sql, values);
    if (result.affectedRows > 0) {
      res.status(200).json({ message: "patrimonio deshabilitado con éxito" });
    } else {
      res.status(400).json({ message: "patrimonio no encontrada" });
    }
  } catch (error) {
    console.error("Error al eliminar el patrimonio:", error);
    res.status(500).json({ message: error.message || "Algo salió mal :(" });
    // res.status(500).json({
    //   // message: `Error interno del servidor, ${req.body}`,
    //   message: `Error interno del servidor,AAAAAAAAAAH`,
    //   details: error.message,
    // });
  } finally {
    connection.end();
  }
};
const editarCategoriaPatrimonio = async (req, res) => {
  const { id, nombre_categoria, habilita } = req.body;
  const sql =
    "UPDATE categoria set habilita = ?, nombre_categoria = ? WHERE id_categoria = ?";
  const values = [habilita, nombre_categoria, id];
  let connection;

  try {
    connection = await conectarSMTPatrimonio();
    const [result] = await connection.execute(sql, values);
    if (result.affectedRows > 0) {
      res.status(200).json({ message: "Categoría editada con éxito" });
    } else {
      res.status(400).json({ message: "Categoría no encontrada" });
    }
  } catch (error) {
    res.status(500).json({ message: error.message || "Algo salió mal :(" });
  } finally {
    connection.end();
  }
};
const editarTipologiaPatrimonio = async (req, res) => {
  const { id, nombre_tipologia, habilita } = req.body;
  const sql =
    "UPDATE tipologia set habilita = ?, nombre_tipologia = ? WHERE id_tipologia = ?";
  const values = [habilita, nombre_tipologia, id];
  let connection;

  try {
    connection = await conectarSMTPatrimonio();
    const [result] = await connection.execute(sql, values);
    if (result.affectedRows > 0) {
      res.status(200).json({ message: "Tipología editada con éxito" });
    } else {
      res.status(400).json({ message: "Tipología no encontrada" });
    }
  } catch (error) {
    res.status(500).json({ message: error.message || "Algo salió mal :(" });
  } finally {
    connection.end();
  }
};
const editarMaterialPatrimonio = async (req, res) => {
  const { id, nombre_material, habilita } = req.body;
  const sql =
    "UPDATE material set habilita = ?, nombre_material = ? WHERE id_material = ?";
  const values = [habilita, nombre_material, id];
  let connection;

  try {
    connection = await conectarSMTPatrimonio();
    const [result] = await connection.execute(sql, values);
    if (result.affectedRows > 0) {
      res.status(200).json({ message: "Material editada con éxito" });
    } else {
      res.status(400).json({ message: "Material no encontrada" });
    }
  } catch (error) {
    res.status(500).json({ message: error.message || "Algo salió mal :(" });
  } finally {
    connection.end();
  }
};
const editarEstadoPatrimonio = async (req, res) => {
  const { id, nombre_estado, habilita } = req.body;
  const sql =
    "UPDATE estado set habilita = ?, nombre_estado = ? WHERE id_estado = ?";
  const values = [habilita, nombre_estado, id];
  let connection;

  try {
    connection = await conectarSMTPatrimonio();
    const [result] = await connection.execute(sql, values);
    if (result.affectedRows > 0) {
      res.status(200).json({ message: "Estado editada con éxito" });
    } else {
      res.status(400).json({ message: "Estado no encontrada" });
    }
  } catch (error) {
    res.status(500).json({ message: error.message || "Algo salió mal :(" });
  } finally {
    connection.end();
  }
};

const editarAutorPartimonio = async (req, res) => {
  const { id, nombre_autor, habilita, descripcion_autor } = req.body;
  const sql =
    "UPDATE autor set habilita = ?, nombre_autor = ?, descripcion_autor = ? WHERE id_autor = ?";
  const values = [habilita, nombre_autor, descripcion_autor, id];
  let connection;

  try {
    connection = await conectarSMTPatrimonio();
    const [result] = await connection.execute(sql, values);
    if (result.affectedRows > 0) {
      res.status(200).json({ message: "Autor editada con éxito" });
    } else {
      res.status(400).json({ message: "Autor no encontrada" });
    }
  } catch (error) {
    res.status(500).json({ message: error.message || "Algo salió mal :(" });
  } finally {
    connection.end();
  }
};
const editarUbicacionPatrimonio = async (req, res) => {
  const { id, nombre_ubicacion, habilita } = req.body;
  console.log(req.body)
  const sql = "UPDATE ubicacion set habilita = ?, nombre_ubicacion = ? WHERE id_ubicacion = ?";
  const values = [habilita, nombre_ubicacion, id]; 
  let connection;

  try {
    connection = await conectarSMTPatrimonio();
    const [result] = await connection.execute(sql, values);
    if (result.affectedRows > 0) {
      res.status(200).json({ message: "Ubicación editada con éxito" });
    } else {
      res.status(400).json({ message: "Ubicación no encontrada" });
    }
  } catch (error) {
    res.status(500).json({ message: error.message || "Algo salió mal :(" });
  } finally {
    connection.end();
  }
};



const crearBannerImagenes = async (req, res) => {
  let sftp;
  let connection;

  try {
    console.log("Cuerpo de la solicitud:", req.body);
    console.log("Archivos recibidos:", req.file);

    const newImage = req.file;

    if (!newImage) {
      return res.status(400).json({ message: "No se ha subido ninguna imagen." });
    }

    try {
      sftp = await conectarSFTPCondor();
      if (!sftp || typeof sftp.put !== 'function') {
        throw new Error("Conexión SFTP inválida o función 'put' no disponible.");
      }
      console.log("Conectado al servidor SFTP correctamente.");
    } catch (sftpError) {
      console.error("Error al conectar al SFTP:", sftpError);
      return res.status(500).json({ message: "Error al conectar al servidor SFTP." });
    }

    const extension = newImage.originalname.split('.').pop();
    const baseName = newImage.originalname.replace(`.${extension}`, '');
    const newFileName = `${baseName}_banner.${extension}`;
    const remotePath = `/var/www/vhosts/cidituc.smt.gob.ar/Fotos-Patrimonio/Banner/${newFileName}`;

    await sftp.put(newImage.path, remotePath);

    try {
      // Conexión a la base de datos
      connection = await conectar_smt_Patrimonio_MySql();

      const sql = "INSERT INTO banner (nombre_banner, habilita) VALUES (?, ?)";
      const values = [newFileName, 1];  // Habilita por defecto como 1 (habilitado)

      await connection.execute(sql, values);

      res.status(200).json({ message: "Imagen de banner actualizada y guardada correctamente." });
    } catch (dbError) {
      console.error("Error al insertar en la base de datos:", dbError);
      res.status(500).json({ message: "Error al insertar en la base de datos." });
    }
  } catch (error) {
    console.error("Error en crearBannerImagenes:", error);
    res.status(500).json({ message: error.message || "Algo salió mal :(" });
  } finally {
    if (sftp && typeof sftp.end === 'function') sftp.end();
    if (connection && typeof connection.end === 'function') connection.end();
  }
};

const obtenerBanners = async (req, res) => {
  let connection; 
  try {
    connection = await conectar_smt_Patrimonio_MySql();
    const [rows] = await connection.execute("SELECT * FROM banner");
    res.json(rows);
  } catch (error) {
    console.error("Error al obtener los banners:", error);
    res.status(500).json({ message: "Error al obtener los banners." });
  } finally {
    if (connection && typeof connection.end === "function") connection.end();
  }
};

const subirImagenBanner = async (newImage, suffix, sftp) => {
  const remotePath = `/var/www/vhosts/cidituc.smt.gob.ar/Fotos-Patrimonio/Banner/${newImage.filename}`;
  await sftp.put(newImage.path, remotePath);
  };
  
  const obtenerImagenesBanner = async (req, res) => {
    let sftp;
    const nombreArchivo = decodeURIComponent(req.query.nombreArchivo); 
    console.log(nombreArchivo, "Nombre de archivo recibido para imágenes de banner");
  
    const archivosBuscados = nombreArchivo;
  
    try {
      sftp = await conectarSFTPCondor();
      const remotePath = `/var/www/vhosts/cidituc.smt.gob.ar/Fotos-Patrimonio/Banner/${nombreArchivo}/`;
  
      // Verificar que el directorio remoto exista antes de listar archivos
      const existeDirectorio = await sftp.exists(remotePath);
      if (!existeDirectorio) {
        console.error(`La ruta ${remotePath} no existe en el servidor SFTP`);
        return res.status(404).json({ message: "Directorio no encontrado en el servidor SFTP." });
      }
  
      const archivosRemotos = await sftp.list(remotePath);
  
      const imagenesEncontradas = {};
  
      for (const archivoRemoto of archivosRemotos) {
        const nombreSinExtension = archivoRemoto.name.split(".")[0];
  
        // Verificar si el nombre del archivo remoto está en la lista de archivos buscados
        if (archivosBuscados.includes(nombreSinExtension)) {
          const remoteFilePath = `${remotePath}${archivoRemoto.name}`;
          const buffer = await sftp.get(remoteFilePath);
  
          const base64Image = buffer.toString("base64");
  
          imagenesEncontradas[nombreSinExtension] = {
            nombre: archivoRemoto.name,
            imagen: base64Image,
          };
        }
      }
  
      res.status(200).json(imagenesEncontradas);
    } catch (error) {
      console.error("Error al obtener imágenes de banner:", error);
      res.status(500).json({
        message: error.message || "Error al obtener las imágenes de banner.",
      });
    } finally {
      if (sftp) sftp.end();
    }
  };
  

  const imagenPreview = async (req, res) => {
    let sftp;
    const nombre_banner = req.query.banner; // Accede al valor directamente en lugar de intentar desestructurarlo
    console.log(nombre_banner, "Nombre del banner recibido en imagenPreview");
  
    try {
      // Intentar conectar al servidor SFTP
      sftp = await conectarSFTPCondor();
      if (!sftp || typeof sftp.put !== 'function') {
        throw new Error("Conexión SFTP inválida o función 'put' no disponible.");
      }
      console.log("Conectado al servidor SFTP correctamente.");
  
      // Construir la ruta remota del banner
      const remotePath = `/var/www/vhosts/cidituc.smt.gob.ar/Fotos-Patrimonio/Banner/`;
      const archivoBannerPath = `${remotePath}${nombre_banner}`;
      console.log("Ruta del archivo:", archivoBannerPath);
  
      // Verificar si el archivo existe en el SFTP
      const archivoExiste = await sftp.exists(archivoBannerPath);
      if (!archivoExiste) {
        console.log(`El archivo ${archivoBannerPath} no existe en el servidor SFTP.`);
        return res.status(404).json({ message: "Archivo no encontrado." });
      }
  
      // Obtener el archivo y convertirlo a base64
      const buffer = await sftp.get(archivoBannerPath);
      const base64Image = buffer.toString("base64");
  
      // Enviar la imagen codificada en base64 en la respuesta
      return res.status(200).json({ banner: { base64Image } });
  
    } catch (error) {
      console.error("Error al obtener los banners:", error);
      res.status(500).json({ message: "Error al obtener los banners." });
  
    } finally {
      // Cerrar la conexión SFTP si está abierta
      if (sftp) sftp.end();
    }
  };
  
const deshabilitarBanner = async (req, res) => {
  let connection;
  connection = await conectar_smt_Patrimonio_MySql();
console.log(req.body);
  try {

    const {id, hab }= req.body;
    if (id === undefined ||hab === undefined || req.body == "") {
      return res
        .status(400)
        .json({ message: "El ID del banner es requerido" });
    }
    
    // const nuevoEstado = hab ? 0 : 1
    const sql = "UPDATE banner set habilita = ? WHERE id_banner = ?";
    const values = [ hab, id];

    const [result] = await connection.execute(sql, values);
    if (result.affectedRows > 0) {
      res.status(200).json({ message: "banner deshabilitado con éxito" });
    } else {
      res.status(400).json({ message: "banner no encontrado" });
    }
  } catch (error) {
    console.error("Error al eliminar el banner:", error);
    res.status(500).json({ message: error.message || "Algo salió mal :(" });
    // res.status(500).json({
    //   // message: `Error interno del servidor, ${req.body}`,
    //   message: `Error interno del servidor,AAAAAAAAAAH`,
    //   details: error.message,
    // });
  } finally {
    connection.end();
  }
};

module.exports = {

  agregarPatrimonio,
  agregarCategoriaPatrimonio,
  agregarEstadoPatrimonio,
  agregarAutorPatrimonio,
  agregarMaterialPatrimonio,
  agregarUbicacionPatrimonio,
  agregarTipologiaPatrimonio,
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
  listarTipologiaPatrimonio,
  listarPatrimonioPorId,
  listarCategoriaPatrimonio,
  listarAutorPatrimonio,
  listarEstadoPatrimonio,
  listarUbicacionPatrimonio,
  listarMaterialPatrimonio,
  listarPatrimonio,
};
