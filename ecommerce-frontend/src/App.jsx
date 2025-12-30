import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import Header from './components/layout/Header';
import Footer from './components/layout/Footer';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import PropTypes from 'prop-types';

/**
 * Layout wrapper to conditionally show Header/Footer
 */
const Layout = ({ children }) => {
  const location = useLocation();
  const authPages = ['/login', '/register'];
  const hideLayout = authPages.includes(location.pathname);

  return (
    <div className="flex flex-col min-h-screen">
      {!hideLayout && <Header />}
      <main className={hideLayout ? '' : 'flex-1'}>
        {children}
      </main>
      {!hideLayout && <Footer />}
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
        <Layout>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            {/* More routes will be added as we build pages */}
          </Routes>
        </Layout>
      </AuthProvider>
    </Router>
  );
}

export default App;
