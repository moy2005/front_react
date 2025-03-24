import React from "react";
import { useLocation, Link, useParams } from "react-router-dom";
import { useProducts } from "../context/ProductContext";
import "../styles/breadcrumbs.css";

const Breadcrumbs = () => {
  const location = useLocation();
  const pathnames = location.pathname.split("/").filter((x) => x);
  const { id } = useParams(); // Para rutas dinámicas como /products/:id
  const { products } = useProducts(); // Para obtener el nombre del producto

  // Mapeo de rutas a nombres personalizados
  const routeNames = {
    // Rutas públicas
    "/": "Inicio",
    "/about": "Sobre Nosotros",
    "/contact": "Contacto",
    "/location": "Ubicación",
    "/catalog": "Catálogo",
    "/products/:id": "Detalle del Producto", // Ruta dinámica
    "/offers": "Ofertas",
    "/nosotros": "Nosotros",
    "/public/preguntasFre": "Preguntas Frecuentes",

    // Rutas de autenticación
    "/login": "Iniciar Sesión",
    "/register": "Registrarse",
    "/forgot-password": "Recuperar Contraseña",
    "/reset-password/:token": "Restablecer Contraseña",
    "/verify": "Verificación",

    // Rutas protegidas - Cliente
    "/cliente/profile": "Perfil del Cliente",
    "/orders": "Mis Pedidos",
    "/iot-device": "Dispositivo IoT",
    "/dispositivo/:macAddress": "Panel de Usuario",
    "/dispositivos": "Dispositivos",
    "/historialAcciones/:macAddress": "Historial de Acciones",

    // Rutas protegidas - Administrador
    "/admin/profile-admin": "Perfil del Administrador",
    "/manage-orders": "Gestionar Pedidos",
    "/manage-products": "Gestionar Productos",
    "/products/create": "Crear Producto",
    "/products/update/:id": "Actualizar Producto",
    "/users-management": "Gestión de Usuarios",
    "/mision": "Misión",
    "/visiones": "Visiones",
    "/politicas": "Políticas",
    "/preguntasFre": "Preguntas Frecuentes (Admin)",
    "/empresa-manage": "Gestión de la Empresa",
    "/ubicacion": "Ubicación (Admin)",
    "/redesSociales": "Redes Sociales (Admin)",
    "/dispositivos-manage": "Gestión de Dispositivos",

    // Página de acceso denegado
    "/access-denied": "Acceso Denegado",
  };

  // Obtener el nombre del producto si estamos en la ruta /products/:id
  const getProductName = (id) => {
    const product = products.find((p) => p._id === id);
    return product ? product.name : "Detalle del Producto";
  };

  // Obtener el nombre de la ruta
  const getDisplayName = (path) => {
    // Si estamos en la ruta /products/:id, devolvemos el nombre del producto
    if (path === "products" && id) {
      return getProductName(id);
    }
    return routeNames[`/${path}`] || path; // Nombre personalizado o el segmento de la URL
  };

  // Función para obtener la ruta padre correcta
  const getParentRoute = (path) => {
    // Si la ruta es /products/:id, su padre es /catalog
    if (path === "products") {
      return "/catalog";
    }
    // Para otras rutas, simplemente retrocede un nivel
    return `/${pathnames.slice(0, pathnames.indexOf(path)).join("/")}`;
  };

  return (
    <div className="breadcrumbs">
      <Link to="/">Inicio</Link>
      {pathnames.map((name, index) => {
        const routeTo = `/${pathnames.slice(0, index + 1).join("/")}`;
        const isLast = index === pathnames.length - 1;
        const displayName = getDisplayName(name);

        // Si estamos en /products/:id, el enlace debe apuntar a /catalog
        const correctedRouteTo = name === "products" ? "/catalog" : routeTo;

        return isLast ? (
          <span key={name}> / {displayName}</span>
        ) : (
          <span key={name}>
            {" "}
            / <Link to={correctedRouteTo}>{displayName}</Link>
          </span> 
        );
      })}
    </div>
  );
};

export default Breadcrumbs;