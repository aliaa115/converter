const express = require("express");
const cors = require("cors");
const fs = require("fs");
const {
  ArchivosRoutes,
  AllProyectos,
  CreateProyecto,
  GetProyectos,
  AgregarArchivoProyecto,
} = require("./routes");
const app = express();
const port = process.env.PORT || 3000;
const multer = require("multer");
const mysql = require("./db/mysql");
require("./helpers/globals");

global.mysql = mysql;

app.use(express.json());
app.use(cors());

// Ruta principal
app.get("/", (req, res) => {
  res.send("Bienvenido a la página principal");
});

const storage = multer.memoryStorage(); // Almacenará el archivo en memoria
const upload = multer({ storage: storage });

// Rutas con el prefijo '/api'
const apiRouter = express.Router();

// Ruta '/api/posts'
apiRouter.get("/", (req, res) => {
  // Lógica para obtener la lista de publicaciones
  res.json({});
});

// Ruta '/api/users'
apiRouter.get("/users", (req, res) => {
  // Lógica para obtener la lista de usuarios
  const users = [
    { id: 1, name: "Usuario 1" },
    { id: 2, name: "Usuario 2" },
  ];
  res.json(users);
});

// Ruta '/api/posts'
apiRouter.get("/posts", (req, res) => {
  // Lógica para obtener la lista de publicaciones
  const posts = [
    { id: 1, title: "Publicación 1" },
    { id: 2, title: "Publicación 2" },
  ];
  res.json(posts);
});

ArchivosRoutes(apiRouter, upload);
AllProyectos(apiRouter, upload);
CreateProyecto(apiRouter, upload);
GetProyectos(apiRouter, upload);
AgregarArchivoProyecto(apiRouter, upload);

app.use("/api", apiRouter);

// Agregar el enrutador '/api' a la aplicación

// Iniciar el servidor
app.listen(port, () => {
  console.log(`Servidor en funcionamiento en el puerto ${port}`);
});
