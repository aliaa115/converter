const mysql = require("knex")({
  client: "mysql",
  connection: {
    host: "localhost",
    user: "root",
    password: "12345678",
    database: "Conversion",
  },
});

module.exports = mysql;
