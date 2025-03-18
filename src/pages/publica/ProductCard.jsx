import React from "react";
import { Link } from "react-router-dom";
import {
  FaRegHeart,
  FaStar,
  FaStarHalf,
  FaRegStar,
  FaShoppingCart,
} from "react-icons/fa";

function ProductCard({ product }) {
  if (!product) {
    return <div className="loading">Cargando...</div>;
  }

  const {
    _id,
    name,
    price,
    stock,
    images,
    category,
    rating = 0,
    reviews = [],
    discount = 0,
    isNew = false,
    isBestseller = false,
  } = product;
  const firstImage =
    images && images.length > 0 ? images[0] : "default-image.jpg";

  // Calcular precio original solo si hay descuento
  const hasDiscount = discount > 0;
  const originalPrice = hasDiscount ? price / (1 - discount / 100) : null;

  // Determinar tipo de badge basado en propiedades del producto
  let badgeType = null;
  let badgeText = "";

  if (isNew) {
    badgeType = "new";
    badgeText = "NUEVO";
  } else if (isBestseller) {
    badgeType = "bestseller";
    badgeText = "MÁS VENDIDO";
  } else if (stock > 0 && stock <= 5) {
    badgeType = "last-units";
    badgeText = "ÚLTIMAS UNIDADES";
  }

  // Renderizar estrellas para calificación
  const renderStars = (rating) => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const halfStar = rating - fullStars >= 0.5;

    for (let i = 1; i <= 5; i++) {
      if (i <= fullStars) {
        stars.push(<FaStar key={i} />);
      } else if (i === fullStars + 1 && halfStar) {
        stars.push(<FaStarHalf key={i} />);
      } else {
        stars.push(<FaRegStar key={i} />);
      }
    }

    return stars;
  };

  return (
    <div className="product-card txt">
      {/* Badge para productos destacados (solo si hay badge) */}
      {badgeType && (
        <div className={`product-badge ${badgeType}`}>{badgeText}</div>
      )}

      {/* Botón de favoritos */}
      <button className="wishlist-btn">
        <FaRegHeart className="heart-icon" />
      </button>

      {/* Contenedor de imagen con altura fija */}
      <div className="product-image-container">
        <Link to={`/products/${_id}`} className="">
          <img src={firstImage} alt={name} className="product-image" />
        </Link>
      </div>

      {/* Información del producto */}
      <div className="product-info">
        {/* Categoría */}
        {category && (
          <div className="product-category">{category.name || "Categoría"}</div>
        )}

        {/* Título */}
        <h2 className="product-title1">{name}</h2>

        {/* Calificación */}
        <div className="product-rating">
          <div className="rating-stars">{renderStars(rating)}</div>
          <span className="rating-count">({reviews?.length || 0})</span>
        </div>

        {/* Precio */}
        <div className="product-price-container">
          <span className="product-price">${price.toFixed(2)}</span>
          {hasDiscount && (
            <>
              <span className="product-price-original">
                ${originalPrice.toFixed(2)}
              </span>
              <span className="product-discount">-{discount}%</span>
            </>
          )}
        </div>

        {/* Disponibilidad (stock bajo o agotado) */}
        {stock === 0 ? (
          <div className="product-stock low">Agotado</div>
        ) : stock <= 5 ? (
          <div className="product-stock low">¡Solo {stock} unidades!</div>
        ) : null}

        {/* Botones de acción */}
        <div className="product-actions">
          <Link to={`/products/${_id}`} className="view-more-btn">
            Ver detalles
          </Link>
          <button className="add-cart-btn" disabled={stock === 0}>
            <FaShoppingCart />
          </button>
        </div>
      </div>
    </div>
  );
}

export default ProductCard;
