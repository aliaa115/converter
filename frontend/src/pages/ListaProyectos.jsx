import { useEffect, useState, useRef } from "react";
import backend from "../api/api";
import PropTypes from "prop-types";
import moment from "moment";

export const ListaProyectos = () => {
  //allProyectos

  const [archivos, setArchivos] = useState([]);
  const [contador, setContador] = useState(50); // Establece el tiempo inicial en segundos

  useEffect(() => {
    const interval = setInterval(() => {
      if (contador > 0) {
        setContador(contador - 1);
      } else {
        setContador(50);
        obtenerListaArchivosConvertidos();
        clearInterval(interval); // Detiene el contador cuando llega a cero
      }
    }, 1000);

    // Limpia el intervalo cuando el componente se desmonta
    return () => clearInterval(interval);
  }, [contador]);

  useEffect(() => {
    obtenerListaArchivosConvertidos();
  }, []);

  const obtenerListaArchivosConvertidos = () => {
    backend
      .get("/allProyectos")
      .then((response) => {
        setArchivos(response.data);
        console.log(response.data);
      })
      .catch((error) => {
        console.error("Error al obtener datos de la API:", error);
      });
  };

  return (
    <div className="col row">
      <div className="bg-primary-subtle row">
        <div className="col-auto">
          <a className="btn btn-circle fs-1 my-1 p-0" role="button" href="/">
            <span className="c-chevron-left m-0 p-0" />
          </a>
        </div>
        <div className="bg-primary-subtle h2 col my-1 p-0">
          Lista de proyectos
        </div>
        <div className="col-auto row text-end">
          <div className="col my-2">
            <sup className="col">
              Recargando en... {`${`${contador}`.split(".")[0]}s`}
            </sup>
            <div
              className="progress bg-transparent border"
              role="progressbar"
              aria-label="Basic example"
              aria-valuenow={`${contador * 2}`}
              aria-valuemin="0"
              aria-valuemax="100"
              style={{ height: "5px", transform: "rotate(180deg)" }}
            >
              <div
                className="progress-bar rounded-pill bg-warning text-black py-1"
                style={{ width: `${contador * 2}%` }}
              />
            </div>
          </div>
        </div>
      </div>
      <div className="px-5">
        <h2 className="pb-4 col">Ingrese el documento a convertir</h2>
        <div className="col row">
          <div className="h3 col-auto"> Lista de proyectos generados </div>
          <div className="col">
            <a role="button" href="/proyect/add" className="btn btn-success">
              <span className="c-folder-plus"></span>
              <span className="ms-2">Nuevo proyecto</span>
            </a>
          </div>
        </div>
        <ul className="col-12 p-2 list-group">
          {archivos.map((i) => (
            <ItemProyecto key={i.id} id={i.id} nombre={i.nombre} data={i} />
          ))}
        </ul>
      </div>
    </div>
  );
};

const ItemProyecto = (props) => {
  const { id, nombre, data } = props;

  const ref = useRef(null);

  const [icon, setIcon] = useState("c-chevron-down");

  useEffect(() => {
    // Función que se ejecutará cuando se observe un cambio en el elemento
    const callback = () => {
      // Verifica si el elemento tiene la clase "show" después de cada mutación
      setIcon(
        ref.current?.classList?.contains("show")
          ? "c-chevron-up"
          : !ref.current?.classList?.contains("collapse")
          ? "c-minus"
          : "c-chevron-down"
      );
    };

    // Configurar el MutationObserver para observar cambios en las clases
    const observer = new MutationObserver(callback);

    // Observar cambios en el atributo "class" del elemento
    observer.observe(ref.current, {
      attributes: true,
      attributeFilter: ["class"],
    });

    // Detener el observador cuando el componente se desmonta
    return () => {
      observer.disconnect();
    };
  }, []);

  return (
    <div key={id}>
      <a role="button" href={`/proyect/view/${id}`} className="btn btn-primary">
        <span className="c-book-open"></span>
      </a>
      <button
        className="btn"
        type="button"
        data-bs-toggle="collapse"
        data-bs-target={`#proyectDetails${id}`}
        aria-expanded="false"
        aria-controls={`proyectDetails${id}`}
      >
        <div className="h4">
          {nombre}
          <span className={`${icon} ms-2`}></span>
        </div>
      </button>
      <div className="collapse" ref={ref} id={`proyectDetails${id}`}>
        <div className="col">
          <table className="table table-striped table-hover">
            <tbody>
              <tr>
                <th>
                  Proyecto <sup className="text-secondary">({id})</sup>
                </th>
                <td>{nombre}</td>
                <th>Fecha de creación</th>
                <td>
                  <span>
                    {moment(data.fecha_creacion).format("DD-MM-YYYY")}
                  </span>{" "}
                  <sup className="text-secondary">
                    [{moment(data.fecha_creacion).format("HH:mm:ss")}]
                  </sup>
                </td>
              </tr>
              <tr>
                <th>Cantidad de archivos</th>
                <td>{data.archivos}</td>
                <th>Fecha de actualizacion</th>
                <td>
                  <span>{moment(data.fecha_update).format("DD-MM-YYYY")}</span>{" "}
                  <sup className="text-secondary">
                    [{moment(data.fecha_update).format("HH:mm:ss")}]
                  </sup>
                </td>
              </tr>
              <tr>
                <th className="bg-info-subtle">Información general:</th>
                <td className="bg-info-subtle" colSpan={"100%"}>
                  <code className="col-12  p-2">
                    {JSON.stringify(data, null, 2)}
                  </code>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
        {/* <table className="table table-striped table-hover">
          <thead>
            <tr>
              <th scope="col">#</th>
              <th scope="col">First</th>
              <th scope="col">Last</th>
              <th scope="col">Handle</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <th scope="row">1</th>
              <td>Mark</td>
              <td>Otto</td>
              <td>@mdo</td>
            </tr>
            <tr>
              <th scope="row">2</th>
              <td>Jacob</td>
              <td>Thornton</td>
              <td>@fat</td>
            </tr>
            <tr>
              <th scope="row">3</th>
              <td colSpan="2">Larry the Bird</td>
              <td>@twitter</td>
            </tr>
          </tbody>
        </table> */}
      </div>
      <hr />
    </div>
  );
};

ItemProyecto.propTypes = {
  id: PropTypes.number,
  nombre: PropTypes.string,
  data: PropTypes.object,
};
