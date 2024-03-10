const path = require("path");
const fs = require("fs");

module.exports.AllProyectos = (app, multer) => {
  app.get("/allProyectos", (req, res) => {
    mysql({ p: "proyecto" })
      .select("p.*")
      .count({ archivos: "a.id_proyecto" })
      .leftJoin({ a: "archivo" }, function () {
        this.on("p.id", "a.id_proyecto");
      })
      .groupBy("p.id", "p.nombre", "p.fecha_creacion")
      .then((i) => res.json(i));
  });
};
