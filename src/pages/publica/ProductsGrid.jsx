import React from "react";
import ProductCard from "./ProductCard";
import "../../styles/products.css";

function ProductsGrid({ products }) {
    return (
        <div className="products-grid">
            {products && products.length > 0 ? (
                products.map(product => (
                    <ProductCard key={product._id} product={product} />
                ))
            ) : (
                <div className="loading">No hay productos disponibles</div>
            )}
        </div>
    );
}

export default ProductsGrid;
