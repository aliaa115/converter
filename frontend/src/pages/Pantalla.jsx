// import fs from "fs";

import { useState } from "react";
import AgregarArchivoParaIniciarConversion from "../components/ConversionBase/AgregarArchivoParaIniciarConversion";
import ArchivosAConvertir from "../components/ConversionBase/ArchivosAConvertir";
import ArchivosAEditar from "../components/ConversionBase/ArchivosAEditar";
import ArchivosBase from "../components/ConversionBase/ArchivosBase";
import DescargaDeArchivos from "../components/ConversionBase/DescargaDeArchivos";

const Pantalla = () => {
  const [recargarArchivos, setRecargarArchivos] = useState(0);

  return (
    <div className="col row">
      <div className="bg-primary-subtle row">
        <div className="col-auto">
          <a className="btn btn-circle fs-1 my-1 p-0" role="button" href="/">
            <span className="c-chevron-left m-0 p-0" />
          </a>
        </div>
        <div className="bg-primary-subtle h2 col my-1 p-0">
          Conversion de Archivos
        </div>
      </div>
      <div className="col row">
        <div className="col row">
          <div className="col-12">
            <AgregarArchivoParaIniciarConversion
              reactivar={recargarArchivos}
              onCambio={setRecargarArchivos}
            />
          </div>
          <div className="col">
            <ArchivosBase
              reactivar={recargarArchivos}
              onCambio={setRecargarArchivos}
            />
          </div>
          <div className="col">
            <ArchivosAEditar
              reactivar={recargarArchivos}
              onCambio={setRecargarArchivos}
            />
          </div>
          <div className="col">
            <ArchivosAConvertir
              reactivar={recargarArchivos}
              onCambio={setRecargarArchivos}
            />
          </div>
        </div>
        <div className="col-4">
          <DescargaDeArchivos
            reactivar={recargarArchivos}
            onCambio={setRecargarArchivos}
          />
        </div>
      </div>
    </div>
  );
};

export default Pantalla;
