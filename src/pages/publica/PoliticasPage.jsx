import React, { useState, useEffect } from 'react';
import { usePoliticas } from '../../context/politicaContext';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import '../../styles/politicas.css'

function PoliticasPage() {
  const { politicas, getPoliticas } = usePoliticas();
  const [activeIndex, setActiveIndex] = useState(null);
  const [hoveredCard, setHoveredCard] = useState(null);

  useEffect(() => {
    getPoliticas();
  }, []);

  const toggleAccordion = (index) => {
    setActiveIndex(activeIndex === index ? null : index);
  };

  // Filtrar solo políticas activas (estado: true)
  const politicasActivas = politicas.filter(politica => politica.estado);

  return (
    <div className="vetcare-politicas-container">
      <div className="vetcare-politicas-header">
        <div className="vetcare-header-content">
          <h1 className="vetcare-main-title">
            <span className="vetcare-title-highlight">Políticas</span>
          </h1>
          <p className="vetcare-header-description">
            Conoce las normativas y directrices que guían nuestro trabajo diario y garantizan la excelencia en nuestro servicio
          </p>
          <div className="vetcare-header-decoration">
            <div className="vetcare-decoration-leaf vetcare-leaf-1"></div>
            <div className="vetcare-decoration-leaf vetcare-leaf-2"></div>
            <div className="vetcare-decoration-paw"></div>
          </div>
        </div>
      </div>

      {politicasActivas.length === 0 ? (
        <div className="vetcare-empty-state">
          <div className="vetcare-empty-icon-container">
            <i className="fas fa-file-alt vetcare-empty-icon"></i>
            <div className="vetcare-empty-icon-shadow"></div>
          </div>
          <h3 className="vetcare-empty-title">No hay políticas activas</h3>
          <p className="vetcare-empty-message">Actualmente no hay políticas disponibles para mostrar</p>
        </div>
      ) : (
        <div className="vetcare-politicas-grid">
          {politicasActivas.map((politica, index) => (
            <div 
              key={politica._id} 
              className={`vetcare-politica-card ${activeIndex === index ? 'active' : ''} ${hoveredCard === index ? 'hovered' : ''}`}
              onClick={() => toggleAccordion(index)}
              onMouseEnter={() => setHoveredCard(index)}
              onMouseLeave={() => setHoveredCard(null)}
            >
              <div className="vetcare-card-glow"></div>
              <div className="vetcare-card-border"></div>
              <div className="vetcare-card-content">
                <div className="vetcare-card-header">
                  <div className="vetcare-card-icon">
                    <i className="fas fa-file-signature"></i>
                    <div className="vetcare-icon-circle"></div>
                  </div>
                  <h3 className="vetcare-card-title">{politica.title}</h3>
                </div>
                
                <p className="vetcare-card-description">
                  {politica.description.length > 100 
                    ? `${politica.description.substring(0, 100)}...` 
                    : politica.description}
                </p>
                
                <div className="vetcare-card-footer">
                  <div className="vetcare-date-info">
                    <i className="fas fa-calendar-alt"></i>
                    <span>{format(new Date(politica.createdAt), 'dd MMM yyyy', { locale: es })}</span>
                  </div>
                  
                  <div className="vetcare-accordion-indicator">
                    <i className={`fas fa-chevron-${activeIndex === index ? 'up' : 'down'}`}></i>
                  </div>
                </div>
                
                <div className={`vetcare-accordion-content ${activeIndex === index ? 'expanded' : ''}`}>
                  <div className="vetcare-policy-details">
                    <h4>Detalles de la política</h4>
                    <p className="vetcare-policy-fulltext">{politica.description}</p>
                    
                    <div className="vetcare-policy-meta">
                      <div className="vetcare-meta-item">
                        <i className="fas fa-calendar-plus"></i>
                        <span>
                          <strong>Creada:</strong> {format(new Date(politica.createdAt), 'dd MMMM yyyy', { locale: es })}
                        </span>
                      </div>
                      {politica.updatedAt && (
                        <div className="vetcare-meta-item">
                          <i className="fas fa-calendar-check"></i>
                          <span>
                            <strong>Actualizada:</strong> {format(new Date(politica.updatedAt), 'dd MMMM yyyy', { locale: es })}
                          </span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default PoliticasPage;