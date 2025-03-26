import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext.jsx';
import { ProductProvider } from './context/ProductContext.jsx';
import { CategoryProvider } from './context/CategoryContext.jsx'; // Añadido correctamente
import { MarcaProvider } from './context/MarcaContext.jsx'; // Añadido correctamente
import ProtectedRoute from './ProtectedRoute.jsx';
import Navbar from './components/Navbar.jsx';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

// Páginas públicas
import HomePage from './pages/HomePage.jsx';
import AboutPage from './pages/publica/AboutPage.jsx';
import ContactPage from './pages/publica/ContactPage.jsx';
import LocationPage from './pages/publica/LocationPage.jsx';
import CatalogPage from './pages/publica/CatalogPage.jsx';
import ProductDetailPage from './pages/publica/ProductDetailPage.jsx';
import OffersPage from './pages/publica/OffersPage.jsx';

// Páginas de autenticación
import RegisterPage from './pages/autenticacion/RegisterPage.jsx';
import LoginPage from './pages/autenticacion/LoginPage.jsx';
import ForgotPassword from './pages/autenticacion/ForgotPassword.jsx';
import ResetPassword from './pages/autenticacion/ResetPassword.jsx';
import VerificationPage from './pages/autenticacion/VerificationPage.jsx';

// Páginas privadas - Cliente
import ProfilePage from './pages/client/ProfilePage.jsx';
import OrdersPage from './pages/client/OrdersPage.jsx';
import IoTDevicePage from './pages/client/IoTDevicePage.jsx';

// Páginas privadas - Administrador
import ManageOrdersPage from './pages/admin/ManageOrdersPage.jsx';
import ManageProductsPage from './pages/admin/ManageProductsPage.jsx';
import UsersManagementPage from './pages/admin/UsersManagementPage.jsx';
import ProfilePageAdmin from './pages/admin/ProfilePageAdmin.jsx';

// Pagina de acceso denegado
import AccessDeniedPage from './pages/AccessDeniedPage.jsx'
import UpdateProductForm from './pages/admin/UpdateProductForm.jsx';
import Footer from './pages/publica/Footer.jsx';
import ProductCreate from './pages/admin/ProductCreate.jsx';
import DispositivosList from './pages/admin/DispositivosList.jsx';
import MisionesList from './pages/admin/MisionList.jsx';
import { MisionProvider } from './context/misionContext.jsx';
import Nosotros from './pages/publica/Nosotros.jsx';
import { VisionProvider } from './context/visionContext.jsx';
import { PoliticaProvider } from './context/politicaContext.jsx';
import VisionesList from './pages/admin/VisionList.jsx';
import PoliticasList from './pages/admin/politicaList.jsx';
import FAQsList from './pages/admin/PreguntasFre.jsx';
import EmpresaPage from './pages/admin/EmpresaPage.jsx';
import { FAQProvider } from './context/preguntasFre.jsx';
import Inicio from './pages/client/Inicio.jsx';
import UserDashboard from './pages/client/UserDashboard.jsx';
import { UbicacionProvider } from './context/UbicacionContext.jsx';
import UbicacionList from './pages/admin/UbicacionList.jsx';
import { RedesSocialesProvider } from './context/RedesSociales.jsx';
import RedesSocialesList from './pages/admin/RedesSocialesList.jsx';
import PreguntasFrecuentes from './pages/publica/PreguntasFrecuentes.jsx';
import HistorialAcciones from './pages/client/HistorialAcciones.jsx';
import Breadcrumbs from './pages/Breadcrumbs.jsx';
import PoliticasPage from './pages/publica/PoliticasPage.jsx';
import MapaPage from './pages/publica/MapaPage.jsx';

function App() {
  return (
    <AuthProvider>
      <ProductProvider>
        <CategoryProvider>
          <MarcaProvider>
            <MisionProvider>
              <VisionProvider>
                <PoliticaProvider>
                  <FAQProvider>
                  <UbicacionProvider>
                  <RedesSocialesProvider>
                    <BrowserRouter>
                      <main>
                        <Navbar /> {/* Barra de navegación */}
                        <Breadcrumbs/>

                        <ToastContainer position="top-right" autoClose={3000} />
                        
                        <Routes>
                          {/* 📌 Rutas Públicas */}
                          <Route path="/" element={<HomePage />} />
                          <Route path="/about" element={<AboutPage />} />
                          <Route path="/contact" element={<ContactPage />} />
                          <Route path="/location" element={<LocationPage />} />
                          <Route path="/catalog" element={<CatalogPage />} />
                          <Route path="/products/:id" element={<ProductDetailPage />} />
                          <Route path="/offers" element={<OffersPage />} />
                          <Route path="/nosotros" element={<Nosotros />} />
                          <Route path="/public/preguntasFre" element={<PreguntasFrecuentes />} />
                          <Route path="/politicas" element={<PoliticasPage />} />
                          <Route path="/mapa" element={<MapaPage />} />
                          
                          {/* 📌 Autenticación */}
                          <Route path="/login" element={<LoginPage />} />
                          <Route path="/register" element={<RegisterPage />} />
                          <Route path="/forgot-password" element={<ForgotPassword />} />
                          <Route path="/reset-password/:token" element={<ResetPassword />} />
                          <Route path="/verify" element={<VerificationPage />} />

                          {/* 📌 Rutas Protegidas */}
                          <Route element={<ProtectedRoute allowedRoles={['cliente']} />}>
                            <Route path="/cliente/profile" element={<ProfilePage />} />
                            <Route path="/orders" element={<OrdersPage />} />
                            <Route path="/iot-device" element={<IoTDevicePage />} />
                             {/*    <Route path="/dispositivos" element={<DispositivoList />} /> */}
                         
                             <Route path="/dispositivo/:macAddress" element={<UserDashboard />} />
                            <Route path="/dispositivos" element={<Inicio />} />
                            <Route path="/historialAcciones/:macAddress" element={<HistorialAcciones />} />
                          </Route>

                          

                          <Route element={<ProtectedRoute allowedRoles={['admin']} />}>

                            <Route path="/admin/profile-admin" element={<ProfilePageAdmin />} />
                            <Route path="/manage-orders" element={<ManageOrdersPage />} />
                            <Route path="/manage-products" element={<ManageProductsPage />} />
                            <Route path="/products/create" element={<ProductCreate />} />
                            <Route path="/products/update/:id" element={<UpdateProductForm />} />
                            <Route path="/users-management" element={<UsersManagementPage />} />
                            <Route path="/mision" element={<MisionesList />} />
                            <Route path="/visiones" element={<VisionesList />} />
                            <Route path="/politicas" element={<PoliticasList />} />
                            <Route path="/preguntasFre" element={<FAQsList />} />
                            <Route path="/empresa-manage" element={<EmpresaPage />} />
                            <Route path="/ubicacion" element={<UbicacionList />} />
                            <Route path="/redesSociales" element={<RedesSocialesList />} />
                            <Route path="/dispositivos-manage" element={<DispositivosList />} />
                          </Route>

                          {/* 📌 Página de Acceso Denegado */}
                          <Route path="/access-denied" element={<AccessDeniedPage />} />
                        </Routes>

                        <Footer /> {/* Footer */}
                      </main>
                    </BrowserRouter>
                    </RedesSocialesProvider>
                    </UbicacionProvider>
                  </FAQProvider>
                </PoliticaProvider>
              </VisionProvider>
            </MisionProvider>
          </MarcaProvider>
        </CategoryProvider>
      </ProductProvider>
    </AuthProvider>
  );
}

export default App;
