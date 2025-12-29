// src/pages/auth/CustomerLogin.jsx
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../../context/AuthContext';

const CustomerLogin = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    try {
      const { data } = await axios.post('/api/auth/customer/login', { email, password });
      login(data);
      navigate('/customer/dashboard');
    } catch (err) {
      // Çevrilmiş Hata Mesajı
      setError(err.response?.data?.message || 'Giriş başarısız oldu. Bilgilerinizi kontrol edin.');
    }
  };

  return (
    <div className="flex justify-center items-center py-10">
      <div className="bg-white p-8 rounded-xl shadow-2xl w-full max-w-md">
        {/* Başlık Çevirisi */}
        <h2 className="text-3xl font-bold text-center text-primary-dark mb-6">Müşteri Girişi</h2>
        
        {error && <p className="text-red-500 bg-red-100 p-3 rounded-md mb-4 text-sm">{error}</p>}
        
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            {/* Etiket Çevirisi */}
            <label className="block text-gray-700 text-sm font-medium mb-2" htmlFor="email">
              E-posta
            </label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-orange"
              required
            />
          </div>
          <div className="mb-6">
            {/* Etiket Çevirisi */}
            <label className="block text-gray-700 text-sm font-medium mb-2" htmlFor="password">
              Şifre
            </label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-orange"
              required
            />
          </div>
          <button
            type="submit"
            className="w-full bg-primary-orange hover:bg-primary-orange/90 text-white font-bold py-2 px-4 rounded-lg transition duration-200 shadow-md"
          >
            {/* Buton Metni Çevirisi */}
            Giriş Yap
          </button>
        </form>
        <p className="mt-6 text-center text-gray-600">
          {/* Metin Çevirisi */}
          Yeni misiniz?{' '}
          <Link to="/customer/register" className="text-primary-orange hover:underline font-medium">
            {/* Bağlantı Metni Çevirisi */}
            Hesap Aç
          </Link>
        </p>
      </div>
    </div>
  );
};

export default CustomerLogin;