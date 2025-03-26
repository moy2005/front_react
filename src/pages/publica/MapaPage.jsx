import React from "react";

function MapaPage() {
  // Coordenadas de ejemplo (reemplaza con tus coordenadas reales)
  const ubicacion = {
    latitud: 21.14, 
    longitud: -98.41944,
    zoom: 14, // Nivel de zoom recomendado para mostrar calles
  };

  // Construye la URL del mapa de forma más limpia
  const mapaUrl = `https://www.google.com/maps/embed/v1/view?key=AIzaSyC07PrpbYNDJ0Mwk7mH2CHjYfpyIPUPNp8&center=${ubicacion.latitud},${ubicacion.longitud}&zoom=${ubicacion.zoom}`;

  return (
    <div className="mapa-container">
      <h1 className="mapa-titulo">Nuestra Ubicación</h1>
      <div className="mapa-iframe-container">
        <iframe
          className="mapa-iframe"
          title="Ubicación en Google Maps"
          src={mapaUrl}
          allowFullScreen
          loading="lazy" // Mejora el rendimiento con carga diferida
          referrerPolicy="no-referrer-when-downgrade" // Mejor seguridad
        />
      </div>
    </div>
  );
}

export default MapaPage;

// Estilos CSS (puedes ponerlos en un archivo separado)
const styles = `
  /* Modern CSS Reset and Base Styles */
:root {
  --primary-green: #2a7d4f;
  --secondary-green: #4caf50;
  --accent-green: #81c784;
  --background-white: #f4f4f4;
  --text-dark: #333;
  --shadow-subtle: rgba(0, 0, 0, 0.08);
  --transition-smooth: all 0.3s cubic-bezier(0.25, 0.8, 0.25, 1);
}

/* Responsive and Adaptive Map Container */
.mapa-container {
  width: 100%;
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  background-color: var(--background-white);
  overflow-x: hidden;
  scroll-behavior: smooth;
}

/* Advanced Responsive Typography */
.mapa-titulo {
  text-align: center;
  padding: 1.5rem 0;
  color: var(--primary-green);
  font-size: clamp(1.8rem, 4vw, 2.5rem);
  font-weight: 600;
  letter-spacing: -0.02em;
  position: relative;
  transition: var(--transition-smooth);
}

.mapa-titulo::after {
  content: '';
  position: absolute;
  bottom: 0.5rem;
  left: 50%;
  transform: translateX(-50%);
  width: 80px;
  height: 4px;
  background: linear-gradient(90deg, var(--primary-green), var(--accent-green));
  border-radius: 2px;
}

/* Enhanced Iframe Container */
.mapa-iframe-container {
  flex: 1;
  position: relative;
  padding: 0 2rem;
  max-width: 1400px;
  margin: 0 auto;
  width: 100%;
}

.mapa-iframe {
  width: 100%;
  height: 500px;
  border: none;
  border-radius: 16px;
  box-shadow: 
    0 15px 35px var(--shadow-subtle),
    0 5px 15px rgba(0, 0, 0, 0.07);
  transition: var(--transition-smooth);
  overflow: hidden;
}

.mapa-iframe:hover {
  transform: scale(1.01);
  box-shadow: 
    0 20px 40px rgba(0, 0, 0, 0.12),
    0 8px 20px rgba(0, 0, 0, 0.08);
}

/* Advanced Responsive Breakpoints */
@media screen and (max-width: 1200px) {
  .mapa-iframe-container {
    padding: 0 1.5rem;
  }
}

@media screen and (max-width: 768px) {
  .mapa-container {
    min-height: auto;
  }

  .mapa-titulo {
    font-size: clamp(1.5rem, 6vw, 2rem);
    padding: 1rem 0;
  }

  .mapa-iframe-container {
    padding: 0 1rem;
  }

  .mapa-iframe {
    height: 300px;
    border-radius: 12px;
  }
}

/* Accessibility and Performance Enhancements */
@media (prefers-reduced-motion: reduce) {
  * {
    transition: none !important;
  }
}

/* Print Styles */
@media print {
  .mapa-container {
    min-height: auto;
  }

  .mapa-iframe {
    box-shadow: none;
    border: 1px solid #ccc;
  }
}
`;

// Inyecta los estilos en el head del documento
const styleSheet = document.createElement("style");
styleSheet.innerText = styles;
document.head.appendChild(styleSheet);
