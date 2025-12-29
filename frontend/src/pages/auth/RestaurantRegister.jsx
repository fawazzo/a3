// src/pages/auth/RestaurantRegister.jsx
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../../context/AuthContext';

const RestaurantRegister = () => {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        cuisineType: '',
        il: '',          // Yeni
        ilce: '',        // Yeni
        fullAddress: '', // Yeni
        description: '',
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
            // API call to the Restaurant specific registration endpoint
            const { data } = await axios.post('/api/auth/restaurant/register', formData);
            
            login(data);
            navigate('/restaurant/dashboard');
        } catch (err) {
            // Çevrilmiş Hata Mesajı
            setError(err.response?.data?.message || 'Restoran kaydı başarısız oldu.');
        }
    };

    return (
        <div className="flex justify-center items-center py-10">
            <div className="bg-white p-8 rounded-xl shadow-2xl w-full max-w-2xl">
                {/* Başlık Çevirisi */}
                <h2 className="text-3xl font-bold text-center text-primary-orange mb-6">Restoranınızı Kaydedin</h2>
                
                {error && <p className="text-red-500 bg-red-100 p-3 rounded-md mb-4 text-sm">{error}</p>}
                
                <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4">
                    {/* Name & Cuisine */}
                    <div className="col-span-1">
                        {/* Etiket Çevirisi */}
                        <label className="block text-gray-700 text-sm font-medium mb-2" htmlFor="name">Restoran Adı</label>
                        <input type="text" id="name" name="name" value={formData.name} onChange={handleChange} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-primary-orange" required/>
                    </div>
                    <div className="col-span-1">
                        {/* Etiket Çevirisi */}
                        <label className="block text-gray-700 text-sm font-medium mb-2" htmlFor="cuisineType">Mutfak Türü (Örn: İtalyan, Türk)</label>
                        <input type="text" id="cuisineType" name="cuisineType" value={formData.cuisineType} onChange={handleChange} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-primary-orange" required/>
                    </div>

                    {/* Email & Password */}
                    <div className="col-span-1">
                        {/* Etiket Çevirisi */}
                        <label className="block text-gray-700 text-sm font-medium mb-2" htmlFor="email">E-posta (Giriş İçin)</label>
                        <input type="email" id="email" name="email" value={formData.email} onChange={handleChange} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-primary-orange" required/>
                    </div>
                    <div className="col-span-1">
                        {/* Etiket Çevirisi */}
                        <label className="block text-gray-700 text-sm font-medium mb-2" htmlFor="password">Şifre</label>
                        <input type="password" id="password" name="password" value={formData.password} onChange={handleChange} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-primary-orange" required/>
                    </div>

                    {/* New Address Fields: İl and İlçe */}
                    <div className="col-span-1">
                        {/* Etiket Çevirisi */}
                        <label className="block text-gray-700 text-sm font-medium mb-2" htmlFor="il">İl</label>
                        <input type="text" id="il" name="il" value={formData.il} onChange={handleChange} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-primary-orange" required/>
                    </div>
                    <div className="col-span-1">
                        {/* Etiket Çevirisi */}
                        <label className="block text-gray-700 text-sm font-medium mb-2" htmlFor="ilce">İlçe</label>
                        <input type="text" id="ilce" name="ilce" value={formData.ilce} onChange={handleChange} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-primary-orange" required/>
                    </div>

                    {/* Detailed Address: fullAddress */}
                    <div className="md:col-span-2">
                        {/* Etiket Çevirisi */}
                        <label className="block text-gray-700 text-sm font-medium mb-2" htmlFor="fullAddress">Detaylı Açık Adres</label>
                        <input type="text" id="fullAddress" name="fullAddress" value={formData.fullAddress} onChange={handleChange} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-primary-orange" required/>
                    </div>
                    
                    {/* Description */}
                    <div className="md:col-span-2">
                        {/* Etiket Çevirisi */}
                        <label className="block text-gray-700 text-sm font-medium mb-2" htmlFor="description">Açıklama (Maks 200 karakter)</label>
                        <textarea id="description" name="description" value={formData.description} onChange={handleChange} maxLength="200" rows="3" className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-primary-orange"></textarea>
                    </div>
                    
                    <button type="submit" className="md:col-span-2 mt-4 w-full bg-primary-orange hover:bg-primary-orange/90 text-white font-bold py-3 px-4 rounded-lg shadow-md transition duration-200">
                        {/* Buton Metni Çevirisi */}
                        Restoranı Kaydet
                    </button>
                </form>
                <p className="mt-6 text-center text-gray-600">
                    {/* Metin Çevirisi */}
                    Zaten kayıtlı mısınız?{' '}
                    <Link to="/restaurant/login" className="text-primary-orange hover:underline font-medium">
                        {/* Bağlantı Metni Çevirisi */}
                        Buradan Giriş Yapın
                    </Link>
                </p>
            </div>
        </div>
    );
};

export default RestaurantRegister;