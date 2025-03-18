import React, { useState } from 'react';
import { FaTimes, FaStar, FaBox, FaTags, FaTrademark, FaCalendarAlt, FaInfoCircle, FaUser, FaImages } from 'react-icons/fa';
import { MdAttachMoney, MdOutlineRateReview } from 'react-icons/md';
import '../styles/ProductDetailsModal.css';

function ProductDetailsModal({ product, onClose }) {
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  
  const formatDate = (dateString) => {
    if (!dateString) return "No disponible";
    const date = new Date(dateString);
    return date.toLocaleDateString('es-ES', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  };

  // Verifica si hay imágenes disponibles
  const hasImages = product.images && product.images.length > 0;

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <div className="modal-header">
          <h2 className="modal-title">Detalles del Producto</h2>
          <button className="modal-close" onClick={onClose}>
            <FaTimes />
          </button>
        </div>
        
        <div className="modal-body">
          {/* Información principal */}
          <div className="product-main-info">
            <h3 className="product-name">{product.name}</h3>
            
            {/* Galería de imágenes */}
            {hasImages && (
              <div className="product-gallery">
                <div className="main-image-container">
                  <img 
                    src={product.images[activeImageIndex]} 
                    alt={`${product.name} - Imagen ${activeImageIndex + 1}`} 
                    className="product-main-image" 
                  />
                </div>
                
                {product.images.length > 1 && (
                  <div className="image-thumbnails">
                    {product.images.map((image, index) => (
                      <div 
                        key={index}
                        className={`image-thumbnail ${index === activeImageIndex ? 'active' : ''}`}
                        onClick={() => setActiveImageIndex(index)}
                      >
                        <img src={image} alt={`Thumbnail ${index + 1}`} />
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
          
          {/* Descripción */}
          {product.description && (
            <div className="product-description">
              <h4 className="description-title"><FaInfoCircle /> Descripción</h4>
              <p className="description-content">{product.description}</p>
            </div>
          )}
          
          <div className="product-details-grid">
            {/* Columna izquierda */}
            <div className="details-column">
              <div className="detail-item">
                <div className="detail-label"><MdAttachMoney /> Precio:</div>
                <div className="detail-value">${product.price.toFixed(2)}</div>
              </div>
              
              <div className="detail-item">
                <div className="detail-label"><FaBox /> Stock:</div>
                <div className="detail-value">{product.stock}</div>
              </div>
              
              <div className="detail-item">
                <div className="detail-label"><FaTags /> Categoría:</div>
                <div className="detail-value">
                  {product.category
                    ? (typeof product.category === "object" && product.category.name
                      ? product.category.name
                      : "No especificada")
                    : "No especificada"}
                </div>
              </div>
              
              <div className="detail-item">
                <div className="detail-label"><FaTrademark /> Marca:</div>
                <div className="detail-value">
                  {product.marca
                    ? (typeof product.marca === "object" && product.marca.name
                      ? product.marca.name
                      : "No especificada")
                    : "No especificada"}
                </div>
              </div>
            </div>
            
            {/* Columna derecha */}
            <div className="details-column">
              <div className="detail-item">
                <div className="detail-label"><FaStar /> Valoración:</div>
                <div className="detail-value rating-display">
                  {product.rating || 0} <FaStar className="star-icon" />
                </div>
              </div>
              
              <div className="detail-item">
                <div className="detail-label"><MdOutlineRateReview /> Reseñas:</div>
                <div className="detail-value">{product.reviews ? product.reviews.length : 0}</div>
              </div>
              
              <div className="detail-item">
                <div className="detail-label"><FaUser /> Creado por:</div>
                <div className="detail-value">
                  {product.user
                    ? (typeof product.user === "object" && product.user.name
                      ? product.user.name
                      : product.user._id || "No especificado")
                    : "No especificado"}
                </div>
              </div>
              
              <div className="detail-item">
                <div className="detail-label"><FaImages /> Imágenes:</div>
                <div className="detail-value">
                  {hasImages ? product.images.length : 0}
                </div>
              </div>
            </div>
          </div>
          
          <div className="additional-details">
            <div className="detail-item wide">
              <div className="detail-label"><FaCalendarAlt /> Fecha de creación:</div>
              <div className="detail-value">{formatDate(product.createdAt)}</div>
            </div>
            
            <div className="detail-item wide">
              <div className="detail-label"><FaCalendarAlt /> Última actualización:</div>
              <div className="detail-value">{formatDate(product.updatedAt)}</div>
            </div>
          </div>
          
          {/* Reseñas si existen */}
          {product.reviews && product.reviews.length > 0 && (
            <div className="product-reviews">
              <h4 className="reviews-title"><MdOutlineRateReview /> Reseñas de Clientes ({product.reviews.length})</h4>
              <div className="reviews-list">
                {product.reviews.map((review, index) => (
                  <div className="review-item" key={index}>
                    <div className="review-header">
                      <div className="reviewer-info">
                        <span className="reviewer-name">
                          {review.user && typeof review.user === "object" && review.user.name
                            ? review.user.name
                            : "Usuario"}
                        </span>
                        <span className="review-date">{formatDate(review.createdAt)}</span>
                      </div>
                      <span className="review-rating">
                        {review.rating || 0} <FaStar className="star-icon" />
                      </span>
                    </div>
                    <p className="review-comment">{review.comment}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
        
        <div className="modal-footer">
          <button className="modal-close-btn" onClick={onClose}>Cerrar</button>
        </div>
      </div>
    </div>
  );
}

export default ProductDetailsModal;
