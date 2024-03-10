import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import { useEffect, useState } from "react";
import Pantalla from "./pages/Pantalla";
import TextEditor from "./pages/TextEditor";
import Inicio from "./pages/Inicio";
import { ListaProyectos } from "./pages/ListaProyectos";
import CrearProyecto from "./components/Proyectos/CrearProyecto";
import VerProyecto from "./components/Proyectos/VerProyecto";
import EditarCapitulo from "./components/Proyectos/EditarCapitulo";

const App = () => {
  const [isDarkTheme, setIsDarkTheme] = useState(
    localStorage.getItem("theme") === "dark"
  );
  useEffect(() => {
    if (isDarkTheme) {
      document.documentElement.setAttribute("data-bs-theme", "dark");
      localStorage.setItem("theme", "dark");
    } else {
      document.documentElement.setAttribute("data-bs-theme", "");
      localStorage.setItem("theme", "light");
    }
    window.dispatchEvent(new Event("storage"));
  }, [isDarkTheme]);

  window.addEventListener("storage", () => {
    setIsDarkTheme(localStorage.getItem("theme") === "dark");
  });

  const toggleTheme = () => {
    setIsDarkTheme(!isDarkTheme);
  };

  return (
    <div className="col px-3">
      <div className="row bg-body-secondary p-2 rounded">
        <div className="col-auto">
          <a className={`btn p-0 fs-5 d-none d-sm-block`} href="/">
            Inicio
          </a>
          <a className={`btn p-0 fs-5 d-block d-sm-none`} href="/">
            <div className="my-tooltip">
              <span className="c-home" />
              <div className="p-0 m-0 px-1 tooltiptext tooltiptext-bottom">
                Inicio
              </div>
            </div>
          </a>
        </div>
        <div className="col-auto">
          <a className={`btn p-0 fs-5 d-none d-sm-block`} href="/general">
            Conversión
          </a>
          <a className={`btn p-0 fs-5 d-block d-sm-none`} href="/general">
            <div className="my-tooltip">
              <span className="c-list" />
              <div className="p-0 m-0 px-1 tooltiptext tooltiptext-bottom">
                Conversión
              </div>
            </div>
          </a>
        </div>
        <div className="col-auto">
          <a className={`btn p-0 fs-5 d-none d-sm-block`} href="/proyect">
            Proyectos
          </a>
          <a className={`btn p-0 fs-5 d-block d-sm-none`} href="/proyect">
            <div className="my-tooltip">
              <span className="c-folder" />
              <div className="p-0 m-0 px-1 tooltiptext tooltiptext-bottom">
                Proyectos
              </div>
            </div>
          </a>
        </div>
        <div className="col"></div>
        {/* <div className="col-auto">
          <div className="d-sm-none">xs</div>
          <div className="d-none d-sm-block d-md-none">sm</div>
          <div className="d-none d-md-block d-lg-none">md</div>
          <div className="d-none d-lg-block d-xl-none">lg</div>
          <div className="d-none d-xl-block d-xxl-none">xl</div>
          <div className="d-none d-xxl-block">xxl</div>
        </div> */}
        <div className="col-auto">
          <button
            className={`btn px-1 py-0 round-5 fs-3 btn-circle btn-circle boton-hover text-${
              isDarkTheme ? "warning" : "secondary"
            }`}
            onClick={toggleTheme}
          >
            <div className="my-tooltip">
              <span
                className={`${isDarkTheme ? "c-sun11" : "c-moon11"} p-0 m-0`}
              />
              <div className="p-0 m-0 px-1 fs-6 fw-lighter tooltiptext tooltiptext-bottom">
                Modo {isDarkTheme ? "claro" : "oscuro"}
              </div>
            </div>
          </button>
        </div>
      </div>
      <div className="">
        <Router>
          <Routes>
            <Route path="/" element={<Inicio />} />
            <Route path="/general" element={<Pantalla />} />
            <Route path="/proyect" element={<ListaProyectos />} />
            <Route path="/proyect/add" element={<CrearProyecto />} />
            <Route path="/proyect/view/:id" element={<VerProyecto />} />
            <Route
              path="/proyect/editar_capitulo/:id/:id_capitulo"
              element={<EditarCapitulo />}
            />
            <Route path="/textEditor" element={<TextEditor />} />
          </Routes>
        </Router>
      </div>
    </div>
  );
};

export default App;
