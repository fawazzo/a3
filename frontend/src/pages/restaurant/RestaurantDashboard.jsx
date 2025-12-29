// src/pages/restaurant/RestaurantDashboard.jsx
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../../context/AuthContext';
import { Link } from 'react-router-dom';
import OrderList from '../../pages/restaurant/OrderList';

const RestaurantDashboard = () => {
    const { user } = useAuth();
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // Fetch all orders received by this restaurant
    const fetchOrders = async () => {
        try {
            const { data } = await axios.get('/api/orders/restaurant');
            setOrders(data);
            setLoading(false);
        } catch (err) {
            // Hata mesajı çevirisi
            setError('Restoran siparişleri alınamadı.');
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchOrders();
    }, []);

    // Function to handle status update from OrderList component
    const handleStatusUpdate = async (orderId, newStatus) => {
        try {
            const { data } = await axios.put(`/api/orders/${orderId}/status`, { status: newStatus });
            
            // Update the local state with the new order data
            setOrders(prevOrders => 
                prevOrders.map(order => 
                    order._id === orderId ? data : order
                )
            );
            // Başarı mesajı çevirisi
            alert(`Sipariş ${orderId} durumu ${newStatus} olarak güncellendi`);

        } catch (err) {
            // Hata mesajı çevirisi
            alert(`Durum güncellenirken hata oluştu: ${err.response?.data?.message || 'Geçersiz geçiş.'}`);
        }
    };

    // Yüklenme metni çevirisi
    if (loading) return <div className="text-center text-xl text-primary-dark">Kontrol Paneli Yükleniyor...</div>;
    if (error) return <div className="text-center text-red-500 text-xl">{error}</div>;

    const activeOrders = orders.filter(o => !['Delivered', 'Cancelled'].includes(o.status));
    const completedOrders = orders.filter(o => ['Delivered', 'Cancelled'].includes(o.status));

    return (
        <div className="space-y-10">
            {/* Başlık Çevirisi */}
            <h1 className="text-4xl font-extrabold text-primary-orange">Tekrar Hoş Geldiniz, {user.name}</h1>
            
            {/* Quick Actions / Hızlı İşlemler */}
            <div className="flex space-x-4">
                <Link 
                    to="/restaurant/menu" 
                    className="bg-primary-dark text-white py-3 px-6 rounded-lg font-semibold hover:bg-primary-dark/90 transition shadow-lg"
                >
                    {/* Buton Metni Çevirisi */}
                    Menü Öğelerini Yönet
                </Link>
                <div className="bg-white p-3 rounded-lg shadow-md flex items-center">
                    <span className="text-xl font-bold text-primary-orange">{activeOrders.length}</span>
                    {/* Metin Çevirisi */}
                    <span className="ml-2 text-gray-600">Aktif Sipariş</span>
                </div>
            </div>

            {/* Active Orders Section / Aktif Siparişler Bölümü */}
            <div className="bg-white p-6 rounded-xl shadow-2xl">
                {/* Başlık Çevirisi */}
                <h2 className="text-3xl font-bold text-primary-dark mb-6">Mevcut Gelen Siparişler</h2>
                
                {activeOrders.length === 0 ? (
                    // Metin Çevirisi
                    <p className="text-gray-500 italic">Şu anda yeni veya aktif sipariş bulunmamaktadır.</p>
                ) : (
                    <OrderList 
                        orders={activeOrders} 
                        handleStatusUpdate={handleStatusUpdate} 
                        isRestaurantView={true} 
                    />
                )}
            </div>

            {/* History Section / Geçmiş Bölümü */}
            <div className="bg-white p-6 rounded-xl shadow-2xl">
                {/* Başlık Çevirisi */}
                <h2 className="text-3xl font-bold text-primary-dark mb-6">Sipariş Geçmişi ({completedOrders.length})</h2>
                {completedOrders.length > 0 && (
                    <OrderList 
                        orders={completedOrders} 
                        handleStatusUpdate={handleStatusUpdate} 
                        isRestaurantView={true} 
                    />
                )}
            </div>
        </div>
    );
};

export default RestaurantDashboard;