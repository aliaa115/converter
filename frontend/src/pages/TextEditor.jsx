import React, { useEffect, useState } from "react";
import AceEditor from "react-ace";
import "ace-builds/src-noconflict/mode-text"; // Configura el modo de edición de texto
import "ace-builds/src-noconflict/theme-github"; // Configura el tema del editor
import backend from "../api/api";

function TxtEditor() {
  const [text, setText] = useState("");
  const [archivo, setArchivo] = useState("");

  useEffect(() => {
    // Obtener la URL actual
    const url = new URL(window.location.href);

    // Obtener los parámetros de consulta
    const queryParams = new URLSearchParams(url.search);

    // Obtener el valor de un parámetro de consulta específico
    const parametro1 = queryParams.get("archivo");

    console.log("archivo:", parametro1); // Valor1

    setArchivo(parametro1);
    backend.get("/contenidoTxt/" + parametro1).then(({ data }) => {
      console.log(data.contenido);
      setText(data.contenido);
    });
  }, []);

  const handleTextChange = (e) => {
    setText(e.target.value);
  };

  const textareaStyle = {
    width: "100%", // Ocupa el 100% del ancho disponible
    height: "80vh", // Ocupa el 100% de la altura de la ventana
  };

  const corregirArchivo = () => {
    // Agregar el archivo con el nombre "archivo.txt" y el contenido "text"
    const formData = new FormData();

    formData.append(
      "archivo",
      new Blob([text], { type: "text/plain" }),
      "archivo.txt"
    );

    formData.append("nombre", archivo);

    // Hacer la solicitud con axios
    backend
      .put("/enviarCorregitArchivo", formData)
      .then((e) => {
        window.location.reload();
        console.log(e);
      })
      .catch((e) => console.log(e));
  };

  return (
    <div className="col row">
      <p className="col">
        A continuación se le presenta el contenido del archivo seleccionado,
        debe copiar y pegar el contenido en un editor de texto para poder
        editarlo y luego reemplazar el texto en el <b>cuadro de texto</b> y dar
        click en <b>Corregir Archivo</b>:
      </p>
      <div className="col">
        <button className="btn btn-primary" onClick={() => corregirArchivo()}>
          Corregir Archivo
        </button>
        <textarea
          className="col mt-2 form-control"
          style={textareaStyle}
          value={text}
          onChange={handleTextChange}
        />
      </div>
    </div>
  );
}

export default TxtEditor;
