// src/components/public/Home.jsx
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const Home = () => {
    const { user } = useAuth();
    const [restaurants, setRestaurants] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchRestaurants = async () => {
            try {
                // Fetch only active restaurants
                const { data } = await axios.get('/api/restaurants');
                setRestaurants(data);
                setLoading(false);
            } catch (err) {
                // Hata Mesajı Çevirisi
                setError('Restoranlar yüklenirken bir hata oluştu.');
                setLoading(false);
            }
        };
        fetchRestaurants();
    }, []);

    // Display a message based on the user's location (Il/Province)
    const filterMessage = user?.il ? 
        // Metin Çevirisi
        <p className="text-xl text-primary-dark mb-6">
            <span className="font-semibold">{user.il}</span> ilindeki aktif restoranlar:
        </p> :
        // Metin Çevirisi
        <p className="text-xl text-primary-dark mb-6">
            Tüm aktif restoranlar:
        </p>;

    if (loading) return <div className="text-center text-xl text-primary-orange py-10">Restoranlar Yükleniyor...</div>;
    if (error) return <div className="text-center text-red-500 text-xl py-10">{error}</div>;

    return (
        <div className="space-y-8">
            {/* Başlık Çevirisi */}
            <h1 className="text-4xl font-extrabold text-primary-orange">Yakınınızdaki Restoranlar</h1>
            
            {filterMessage}

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {restaurants.length === 0 ? (
                    // Metin Çevirisi
                    <div className="col-span-full bg-white p-6 rounded-xl shadow-md text-center text-gray-500">
                        Bu bölgede şu anda aktif restoran bulunmamaktadır.
                    </div>
                ) : (
                    restaurants.map(restaurant => (
                        <Link 
                            key={restaurant._id} 
                            to={`/restaurant/${restaurant._id}`}
                            className="block bg-white p-6 rounded-xl shadow-lg hover:shadow-xl transition duration-300 transform hover:scale-[1.02] border-t-4 border-primary-orange"
                        >
                            <h2 className="text-2xl font-bold text-primary-dark mb-2">{restaurant.name}</h2>
                            <p className="text-primary-orange font-semibold mb-3">{restaurant.cuisineType}</p>
                            {/* Adres Bilgisi Çevirisi */}
                            <p className="text-sm text-gray-600">📍 {restaurant.ilce} / {restaurant.il}</p>
                            <p className="text-sm text-gray-500 mt-1">{restaurant.description || 'Açıklama mevcut değil.'}</p>
                        </Link>
                    ))
                )}
            </div>
        </div>
    );
};

export default Home;