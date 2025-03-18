import React, { useEffect, useState } from "react";
import { useProducts } from "../../context/ProductContext";
import ProductsGrid from "./ProductsGrid";
import "../../styles/products.css";

function CatalogPage() {
  const { getProducts, products, loading } = useProducts();
  const [currentPage, setCurrentPage] = useState(1); // Estado para la página actual
  const productsPerPage = 8; // Número de productos por página

  useEffect(() => {
    getProducts();
  }, []);

  // Calcular los productos que se deben mostrar en la página actual
  const indexOfLastProduct = currentPage * productsPerPage;
  const indexOfFirstProduct = indexOfLastProduct - productsPerPage;
  const currentProducts = products.slice(indexOfFirstProduct, indexOfLastProduct);

  // Cambiar de página
  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  // Navegar a la página anterior
  const goToPreviousPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  // Navegar a la página siguiente
  const goToNextPage = () => {
    if (currentPage < Math.ceil(products.length / productsPerPage)) {
      setCurrentPage(currentPage + 1);
    }
  };

  // Generar los números de página que se mostrarán
  const getPageNumbers = () => {
    const totalPages = Math.ceil(products.length / productsPerPage);
    const maxPagesToShow = 5; // Número máximo de botones de página a mostrar
    let startPage, endPage;

    if (totalPages <= maxPagesToShow) {
      // Si hay pocas páginas, mostrar todas
      startPage = 1;
      endPage = totalPages;
    } else {
      // Si hay muchas páginas, mostrar un subconjunto alrededor de la página actual
      const halfMaxPages = Math.floor(maxPagesToShow / 2);
      if (currentPage <= halfMaxPages) {
        startPage = 1;
        endPage = maxPagesToShow;
      } else if (currentPage + halfMaxPages >= totalPages) {
        startPage = totalPages - maxPagesToShow + 1;
        endPage = totalPages;
      } else {
        startPage = currentPage - halfMaxPages;
        endPage = currentPage + halfMaxPages;
      }
    }

    return Array.from({ length: endPage - startPage + 1 }, (_, i) => startPage + i);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col items-center p-6">
        <h1 className="catalog-title h1-form">Productos</h1>
        <div className="loading">Cargando productos...</div>
      </div>
    );
  }

  // Si no hay productos
  if (!products || products.length === 0) {
    return (
      <div className="min-h-screen flex flex-col items-center p-6">
        <h1 className="catalog-title h1-form">Productos</h1>
        <h2 className="tasks text-red-400">No hay productos disponibles</h2>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col items-center p-6">
      <h1 className="catalog-title h1-form">Productos</h1>
      <ProductsGrid products={currentProducts} /> {/* Mostrar solo los productos de la página actual */}

      {/* Paginación */}
      <div className="pagination flex justify-center items-center mt-6">
        <button
          onClick={goToPreviousPage}
          disabled={currentPage === 1}
          className="pagination-button px-4 py-2 mx-1 rounded bg-gray-200 disabled:opacity-50"
        >
          Anterior
        </button>

        {getPageNumbers().map((pageNumber) => (
          <button
            key={pageNumber}
            onClick={() => paginate(pageNumber)}
            className={`pagination-button ${
              currentPage === pageNumber ? "bg-blue-500 text-white" : "bg-gray-200"
            } px-4 py-2 mx-1 rounded`}
          >
            {pageNumber}
          </button>
        ))}

        <button
          onClick={goToNextPage}
          disabled={currentPage === Math.ceil(products.length / productsPerPage)}
          className="pagination-button px-4 py-2 mx-1 rounded bg-gray-200 disabled:opacity-50"
        >
          Siguiente
        </button>
      </div>
    </div>
  );
}

export default CatalogPage;

