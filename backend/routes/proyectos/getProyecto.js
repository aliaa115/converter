const path = require("path");
const fs = require("fs");
const { exec } = require("child_process");
const { convert } = require("html-to-text");

module.exports.GetProyectos = (app, multer) => {
  app.get("/proyecto/:id", (req, res) => {
    mysql({ p: "proyecto" })
      .select("p.*")
      .where("id", "=", req.params.id)
      .first()
      .then((i) => {
        if (req.query?.archivos !== "false")
          if (i)
            mysql("archivo")
              .where("id_proyecto", req.params.id)
              .then((d) => res.json({ ...i, archivos: d }));
          else res.json(null);
        else res.json(i || null);
      });
  });

  app.get("/capitulos/:id", (req, res) => {
    mysql("capitulos")
      .where("id_proyecto", "=", req.params.id)
      .then((i) => res.json(i));
  });

  app.get("/capitulo/:id/:id_capitulo", (req, res) => {
    mysql("capitulos")
      .where("id_proyecto", "=", req.params.id)
      .where("id", "=", req.params.id_capitulo)
      .first()
      .then((i) => res.json(i));
  });

  app.put("/capitulo/:id/:id_capitulo", (req, res) => {
    mysql("capitulos")
      .update(req.body.datos)
      .where("id_proyecto", "=", req.params.id || req.body.id)
      .where("id", "=", req.params.id_capitulo || req.body.id_capitulo)
      .returning(["id", "id_proyecto"])
      .then((i) => res.json(i));
  });

  app.get("/obtener_contenido_archivos/:id/:proyecto", async (req, res) => {
    let archivo = await mysql("archivo")
      .where("id_proyecto", req.params.proyecto)
      .where("id", req.params.id)
      .first();

    let filePath = path.join(archivo.ubicacion, archivo.nombre);

    if (!fs.existsSync(filePath)) {
      console.error("El archivo no existe:", filePath);
      res.status(404).send("Archivo no encontrado");
      return;
    }

    // Leer el contenido del archivo
    fs.readFile(filePath, "utf8", (err, data) => {
      if (err) {
        console.error("Error al leer el archivo:", err);
        return res.status(500).json({ error: "Error al leer el archivo" });
      }

      // Enviar el contenido del archivo como respuesta
      res.status(200).json({ contenido: data });
    });

    // if (`${archivo.nombre}`.includes(".epub"))
    //   res.setHeader("Content-Type", "application/epub+zip");
    // if (`${archivo.nombre}`.includes(".jpg"))
    //   res.setHeader("Content-Type", "application/jpg");
    // if (`${archivo.nombre}`.includes(".txt"))
    //   res.setHeader("Content-Type", "application/txt");

    // res.download(filePath, (error) => {
    //   if (error) {
    //     console.error("Error al descargar el archivo:", error);
    //     res.status(404).send("Archivo no encontrado");
    //   }
    // });
  });

  app.get("/obtener_archivos_proyecto/:proyecto", async (req, res) => {
    let archivo = null;
    if (!!req.query?.extension)
      archivo = await mysql("archivo")
        .join(
          "extension_archivo",
          "archivo.id_extension",
          "extension_archivo.id"
        )
        .where("extension_archivo.extension", req.query?.extension)
        .where("id_proyecto", req.params.proyecto)
        .select("archivo.*", "extension_archivo.nombre as extension");
    else
      archivo = await mysql("archivo").where(
        "id_proyecto",
        req.params.proyecto
      );

    return res.json(archivo);

    // let filePath = path.join(archivo.ubicacion, archivo.nombre);

    // console.log(filePath);

    // if (!fs.existsSync(filePath)) {
    //   console.error("El archivo no existe:", filePath);
    //   res.status(404).send("Archivo no encontrado");
    //   return;
    // }

    // if (`${archivo.nombre}`.includes(".epub"))
    //   res.setHeader("Content-Type", "application/epub+zip");
    // if (`${archivo.nombre}`.includes(".jpg"))
    //   res.setHeader("Content-Type", "application/jpg");
    // if (`${archivo.nombre}`.includes(".txt"))
    //   res.setHeader("Content-Type", "application/txt");

    // res.download(filePath, (error) => {
    //   if (error) {
    //     console.error("Error al descargar el archivo:", error);
    //     res.status(404).send("Archivo no encontrado");
    //   }
    // });
  });

  app.get("/obtener_archivo_proyecto/:proyecto/:id", async (req, res) => {
    let archivo = await mysql("archivo")
      .where("id", req.params.id)
      .where("id_proyecto", req.params.proyecto)
      .first();

    let filePath = path.join(archivo.ubicacion, archivo.nombre);

    console.log(filePath);

    if (!fs.existsSync(filePath)) {
      console.error("El archivo no existe:", filePath);
      res.status(404).send("Archivo no encontrado");
      return;
    }

    if (`${archivo.nombre}`.includes(".epub"))
      res.setHeader("Content-Type", "application/epub+zip");
    if (`${archivo.nombre}`.includes(".jpg"))
      res.setHeader("Content-Type", "application/jpg");
    if (`${archivo.nombre}`.includes(".txt"))
      res.setHeader("Content-Type", "application/txt");

    res.download(filePath, (error) => {
      if (error) {
        console.error("Error al descargar el archivo:", error);
        res.status(404).send("Archivo no encontrado");
      }
    });
  });

  app.get("/procesar_archivo_proyecto_txt/:proyecto/:id", async (req, res) => {
    let archivo = await mysql("archivo")
      .where("id", req.params.id)
      .where("id_proyecto", req.params.proyecto)
      .first();
    const { nombre } = await mysql("proyecto")
      .select("nombre")
      .where("id", req.params.proyecto)
      .first();
    const cant_archivos = await mysql("archivo").where(
      "id_proyecto",
      req.params.proyecto
    );
    let c_a = cant_archivos.length + 1;
    const processPath = path.join(archivo.ubicacion, "./../..");

    const scriptPath = path.join(
      archivo.ubicacion,
      "./../..",
      "TXT_TO_HTML.sh"
    );
    console.log(`sh "${scriptPath}" "${processPath}" "${archivo.nombre}"`);

    console.log(`sh "${scriptPath}" "${processPath}" "${archivo.nombre}"`);

    // Ejecuta el comando
    exec(
      `sh "${scriptPath}" "${processPath}" "${archivo.nombre}"`,
      async (error, stdout, stderr) => {
        if (error) {
          console.error(`Error al ejecutar el script: ${error}`);
          return res.status(400).json({
            error: `Error al ejecutar el script: ${error}`,
          });
        }

        if (stderr) console.error(`Salida de error del script: ${stderr}`);

        if (stdout) {
          const outputLines = stdout.split("\n");
          console.log({
            a: `Salida estándar del script: ${
              outputLines[outputLines.length - 2]
            }`,
            b: outputLines[outputLines.length - 4],
            c: outputLines[outputLines.length - 3],
            d: outputLines[outputLines.length - 2],
          });
          const dir = path.join(
            outputLines[outputLines.length - 4],
            outputLines[outputLines.length - 3]
          );

          await mysql("extension_archivo")
            .where("extension", "html")
            .first()
            .then((id_extension) =>
              mysql("archivo")
                .returning("id")
                .insert({
                  nombre: outputLines[outputLines.length - 2],
                  ubicacion: dir,
                  tamano: fs.statSync(
                    path.join(dir, outputLines[outputLines.length - 2])
                  ).size,
                  id_proyecto: req.params.proyecto,
                  id: c_a++,
                  id_extension: id_extension.id,
                })
                .then((i) => console.log({ i }))
            );

          let data = fs.readFileSync(
            path.join(dir, outputLines[outputLines.length - 2]),
            "utf8"
          );
          data = data
            .split("<div>")
            .filter((i) => i.includes("<a "))
            .map((i) =>
              convert(i, {
                wordwrap: null,
                selectors: [
                  { selector: "a", options: { linkBrackets: false } },
                ],
              })
            )
            .map((i) => i.split("./"))
            .map((i, ind) => ({
              id: ind + 1,
              name: i[0],
              path: path.join(dir, i[1]),
            }));

          data.map(async (file, ind) => {
            let data = fs.readFileSync(path.join(file.path), "utf8");
            const text = convert(data, {
              wordwrap: null,
            });
            await mysql("capitulos").insert({
              id: file.id,
              id_proyecto: req.params.proyecto,
              nombre: file.name,
              content: text.replace(/[\uD800-\uDFFF]./g, ""),
            });
          });

          mysql("archivo")
            .where("id", req.params.id)
            .where("id_proyecto", req.params.proyecto)
            .update({ procesado: 1 })
            .then((i) => res.json({ msg: `Resultado: guardado` }));
        }
      }
    );
  });

  app.get("/procesar_archivo_proyecto/:proyecto/:id", async (req, res) => {
    let archivo = await mysql("archivo")
      .where("id", req.params.id)
      .where("id_proyecto", req.params.proyecto)
      .first();
    const { nombre } = await mysql("proyecto")
      .select("nombre")
      .where("id", req.params.proyecto)
      .first();
    const cant_archivos = await mysql("archivo").where(
      "id_proyecto",
      req.params.proyecto
    );
    const processPath = path.join(archivo.ubicacion, "./..");

    const scriptPath = path.join(archivo.ubicacion, "./..", "EPUB_TO_TXT.sh");

    // Ejecuta el comando
    exec(
      `sh "${scriptPath}" "${processPath}" "${archivo.nombre}"`,
      async (error, stdout, stderr) => {
        if (error) {
          console.error(`Error al ejecutar el script: ${error}`);
          return res.status(400).json({
            error: `Error al ejecutar el script: ${error}`,
          });
        }

        if (stderr) console.error(`Salida de error del script: ${stderr}`);

        if (stdout) {
          const outputLines = stdout.split("\n");
          console.log(
            `Salida estándar del script: ${outputLines[outputLines.length - 2]}`
          );

          let archivo = fs.statSync(
            path.join(
              __dirname,
              "../..",
              "proyectos",
              nombre,
              outputLines[outputLines.length - 3],
              outputLines[outputLines.length - 2]
            )
          );

          let path_ = path.join(
            __dirname,
            "../..",
            "proyectos",
            nombre,
            outputLines[outputLines.length - 3]
          );
          let id_extension = await mysql("extension_archivo")
            .where("extension", "txt")
            .first();

          mysql("archivo")
            .returning("id")
            .insert({
              nombre: outputLines[outputLines.length - 2],
              ubicacion: path_,
              tamano: archivo["size"],
              id_proyecto: req.params.proyecto,
              id: cant_archivos.length + 1,
              id_extension: id_extension.id,
            })
            .then(async (i) => {
              let archivo_2 = fs.statSync(
                path.join(
                  __dirname,
                  "../..",
                  "proyectos",
                  nombre,
                  outputLines[outputLines.length - 5],
                  outputLines[outputLines.length - 4]
                )
              );
              path_ = path.join(
                __dirname,
                "../..",
                "proyectos",
                nombre,
                outputLines[outputLines.length - 5]
              );

              let id_extension = await mysql("extension_archivo")
                .where("extension", "jpg")
                .first();

              mysql("archivo")
                .returning("id")
                .insert({
                  nombre: outputLines[outputLines.length - 4],
                  ubicacion: path_,
                  tamano: archivo_2["size"],
                  id_proyecto: req.params.proyecto,
                  id: cant_archivos.length + 2,
                  id_extension: id_extension.id,
                })
                .then((i) => {
                  mysql("archivo")
                    .where("id", req.params.id)
                    .where("id_proyecto", req.params.proyecto)
                    .update({ procesado: 1 })
                    .then((i) => {
                      return res.json({
                        msg: `Resultado: ${
                          outputLines[outputLines.length - 4]
                        }`,
                      });
                    });
                });
            });
        }
      }
    );
  });
};
