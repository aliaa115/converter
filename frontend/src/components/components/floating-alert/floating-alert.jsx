import PropTypes from "prop-types";
import { useEffect, useState } from "react";

export const FloatingAlert = ({
  titulo,
  texto,
  color,
  visible,
  updateCurrent,
}) => {
  const [isVisible, setIsVisible] = useState(visible);
  const [progress, setProgress] = useState(100);

  useEffect(() => {
    if (isVisible === true) {
      const timer = setInterval(() => {
        setProgress((prevProgress) => {
          if (prevProgress <= 0) {
            clearInterval(timer);
            setIsVisible(false);
            updateCurrent(false);
            return 100; // Reinicia el progreso cuando llega a cero
          }
          return prevProgress - 1;
        });
      }, 60); // Actualiza la barra de progreso cada 50 milisegundos

      return () => {
        clearInterval(timer);
      };
    }
  }, [isVisible]); // El efecto se ejecuta solo una vez al montar el componente

  const handleClose = () => {
    setIsVisible(false);
    updateCurrent(false);
  };

  useEffect(() => {
    setIsVisible(visible);
  }, [visible]);

  return (
    isVisible && (
      <div className={`floating-alert bg-${color}`}>
        <div className="col row">
          <div className="col-auto">
            <h6 className="m-0 p-0 col">{titulo || "Exito!"}</h6>
          </div>
          <div className="col"></div>
          <div className="col-auto">
            <button
              className="btn px-1 py-0 round-5 fs-6 btn-sm btn-circle boton-hover"
              onClick={handleClose}
            >
              <div className="my-tooltip">
                <span className="c-x p-0 m-0" />
                <div className="p-0 m-0 px-1 tooltiptext tooltiptext-top">
                  Cerrar
                </div>
              </div>
            </button>
          </div>
        </div>
        <div className="">{texto || "Se realizo la acción con éxito"}</div>
        <div
          className="progress"
          role="progressbar"
          aria-label="Example with label"
          aria-valuemin="0"
          aria-valuemax="100"
          style={{ height: "5px" }}
        >
          <div
            className="progress-bar"
            style={{ width: 120 - progress + "%", height: "5px" }}
          ></div>
        </div>
        <div
          className="progress-bar"
          style={{ width: `${120 - progress}%`, height: "5px" }}
        />
      </div>
    )
  );
};

FloatingAlert.propTypes = {
  titulo: PropTypes.string,
  texto: PropTypes.string,
  color: PropTypes.string,
  visible: PropTypes.bool,
  updateCurrent: PropTypes.func,
};
FloatingAlert.defaultProps = { color: "success", visible: true };

export default FloatingAlert;
