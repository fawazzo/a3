// src/components/public/RestaurantDetail.jsx
import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { ShoppingCart } from 'lucide-react'; 

const RestaurantDetail = ({ globalAddToCart, globalCartItems }) => {
    const { id: restaurantId } = useParams();
    const [restaurant, setRestaurant] = useState(null);
    const [menu, setMenu] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                // Fetch Restaurant Details
                const { data: restData } = await axios.get(`/api/restaurants/${restaurantId}`);
                setRestaurant(restData);

                // Fetch Menu Items
                const { data: menuData } = await axios.get(`/api/menu/restaurant/${restaurantId}`);
                setMenu(menuData);
                
                setLoading(false);
            } catch (err) {
                // Hata Mesajı Çevirisi
                setError(err.response?.data?.message || 'Restoran veya menü bilgileri alınamadı.');
                setLoading(false);
            }
        };
        fetchData();
    }, [restaurantId]);

    // **UPDATED: To handle a specific quantity**
    const handleAddToCart = (item, quantity) => {
        if (quantity <= 0) return;
        
        // Pass a minimum object required for globalAddToCart logic, including quantity
        globalAddToCart({ 
            _id: item._id, 
            restaurantId: restaurantId,
            name: item.name,
            price: item.price,
            category: item.category,
            // Pass the selected quantity directly
            initialQuantity: quantity, 
        });
        
        // Başarı mesajı çevirisi
        alert(`${quantity} adet ${item.name} sepete eklendi.`);
    };

    const getItemsByStatus = (available) => menu.filter(item => item.isAvailable === available);
    const availableItems = getItemsByStatus(true);
    const unavailableItems = getItemsByStatus(false);
    
    // Yüklenme Metni Çevirisi
    if (loading) return <div className="text-center text-xl text-primary-orange py-10">Restoran Detayları Yükleniyor...</div>;
    if (error) return <div className="text-center text-red-500 text-xl py-10">{error}</div>;
    if (!restaurant) return <div className="text-center text-red-500 text-xl py-10">Restoran bulunamadı veya pasif.</div>;

    // Group menu items by category for display
    const categorizedMenu = availableItems.reduce((acc, item) => {
        const category = item.category || 'Diğer';
        if (!acc[category]) {
            acc[category] = [];
        }
        acc[category].push(item);
        return acc;
    }, {});


    // --- Menu Item Card Component (Nested for Quantity state) ---
    const MenuItemCard = ({ item }) => {
        const [quantity, setQuantity] = useState(1);
        
        return (
            <div className="bg-secondary-light p-4 rounded-lg shadow-md flex flex-col md:flex-row items-stretch border border-gray-200 overflow-hidden">
                
                {/* 1. Image (Conditional Display) */}
                {item.imageUrl && (
                    <div className="w-full md:w-28 h-24 flex-shrink-0 mb-4 md:mb-0 md:mr-4">
                        <img 
                            src={item.imageUrl} 
                            alt={item.name} 
                            className="w-full h-full object-cover rounded-lg"
                        />
                    </div>
                )}
                
                {/* 2. Details */}
                <div className="flex-grow flex flex-col justify-between">
                    <div>
                        <h4 className="font-bold text-lg text-primary-dark">{item.name}</h4>
                        <p className="text-sm text-gray-600">{item.description}</p>
                        <p className="text-primary-orange font-bold mt-1">{item.price.toFixed(2)} TL</p>
                    </div>
                    
                    {/* 3. Quantity and Action */}
                    <div className="flex items-center space-x-3 mt-3 pt-3 border-t border-gray-300">
                        {/* Quantity Input */}
                        <input
                            type="number"
                            min="1"
                            value={quantity}
                            onChange={(e) => setQuantity(Math.max(1, Number(e.target.value)))}
                            className="w-16 px-2 py-1 border rounded-lg text-center focus:ring-primary-orange"
                        />
                        
                        {/* Add to Cart Button */}
                        <button
                            onClick={() => handleAddToCart(item, quantity)}
                            className="flex items-center justify-center bg-primary-orange text-white p-2 rounded-lg font-semibold hover:bg-primary-orange/90 transition shadow-md flex-grow"
                        >
                            <ShoppingCart size={20} className="mr-1" />
                            {/* Buton Metni Çevirisi */}
                            Sepete Ekle
                        </button>
                    </div>
                </div>
            </div>
        );
    };
    // --- End Menu Item Card Component ---


    return (
        <div className="space-y-10">
            {/* Restaurant Header */}
            <div className="bg-white p-8 rounded-xl shadow-2xl border-t-8 border-primary-orange">
                <h1 className="text-4xl font-extrabold text-primary-dark mb-2">{restaurant.name}</h1>
                <p className="text-xl text-primary-orange font-semibold mb-3">{restaurant.cuisineType}</p>
                {/* Adres ve Açıklama Çevirisi */}
                <p className="text-gray-600 mb-2">📍 {restaurant.fullAddress}, {restaurant.ilce}/{restaurant.il}</p>
                <p className="text-gray-500">{restaurant.description}</p>
                <p className="text-sm font-medium mt-3">Min. Sipariş Tutarı: {restaurant.minOrderValue.toFixed(2)} TL</p>
            </div>

            {/* Menu Section */}
            <div className="bg-white p-8 rounded-xl shadow-2xl">
                <h2 className="text-3xl font-bold text-primary-dark mb-6">Menü</h2>
                
                {Object.keys(categorizedMenu).length === 0 && menu.length > 0 && (
                    <p className="text-gray-500 italic">Şu anda mevcut olan ürün bulunmamaktadır.</p>
                )}
                
                {Object.keys(categorizedMenu).map(category => (
                    <div key={category} className="mb-8">
                        {/* Kategori Başlığı Çevirisi */}
                        <h3 className="text-2xl font-bold text-primary-dark border-b-2 border-primary-orange/50 pb-2 mb-4">{category}</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {categorizedMenu[category].map(item => (
                                <MenuItemCard key={item._id} item={item} />
                            ))}
                        </div>
                    </div>
                ))}
                
                {/* Unavailable Items (Optional) */}
                {unavailableItems.length > 0 && (
                    <div className="mt-10 pt-6 border-t border-gray-200">
                        {/* Başlık Çevirisi */}
                        <h3 className="text-xl font-bold text-gray-600 mb-4">Mevcut Olmayan Öğeler</h3>
                        <ul className="text-sm text-gray-500 list-disc list-inside">
                            {unavailableItems.map(item => <li key={item._id}>{item.name} ({item.price.toFixed(2)} TL)</li>)}
                        </ul>
                    </div>
                )}
            </div>
        </div>
    );
};

export default RestaurantDetail;