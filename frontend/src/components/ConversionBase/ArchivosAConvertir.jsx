// import fs from "fs";
import backend from "../../api/api";
import { useEffect, useState } from "react";
import PropTypes from "prop-types";

const ArchivosAConvertir = (props) => {
  let { reactivar, onCambio } = props;

  // let file = fs.readSync();
  // backend
  const [archivos, setArchivos] = useState([]);

  const obtenerListaArchivosConvertidos = () => {
    backend
      .get("/obtenrListaArchivosListosParaConvertir")
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

  const editarArchivo = (archivo) => {
    // Specify the URL you want to open in a new tab
    const url = `http://localhost:5173/textEditor?archivo=${archivo}`;

    // Open the URL in a new tab
    window.open(url, "_blank");
  };

  const convertirArchivos = () => {
    backend
      .get("/txt_to_epub")
      .then((res) => {
        onCambio(reactivar + 1);
        console.log(res);
      })
      .catch((e) => console.error(e));
  };

  return (
    <div className="fs-6 text-start px-3 rounded-4">
      <div className="col row">
        <div className="h2 py-3 col-auto">Archivos a convertir:</div>
        {/* onClick={() => iniciarConversion()} */}
        <button
          className="btn col btn-secondary"
          onClick={() => convertirArchivos()}
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
ArchivosAConvertir.propTypes = {
  reactivar: PropTypes.number, // Esto asume que 'reactivar' es de tipo numerico
  onCambio: PropTypes.func,
};

export default ArchivosAConvertir;
