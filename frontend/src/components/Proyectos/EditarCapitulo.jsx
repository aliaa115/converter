import React, { useEffect, useState } from "react";
import PropTypes from "prop-types";
import { useParams } from "react-router-dom";
import backend from "../../api/api";
import Editor from "@monaco-editor/react";
import InputFormulario from "../components/Inputs/InputForm";
import FloatingAlert from "../components/floating-alert/floating-alert";

const EditarCapitulo = (props) => {
  const { id, id_capitulo } = useParams();

  const [isDarkTheme, setIsDarkTheme] = useState(false);
  const [proyecto, setProyecto] = useState({});
  const [capituloContent, setCapituloContent] = useState("");
  const [nombreDelCapitulo, setnombreDelCapitulo] = useState("");

  const [verAlertaGuardado, setVerAlertaGuardado] = useState(false);

  window.addEventListener("storage", () => {
    setIsDarkTheme(localStorage.getItem("theme") === "dark");
  });

  useEffect(() => {
    setIsDarkTheme(localStorage.getItem("theme") === "dark");
  }, []);

  useEffect(() => {
    backend
      .get(`/proyecto/${id}`, {
        params: {
          archivos: false,
        },
      })
      .then((i) => {
        if (i.data) setProyecto({ ...i.data, archivos: [] });
        else window.location.href = "/proyect";
      });
    backend.get(`/capitulo/${id}/${id_capitulo}`).then((i) => {
      if (i.data) {
        setnombreDelCapitulo(i.data["nombre"]);
        setCapituloContent(i.data.content);
      } else window.location.href = `/proyect/view/${id}`;
    });
  }, [id]);

  const editarCapitulo = async () => {
    backend
      .put(`/capitulo/${id}/${id_capitulo}`, {
        datos: {
          nombre: nombreDelCapitulo,
          content: capituloContent,
        },
        id,
        id_capitulo,
      })
      .then((i) => setVerAlertaGuardado(true))
      .catch((i) => setVerAlertaGuardado(false));
  };

  return (
    <div>
      <FloatingAlert
        texto={"Se ralizo la actualización"}
        titulo={`EXITO`}
        color="primary"
        visible={verAlertaGuardado}
        updateCurrent={(val) => setVerAlertaGuardado(val)}
      />
      <div className="bg-primary-subtle row">
        <div className="col-auto h3">
          Proyecto <sup className="text-secondary">({proyecto["id"]})</sup>
        </div>
        <div className="col-auto h3 bg-primary-subtle">
          {proyecto["nombre"]}
        </div>
        <div className="col-auto h3 bg-primary-subtle">-</div>
        <div className="col h3 bg-primary-subtle">{nombreDelCapitulo}</div>
      </div>
      <div className="col-grow">
        <div className="col-grow row px-3">
          <div className="col">
            <InputFormulario
              value={nombreDelCapitulo}
              setValue={setnombreDelCapitulo}
              type={"text"}
              label={"Nombre del capitulo"}
              icon="book-open"
            />
          </div>
          <div className="col"></div>
          <div
            className={`col-auto m-auto bg-${isDarkTheme ? "black" : "white"}`}
          >
            <button className="btn m-1 text-success-emphasis bg-success-subtle btn-lg boton-hover">
              <div className="my-tooltip">
                <span className="c-eye" />
                <div className="p-0 m-0 px-1 tooltiptext tooltiptext-top">
                  Previsualizar
                </div>
              </div>
            </button>
            <button
              className="btn m-1 text-primary-emphasis bg-primary-subtle btn-lg boton-hover"
              onClick={(ev) => editarCapitulo()}
            >
              <div className="my-tooltip">
                <span className="c-save" />
                <div className="p-0 m-0 px-1 tooltiptext tooltiptext-top">
                  Guardar
                </div>
              </div>
            </button>
          </div>
        </div>
        <div className="col-grow row"></div>
        <div className="col-grow row">
          <div className="input-group mb-3">
            <span className="input-group-text">
              <span className={`c-edit m-2`}></span>
            </span>
            <div className="col border-white ps-3 pt-2">
              <label className="mx-4 mb-2">
                {"Editor de capítulo"}
                <small className="col-auto text-secondary">
                  {
                    " Edite el texto del capitulo dentro del siguiente editor de texto:"
                  }
                </small>
              </label>
              <Editor
                className="mb-2"
                height="70vh"
                width="100%"
                defaultValue={capituloContent}
                value={capituloContent}
                theme={isDarkTheme ? "vs-dark" : ""}
                onChange={setCapituloContent}
                language="text"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

EditarCapitulo.propTypes = {};

export default EditarCapitulo;
