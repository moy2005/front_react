import { useState, useEffect, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useProducts } from "../context/ProductContext";
import { PawPrint, Menu, X, Search, ShoppingBag, Sun, Moon,ChevronDown } from 'lucide-react';
import "../styles/navbar.css";
import { useCategories } from "../context/CategoryContext";

function Navbar() {
  const { user, logout } = useAuth();
  const { products, getProducts,getProductsByCategory } = useProducts();
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isAdminMenuOpen, setIsAdminMenuOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [showResults, setShowResults] = useState(false);
  const searchRef = useRef(null);
  const adminMenuRef = useRef(null);
  const { categories, getCategories } = useCategories();
  const [isCategoryMenuOpen, setIsCategoryMenuOpen] = useState(false);
  const categoryMenuRef = useRef(null);

  // Check if user has specific role
  const hasRole = (role) => user && user.role === role;

  const toggleCategoryMenu = () => {
    setIsCategoryMenuOpen(!isCategoryMenuOpen);
    if (isProfileOpen) setIsProfileOpen(false);
    if (isAdminMenuOpen) setIsAdminMenuOpen(false);
  };

  const handleCategorySelect = (categoryId) => {
    if (categoryId) {
      getProductsByCategory(categoryId);
      navigate('/catalog');
    } else {
      getProducts();
      navigate('/catalog');
    }
    setIsCategoryMenuOpen(false);
    setIsMenuOpen(false);
  };


  const handleLogout = () => {
    logout();
    navigate('/login');
    setIsMenuOpen(false);
  };

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const toggleProfile = () => {
    setIsProfileOpen(!isProfileOpen);
    if (isAdminMenuOpen) setIsAdminMenuOpen(false);
  };

  const toggleAdminMenu = () => {
    setIsAdminMenuOpen(!isAdminMenuOpen);
    if (isProfileOpen) setIsProfileOpen(false);
  };

  // Fetch all products on component mount
  useEffect(() => {
    getProducts();
    getCategories();
  }, []);

  // Filter products based on search term
  useEffect(() => {
    if (searchTerm.trim() === "") {
      setFilteredProducts([]);
      setShowResults(false);
      return;
    }

    const results = products.filter(product =>
      product.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    setFilteredProducts(results.slice(0, 8)); // Limit to 8 results
    setShowResults(true);
  }, [searchTerm, products]);

  // Handle product selection
  const handleProductSelect = (productId) => {
    setSearchTerm("");
    setShowResults(false);
    navigate(`/products/${productId}`);
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (isMenuOpen && !event.target.closest('.nav-menu') && !event.target.closest('.hamburger')) {
        setIsMenuOpen(false);
      }

      if (isProfileOpen && !event.target.closest('.profile-dropdown')) {
        setIsProfileOpen(false);
      }

      if (isAdminMenuOpen && adminMenuRef.current && !adminMenuRef.current.contains(event.target)) {
        setIsAdminMenuOpen(false);
      }

      if (isCategoryMenuOpen && categoryMenuRef.current && !categoryMenuRef.current.contains(event.target)) {
        setIsCategoryMenuOpen(false);
      }

      if (showResults && searchRef.current && !searchRef.current.contains(event.target)) {
        setShowResults(false);
      }
    };

    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, [isMenuOpen, isProfileOpen, isAdminMenuOpen, showResults]);

  // Handle window resize
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 768);
      if (window.innerWidth > 768) {
        setIsMenuOpen(false);
      }
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return (
    <header className="header txt">
      <div className="header-top">
        <div className="container">
          <div className="logo">
            <Link to="/">
              <i className="fas fa-leaf"></i>
              <span className="h1-form">AgriStore</span>
            </Link>
          </div>

          {!isMobile && (
            <div className="search-bar" ref={searchRef}>
              <input
                className="txt"
                type="text"
                placeholder="Buscar productos..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                onFocus={() => searchTerm.trim() !== "" && setShowResults(true)}
              />
              <button>
                <i className="fas fa-search"></i>
              </button>

              {/* Search results dropdown */}
              {showResults && filteredProducts.length > 0 && (
                <div className="search-results-dropdown">
                  <ul>
                    {filteredProducts.map(product => (
                      <li key={product._id} onClick={() => handleProductSelect(product._id)}>
                        <div className="search-result-item">
                          <div className="search-result-image">
                            <img
                              src={product.images && product.images.length > 0 ? product.images[0] : '/placeholder-image.jpg'}
                              alt={product.name}
                            />
                          </div>
                          <div className="search-result-name">{product.name}</div>
                        </div>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {showResults && filteredProducts.length === 0 && searchTerm.trim() !== "" && (
                <div className="search-results-dropdown">
                  <div className="no-results">No se encontraron productos</div>
                </div>
              )}
            </div>
          )}

          <div className="user-actions">
            {isMobile && (
              <button className="hamburger" onClick={toggleMenu} aria-label="Menu">
                <span></span>
                <span></span>
                <span></span>
              </button>
            )}

            {!isMobile && !user && (
              <div className="auth-buttons">
                <Link to="/login" className="btn-login">
                  <i className="fas fa-sign-out-alt"></i> Iniciar Sesión
                </Link>
                <Link to="/register" className="btn-register">
                  Registrarse
                </Link>
              </div>
            )}

            {!isMobile && user && (
              <div className="user-menu">
                {hasRole("cliente") && (
                  <div className="profile-dropdown">
                    <button
                      className="dropdown-button"
                      onClick={toggleProfile}
                      aria-expanded={isProfileOpen}
                    >
                      <i className="fas fa-user"></i>
                      <span>Mi Perfil</span>
                      <i className={`fas fa-chevron-${isProfileOpen ? 'up' : 'down'}`}></i>
                    </button>
                    <div className={`dropdown-content ${isProfileOpen ? 'show' : ''}`}>
                      <Link to="/cliente/profile">Ver Perfil</Link>
                      <Link to="/dispositivos">Dispositivo IoT</Link>
                      <button onClick={handleLogout} className="logout-btn">
                        <i className="fas fa-sign-out-alt txt"></i> Cerrar Sesión
                      </button>
                    </div>
                  </div>
                )}

                {hasRole("admin") && (
                  <div className="admin-dropdown" ref={adminMenuRef}>
                    <button
                      className="admin-dropdown-button"
                      onClick={toggleAdminMenu}
                      aria-expanded={isAdminMenuOpen}
                    >
                      <i className="fas fa-user-shield"></i>
                      <span>Panel Admin</span>
                      <i className={`fas fa-chevron-${isAdminMenuOpen ? 'up' : 'down'}`}></i>
                    </button>
                    <div className={`admin-dropdown-content ${isAdminMenuOpen ? 'show' : ''}`}>
                      <Link to="/admin/profile-admin">
                        <i className="fas fa-user-cog"></i> Perfil Admin
                      </Link>
                      <Link to="/users-management">
                        <i className="fas fa-users"></i> Gestionar Usuarios
                      </Link>
                      <Link to="/manage-products">
                        <i className="fas fa-box"></i> Gestionar Productos
                      </Link>
                      <Link to="/empresa-manage">
                        <i className="fas fa-building"></i> Empresa
                      </Link>
                      <button onClick={handleLogout} className="logout-btn">
                        <i className="fas fa-sign-out-alt txt"></i> Cerrar Sesión
                      </button>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Mobile search bar */}
      {isMobile && (
        <div className="mobile-search-container">
          <div className="search-bar mobile-search" ref={searchRef}>
            <input
              type="text"
              placeholder="Buscar productos..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              onFocus={() => searchTerm.trim() !== "" && setShowResults(true)}
            />
            <button>
              <i className="fas fa-search"></i>
            </button>

            {/* Mobile search results dropdown */}
            {showResults && filteredProducts.length > 0 && (
              <div className="search-results-dropdown mobile">
                <ul>
                  {filteredProducts.map(product => (
                    <li key={product.id} onClick={() => handleProductSelect(product.id)}>
                      <div className="search-result-item">
                        <div className="search-result-image">
                          <img
                            src={product.images && product.images.length > 0 ? product.images[0] : '/placeholder-image.jpg'}
                            alt={product.name}
                          />
                        </div>
                        <div className="search-result-name">{product.name}</div>
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {showResults && filteredProducts.length === 0 && searchTerm.trim() !== "" && (
              <div className="search-results-dropdown mobile">
                <div className="no-results">No se encontraron productos</div>
              </div>
            )}
          </div>
        </div>
      )}

      <nav className={`header-nav ${isMobile ? 'mobile' : ''}`}>
        <div className="container nav-container">
          <ul className={`nav-menu ${isMenuOpen && isMobile ? 'active' : ''}`}>
            {/* Public navigation links */}
            <li><Link to="/" onClick={() => setIsMenuOpen(false)}>Inicio</Link></li>
            <li><Link to="/catalog" onClick={() => setIsMenuOpen(false)}>Productos</Link></li>
            <li className="vet-nav-item">
                <div className="vet-category-dropdown" ref={categoryMenuRef}>
                  <button
                    className="vet-nav-link vet-category-button txt"
                    onClick={toggleCategoryMenu}
                    aria-expanded={isCategoryMenuOpen}
                  >
                    Categorias <ChevronDown size={16} className={`vet-chevron ${isCategoryMenuOpen ? 'vet-rotate' : ''}`} />
                  </button>
                  <div className={`vet-category-content ${isCategoryMenuOpen ? 'vet-show' : ''}`}>
                    <div
                      className="vet-category-link"
                      onClick={() => handleCategorySelect(null)}
                    >
                      Todas las categorías
                    </div>
                    {categories.map(category => (
                      <div
                        key={category._id}
                        className="vet-category-link"
                        onClick={() => handleCategorySelect(category._id)}
                      >
                        {category.name}
                      </div>
                    ))}
                  </div>
                </div>
              </li>
            <li><Link to="/nosotros" onClick={() => setIsMenuOpen(false)}>Empresa</Link></li>


            {/* Only show admin links in the mobile menu (desktop uses dropdown in header) */}
            {isMobile && hasRole("admin") && (
              <li className="mobile-admin-section">
                <div className="admin-section-title">
                  <i className="fas fa-user-shield"></i> Administración
                </div>
                <ul className="mobile-admin-links">
                  <li>
                    <Link to="/admin/profile-admin" onClick={() => setIsMenuOpen(false)}>
                      <i className="fas fa-user-cog"></i> Perfil Admin
                    </Link>
                  </li>
                  <li>
                    <Link to="/users-management" onClick={() => setIsMenuOpen(false)}>
                      <i className="fas fa-users"></i> Gestionar Usuarios
                    </Link>
                  </li>
                  <li>
                    <Link to="/manage-products" onClick={() => setIsMenuOpen(false)}>
                      <i className="fas fa-box"></i> Gestionar Productos
                    </Link>
                  </li>
                  <li>
                    <Link to="/empresa" onClick={() => setIsMenuOpen(false)}>
                      <i className="fas fa-building"></i> Empresa
                    </Link>
                  </li>
                </ul>
              </li>
            )}

            {/* Mobile-only menu items for user actions */}
            {isMobile && !user && (
              <div className="mobile-auth">
                <li className="mobile-auth-item">
                  <Link to="/login" className="mobile-login" onClick={() => setIsMenuOpen(false)}>
                    <i className="fas fa-sign-in-alt"></i> Iniciar Sesión
                  </Link>
                </li>
                <li className="mobile-auth-item">
                  <Link to="/register" className="mobile-register" onClick={() => setIsMenuOpen(false)}>
                    <i className="fas fa-user-plus"></i> Registrarse
                  </Link>
                </li>
              </div>
            )}

            {isMobile && user && hasRole("cliente") && (
              <div className="mobile-user-menu">
                <li>
                  <Link to="/cliente/profile" onClick={() => setIsMenuOpen(false)}>
                    <i className="fas fa-user"></i> Ver Perfil
                  </Link>
                </li>
                <li>
                  <Link to="/iot-device" onClick={() => setIsMenuOpen(false)}>
                    <i className="fas fa-microchip"></i> Dispositivo IoT
                  </Link>
                </li>
                <li>
                  <button onClick={handleLogout} className="mobile-logout">
                    <i className="fas fa-sign-out-alt"></i> Cerrar Sesión
                  </button>
                </li>
              </div>
            )}

            {isMobile && user && hasRole("admin") && (
              <div className="mobile-user-menu">
                <li>
                  <button onClick={handleLogout} className="mobile-logout">
                    <i className="fas fa-sign-out-alt"></i> Cerrar Sesión
                  </button>
                </li>
              </div>
            )}
          </ul>
        </div>
      </nav>
    </header>
  );
}

export default Navbar;

