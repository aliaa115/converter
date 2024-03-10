// import fs from "fs";
import backend from "../../api/api";
import { useEffect, useState } from "react";
import PropTypes from "prop-types";

const ArchivosBase = (props) => {
  let { reactivar } = props;

  // let file = fs.readSync();
  // backend
  const [archivos, setArchivos] = useState([]);

  const obtenerListaArchivosConvertidos = () => {
    backend
      .get("/obtenerListaArchivosBase")
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

  const iniciarConversion = () => {
    backend
      .get("epub_to_txt")
      .then((res) => {
        props.onCambio(reactivar + 1);
      })
      .catch((e) => {
        console.log(e);
      });
  };

  const descargarArchivo = (archivo) => {
    const confirmacion = window.confirm(
      `¿Deseas eliminar el archivo "${archivo}"?`
    );

    if (confirmacion) {
      backend
        .delete(`/delete/${archivo.replace(/\?/g, "%3F")}`)
        .then((response) => {
          console.log(response);
          props.onCambio(reactivar + 1);
        });
    }
  };

  return (
    <div className="fs-6 text-start px-3 rounded-4">
      <div className="col row">
        <div className="h2 py-3 col-auto">Archivos a procesar:</div>
        <button
          onClick={() => iniciarConversion()}
          className="btn col btn-secondary"
        >
          Convertir
        </button>
      </div>
      <div
        className=""
        style={{
          maxHeight: "30vh",
          minHeight: "30vh",
          overflowY: "auto",
          overflowX: "hidden",
        }}
      >
        <ul className="list-group list-group-flush ">
          {archivos.map((i) => (
            <li
              key={i.archivo}
              className="list-group-item-action list-group-item text-left bg-transparent"
            >
              <div className="row">
                <button
                  type="button"
                  className="btn col-1 fs-5 btn-outline-danger border-0 m-0 p-0"
                  onClick={() => descargarArchivo(i.archivo)}
                >
                  <span className={`${"c-x"} p-0`}></span>
                </button>
                <div className="px-2 col" style={{ overflowX: "auto" }}>
                  {i.archivo}
                </div>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

// Define las propTypes para tu componente
ArchivosBase.propTypes = {
  reactivar: PropTypes.number, // Esto asume que 'reactivar' es de tipo numerico
  onCambio: PropTypes.func,
};

export default ArchivosBase;
