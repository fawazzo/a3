// src/pages/public/RestaurantDetail.jsx
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../../context/AuthContext';
import MenuList from '../../components/public/MenuList';
// Removed CartSummary import

// NOTE: This component now accepts global cart functions via props from App.jsx
const RestaurantDetail = ({ globalAddToCart, globalCartItems }) => { 
  const { id } = useParams();
  const navigate = useNavigate();
  const { isAuthenticated, role, user } = useAuth(); 

  const [restaurant, setRestaurant] = useState(null);
  const [menu, setMenu] = useState([]);
  // Removed local cart state: [cart, setCart]
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [resRes, menuRes] = await Promise.all([
          axios.get(`/api/restaurants/${id}`),
          axios.get(`/api/menu/restaurant/${id}`),
        ]);
        setRestaurant(resRes.data);
        setMenu(menuRes.data);
        setLoading(false);
      } catch (err) {
        setError('Restoran veya menü yüklenemedi.');
        setLoading(false);
      }
    };
    fetchData();
  }, [id]);
  
  // --- Cart Management Functions (Calls Global) ---
  const handleAddToCart = (item) => {
    const itemWithRestaurant = {
        ...item,
        restaurantId: restaurant._id 
    };
    
    // Call the global function provided by App.jsx
    globalAddToCart(itemWithRestaurant);
  };
  
  // The Checkout functionality is now entirely global and is removed from here.

  if (loading) return <div className="text-center text-xl">Menü Yükleniyor...</div>;
  if (error) return <div className="text-center text-red-500 text-xl">{error}</div>;

  // Prepare location display
  const displayLocation = restaurant.ilce && restaurant.il 
    ? `${restaurant.ilce}, ${restaurant.il}` 
    : (restaurant.fullAddress ? restaurant.fullAddress : 'Adres Bilgisi Yok'); 


  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
      {/* Restaurant Info & Menu / Restoran Bilgileri & Menü */}
      <div className="lg:col-span-2">
        <h1 className="text-4xl font-extrabold text-primary-dark mb-2">{restaurant.name}</h1>
        <p className="text-xl text-primary-orange mb-4">{restaurant.cuisineType} Mutfağı ({displayLocation})</p>
        <p className="text-gray-600 mb-6">{restaurant.description}</p>

        {/* Menu Items / Menü Öğeleri */}
        <MenuList menu={menu} addToCart={handleAddToCart} />
      </div>

      {/* Cart Summary (Now just a persistent link/status bar to prompt user to use the Navbar button) */}
      <div className="lg:sticky lg:top-20 lg:h-fit">
        <div className="bg-white p-6 rounded-xl shadow-lg border-t-4 border-primary-orange">
            <h3 className="text-2xl font-bold text-primary-dark">Sepet Durumu</h3>
            <p className="mt-2 text-gray-600">Ürünler sepete eklendi.</p>
            <p className="text-sm text-gray-500 mt-1">Ödeme yapmak için yukarıdaki sepet ikonunu kullanın.</p>
        </div>
      </div>
    </div>
  );
};

export default RestaurantDetail;