// src/components/layout/Navbar.jsx
import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
// import { MapPin } from 'lucide-react'; // <-- REMOVED

const Navbar = () => {
  const { isAuthenticated, role, logout, user } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const getDashboardPath = () => {
    if (role === 'customer') return '/customer/dashboard';
    if (role === 'restaurant') return '/restaurant/dashboard';
    return '/';
  };

  // Determine the display location
  const displayIl = user?.il || 'Şehir Seçiniz'; // Changed to Turkish default
  
  // Define styles for the location display (using simple text)
  const locationDisplay = (
    <div className="flex items-center space-x-1 text-white bg-primary-dark/50 py-1 px-3 rounded-full text-sm font-medium">
      {/* Simple location indicator */}
      <span>📍</span> 
      <span>{displayIl}</span>
    </div>
  );

  return (
    <header className="bg-primary-orange shadow-md sticky top-0 z-50">
      <div className="container mx-auto px-4 flex justify-between items-center py-4">
        {/* Logo */}
        <Link to="/" className="text-white text-2xl font-bold tracking-wider hover:text-white/90">
          {/* Logo Metni Çevirisi */}
          YEMEKSEPETİ CLONE
        </Link>

        {/* Navigation Links / Navigasyon Bağlantıları */}
        <nav className="flex items-center space-x-6">
          <Link to="/" className="text-white hover:text-secondary-light transition duration-200">
            {/* Bağlantı Metni Çevirisi */}
            Restoranlar
          </Link>

          {isAuthenticated ? (
            // Authenticated section starts here
            <>
              {/* Display User/Restaurant IL */}
              {locationDisplay}

              {/* Logged In Links / Giriş Yapılmış Bağlantılar */}
              <Link 
                to={getDashboardPath()} 
                className="text-white font-medium hover:text-secondary-light transition duration-200"
              >
                {/* Kullanıcı Adı veya Kontrol Paneli Çevirisi */}
                {user?.name || 'Kontrol Paneli'}
              </Link>

              {role === 'customer' && (
                <Link 
                  to="/customer/orders" 
                  className="text-white hover:text-secondary-light transition duration-200"
                >
                  {/* Bağlantı Metni Çevirisi */}
                  Siparişlerim
                </Link>
              )}

              <button 
                onClick={handleLogout} 
                className="bg-white text-primary-orange font-semibold py-1.5 px-4 rounded-full shadow-lg hover:bg-gray-100 transition duration-200"
              >
                {/* Buton Metni Çevirisi */}
                Çıkış Yap
              </button>
            </>
          ) : (
            // Not Authenticated section starts here
            <>
              {/* Not Logged In Links / Giriş Yapılmamış Bağlantılar */}
              <div className="group relative">
                <button className="text-white hover:text-secondary-light px-2 py-1.5">
                  {/* Buton Metni Çevirisi */}
                  Giriş Yap
                </button>
                {/* Set top margin to '0' to ensure no gap between button and dropdown */}
                <div className="absolute right-0 w-48 bg-white rounded-md shadow-xl opacity-0 group-hover:opacity-100 transition duration-300 pointer-events-none group-hover:pointer-events-auto"
                     style={{ marginTop: 0 }}> 
                  <Link to="/customer/login" className="block px-4 py-2 text-primary-dark hover:bg-gray-100 rounded-t-md">
                    {/* Bağlantı Metni Çevirisi */}
                    Müşteri Girişi
                  </Link>
                  <Link to="/restaurant/login" className="block px-4 py-2 text-primary-dark hover:bg-gray-100 rounded-b-md">
                    {/* Bağlantı Metni Çevirisi */}
                    Restoran Girişi
                  </Link>
                </div>
              </div>

              <div className="group relative">
                <button className="bg-primary-dark text-white font-semibold py-1.5 px-4 rounded-full shadow-lg hover:bg-primary-dark/90 transition duration-200">
                  {/* Buton Metni Çevirisi */}
                  Kaydol
                </button>
                {/* Set top margin to '0' to ensure no gap between button and dropdown */}
                <div className="absolute right-0 w-48 bg-white rounded-md shadow-xl opacity-0 group-hover:opacity-100 transition duration-300 pointer-events-none group-hover:pointer-events-auto"
                     style={{ marginTop: 0 }}>
                  <Link to="/customer/register" className="block px-4 py-2 text-primary-dark hover:bg-gray-100 rounded-t-md">
                    {/* Bağlantı Metni Çevirisi */}
                    Müşteri Kaydı
                  </Link>
                  <Link to="/restaurant/register" className="block px-4 py-2 text-primary-dark hover:bg-gray-100 rounded-b-md">
                    {/* Bağlantı Metni Çevirisi */}
                    Restoran Kaydı
                  </Link>
                </div>
              </div>
            </>
          )}
        </nav>
      </div>
    </header>
  );
};

export default Navbar;