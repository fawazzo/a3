// src/pages/public/Home.jsx
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import RestaurantCard from '../../components/public/RestaurantCard';

const Home = () => {
  const [restaurants, setRestaurants] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const fetchRestaurants = async () => {
      try {
        const { data } = await axios.get('/api/restaurants');
        setRestaurants(data);
        setLoading(false);
      } catch (err) {
        // Hata mesajı çevirisi
        setError('Restoranlar yüklenemedi.');
        setLoading(false);
      }
    };
    fetchRestaurants();
  }, []);

  const filteredRestaurants = restaurants.filter(restaurant => {
    const lowerCaseSearchTerm = searchTerm.toLowerCase();

    // --- FIX: Safely access properties using || "" ---
    
    // Safety check for all fields used in search to prevent crash on null/undefined
    const name = restaurant.name || "";
    const cuisineType = restaurant.cuisineType || "";
    const il = restaurant.il || "";
    const ilce = restaurant.ilce || "";

    // Check Name and Cuisine Type
    const matchesName = name.toLowerCase().includes(lowerCaseSearchTerm);
    const matchesCuisine = cuisineType.toLowerCase().includes(lowerCaseSearchTerm);

    // Check İl (Province) and İlçe (District)
    const matchesIl = il.toLowerCase().includes(lowerCaseSearchTerm);
    const matchesIlce = ilce.toLowerCase().includes(lowerCaseSearchTerm);

    // Combine all checks
    return matchesName || matchesCuisine || matchesIl || matchesIlce;
  });

  // Yüklenme metni çevirisi
  if (loading) return <div className="text-center text-xl text-primary-dark">Restoranlar Yükleniyor...</div>;
  if (error) return <div className="text-center text-red-500 text-xl">{error}</div>;

  return (
    <div className="py-8">
      {/* Başlık Çevirisi */}
      <h1 className="text-4xl font-extrabold text-primary-dark mb-8 text-center">
        Yakınınızdaki Lezzetli Yemekleri Keşfedin
      </h1>

      {/* Search Bar / Arama Çubuğu */}
      <div className="mb-10 flex justify-center">
        <input
          type="text"
          // Placeholder Çevirisi
          placeholder="Restoranları ada, mutfak türüne, şehre veya ilçeye göre arayın..."
          className="w-full max-w-xl px-6 py-3 border-2 border-primary-orange rounded-full shadow-lg focus:outline-none focus:ring-2 focus:ring-primary-orange/50"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {filteredRestaurants.length > 0 ? (
          filteredRestaurants.map(restaurant => (
            <RestaurantCard key={restaurant._id} restaurant={restaurant} />
          ))
        ) : (
          // Sonuç Yok Metni Çevirisi
          <p className="col-span-full text-center text-xl text-gray-500">
            "{searchTerm}" ile eşleşen restoran bulunamadı.
          </p>
        )}
      </div>
    </div>
  );
};

export default Home;