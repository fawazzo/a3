// src/components/restaurant/MenuItemForm.jsx
import React, { useState, useEffect } from 'react';
import axios from 'axios';

// Varsayılan Kategoriler Çevirisi
const defaultCategories = ['Ana Yemek', 'Başlangıç', 'Tatlı', 'İçecek', 'Yan Lezzet'];

const MenuItemForm = ({ initialData, onSave, onCancel }) => {
    const [formData, setFormData] = useState({
        name: '',
        description: '',
        price: 0,
        category: defaultCategories[0],
        imageUrl: '',
        isAvailable: true,
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    useEffect(() => {
        if (initialData) {
            setFormData({
                name: initialData.name,
                description: initialData.description,
                price: initialData.price,
                category: initialData.category,
                imageUrl: initialData.imageUrl || '',
                isAvailable: initialData.isAvailable,
            });
        } else {
            // Reset form for new item
            // Yeni ürün için formu sıfırla
            setFormData({
                name: '', description: '', price: 0, category: defaultCategories[0], imageUrl: '', isAvailable: true,
            });
        }
    }, [initialData]);

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData({
            ...formData,
            [name]: type === 'checkbox' ? checked : (name === 'price' ? Number(value) : value),
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError(null);
        
        try {
            let response;
            if (initialData) {
                // GÜNCELLEME isteği
                response = await axios.put(`/api/menu/${initialData._id}`, formData);
            } else {
                // OLUŞTURMA isteği
                response = await axios.post('/api/menu', formData);
            }
            
            onSave(response.data);
            setLoading(false);
            
        } catch (err) {
            // Hata mesajı çevirisi
            setError(err.response?.data?.message || 'Ürün kaydedilemedi.');
            setLoading(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            {error && <p className="text-red-500 bg-red-100 p-3 rounded-md">{error}</p>}
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                    {/* Etiket Çevirisi */}
                    <label className="block font-medium text-gray-700">Ad</label>
                    <input type="text" name="name" value={formData.name} onChange={handleChange} required className="w-full px-3 py-2 border rounded-lg focus:ring-primary-orange" />
                </div>
                <div>
                    {/* Etiket Çevirisi */}
                    <label className="block font-medium text-gray-700">Fiyat (TL)</label>
                    <input type="number" name="price" value={formData.price} onChange={handleChange} required min="0" step="0.01" className="w-full px-3 py-2 border rounded-lg focus:ring-primary-orange" />
                </div>
            </div>

            <div>
                {/* Etiket Çevirisi */}
                <label className="block font-medium text-gray-700">Açıklama</label>
                <textarea name="description" value={formData.description} onChange={handleChange} rows="2" className="w-full px-3 py-2 border rounded-lg focus:ring-primary-orange"></textarea>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                    {/* Etiket Çevirisi */}
                    <label className="block font-medium text-gray-700">Kategori</label>
                    <select name="category" value={formData.category} onChange={handleChange} required className="w-full px-3 py-2 border rounded-lg focus:ring-primary-orange">
                        {/* Kategoriler otomatik çevrildi */}
                        {defaultCategories.map(cat => <option key={cat} value={cat}>{cat}</option>)}
                    </select>
                </div>
                <div>
                    {/* Etiket Çevirisi */}
                    <label className="block font-medium text-gray-700">Görsel URL'si (Örnek)</label>
                    <input type="url" name="imageUrl" value={formData.imageUrl} onChange={handleChange} className="w-full px-3 py-2 border rounded-lg focus:ring-primary-orange" />
                </div>
            </div>

            <div className="flex items-center space-x-2">
                <input type="checkbox" id="isAvailable" name="isAvailable" checked={formData.isAvailable} onChange={handleChange} className="w-4 h-4 text-primary-orange border-gray-300 rounded focus:ring-primary-orange" />
                {/* Etiket Çevirisi */}
                <label htmlFor="isAvailable" className="font-medium text-gray-700">Şu Anda Mevcut</label>
            </div>

            <div className="flex justify-end space-x-3 pt-4">
                {initialData && (
                    <button type="button" onClick={onCancel} className="bg-gray-300 text-primary-dark py-2 px-4 rounded-lg font-semibold hover:bg-gray-400">
                        {/* Buton Metni Çevirisi */}
                        Düzenlemeyi İptal Et
                    </button>
                )}
                <button
                    type="submit"
                    disabled={loading}
                    className="bg-primary-orange text-white py-2 px-4 rounded-lg font-semibold hover:bg-primary-orange/90 disabled:bg-gray-400 transition"
                >
                    {/* Buton Metni Çevirisi */}
                    {loading ? 'Kaydediliyor...' : (initialData ? 'Ürünü Güncelle' : 'Ürün Oluştur')}
                </button>
            </div>
        </form>
    );
};

export default MenuItemForm;