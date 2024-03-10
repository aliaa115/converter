import backend from "../../api/api";
import "../index.css";
import { ChangeEvent, useState } from "react";
import PropTypes from "prop-types";

const AgregarArchivoParaIniciarConversion = (props) => {
  const [file, setFile] = useState(null);

  const handleFileChange = (e) => {
    if (e.target.files) {
      setFile(e.target.files[0]);
    }
  };

  const handleUploadClick = () => {
    if (!file) return;
    const formData = new FormData();
    formData.append("archivo", file);

    backend
      .post("/guardar-archivo", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      })
      .then((i) => {
        props.onCambio(props.reactivar + 1);
        setFile(null);
      });
  };

  return (
    <div className="p-2 col rounded-4">
      <div className="col row">
        <h2 className="pb-4 col">Ingrese el documento a convertir</h2>
      </div>
      <div>
        <label htmlFor="images" className="drop-container" id="dropcontainer">
          <input type="file" required onChange={handleFileChange} />
        </label>
        <button className="btn btn-primary my-2" onClick={handleUploadClick}>
          Upload
        </button>
      </div>
    </div>
  );
};

// Define las propTypes para tu componente
AgregarArchivoParaIniciarConversion.propTypes = {
  reactivar: PropTypes.number, // Esto asume que 'reactivar' es de tipo numerico
  onCambio: PropTypes.func,
};

export default AgregarArchivoParaIniciarConversion;
