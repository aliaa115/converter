const path = require("path");
const fs = require("fs");

global.obtenerContenidoDirectorio = (
  directorio,
  nombreDirectorio,
  archivosYDirectorios = []
) => {
  // Leer el contenido del directorio
  const contenido = fs.readdirSync(directorio);

  contenido.forEach((elemento) => {
    const rutaElemento = path.join(directorio, elemento);

    // Verificar si es un directorio
    if (fs.statSync(rutaElemento).isDirectory()) {
      // Si es un directorio, llamamos a la función de manera recursiva
      obtenerContenidoDirectorio(rutaElemento, elemento, archivosYDirectorios);
    } else {
      // Si es un archivo, lo agregamos a la lista con el nombre del directorio
      archivosYDirectorios.push({
        archivo: elemento,
        directorio: nombreDirectorio,
      });
    }
  });

  return archivosYDirectorios;
};
