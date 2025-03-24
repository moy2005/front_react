import React from "react";
import "./../../styles/footer.css";
import { Link } from "react-router-dom";
import { useCategories } from "../../context/CategoryContext"; // Importa el contexto de categorías

const Footer = () => {
  const { categories } = useCategories(); // Obtén las categorías desde el contexto

  return (
    <footer>
      <div className="footer-content">
        <div className="footer-column">
          <h3 className="h1-form">AgriStore</h3>
          <p className="txt">
            La tienda de referencia para todos los profesionales y aficionados
            de la agricultura, ofreciendo productos de alta calidad y
            asesoramiento experto desde 2010.
          </p>
          <div className="social-links">
            <a href="#">
              <i className="fab fa-facebook-f"></i>
            </a>
            <a href="#">
              <i className="fab fa-twitter"></i>
            </a>
            <a href="#">
              <i className="fab fa-instagram"></i>
            </a>
            <a href="#">
              <i className="fab fa-linkedin-in"></i>
            </a>
          </div>
        </div>
        <div className="footer-column">
          <h3 className="h1-form">Enlaces Rapidos</h3>
          <ul className="footer-links txt">
            <li>
              <Link to="/" className="social-links">
                Inicio
              </Link>
            </li>
            <li>
              <Link to="/nosotros" className="social-links">
                Sobre Nosotros
              </Link>
            </li>
            <li>
              <Link to="/catalog" className="social-links">
                Productos
              </Link>
            </li>
            <li>
              <Link to="/contact" className="social-links">
                Contacto
              </Link>
            </li>
            <li>
              <Link to="/public/preguntasFre" className="social-links">
                Preguntas Frecuentes
              </Link>
            </li>
          </ul>
        </div>
        <div className="footer-column">
          <h3 className="h1-form">Productos</h3>
          <ul className="footer-links txt">
            {/* Mostrar las categorías dinámicas */}
            {categories.map((category) => (
              <li key={category._id}>
                <Link
                  to={`/catalog?category=${category._id}`} // Redirige al catálogo con la categoría seleccionada
                  className="social-links"
                >
                  {category.name}
                </Link>
              </li>
            ))}
          </ul>
        </div>
        <div className="footer-column">
          <h3 className="h1-form">Boletin</h3>
          <p className="txt">
            Suscríbete para recibir las últimas noticias, ofertas especiales y
            consejos de agricultura.
          </p>
          <form className="newsletter-form">
            <input type="email" placeholder="Tu email" required />
            <button type="submit">
              <i className="fas fa-paper-plane"></i>
            </button>
          </form>
        </div>
      </div>
      <div className="copyright h1-form">
        <p>
          &copy; 2025 AgriStore. Todos los derechos reservados. Diseñado con{" "}
          <i className="fas fa-heart" style={{ color: "#15A421" }}></i>
        </p>
      </div>
    </footer>
  );
};

export default Footer;