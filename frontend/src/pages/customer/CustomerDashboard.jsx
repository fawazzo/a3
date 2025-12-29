// src/pages/customer/CustomerDashboard.jsx
import React from 'react';
import { useAuth } from '../../context/AuthContext';
import { Link } from 'react-router-dom';

const CustomerDashboard = () => {
    const { user } = useAuth();
    
    // Construct the full address string for display
    // Görüntülemek için tam adres dizesini oluşturun
    const displayAddress = user.fullAddress || `${user.ilce || 'Bilinmiyor İlçe'}, ${user.il || 'Bilinmiyor İl'}`;

    return (
        <div className="space-y-10">
            {/* Başlık Çevirisi */}
            <h1 className="text-4xl font-extrabold text-primary-orange">
                Hoş Geldiniz, {user.name}
            </h1>
            {/* Alt Metin Çevirisi */}
            <p className="text-xl text-primary-dark">
                Lezzetli yemekleri keşfetmeye ve sipariş vermeye hazırsınız!
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Profile Card / Profil Kartı */}
                <div className="bg-white p-6 rounded-xl shadow-2xl border-t-4 border-primary-orange">
                    {/* Başlık Çevirisi */}
                    <h2 className="text-2xl font-bold text-primary-dark mb-4">Profiliniz</h2>
                    <p className="mb-2"><strong>E-posta:</strong> {user.email}</p>
                    {/* Etiket Çevirisi */}
                    <p className="mb-2"><strong>İl:</strong> {user.il || 'Bilinmiyor'}</p>
                    {/* Etiket Çevirisi */}
                    <p className="mb-2"><strong>İlçe:</strong> {user.ilce || 'Bilinmiyor'}</p>
                    {/* Etiket Çevirisi */}
                    <p><strong>Detaylı Adres:</strong> {user.fullAddress || 'Bilinmiyor'}</p>
                    {/* Add Edit Profile functionality here if desired later */}
                </div>

                {/* Quick Actions Card / Hızlı İşlemler Kartı */}
                <div className="bg-white p-6 rounded-xl shadow-2xl border-t-4 border-primary-orange">
                    {/* Başlık Çevirisi */}
                    <h2 className="text-2xl font-bold text-primary-dark mb-4">Hızlı İşlemler</h2>
                    <div className="space-y-3">
                        <Link 
                            to="/customer/orders" 
                            className="block w-full text-center bg-primary-dark text-white py-3 px-4 rounded-lg font-semibold hover:bg-primary-dark/90 transition"
                        >
                            {/* Buton Metni Çevirisi */}
                            Siparişlerimi Görüntüle
                        </Link>
                        <Link 
                            to="/" 
                            className="block w-full text-center bg-primary-orange text-white py-3 px-4 rounded-lg font-semibold hover:bg-primary-orange/90 transition"
                        >
                            {/* Buton Metni Çevirisi */}
                            Restoranlara Göz At
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CustomerDashboard;