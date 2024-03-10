// crear - proyectos;
const path = require("path");
const fs = require("fs");

module.exports.AgregarArchivoProyecto = (app, multer) => {
  app.delete("/eliminar-archivo-proyecto/:id/:proyecto", (req, res) => {
    const id = req.params.id;
    const proyecto = req.params.proyecto;
    if (!req.params.id)
      return res.status(404).json({ msg: "el Id del archivo es requerido" });
    if (!req.params.proyecto)
      return res.status(404).json({ msg: "el Id del proyecto es requerido" });

    mysql("archivo")
      .where("id", id)
      .where("id_proyecto", proyecto)
      .update({ estado: 2 })
      .then((i) => {
        res.json({ msg: "eliminado" });
      });
  });

  app.post(
    "/reemplazar-archivo-proyecto/:id",
    multer.array("archivo"),
    async (req, res) => {
      const archivos = req.files;
      const id = req.params.id;
      const archivo_nombre = req.body.nombre;
      const ubicacion = req.body.ubicacion;
      if (!req.params.id)
        return res.status(404).json({ msg: "el Id del proyecto es requerido" });

      if (!archivos[0])
        return res.status(404).json({ msg: "No se envio ningun archivo" });
      if (!archivos.length > 0)
        return res.status(404).json({ msg: "Se envio mas de un archivo" });

      const nombreArchivo = archivo_nombre;
      const archivo = archivos[0];
      const contenidoBase64 = archivo.buffer;
      archivo.originalname = nombreArchivo;

      console.log(ubicacion);

      const rutaGuardado = path.join(ubicacion, `${nombreArchivo}`);
      try {
        // Guardar el archivo en el sistema de archivos
        fs.writeFileSync(rutaGuardado, contenidoBase64);

        return res.json(await mysql("proyecto").where("id", id).first());
      } catch (error) {
        console.error(error);
        return res.status(400).json(id);
      }
    }
  );
  app.post(
    "/agregar-archivo-proyecto/:id",
    multer.array("archivo"),
    async (req, res) => {
      const archivos = req.files;
      const id = req.params.id;
      if (!req.params.id)
        return res.status(404).json({ msg: "el Id del proyecto es requerido" });

      const { nombre } = await mysql("proyecto")
        .select("nombre")
        .where("id", id)
        .first();
      const cant_archivos = await mysql("archivo").where("id_proyecto", id);

      archivos.map(async (archivo, ind) => {
        const ext = `${path.extname(archivo.originalname)}`.replace(".", "");
        let id_extension = await mysql("extension_archivo")
          .where("extension", ext)
          .first();
        const nombreArchivo = archivo.originalname;
        const contenidoBase64 = archivo.buffer;
        const rutaBase = path.join(
          __dirname,
          "../..",
          "proyectos",
          nombre,
          "ingresados"
        );

        const rutaGuardado = path.join(rutaBase, `${nombreArchivo}`);

        fs.mkdirSync(rutaBase, {
          recursive: true,
        });

        // Guardar el archivo en el sistema de archivos
        fs.writeFileSync(rutaGuardado, contenidoBase64);

        let ar = await mysql("archivo")
          .returning("id")
          .insert({
            nombre: nombreArchivo,
            ubicacion: rutaBase,
            tamano: archivo["size"],
            id_proyecto: id,
            id_extension: id_extension.id,
            id: cant_archivos.length + 1 + ind,
          });
      });
      return res.json(id);
    }
  );
};
