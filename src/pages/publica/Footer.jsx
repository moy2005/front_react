import React from "react";
import "./../../styles/footer.css";

const Footer = () => {
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
            <a href="#"><i className="fab fa-facebook-f"></i></a>
            <a href="#"><i className="fab fa-twitter"></i></a>
            <a href="#"><i className="fab fa-instagram"></i></a>
            <a href="#"><i className="fab fa-linkedin-in"></i></a>
          </div>
        </div>
        <div className="footer-column">
          <h3 className="h1-form">Enlaces Rapidos</h3>
          <ul className="footer-links txt">
            <li><a href="#inicio">Inicio</a></li>
            <li><a href="#nosotros">Sobre Nosotros</a></li>
            <li><a href="#destacados">Productos</a></li>
            <li><a href="#testimonios">Testimonios</a></li>
            <li><a href="#contacto">Contacto</a></li>
          </ul>
        </div>
        <div className="footer-column">
          <h3 className="h1-form">Productos</h3>
          <ul className="footer-links txt">
            <li><a href="#">Fertilizantes</a></li>
            <li><a href="#">Semillas</a></li>
            <li><a href="#">Sistemas de Riego</a></li>
            <li><a href="#">Herramientas</a></li>
            <li><a href="#">Invernaderos</a></li>
            <li><a href="#">Control de Plagas</a></li>
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
            <button type="submit"><i className="fas fa-paper-plane"></i></button>
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

