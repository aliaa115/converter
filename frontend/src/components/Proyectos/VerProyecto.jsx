import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import PropTypes from "prop-types";
import backend from "../../api/api";
import moment from "moment";
import { Modal, Tooltip } from "react-bootstrap";
import bootstrap from "bootstrap/dist/js/bootstrap.js";
import { propTypes } from "react-bootstrap/esm/Image";

const VerProyecto = (props) => {
  const { id } = useParams();

  const [proyecto, setProyecto] = useState({});
  const [capitulos, setCapitulos] = useState([]);
  const [file, setFile] = useState(null);
  const [contenidoArchivo, setcontenidoArchivo] = useState("");
  const [showFile, setshowFile] = useState(false);
  const [isShow, invokeModal] = React.useState(false);
  const [replaceFile, setReplaceFile] = useState(false);
  const [archivoParaReemplazar, setArchivoParaReemplazar] = useState(null);
  const [extensionToReplace, setExtensionToReplace] = useState("txt");
  const [datosArchivoAReemplazar, setDatosArchivoAReemplazar] = useState({
    ubicacion: null,
    nombre: null,
  });
  const [recargarProyecto, setRecargarProyecto] = useState(0);
  const [watchChapter, setWatchChapter] = useState(false);
  const [chapter, setChapter] = useState({ id: 0, nombre: "", content: "" });
  const [mostrarEditarCapitulo, setMostrarEditarCapitulo] = useState(false);
  const [capituloAEditar, setCapituloAEditar] = useState(null);

  const irACapitulo = (id) => {
    let capitulo = capitulos.find((i) => i.id == id);

    if (capitulo) setChapter({ ...capitulo });
    else setWatchChapter(false);
  };
  const initWatchChapter = (id, nombre, content) => {
    setChapter({ id, nombre, content });
    setWatchChapter((val) => !val);
  };
  const hideChapter = () => setWatchChapter(false);
  const handleFileChange = (e) => {
    if (e.target.files[0]) {
      setFile(e.target.files[0]);
    }
  };
  const handleArchivoAReemplazarChange = (e) => {
    if (e.target.files[0]) {
      setArchivoParaReemplazar(e.target.files[0]);
    }
  };

  const obtenerArchivosEpubDeProyecto = async (tipo) => {
    return await backend.get(`obtener_archivos_proyecto/${id}`, {
      params: { extension: tipo },
    });
  };

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
        obtenerArchivosEpubDeProyecto("epub").then((arch) =>
          setProyecto((i) => ({ ...i, archivos_epub: arch.data }))
        );
        obtenerArchivosEpubDeProyecto("txt").then((arch) =>
          setProyecto((i) => ({ ...i, archivos_txt: arch.data }))
        );
        obtenerArchivosEpubDeProyecto("html").then((arch) =>
          setProyecto((i) => ({ ...i, archivos_html: arch.data }))
        );
      });
    backend.get(`/capitulos/${id}`).then(({ data }) => {
      console.log(data);
      setCapitulos(data.map((i) => ({ ...i, url: irAEditarCapitulo(i.id) })));
    });
  }, [id, recargarProyecto]);

  const initShowFile = (archivo) => {
    if (!archivo) {
      setcontenidoArchivo("");
      return setshowFile((val) => !val);
    } else {
      backend(`obtener_contenido_archivos/${archivo.id}/${id}`).then(
        ({ data }) => {
          console.log(data.contenido);
          setcontenidoArchivo(data.contenido);
          setshowFile((val) => !val);
        }
      );
    }
  };

  const initModal = () => {
    setFile(null);
    return invokeModal((val) => !val);
  };

  const initReplaceFile = (extension = "TXT") => {
    setExtensionToReplace(`${extension}`.toLocaleLowerCase());
    setArchivoParaReemplazar(null);
    return setReplaceFile((val) => !val);
  };

  const initActualizarArchivo = ({ id_, nombre, extension, ubicacion }) => {
    initReplaceFile(extension);
    setDatosArchivoAReemplazar({ id_, nombre, ubicacion });
  };

  const agregarArchivoProyecto = () => {
    if (!file) {
      invokeModal(false);
      return;
    }
    const formData = new FormData();
    formData.append("archivo", file);
    backend
      .post(`agregar-archivo-proyecto/${id}`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      })
      .then((i) => setRecargarProyecto((val) => val + 1));
  };

  const eliminarArchivoDeProyecto = (id_) => {
    backend
      .delete(`eliminar-archivo-proyecto/${id_}/${id}`)
      .then((i) => setRecargarProyecto((val) => val + 1));
  };

  const descargarArchivoProyecto = (id_, archivo) => {
    backend
      .get(`obtener_archivo_proyecto/${id}/${id_}`, {
        responseType: "blob", // Especifica que la respuesta es un archivo binario
      })
      .then((response) => {
        const name = `${response.headers["content-disposition"]}`.split('"')[1];

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
  };

  const procesarArchivoDeProyecto = (id_, archivo) => {
    backend
      .get(`procesar_archivo_proyecto/${id}/${id_}`)
      .then((response) => {
        setRecargarProyecto((val) => val + 1);
      })
      .catch((error) => {
        console.error("Error al descargar el archivo:", error);
      });
    // procesar_archivo_proyecto;
  };

  const procesarActualizarArchivo = async (extension) => {
    if (!archivoParaReemplazar) {
      initReplaceFile(extension);
      return;
    }
    //archivoParaReemplazar
    const formData = new FormData();
    formData.append("archivo", archivoParaReemplazar);
    formData.append("nombre", datosArchivoAReemplazar.nombre);
    formData.append("ubicacion", datosArchivoAReemplazar.ubicacion);

    await backend
      .post(`reemplazar-archivo-proyecto/${id}`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      })
      .then(async (i) => {
        initReplaceFile();
        setRecargarProyecto((val) => val + 1);
      });
  };

  const procesarArchivoDeProyectoTxt = (id_, archivo) => {
    backend
      .get(`procesar_archivo_proyecto_txt/${id}/${id_}`)
      .then((response) => setRecargarProyecto((val) => val + 1))
      .catch((error) => {
        console.error("Error al descargar el archivo:", error);
      });
    // procesar_archivo_proyecto;
  };

  const irAEditarCapitulo = (id_) => {
    return "/proyect/editar_capitulo/" + id + "/" + id_;
  };

  return (
    <div className="">
      <div className="bg-primary-subtle row">
        <div className="col-auto h3">
          Proyecto <sup className="text-secondary">({proyecto["id"]})</sup>
        </div>
        <div className="col h3 bg-primary-subtle">{proyecto["nombre"]}</div>
      </div>
      <div className="col px-3 my-3">
        <div className="col row">
          <div className="col">
            <table className="table table-striped table-hover">
              <tbody>
                <tr>
                  <th>Fecha de creación</th>
                  <td>
                    <span>
                      {moment(proyecto["fecha_creacion"]).format("DD-MM-YYYY")}
                    </span>{" "}
                    <sup className="text-secondary">
                      [{moment(proyecto["fecha_creacion"]).format("HH:mm:ss")}]
                    </sup>
                  </td>
                  <th></th>
                  <th></th>
                  <td></td>
                </tr>
                <tr>
                  <th>Fecha de actualizacion</th>
                  <td>
                    <span>
                      {moment(proyecto["fecha_update"]).format("DD-MM-YYYY")}
                    </span>{" "}
                    <sup className="text-secondary">
                      [{moment(proyecto["fecha_update"]).format("HH:mm:ss")}]
                    </sup>
                  </td>
                  <th></th>
                  <th>Cantidad de archivos</th>
                  <td>{proyecto["archivos"]?.length}</td>
                </tr>
                {/* <tr>
                <th className="bg-info-subtle">Información general:</th>
                <td className="bg-info-subtle" colSpan={4}>
                  <code className="col-12 p-2">
                    {JSON.stringify(proyecto, null, 2)}
                  </code>
                </td>
              </tr> */}
              </tbody>
            </table>
          </div>
          <h4>Archivos</h4>
          <div
            className="col"
            style={{ overflow: "auto", maxWidth: "100%", maxHeight: "40vh" }}
          >
            <table className="table table-striped table-hover">
              <thead>
                <tr>
                  <td className="col fw-light m-0 p-0 text-center align-middle">
                    <div className="m-0 py-2">
                      <button
                        onClick={initModal}
                        className="btn text-success-emphasis bg-success-subtle btn-sm m-0 mx-3 p-1 py-0"
                      >
                        <span className="c-plus m-0 p-0" />
                      </button>
                    </div>
                  </td>
                  <th className="col-auto fw-light m-0 p-0 text-center align-middle">
                    Archivo
                  </th>
                  <th className="col-auto fw-light m-0 p-0 text-center align-middle">
                    Extensión
                  </th>
                  <th className="col-1 fw-light m-0 px-1 p-0 text-center align-middle">
                    Tamaño
                  </th>
                  <th className="col-1 fw-light m-0 px-1 p-0 text-center align-middle">
                    Agregado
                  </th>
                  <th className="col-1 fw-light m-0 px-1 p-0 text-center align-middle">
                    Editado
                  </th>
                  <th
                    className="col-1 fw-light m-0 px-1 p-0 text-center align-middle"
                    colSpan={100}
                  ></th>
                </tr>
              </thead>
              <thead>
                <tr className="">
                  <th colSpan="100%">Arcvhivos EPUB base</th>
                </tr>
              </thead>
              <tbody>
                <ListaDeArchivos
                  archivos={proyecto["archivos_epub"]}
                  onEliminar={(id) => eliminarArchivoDeProyecto(id)}
                  onProcesar={(id, nombre) =>
                    procesarArchivoDeProyecto(id, nombre)
                  }
                  onDescargar={(id, nombre) =>
                    descargarArchivoProyecto(id, nombre)
                  }
                />
              </tbody>
              <thead>
                <tr className="">
                  <td colSpan="100%">Archivos TXT previos a procesado</td>
                </tr>
              </thead>
              <tbody>
                <ListaDeArchivos
                  archivos={proyecto["archivos_txt"]}
                  onEliminar={(id) => eliminarArchivoDeProyecto(id)}
                  onProcesar={(id, nombre) =>
                    procesarArchivoDeProyectoTxt(id, nombre)
                  }
                  onDescargar={(id, nombre) =>
                    descargarArchivoProyecto(id, nombre)
                  }
                  mostrarArchivo={(id, nombre) => initShowFile({ id, nombre })}
                  actualizarArchivo={(id, nombre, extension, ubicacion) =>
                    initActualizarArchivo({ id, nombre, extension, ubicacion })
                  }
                />
              </tbody>
              <thead>
                <tr className="">
                  <td colSpan="100%">Archivos HTML previos a procesado</td>
                </tr>
              </thead>
              <tbody>
                <ListaDeArchivos
                  archivos={proyecto["archivos_html"]}
                  onEliminar={(id) => eliminarArchivoDeProyecto(id)}
                  onProcesar={(id, nombre) =>
                    procesarArchivoDeProyectoTxt(id, nombre)
                  }
                  onDescargar={(id, nombre) =>
                    descargarArchivoProyecto(id, nombre)
                  }
                  mostrarArchivo={(id, nombre) => initShowFile({ id, nombre })}
                  actualizarArchivo={(id, nombre, extension, ubicacion) =>
                    initActualizarArchivo({ id, nombre, extension, ubicacion })
                  }
                />
              </tbody>
            </table>
          </div>
          <h4>Capítulos</h4>
          <div
            className="col"
            style={{ overflow: "auto", maxWidth: "100%", maxHeight: "40vh" }}
          >
            <table className="table table-striped table-hover">
              <thead>
                <tr>
                  <td className="col fw-light m-0 p-0 text-center align-middle"></td>
                </tr>
              </thead>
              <tbody>
                <ListaCapitulos
                  capitulos={capitulos}
                  mostrarCapitulo={initWatchChapter}
                  editarCapitulo={irAEditarCapitulo}
                />
              </tbody>
            </table>
          </div>
          <Modal
            show={showFile}
            onHide={() => initShowFile()}
            centered
            persist
            backdrop="static"
            size="lg"
            aria-labelledby="example-modal-sizes-title-lg"
          >
            <Modal.Header className="py-0">
              <Modal.Title style={{ width: "100%" }}>
                <div className="row col p-0">
                  <div className="col-10">Agregar Archivo a Proyecto</div>
                  <div className="col p-0 text-end">
                    <button
                      className="fs-3 btn btn-danger btn-circle btn-sm p-1 m-0"
                      onClick={() => initShowFile()}
                    >
                      <span className="c-x1" />
                    </button>
                  </div>
                </div>
              </Modal.Title>
            </Modal.Header>
            <Modal.Body>
              <pre
                style={{
                  overflowY: "auto",
                  overflowX: "hide",
                  maxHeight: "50vh",
                }}
              >
                {contenidoArchivo}
              </pre>
            </Modal.Body>
          </Modal>
          <Modal
            show={isShow}
            onHide={initModal}
            centered
            persist
            backdrop="static"
          >
            <Modal.Header className="py-0">
              <Modal.Title style={{ width: "100%" }}>
                <div className="row col p-0">
                  <div className="col-10">Agregar Archivo a Proyecto</div>
                  <div className="col p-0 text-end">
                    <button
                      className="fs-3 btn btn-danger btn-circle btn-sm p-1 m-0"
                      onClick={initModal}
                    >
                      <span className="c-x" />
                    </button>
                  </div>
                </div>
              </Modal.Title>
            </Modal.Header>
            <Modal.Body>
              <div className="col row">
                <button
                  className="btn btn-success col-1 mx-2"
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
                  style={{ display: "none" }}
                  onChange={handleFileChange}
                />
                {file ? (
                  <table className="col">
                    <tbody>
                      <tr>
                        <td style={{ width: "100%" }}>{file.name}</td>
                        <td style={{ width: "1%", paddingRight: "15px" }}>
                          {(file.size / (1024 * 1024)).toFixed(2)}MB
                        </td>
                      </tr>
                    </tbody>
                  </table>
                ) : (
                  <></>
                )}
              </div>
            </Modal.Body>
            <Modal.Footer className="py-0">
              <button
                className="btn btn-success"
                onClick={agregarArchivoProyecto}
              >
                <span className="c-save" />
              </button>
            </Modal.Footer>
          </Modal>
          <Modal
            show={replaceFile}
            onHide={() => initReplaceFile()}
            centered
            persist
            backdrop="static"
          >
            <Modal.Header className="py-0">
              <Modal.Title style={{ width: "100%" }}>
                <div className="row col p-0">
                  <div className="col-10">
                    Reemplazar Archivo con archivo [{`${extensionToReplace}`}]
                  </div>
                  <div className="col p-0 text-end">
                    <button
                      className="fs-3 btn btn-danger btn-circle btn-sm p-1 m-0"
                      onClick={initReplaceFile}
                    >
                      <span className="c-x" />
                    </button>
                  </div>
                </div>
              </Modal.Title>
            </Modal.Header>
            <Modal.Body>
              <div className="col row">
                <button
                  className="btn btn-success col-1 mx-2"
                  type="button"
                  onClick={(e) => {
                    document.getElementById("selectedFile").click();
                  }}
                >
                  <span className="c-plus"></span>
                </button>
                <input
                  accept={`.${extensionToReplace}`}
                  id="selectedFile"
                  type="file"
                  name="files"
                  value=""
                  style={{ display: "none" }}
                  onChange={handleArchivoAReemplazarChange}
                />
                {file ? (
                  <table className="col">
                    <tbody>
                      <tr>
                        <td style={{ width: "100%" }}>{file.name}</td>
                        <td style={{ width: "1%", paddingRight: "15px" }}>
                          {(file.size / (1024 * 1024)).toFixed(2)}MB
                        </td>
                      </tr>
                    </tbody>
                  </table>
                ) : (
                  <></>
                )}
              </div>
            </Modal.Body>
            <Modal.Footer className="py-0">
              <button
                className="btn btn-success"
                onClick={procesarActualizarArchivo}
              >
                <span className="c-save" />
              </button>
            </Modal.Footer>
          </Modal>
          <Modal
            show={watchChapter}
            onHide={() => hideChapter()}
            centered
            dialogClassName="modal-xl"
          >
            <Modal.Header className="py-0" closeButton>
              <Modal.Title style={{ width: "100%" }}>
                <div className="row col p-0">
                  <button
                    className="col-auto btn"
                    onClick={(ev) => irACapitulo(chapter.id - 1)}
                    disabled={chapter.id == 1}
                  >
                    <span className="c-skip-back" />
                  </button>
                  <div className="col text-center">
                    {chapter.id} - {chapter.nombre}
                  </div>
                  <button
                    className="col-auto btn me-3"
                    disabled={chapter.id == capitulos.length}
                    onClick={(ev) => irACapitulo(chapter.id + 1)}
                  >
                    <span className="c-skip-forward" />
                  </button>
                </div>
              </Modal.Title>
            </Modal.Header>
            <Modal.Body>
              <div
                className="px-3"
                style={{
                  overflow: "auto",
                  maxHeight: "70vh",
                  whiteSpace: "pre-line",
                  textAlign: "justify",
                }}
              >
                {chapter.content}
              </div>
            </Modal.Body>
          </Modal>
        </div>
      </div>
    </div>
  );
};

VerProyecto.propTypes = {};

const ListaCapitulos = (props) => {
  let { capitulos, mostrarCapitulo, editarCapitulo } = props;
  return (
    <>
      {capitulos.map((i) => (
        <tr key={i.id}>
          <td className="border text-danger-emphasis col text-center align-middle m-0 p-0">
            {i.id}
          </td>
          <td
            className="border px-2 col-auto m-0 p-0 align-middle fw-normal"
            style={{ whiteSpace: "normal" }}
          >
            {i.nombre}
          </td>
          {/* <td>{JSON.stringify(i)}</td> */}
          <td className="border col-1 text-center m-0 p-0 bg-light-subtle  align-middle">
            <a
              className="btn text-primary-emphasis bg-primary-subtle m-0 p-1 py-0 btn-sm boton-hover"
              href={i.url}
            >
              <div className="my-tooltip">
                <span className="c-edit m-0 p-0" />
                <div className="p-0 m-0 px-1 tooltiptext tooltiptext-top">
                  Editar contenido de Capitulo
                </div>
              </div>
            </a>
            <button
              className="btn text-success-emphasis bg-success-subtle m-0 p-1 py-0 btn-sm boton-hover"
              onClick={(ev) => mostrarCapitulo(i.id, i.nombre, i.content)}
            >
              <div className="my-tooltip">
                <span className="c-eye m-0 p-0" />
                <div className="p-0 m-0 px-1 tooltiptext tooltiptext-top">
                  Ver contenido de archivo
                </div>
              </div>
            </button>
          </td>
        </tr>
      ))}
    </>
  );
};

ListaCapitulos.propTypes = {
  capitulos: PropTypes.array,
  mostrarCapitulo: PropTypes.func,
  editarCapitulo: PropTypes.func,
};

const ListaDeArchivos = (props) => {
  let {
    archivos,
    onEliminar,
    onDescargar,
    onProcesar,
    mostrarArchivo,
    actualizarArchivo,
  } = props;

  return (
    <>
      {archivos?.map((i) => (
        <tr className="" key={i.id}>
          <td className="border text-danger-emphasis col text-center align-middle m-0 p-0">
            {i.id}
          </td>
          <td
            className="border px-2 col-auto m-0 p-0 align-middle fw-normal"
            style={{ whiteSpace: "normal" }}
          >
            {i.nombre}
          </td>
          <td
            className="border px-2 col-auto m-0 p-0 align-middle fw-normal"
            style={{ whiteSpace: "normal" }}
          >
            {i.extension}
          </td>
          <td className="border col-1 text-left m-0 p-0 text-center align-middle">
            <div className="m-0 p-0 fw-normal">
              {(i.tamano / (1024 * 1024)).toFixed(2)}MB
            </div>
          </td>
          <td className="border col-2 text-left m-0 p-0 text-center align-middle">
            <div className="m-0 p-0 fw-normal">
              {moment(i.fecha_creacion).format("DD-MM-YYYY")}{" "}
              <sup className="text-secondary">
                [{moment(i.fecha_creacion).format("HH:mm:ss")}]
              </sup>
            </div>
          </td>
          <td className="border col-2 text-left m-0 p-0 text-center align-middle">
            <div className="m-0 p-0 fw-normal">
              {moment(i.fecha_edicion).format("DD-MM-YYYY")}{" "}
              <sup className="text-secondary">
                [{moment(i.fecha_edicion).format("HH:mm:ss")}]
              </sup>
            </div>
          </td>
          {i.estado == 1 ? (
            <td className="border col-1 text-center m-0 p-0 bg-light-subtle  align-middle">
              {[1, 2].includes(i.id_extension) ? (
                <button
                  className={`btn text-info-emphasis bg-info-subtle m-0 p-1 py-0 btn-sm boton-hover ${
                    `${i.nombre}`.includes(".jpg") ? "disabled" : ""
                  }`}
                  onClick={(ev) => onProcesar(i.id, i.nombre)}
                >
                  <div className="my-tooltip">
                    <span className="c-command m-0 p-0" />
                    <div className="p-0 m-0 px-1 tooltiptext tooltiptext-top">
                      Procesar
                    </div>
                  </div>
                </button>
              ) : (
                <></>
              )}
              <button
                className="btn text-warning-emphasis bg-warning-subtle m-0 p-1 py-0 btn-sm boton-hover"
                onClick={(ev) => onDescargar(i.id, i.nombre)}
              >
                <div className="my-tooltip">
                  <span className="icon c-download m-0 p-0" />
                  <div className="p-0 m-0 px-1 tooltiptext tooltiptext-top">
                    Descargar
                  </div>
                </div>
              </button>
              {i.id_extension == 2 ? (
                <button
                  className="btn text-primary-emphasis bg-primary-subtle m-0 p-1 py-0 btn-sm boton-hover"
                  onClick={(ev) =>
                    actualizarArchivo(i.id, i.nombre, i.extension, i.ubicacion)
                  }
                >
                  <div className="my-tooltip">
                    <span className="c-upload m-0 p-0" />
                    <div className="p-0 m-0 px-1 tooltiptext tooltiptext-top">
                      Subir una nueva versión del archivo
                    </div>
                  </div>
                </button>
              ) : (
                <></>
              )}
              {[2, 4].includes(i.id_extension) ? (
                <button
                  className="btn text-success-emphasis bg-success-subtle m-0 p-1 py-0 btn-sm boton-hover"
                  onClick={(ev) => mostrarArchivo(i.id, i.nombre)}
                >
                  <div className="my-tooltip">
                    <span className="c-eye m-0 p-0" />
                    <div className="p-0 m-0 px-1 tooltiptext tooltiptext-top">
                      Ver contenido de archivo
                    </div>
                  </div>
                </button>
              ) : (
                <></>
              )}
              {/* <button
                          className="btn text-primary-emphasis bg-primary-subtle m-0 p-1 py-0 btn-sm boton-hover"
                          onClick={(ev) => editarArchivoDeProyecto(i.id)}
                        >
                          <div className="my-tooltip">
                            <span className="c-edit m-0 p-0" />
                            <div className="p-0 m-0 px-1 tooltiptext tooltiptext-top">
                              Editar
                            </div>
                          </div>
                        </button> */}
              <button
                className="btn text-danger-emphasis bg-danger-subtle m-0 p-1 py-0 btn-sm boton-hover"
                onClick={(ev) => onEliminar(i.id)}
              >
                <div className="my-tooltip">
                  <span className="c-trash m-0 p-0" />
                  <div className="p-0 m-0 px-1 tooltiptext tooltiptext-top">
                    Eliminar
                  </div>
                </div>
              </button>
            </td>
          ) : (
            <td
              className="border col-1 text-center m-0 p-0 bg-light-subtle text-center text-secondary"
              colSpan={4}
            >
              Archivo eliminado
            </td>
          )}
        </tr>
      ))}
    </>
  );
};

ListaDeArchivos.propTypes = {
  archivos: PropTypes.array,
  onEliminar: PropTypes.func,
  onDescargar: PropTypes.func,
  onProcesar: PropTypes.func,
  mostrarArchivo: PropTypes.func,
  actualizarArchivo: PropTypes.func,
};

export default VerProyecto;
