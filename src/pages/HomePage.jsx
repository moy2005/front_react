import React, { useEffect, useState } from 'react';
import { useProducts } from '../context/ProductContext';
import '../styles/homepage.css';

function HomePage() {
  const { getProduct, getProducts, products } = useProducts();
  const [featuredGreenhouse, setFeaturedGreenhouse] = useState(null);
  const [loading, setLoading] = useState(true);
  const [iotStats, setIotStats] = useState({
    temperature: 24.5,
    humidity: 68,
    soilMoisture: 72,
    lightLevel: 85
  });

  // Simulating IoT data updates - FIXED the toFixed issue
  useEffect(() => {
    const interval = setInterval(() => {
      setIotStats(prev => {
        // Calculate new values first, then apply toFixed
        const newTemp = parseFloat(prev.temperature) + (Math.random() * 0.6 - 0.3);
        const newHumidity = Math.min(100, Math.max(50, parseFloat(prev.humidity) + (Math.random() * 4 - 2)));
        const newSoilMoisture = Math.min(100, Math.max(40, parseFloat(prev.soilMoisture) + (Math.random() * 3 - 1.5)));
        const newLightLevel = Math.min(100, Math.max(60, parseFloat(prev.lightLevel) + (Math.random() * 5 - 2.5)));
        
        // Return object with formatted values
        return {
          temperature: newTemp.toFixed(1),
          humidity: newHumidity.toFixed(0),
          soilMoisture: newSoilMoisture.toFixed(0),
          lightLevel: newLightLevel.toFixed(0)
        };
      });
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  // Fetch featured greenhouse product
  useEffect(() => {
    const fetchFeaturedGreenhouse = async () => {
      try {
        const greenhouseProduct = await getProduct("67b559e57d1b5353977f7aef");
        setFeaturedGreenhouse(greenhouseProduct);
      } catch (error) {
        console.error("Error fetching featured greenhouse:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchFeaturedGreenhouse();
    getProducts();
  }, []);

  const handleIotControl = (action) => {
    // Simulate IoT control actions
    console.log(`IoT control: ${action}`);
    // Here you would typically send a request to your IoT backend
  };

  return (
    <div className="home-container">
      {/* Hero Section */}
      <section className="home-hero">
        <div className="home-hero-content">
          <h1 className="home-hero-title h1-form">Comercializacion de Productos Agrícolas</h1>
          <p className="home-hero-description txt">Conectamos productores y compradores de manera eficiente con tecnología avanzada.</p>
         
        </div>
        <div className="home-hero-image">
          <div className="home-hero-image-overlay"></div>
        </div>
      </section>

      {/* Featured Greenhouse Product */}
      <section className="home-featured-product">
        <div className="home-section-header">
          <h2 className="home-section-title h1-form">Producto Destacado</h2>
          <div className="home-section-divider"></div>
        </div>
        
        {loading ? (
          <div className="home-loading-spinner"></div>
        ) : featuredGreenhouse ? (
          <div className="home-featured-product-container">
            <div className="home-featured-product-image">
              {featuredGreenhouse.images && featuredGreenhouse.images[0] ? (
                <img src={featuredGreenhouse.images[0]} alt={featuredGreenhouse.name} />
              ) : (
                <div className="home-placeholder-image">
                  <span>Invernadero Inteligente</span>
                </div>
              )}
            </div>
            <div className="home-featured-product-details txt">
              <h3 className="home-featured-product-title">{featuredGreenhouse.name}</h3>
              <div className="home-featured-product-rating">
                {[...Array(5)].map((_, i) => (
                  <span key={i} className={`home-star ${i < Math.round(featuredGreenhouse.rating) ? 'filled' : ''}`}>★</span>
                ))}
                <span className="home-rating-count">({featuredGreenhouse.reviews?.length || 0} reseñas)</span>
              </div>
              <p className="home-featured-product-description">{featuredGreenhouse.description}</p>
              <div className="home-featured-product-price">
                <span className="home-price-label">Precio:</span>
                <span className="home-price-value">${featuredGreenhouse.price?.toFixed(2)}</span>
              </div>
            
              
            </div>
          </div>
        ) : (
          <div className="home-product-not-found">Producto no encontrado</div>
        )}
      </section>

      {/* IoT Greenhouse Control */}
      <section className="home-iot-control">
        <div className="home-section-header">
          <h2 className="home-section-title h1-form">Muestra de Control de Invernadero IoT</h2>
          <div className="home-section-divider"></div>
        </div>
        <div className="home-iot-dashboard txt">
          <div className="home-iot-stats">
            <div className="home-iot-stat-card">
              <div className="home-iot-stat-icon temperature"></div>
              <div className="home-iot-stat-value">{iotStats.temperature}°C</div>
              <div className="home-iot-stat-label">Temperatura</div>
            </div>
            <div className="home-iot-stat-card">
              <div className="home-iot-stat-icon humidity"></div>
              <div className="home-iot-stat-value">{iotStats.humidity}%</div>
              <div className="home-iot-stat-label">Humedad</div>
            </div>
            <div className="home-iot-stat-card">
              <div className="home-iot-stat-icon soil"></div>
              <div className="home-iot-stat-value">{iotStats.soilMoisture}%</div>
              <div className="home-iot-stat-label">Humedad del Suelo</div>
            </div>
            <div className="home-iot-stat-card">
              <div className="home-iot-stat-icon light"></div>
              <div className="home-iot-stat-value">{iotStats.lightLevel}%</div>
              <div className="home-iot-stat-label">Nivel de Luz</div>
            </div>
          </div>
          <div className="home-iot-controls">
            <h3 className="home-iot-controls-title">Control Remoto</h3>
            <div className="home-iot-control-buttons">
              <button className="home-iot-button" onClick={() => handleIotControl('irrigation')}>
                <span className="home-iot-button-icon irrigation"></span>
                <span className="home-iot-button-label">Riego</span>
              </button>
              <button className="home-iot-button" onClick={() => handleIotControl('ventilation')}>
                <span className="home-iot-button-icon ventilation"></span>
                <span className="home-iot-button-label">Ventilación</span>
              </button>
              <button className="home-iot-button" onClick={() => handleIotControl('lighting')}>
                <span className="home-iot-button-icon lighting"></span>
                <span className="home-iot-button-label">Iluminación</span>
              </button>
              <button className="home-iot-button" onClick={() => handleIotControl('temperature')}>
                <span className="home-iot-button-icon temperature-control"></span>
                <span className="home-iot-button-label">Temperatura</span>
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Servicios Principales */}
      <section className="home-services txt">
        <div className="home-section-header">
          <h2 className="home-section-title h1-form">Servicios Principales</h2>
          <div className="home-section-divider"></div>
        </div>
        <div className="home-services-grid">
          {/* Card 1 */}
          <div className="home-service-card">
            <div className="home-service-icon products"></div>
            <h3 className="home-service-title">Productos Agrícolas</h3>
            <p className="home-service-description">Gestiona tu inventario y encuentra los mejores productos del mercado agrícola con nuestra plataforma integrada.</p>
            <a href="/products" className="home-service-link">Ver productos</a>
          </div>

          {/* Card 2 */}
          <div className="home-service-card">
            <div className="home-service-icon transactions"></div>
            <h3 className="home-service-title">Negociaciones Privadas</h3>
            <p className="home-service-description">Realiza transacciones seguras y privadas con otros miembros de la plataforma, optimizando tu cadena de suministro.</p>
            <a href="/transactions" className="home-service-link">Comenzar negociación</a>
          </div>

          {/* Card 3 */}
          <div className="home-service-card">
            <div className="home-service-icon management"></div>
            <h3 className="home-service-title">Administración Comercial</h3>
            <p className="home-service-description">Herramientas avanzadas para gestionar tus operaciones comerciales y maximizar tus beneficios en el mercado agrícola.</p>
            <a href="/management" className="home-service-link">Administrar cuenta</a>
          </div>

          {/* Card 4 */}
          <div className="home-service-card">
            <div className="home-service-icon greenhouse"></div>
            <h3 className="home-service-title">Invernaderos Inteligentes</h3>
            <p className="home-service-description">Monitorea y controla tus invernaderos mediante nuestra plataforma IoT, mejorando la eficiencia y productividad.</p>
            <a href="/greenhouses" className="home-service-link">Explorar soluciones</a>
          </div>
        </div>
      </section>
      
      {/* Seasonal Products */}
      <section className="home-seasonal-products txt">
        <div className="home-section-header">
          <h2 className="home-section-title h1-form">Productos de Temporada</h2>
          <div className="home-section-divider"></div>
        </div>
        <div className="home-seasonal-products-grid">
          {products.slice(0, 4).map((product) => (
            <div key={product._id} className="home-product-card">
              <div className="home-product-image">
                {product.images && product.images[0] ? (
                  <img src={product.images[0]} alt={product.name} />
                ) : (
                  <div className="home-placeholder-image">
                    <span>{product.name.charAt(0)}</span>
                  </div>
                )}
              </div>
              <div className="home-product-details">
                <h3 className="home-product-title">{product.name}</h3>
                <div className="home-product-rating">
                  {[...Array(5)].map((_, i) => (
                    <span key={i} className={`home-star ${i < Math.round(product.rating) ? 'filled' : ''}`}>★</span>
                  ))}
                </div>
                <div className="home-product-price">${product.price?.toFixed(2)}</div>
              
              </div>
            </div>
          ))}
        </div>
      </section>
      
      {/* Testimonials */}
      <section className="home-testimonials txt">
        <div className="home-section-header">
          <h2 className="home-section-title h1-form">Testimonios de Clientes</h2>
          <div className="home-section-divider"></div>
        </div>
        <div className="home-testimonials-container">
          <div className="home-testimonial">
            <div className="home-testimonial-quote">"Los invernaderos inteligentes han revolucionado mi producción de tomates. La automatización me ha permitido ahorrar tiempo y recursos."</div>
            <div className="home-testimonial-author">- Carlos Rodríguez, Productor de Hortalizas</div>
          </div>
          <div className="home-testimonial">
            <div className="home-testimonial-quote">"La plataforma de comercialización me ha permitido conectar con compradores de toda la región. Mis ventas han aumentado un 40% desde que empecé."</div>
            <div className="home-testimonial-author">- María González, Agricultora Orgánica</div>
          </div>
        </div>
      </section>
      
      {/* Call to Action */}
      <section className="home-cta-section txt">
        <div className="home-cta-content">
          <h2 className="home-cta-title">¿Listo para transformar tu agricultura?</h2>
          <p className="home-cta-description">Únete a nuestra comunidad de agricultores innovadores y lleva tu producción al siguiente nivel.</p>
          <button className="home-cta-button primary large txt">Comenzar ahora</button>
        </div>
      </section>
    </div>
  );
}

export default HomePage;