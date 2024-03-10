// crear - proyectos;
const path = require("path");
const fs = require("fs");

module.exports.CreateProyecto = (app, multer) => {
  app.post("/crear-proyectos", multer.array("archivo"), async (req, res) => {
    const archivos = req.files;

    if (!req.body.nombre)
      return res.status(404).json({ msg: "el Nombre es requerido" });

    let existe = await mysql("proyecto").where("nombre", "=", req.body.nombre);

    if (existe.length != 0)
      return res.status(404).json({ msg: "El nombre ya existe" });

    let id = await mysql("proyecto")
      .returning("id")
      .insert({ nombre: req.body.nombre });

    let extension_archivo = await mysql("extension_archivo");

    const rutaBase = path.join(
      __dirname,
      "../..",
      "proyectos",
      req.body.nombre
    );
    archivos.map(async (archivo, ind) => {
      const nombreArchivo = archivo.originalname;
      const contenidoBase64 = archivo.buffer;
      const rutaBaseIngresados = path.join(rutaBase, "ingresados");
      const rutaGuardado = path.join(rutaBaseIngresados, `${nombreArchivo}`);
      fs.mkdirSync(rutaBaseIngresados, {
        recursive: true,
      });
      const ext = `${path.extname(archivo.originalname)}`.replace(".", "");
      const id_extension = extension_archivo.find((i) => i.extension == ext);

      // Guardar el archivo en el sistema de archivos
      fs.writeFileSync(rutaGuardado, contenidoBase64);

      let ar = await mysql("archivo")
        .returning("id")
        .insert({
          nombre: nombreArchivo,
          ubicacion: rutaBaseIngresados,
          tamano: archivo["size"],
          id_proyecto: id,
          id: ind + 1,
          id_extension: id_extension?.id,
        });
    });

    const rutaScripts = path.join(__dirname, "../..", "proyectos", "scripts");

    fs.cpSync(rutaScripts, rutaBase, { recursive: true });

    return res.json(id);
  });
};
