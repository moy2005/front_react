import axios from "axios";
const URI = "https://api-agristore.vercel.app/api";
//const URI = "http://localhost:4000/api";

const instance = axios.create({
    baseURL: URI,
    withCredentials: true,
});

// Agregar interceptor para incluir el token en cada petición
instance.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem("token"); // Obtener token del localStorage
        console.log("Token enviado en la solicitud:", token);
        
        if (token) {
            config.headers.Authorization = `Bearer ${token}`; // Agregar token al header
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// Interceptor de respuesta para manejar errores, como token expirado (ejemplo 401)
instance.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response?.status === 401) {
            // Si el token está expirado o es inválido, puedes borrar el token y redirigir
            localStorage.removeItem("token");
            console.warn("Token inválido o expirado. Redirigiendo a login...");
           // window.location.href = "/login";  // Redirigir al login
        }
        return Promise.reject(error);
    }
);

export default instance;

