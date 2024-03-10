// import fs from "fs";
import backend from "../../api/api";
import { useEffect, useState } from "react";
import PropTypes from "prop-types";

const ArchivosAEditar = (props) => {
  let { reactivar, onCambio } = props;

  // let file = fs.readSync();
  // backend
  const [archivos, setArchivos] = useState([]);

  const obtenerListaArchivosConvertidos = () => {
    backend
      .get("/obtenerListaArchivosAEditar")
      .then((response) => {
        setArchivos(response.data);
      })
      .catch((error) => {
        console.error("Error al obtener datos de la API:", error);
      });
  };

  const pasarArchivoAConvertir = (archivo) => {
    backend
      .get(`/moverTxt/${archivo.replace(/\?/g, "%3F")}`)
      .then((response) => {
        console.log(response);
        onCambio(reactivar + 1);
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

  const editarArchivo = (archivo) => {
    // Specify the URL you want to open in a new tab
    const url = `http://localhost:5173/textEditor?archivo=${archivo}`;

    // Open the URL in a new tab
    window.open(url, "_blank");
  };

  return (
    <div className="fs-6 text-start px-3 rounded-4">
      <div className="col row">
        <div className="h2 py-3 col-auto">Archivos a editar:</div>
        {/* onClick={() => iniciarConversion()} */}
        {/* <button className="btn col btn-secondary">Convertir</button> */}
      </div>
      <div
        className=""
        style={{
          maxHeight: "34vh",
          minHeight: "34vh",
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
                  className="btn col-1 fs-5 btn-outline-info border-0 m-0 p-0"
                  onClick={() => editarArchivo(i.archivo)}
                >
                  <span className={`${"c-edit"} p-0`}></span>
                </button>
                <div className="px-2 col" style={{ overflowX: "auto" }}>
                  {i.archivo}
                </div>
                <button
                  type="button"
                  className="btn col-1 fs-5 btn-outline-warning border-0 m-0 p-0"
                  onClick={() => pasarArchivoAConvertir(i.archivo)}
                >
                  <span className={`${"c-arrow-right"} p-0`}></span>
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
ArchivosAEditar.propTypes = {
  reactivar: PropTypes.number, // Esto asume que 'reactivar' es de tipo numerico
  onCambio: PropTypes.func,
};

export default ArchivosAEditar;
