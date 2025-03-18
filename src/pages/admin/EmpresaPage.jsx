import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import '../../styles/empresa.css';

function EmpresaPage() {
  const navigate = useNavigate();
  const [hoveredCard, setHoveredCard] = useState(null);

  const cardData = [
    {
      id: 'misiones',
      title: 'Misiones',
      icon: '🎯',
      description: 'Administra las misiones: agrega, edita, elimina y cambia su estado de visibilidad.',
      color: '#FF8C00', // Dark orange
      path: '/mision'
    },
    {
      id: 'visiones',
      title: 'Visiones',
      icon: '👁️',
      description: 'Gestiona las visiones: crea, actualiza, elimina y controla su visibilidad.',
      color: '#FFD700', // Golden yellow
      path: '/visiones'
    },
    {
      id: 'politicas',
      title: 'Políticas',
      icon: '📋',
      description: 'Maneja las políticas: agrega, edita, borra y ajusta su estado de publicación.',
      color: '#FFA500', // Orange
      path: '/politicas'
    },
    {
      id: 'preguntasFre',
      title: 'Preguntas Frecuentes',
      icon: '❓',
      description: 'Administra las preguntas frecuentes: añade, modifica, elimina y oculta si es necesario.',
      color: '#FF6347', // Tomato (orange-red)
      path: '/preguntasFre'
    },
    {
      id: 'redesSociales',
      title: 'Redes Sociales',
      icon: '📱',
      description: 'Gestiona los enlaces y perfiles de redes sociales de la empresa.',
      color: '#4682B4', // Steel blue
      path: '/redesSociales'
    },
    {
      id: 'ubicacion',
      title: 'Ubicación',
      icon: '📍',
      description: 'Administra la dirección, mapas y datos de contacto físico de la empresa.',
      color: '#32CD32', // Lime green
      path: '/ubicacion'
    }
  ];

  const handleCardClick = (path) => {
    navigate(path);
  };

  return (
    <div className="vetcare-empresa-container">
      <div className="vetcare-page-header">
        <h1 className="vetcare-title">AgriStore</h1>
  
      </div>

      <div className="vetcare-cards-container">
        {cardData.map((card) => (
          <motion.div
            key={card.id}
            className={`vetcare-card vetcare-card-${card.id}`}
            onClick={() => handleCardClick(card.path)}
            onMouseEnter={() => setHoveredCard(card.id)}
            onMouseLeave={() => setHoveredCard(null)}
           
          >
            <div className="vetcare-card-content">
              <motion.div
                className="vetcare-card-icon"
                style={{ backgroundColor: card.color }}
               
              >
                {card.icon}
              </motion.div>
              <h2 className="vetcare-card-title">{card.title}</h2>
              <p className="vetcare-card-description">{card.description}</p>

              <motion.div
                className="vetcare-card-indicator"
                initial={{ width: 0 }}
                animate={{
                  width: hoveredCard === card.id ? '100%' : '0%'
                }}
                style={{ backgroundColor: card.color }}
                transition={{ duration: 0.3 }}
              />
            </div>
            <motion.div
              className="vetcare-card-shine"
              animate={{
                opacity: hoveredCard === card.id ? 0.2 : 0,
                x: hoveredCard === card.id ? 200 : -50
              }}
              transition={{ duration: 0.5 }}
            />
          </motion.div>
        ))}
      </div>

      <div className="vetcare-decoration">
        <div className="vetcare-paw vetcare-paw-1"></div>
        <div className="vetcare-paw vetcare-paw-2"></div>
        <div className="vetcare-paw vetcare-paw-3"></div>
      </div>
    </div>
  );
}

export default EmpresaPage;

