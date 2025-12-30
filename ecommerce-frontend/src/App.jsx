import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import { AuthProvider } from './context/AuthContext';
import { CartProvider } from './context/CartContext';
import Header from './components/layout/Header';
import Footer from './components/layout/Footer';
import CartSidebar from './components/cart/CartSidebar';
import ProtectedRoute from './components/common/ProtectedRoute';
import AdminProtectedRoute from './components/admin/AdminProtectedRoute';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import Products from './pages/Products';
import ProductDetail from './pages/ProductDetail';
import Cart from './pages/Cart';
import Checkout from './pages/Checkout';
import OrderConfirmation from './pages/OrderConfirmation';
import Orders from './pages/Orders';
import OrderDetail from './pages/OrderDetail';
import Profile from './pages/Profile';
// Admin Pages
import AdminLogin from './pages/admin/AdminLogin';
import AdminDashboard from './pages/admin/AdminDashboard';
import AdminProducts from './pages/admin/AdminProducts';
import AdminOrders from './pages/admin/AdminOrders';
import AdminUsers from './pages/admin/AdminUsers';
import AdminCategories from './pages/admin/AdminCategories';
import PropTypes from 'prop-types';

/**
 * Layout wrapper to conditionally show Header/Footer
 */
const Layout = ({ children }) => {
  const location = useLocation();
  const authPages = ['/login', '/register'];
  const adminPages = location.pathname.startsWith('/vl-control-panel');
  const hideLayout = authPages.includes(location.pathname) || adminPages;

  return (
    <div className="flex flex-col min-h-screen">
      {!hideLayout && <Header />}
      <main className={hideLayout ? '' : 'flex-1'}>
        <AnimatePresence mode="wait">
          {children}
        </AnimatePresence>
      </main>
      {!hideLayout && <Footer />}
      {!adminPages && <CartSidebar />}
    </div>
  );
};

Layout.propTypes = {
  children: PropTypes.node.isRequired,
};

/**
 * Main App Component
 * Sets up routing and layout structure
 */
function App() {
  return (
    <Router>
      <AuthProvider>
        <CartProvider>
          <Layout>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/products" element={<Products />} />
              <Route path="/products/:slug" element={<ProductDetail />} />
              <Route path="/cart" element={<Cart />} />
              <Route path="/checkout" element={<Checkout />} />
              <Route path="/order-confirmation/:orderNumber" element={<OrderConfirmation />} />

              {/* Dashboard Routes (Protected) */}
              <Route path="/dashboard/orders" element={
                <ProtectedRoute><Orders /></ProtectedRoute>
              } />
              <Route path="/dashboard/orders/:orderNumber" element={
                <ProtectedRoute><OrderDetail /></ProtectedRoute>
              } />
              <Route path="/dashboard/profile" element={
                <ProtectedRoute><Profile /></ProtectedRoute>
              } />

              {/* Admin Login (Public) */}
              <Route path="/vl-control-panel/auth" element={<AdminLogin />} />

              {/* Admin Routes (Admin Protected) - Obscured paths */}
              <Route path="/vl-control-panel" element={
                <AdminProtectedRoute><AdminDashboard /></AdminProtectedRoute>
              } />
              <Route path="/vl-control-panel/inventory" element={
                <AdminProtectedRoute><AdminProducts /></AdminProtectedRoute>
              } />
              <Route path="/vl-control-panel/transactions" element={
                <AdminProtectedRoute><AdminOrders /></AdminProtectedRoute>
              } />
              <Route path="/vl-control-panel/transactions/:id" element={
                <AdminProtectedRoute><AdminOrders /></AdminProtectedRoute>
              } />
              <Route path="/vl-control-panel/accounts" element={
                <AdminProtectedRoute><AdminUsers /></AdminProtectedRoute>
              } />
              <Route path="/vl-control-panel/taxonomy" element={
                <AdminProtectedRoute><AdminCategories /></AdminProtectedRoute>
              } />
            </Routes>
          </Layout>
        </CartProvider>
      </AuthProvider>
    </Router>
  );
}

export default App;




