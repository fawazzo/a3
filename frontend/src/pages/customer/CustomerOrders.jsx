// src/pages/customer/CustomerOrders.jsx
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../../context/AuthContext';
import OrderList from '../../pages/restaurant/OrderList'; // Reusing the list component

const CustomerOrders = () => {
    const { user } = useAuth();
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // Fetch all orders placed by this customer
    useEffect(() => {
        const fetchOrders = async () => {
            try {
                // Use the customer-specific backend endpoint
                const { data } = await axios.get('/api/orders/customer');
                setOrders(data);
                setLoading(false);
            } catch (err) {
                // Hata Mesajı Çevirisi
                setError('Siparişleriniz alınamadı.');
                setLoading(false);
            }
        };
        fetchOrders();
    }, []);

    // Yüklenme Metni Çevirisi
    if (loading) return <div className="text-center text-xl text-primary-dark">Siparişler Yükleniyor...</div>;
    if (error) return <div className="text-center text-red-500 text-xl">{error}</div>;

    const activeOrders = orders.filter(o => !['Delivered', 'Cancelled'].includes(o.status));
    const historyOrders = orders.filter(o => ['Delivered', 'Cancelled'].includes(o.status));


    return (
        <div className="space-y-10">
            {/* Başlık Çevirisi */}
            <h1 className="text-4xl font-extrabold text-primary-orange">Sipariş Geçmişiniz</h1>
            
            {/* Active Orders Section / Aktif Siparişler Bölümü */}
            <div className="bg-white p-6 rounded-xl shadow-2xl">
                {/* Başlık Çevirisi */}
                <h2 className="text-3xl font-bold text-primary-dark mb-6">Aktif Siparişler ({activeOrders.length})</h2>
                
                {activeOrders.length === 0 ? (
                    // Metin Çevirisi
                    <p className="text-gray-500 italic">Şu anda işlenmekte olan siparişiniz bulunmamaktadır.</p>
                ) : (
                    <OrderList 
                        orders={activeOrders} 
                        isRestaurantView={false} // Important: Disables status buttons
                    />
                )}
            </div>

            {/* History Section / Tamamlanan Siparişler Bölümü */}
            <div className="bg-white p-6 rounded-xl shadow-2xl">
                {/* Başlık Çevirisi */}
                <h2 className="text-3xl font-bold text-primary-dark mb-6">Tamamlanan Siparişler ({historyOrders.length})</h2>
                {historyOrders.length > 0 ? (
                    <OrderList 
                        orders={historyOrders} 
                        isRestaurantView={false} 
                    />
                ) : (
                    // Metin Çevirisi
                    <p className="text-gray-500 italic">Henüz tamamlanmış bir siparişiniz bulunmamaktadır.</p>
                )}
            </div>
        </div>
    );
};

export default CustomerOrders;