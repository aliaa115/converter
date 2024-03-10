import React, { useState } from "react";
import PropTypes from "prop-types";
import backend from "../../api/api";
import InputFormulario from "../components/Inputs/InputForm";

const CrearProyecto = (props) => {
  const [nombre, setNombre] = useState("");
  const [file, setFile] = useState([]);

  const handleFileChange = (e) => {
    if (e.target.files) {
      console.log(...e.target.files);
      setFile((old) => [...old, ...e.target.files]);
    }
  };

  const deleteAFile = (e, file, ind) => {
    setFile((old) => old.filter((i, index) => index !== ind));
  };

  const guardarFormulario = (e) => {
    if (!file) return;
    const formData = new FormData();
    file.map((f) => {
      formData.append("archivo", f);
    });
    formData.append("nombre", nombre);

    backend
      .post("/crear-proyectos", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      })
      .then((i) => {
        window.location = "/proyect/view/" + i.data[0];
        // let id = i
        // document.getElementById("IrAProyectos").click();
      });
  };

  return (
    <div>
      <div className="bg-primary-subtle row">
        <div className="col-auto h3">Crear Proyecto</div>
      </div>
      <div className="p-5">
        <div className="col-12">
          <a
            className="btn btn-secondary  m-0 p-0 px-2"
            role="button"
            href="/proyect"
            id="IrAProyectos"
          >
            <span className="c-chevron-left" />
            Regresar a lista de poryectos
          </a>
        </div>
        <h2 className="pb-4 col">Crear proyecto</h2>
        <div className="col row">
          <form className="col-12 row">
            <div className="col-6 ">
              <div className="col m-2">
                <InputFormulario
                  value={nombre}
                  setValue={setNombre}
                  type={"text"}
                  label={"Nombre del proyecto"}
                />
              </div>
            </div>
            <div className="col-6 ">
              <div className="col row">
                <div className="col-auto my-3 h6">
                  AGREGAR ARCHIVOS AL PROYECTO
                </div>
                <div className="col ">
                  <button
                    className="btn btn-success"
                    type="button"
                    onClick={(e) => {
                      document.getElementById("selectedFile").click();
                    }}
                  >
                    <span className="c-plus"></span>
                  </button>
                  <input
                    id="selectedFile"
                    type="file"
                    name="files"
                    value=""
                    style={{ visibility: "hidden" }}
                    onChange={handleFileChange}
                    multiple
                  />
                </div>
              </div>
            </div>
            <div className="col p-2">
              <div className="col m-3 h6">Archivos Seleccionados</div>
              <table className="col-12 table table-striped table-hover">
                <thead>
                  <tr>
                    <th className="">#</th>
                    <th className="">Nombre</th>
                    <th className="text-center">Tamaño</th>
                    <th className="text-center">Eliminar Archivo</th>
                  </tr>
                </thead>
                <tbody>
                  {file?.map((i, ind) => (
                    <tr className="m-0 " key={i.name}>
                      <td className="">{ind + 1}</td>
                      <td className="">{i.name}</td>
                      <td className="text-center">
                        {(i.size / (1024 * 1024)).toFixed(2)}MB
                      </td>
                      <td className="text-center">
                        <button
                          className="btn btn-danger m-0"
                          type="button"
                          onClick={(e) => {
                            deleteAFile(e, i, ind);
                          }}
                        >
                          <span className="c-x"></span>
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="text-end">
              <button
                type="button"
                onClick={guardarFormulario}
                className="btn btn-primary"
              >
                Crear Proyecto
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

CrearProyecto.propTypes = {};

export default CrearProyecto;
