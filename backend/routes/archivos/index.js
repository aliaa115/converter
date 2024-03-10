const fs = require("fs");
const path = require("path");
const { exec } = require("child_process");

exports.ArchivosRoutes = (app, multer) => {
  app.get("/epub_to_txt", (req, res) => {
    // Reemplaza 'tu_script.sh' con la ruta al script Shell que deseas ejecutar
    const scriptPath = path.join(
      __dirname,
      "../..",
      "scripts",
      "EPUB_TO_TXT.sh"
    );
    const script_Path = path.join(__dirname, "../..", "scripts");
    // const scriptPath = "./tu_script.sh";
    console.log(scriptPath);

    // Ejecuta el comando
    exec(`sh ${scriptPath} "${script_Path}"`, (error, stdout, stderr) => {
      if (error) {
        console.error(`Error al ejecutar el script: ${error}`);
        return res.status(400).json({
          error: `Error al ejecutar el script: ${error}`,
        });
      }

      console.log(`Salida estándar del script: ${stdout}`);
      console.error(`Salida de error del script: ${stderr}`);
      return res.json({
        msg: `Resultado: ${stdout}`,
      });
    });
  });
  app.get("/txt_to_epub", (req, res) => {
    // Reemplaza 'tu_script.sh' con la ruta al script Shell que deseas ejecutar
    const scriptPath = path.join(
      __dirname,
      "../..",
      "scripts",
      "TXT_TO_HTML.sh"
    );
    const script_Path = path.join(__dirname, "../..", "scripts");
    // const scriptPath = "./tu_script.sh";
    console.log(scriptPath);

    // Ejecuta el comando
    exec(`sh ${scriptPath} "${script_Path}"`, (error, stdout, stderr) => {
      if (error) {
        console.error(`Error al ejecutar el script: ${error}`);
        return res.status(400).json({
          error: `Error al ejecutar el script: ${error}`,
        });
      }

      console.log(`Salida estándar del script: ${stdout}`);
      console.error(`Salida de error del script: ${stderr}`);
      return res.json({
        msg: `Resultado: ${stdout}`,
      });
    });
  });

  app.get("/contenidoTxt/:fileName", (req, res) => {
    const fileName = req.params.fileName;
    console.log(fileName);
    const filePath = path.join(
      __dirname,
      "../..",
      "scripts",
      "txt",
      "raw",
      fileName
    );
    console.log(filePath);

    // Leer el contenido del archivo
    fs.readFile(filePath, "utf8", (err, data) => {
      if (err) {
        console.error("Error al leer el archivo:", err);
        return res.status(500).json({ error: "Error al leer el archivo" });
      }

      // Enviar el contenido del archivo como respuesta
      res.status(200).json({ contenido: data });
    });
  });
  app.put("/enviarCorregitArchivo", multer.single("archivo"), (req, res) => {
    const fileName = req.body.nombre;
    const archivo = req.file;
    const filePath = path.join(
      __dirname,
      "../..",
      "scripts",
      "txt",
      "raw",
      fileName
    );
    console.log(filePath);

    const content = archivo.buffer;
    fs.writeFileSync(filePath, content);
    res.status(200).json({ fileName, content });
  });
  app.get("/download/:directorio/:fileName", (req, res) => {
    const directorio = req.params.directorio;
    const fileName = req.params.fileName;
    console.log(fileName);
    const filePath = path.join(
      __dirname,
      "../..",
      "scripts",
      "epub",
      directorio,
      fileName
    );
    console.log(filePath);
    if (!fs.existsSync(filePath)) {
      console.error("El archivo no existe:", filePath);
      res.status(404).send("Archivo no encontrado");
      return;
    }
    res.setHeader("Content-Type", "application/epub+zip");

    res.download(filePath, (error) => {
      if (error) {
        console.error("Error al descargar el archivo:", error);
        res.status(404).send("Archivo no encontrado");
      }
    });
    // fs.stat(filePath, (err, stat) => {
    //   if (err) {
    //     console.log(err);
    //     return res.status(404).json({ error: "File not found" });
    //   }
    //   res.setHeader("Content-Length", stat.size);
    //   res.setHeader("Content-Type", "application/epub+zip");
    //   res.setHeader(
    //     "Content-Disposition",
    //     `attachment; filename="${fileName}"`
    //   );

    //   const fileStream = fs.createReadStream(filePath);
    //   fileStream.on("error", (err) => {
    //     console.error("Error al abrir el archivo:", err);
    //     return res.status(500).json({ error: "Error al abrir el archivo" });
    //   });

    //   fileStream.pipe(res);
    // });
  });
  app.get("/moverTxt/:fileName", (req, res) => {
    const fileName = req.params.fileName;
    console.log(fileName);
    const filePath = path.join(
      __dirname,
      "../..",
      "scripts",
      "txt",
      "raw",
      fileName
    );
    const fileDestini = path.join(
      __dirname,
      "../..",
      "scripts",
      "txt",
      "pendiente",
      fileName
    );
    console.log(filePath);
    console.log(fileDestini);
    fs.rename(filePath, fileDestini, (err) => {
      if (err) {
        console.error("Error al mover el archivo:", err);
        return res.status(404).json({ error: "File not found" });
      } else {
        console.log("Archivo movido con éxito.");
        return res.json({ msg: "success" });
      }
    });
  });

  app.delete("/delete/:fileName", (req, res) => {
    const fileName = req.params.fileName;
    console.log(fileName);
    const filePath = path.join(
      __dirname,
      "../..",
      "scripts",
      "raw",
      "pendiente",
      fileName
    );
    console.log(filePath);

    fs.unlinkSync(filePath);

    res.json({ msg: "success" });
  });

  // Ruta '/api/users'
  app.get("/obtenerListaArchivosConvertidos", (req, res) => {
    // Lógica para obtener la lista de usuarios

    const directorio = path.join(__dirname, "../..", "scripts", "epub");

    const archivosEpub = obtenerContenidoDirectorio(directorio, "")
      .filter((archivo) => archivo.archivo.endsWith(".epub"))
      .map((archivo) => ({ ...archivo, tipo: "epub" }));
    res.json(archivosEpub);
  });

  app.get("/obtenrListaArchivosListosParaConvertir", (req, res) => {
    // Lógica para obtener la lista de usuarios
    const directorio = path.join(
      __dirname,
      "../..",
      "scripts",
      "txt",
      "pendiente"
    );

    fs.readdir(directorio, (error, archivos) => {
      if (error) {
        console.error("Error al leer el directorio:", error);
        res.json([]);
        return;
      }

      // archivos es un array con los nombres de los archivos en la carpeta
      const archivosEpub = archivos
        .filter((archivo) => archivo.endsWith(".txt"))
        .map((archivo) => ({ archivo: archivo, tipo: "txt" }));
      res.json(archivosEpub);
    });
  });

  app.get("/obtenerListaArchivosBase", (req, res) => {
    // Lógica para obtener la lista de usuarios
    const directorio = path.join(
      __dirname,
      "../..",
      "scripts",
      "raw",
      "pendiente"
    );

    fs.readdir(directorio, (error, archivos) => {
      if (error) {
        console.error("Error al leer el directorio:", error);
        res.json([]);
        return;
      }

      // archivos es un array con los nombres de los archivos en la carpeta
      const archivosEpub = archivos
        .filter((archivo) => archivo.endsWith(".epub"))
        .map((archivo) => ({ archivo: archivo, tipo: "epub" }));
      res.json(archivosEpub);
    });
  });

  app.get("/obtenerListaArchivosAEditar", (req, res) => {
    // Lógica para obtener la lista de usuarios
    const directorio = path.join(__dirname, "../..", "scripts", "txt", "raw");

    fs.readdir(directorio, (error, archivos) => {
      if (error) {
        console.error("Error al leer el directorio:", error);
        res.json([]);
        return;
      }

      // archivos es un array con los nombres de los archivos en la carpeta
      const archivosEpub = archivos
        .filter((archivo) => archivo.endsWith(".txt"))
        .map((archivo) => ({ archivo: archivo, tipo: "txt" }));
      res.json(archivosEpub);
    });
  });

  // Define una ruta para subir archivos
  app.post("/guardar-archivo", multer.single("archivo"), (req, res) => {
    const archivo = req.file;
    if (!archivo) {
      console.log(req.body);
      return res.status(400).json({
        error: "Se requiere un archivo en el cuerpo de la solicitud.",
      });
    }
    // const datosArchivo = archivo.buffer.toString("utf8");

    console.log(archivo.originalname);

    // Obtener el nombre del archivo del encabezado 'content-disposition'
    const nombreArchivo = archivo.originalname; // Nombre predeterminado si no se encuentra

    // Contenido del archivo en base64 desde la solicitud
    const contenidoBase64 = archivo.buffer;

    // Decodificar el contenido base64 a datos binarios
    // const contenidoBinario = Buffer.from(contenidoBase64, "base64");

    // Ruta donde se guardará el archivo (puedes personalizarla)
    const rutaGuardado = path.join(
      __dirname,
      "../..",
      "scripts",
      "raw",
      "pendiente",
      `${nombreArchivo}`
    );

    // Guardar el archivo en el sistema de archivos
    fs.writeFile(rutaGuardado, contenidoBase64, (err) => {
      if (err) {
        console.log(err);
        return res.status(500).json({ error: "Error al guardar el archivo." });
      }

      return res.status(200).json({ mensaje: "Archivo guardado con éxito." });
    });
  });
};
