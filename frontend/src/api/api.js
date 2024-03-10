// api.js
import axios from "axios";

// Crea una instancia de Axios con la URL base de tu API
const backend = axios.create({
  baseURL: "http://localhost:3000/api", // Reemplaza con la URL de tu API
});

export default backend;
