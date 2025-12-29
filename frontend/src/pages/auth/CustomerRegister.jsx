// src/pages/auth/CustomerRegister.jsx
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../../context/AuthContext';

const CustomerRegister = () => {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        il: '', // Yeni
        ilce: '', // Yeni
        fullAddress: '', // Yeni
    });
    const [error, setError] = useState(null);
    const { login } = useAuth();
    const navigate = useNavigate();

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError(null);

        try {
            // Yeni alanları arka uca gönder
            const { data } = await axios.post('/api/auth/customer/register', formData);
            login(data);
            navigate('/customer/dashboard');
        } catch (err) {
            // Çevrilmiş Hata Mesajı
            setError(err.response?.data?.message || 'Kayıt başarısız oldu.');
        }
    };

    return (
        <div className="flex justify-center items-center py-10">
            <div className="bg-white p-8 rounded-xl shadow-2xl w-full max-w-lg">
                {/* Başlık Çevirisi */}
                <h2 className="text-3xl font-bold text-center text-primary-dark mb-6">Müşteri Kaydı</h2>
                
                {error && <p className="text-red-500 bg-red-100 p-3 rounded-md mb-4 text-sm">{error}</p>}
                
                <form onSubmit={handleSubmit}>
                    <div className="mb-4">
                        {/* Etiket Çevirisi */}
                        <label className="block text-gray-700 text-sm font-medium mb-2" htmlFor="name">Ad Soyad</label>
                        <input type="text" id="name" name="name" value={formData.name} onChange={handleChange} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-primary-orange" required/>
                    </div>
                    <div className="mb-4">
                        {/* Etiket Çevirisi */}
                        <label className="block text-gray-700 text-sm font-medium mb-2" htmlFor="email">E-posta</label>
                        <input type="email" id="email" name="email" value={formData.email} onChange={handleChange} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-primary-orange" required/>
                    </div>
                    
                    {/* Yeni Adres Alanları - İl ve İlçe zaten Türkçe, sadece parantez içi çevrildi */}
                    <div className="grid grid-cols-2 gap-4 mb-4">
                        <div>
                            {/* Etiket Çevirisi */}
                            <label className="block text-gray-700 text-sm font-medium mb-2" htmlFor="il">İl</label>
                            <input type="text" id="il" name="il" value={formData.il} onChange={handleChange} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-primary-orange" required/>
                        </div>
                        <div>
                            {/* Etiket Çevirisi */}
                            <label className="block text-gray-700 text-sm font-medium mb-2" htmlFor="ilce">İlçe</label>
                            <input type="text" id="ilce" name="ilce" value={formData.ilce} onChange={handleChange} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-primary-orange" required/>
                        </div>
                    </div>
                    
                    <div className="mb-4">
                        {/* Etiket Çevirisi */}
                        <label className="block text-gray-700 text-sm font-medium mb-2" htmlFor="fullAddress">Detaylı Açık Adres</label>
                        <input type="text" id="fullAddress" name="fullAddress" value={formData.fullAddress} onChange={handleChange} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-primary-orange" required/>
                    </div>
                    
                    <div className="mb-6">
                        {/* Etiket Çevirisi */}
                        <label className="block text-gray-700 text-sm font-medium mb-2" htmlFor="password">Şifre</label>
                        <input type="password" id="password" name="password" value={formData.password} onChange={handleChange} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-primary-orange" required/>
                    </div>
                    
                    <button type="submit" className="w-full bg-primary-orange hover:bg-primary-orange/90 text-white font-bold py-2 px-4 rounded-lg shadow-md transition duration-200">
                        {/* Buton Metni Çevirisi */}
                        Kaydol
                    </button>
                </form>
                <p className="mt-6 text-center text-gray-600">
                    {/* Metin Çevirisi */}
                    Zaten hesabınız var mı?{' '}
                    <Link to="/customer/login" className="text-primary-orange hover:underline font-medium">
                        {/* Bağlantı Metni Çevirisi */}
                        Giriş Yap
                    </Link>
                </p>
            </div>
        </div>
    );
};

export default CustomerRegister;