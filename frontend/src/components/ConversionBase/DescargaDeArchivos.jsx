// import fs from "fs";
import backend from "../../api/api";
import { useEffect, useState } from "react";
import PropTypes from "prop-types";

const DescargaDeArchivos = (props) => {
  let { reactivar } = props;

  // let file = fs.readSync();
  // backend
  const [archivos, setArchivos] = useState([]);

  const obtenerListaArchivosConvertidos = () => {
    backend
      .get("/obtenerListaArchivosConvertidos")
      .then((response) => {
        setArchivos(response.data);
      })
      .catch((error) => {
        console.error("Error al obtener datos de la API:", error);
      });
  };

  useEffect(() => {
    obtenerListaArchivosConvertidos();
  }, []);

  useEffect(() => {
    obtenerListaArchivosConvertidos();
  }, [reactivar]);

  const descargarArchivo = (directorio, archivo) => {
    const confirmacion = window.confirm(
      `¿Deseas descargar el archivo "${archivo}"?`
    );

    if (confirmacion) {
      backend
        .get(`/download/${directorio}/${archivo.replace(/\?/g, "%3F")}`, {
          responseType: "blob", // Especifica que la respuesta es un archivo binario
        })
        .then((response) => {
          const name = `${response.headers["content-disposition"]}`.split(
            '"'
          )[1];
          console.log(response.headers["content-disposition"], name);

          // Crear un enlace temporal para descargar el archivo
          const url = window.URL.createObjectURL(new Blob([response.data]));
          const link = document.createElement("a");
          link.href = url;

          // Especifica el nombre del archivo que se descargará
          link.setAttribute("download", archivo);

          // Hace clic en el enlace para iniciar la descarga
          document.body.appendChild(link);
          link.click();

          // Limpia el enlace y la URL temporal
          link.parentNode.removeChild(link);
          window.URL.revokeObjectURL(url);
        })
        .catch((error) => {
          console.error("Error al descargar el archivo:", error);
        });
    }
  };

  return (
    <div className=" fs-6 text-end px-3 rounded-4">
      <div className="h2 py-3">Archivos convertidos:</div>
      <div
        className=""
        style={{
          maxHeight: "80vh",
          minHeight: "80vh",
          overflowY: "auto",
          overflowX: "hidden",
        }}
      >
        <ul className="list-group list-group-flush ">
          {archivos.map((i) => (
            <li
              key={i.directorio + i.archivo}
              className="list-group-item-action list-group-item text-left bg-transparent"
            >
              <div className="row">
                <div className="px-2 col" style={{ overflowX: "auto" }}>
                  {i.archivo}
                </div>
                <button
                  type="button"
                  className="btn col-1 fs-5 btn-outline-success border-0 m-0 p-0"
                  onClick={() => descargarArchivo(i.directorio, i.archivo)}
                >
                  <span className={`${"c-arrow-down-circle"} p-0`}></span>
                </button>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

// Define las propTypes para tu componente
DescargaDeArchivos.propTypes = {
  reactivar: PropTypes.number, // Esto asume que 'reactivar' es de tipo numerico
  onCambio: PropTypes.func,
};

export default DescargaDeArchivos;
