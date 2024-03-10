// import fs from "fs";

import { useState } from "react";

const Pantalla = () => {
  const [recargarArchivos, setRecargarArchivos] = useState(0);

  const irAURL = (url) => {
    window.location.href = url;
  };

  return (
    <>
      <div className="col row">
        <div className="bg-primary-subtle row">
          <div className="col-auto">
            <a className="btn btn-circle fs-1 my-1 p-0" role="button" href="/">
              {" "}
            </a>
          </div>
          <div className="bg-primary-subtle h2 col my-1 p-0">
            Lista de proyectos
          </div>
        </div>
        <div>
          Seleccione el metodo por medio del cual desea realizar la conversión
          de archivos
        </div>
        <ul className="col-12 p-5 h4 list-group list-group-flush">
          <button
            onClick={() => irAURL("/general")}
            className="m-0 h4 list-group-item list-group-item-action"
            type="button"
          >
            <span className="c-arrow-right" /> Conversión por medio de proceso{" "}
            <code className="">{`EPUB -> TXT -> HTML  ->EPUB`}</code>
          </button>
          <button
            onClick={() => irAURL("/proyect")}
            className="m-0 h4 list-group-item list-group-item-action"
            type="button"
          >
            <span className="c-arrow-right" /> Conversión por medio proyecto
          </button>
        </ul>
      </div>
      {/* <div className="col row">
        <div className="col row">
          <div className="col-12">
            <AgregarArchivoParaIniciarConversion
              reactivar={recargarArchivos}
              onCambio={setRecargarArchivos}
            />
          </div>
        </div>
      </div> */}
    </>
  );
};

export default Pantalla;
