// src/pages/restaurant/MenuManagement.jsx
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../../context/AuthContext';
import MenuItemForm from '../../pages/restaurant/MenuItemForm';

const MenuManagement = () => {
    const { user } = useAuth();
    const [menuItems, setMenuItems] = useState([]);
    const [loading, setLoading] = useState(true);
    const [editingItem, setEditingItem] = useState(null); // null for creation, object for editing
    const [error, setError] = useState(null);

    const fetchMenu = async () => {
        try {
            // Fetch menu items belonging to the logged-in restaurant user
            const { data } = await axios.get(`/api/menu/restaurant/${user._id}`);
            setMenuItems(data);
            setLoading(false);
        } catch (err) {
            // Hata mesajı çevirisi
            setError('Menü öğeleri alınamadı.');
            setLoading(false);
        }
    };

    useEffect(() => {
        if (user?._id) {
            fetchMenu();
        }
    }, [user]);

    const handleSaveItem = (newItem) => {
        // If editing, replace the old item; otherwise, add the new item
        if (editingItem) {
            setMenuItems(menuItems.map(item => item._id === newItem._id ? newItem : item));
        } else {
            setMenuItems([...menuItems, newItem]);
        }
        setEditingItem(null); // Close the form
    };

    const handleDeleteItem = async (itemId) => {
        // Onay metni çevirisi
        if (window.confirm('Bu menü öğesini silmek istediğinizden emin misiniz?')) {
            try {
                await axios.delete(`/api/menu/${itemId}`);
                setMenuItems(menuItems.filter(item => item._id !== itemId));
                // Uyarı metni çevirisi
                alert('Öğe başarıyla silindi.');
            } catch (err) {
                // Uyarı metni çevirisi
                alert('Öğe silinemedi.');
            }
        }
    };

    // Yüklenme metni çevirisi
    if (loading) return <div className="text-center text-xl">Menü Yöneticisi Yükleniyor...</div>;
    if (error) return <div className="text-center text-red-500 text-xl">{error}</div>;

    return (
        <div className="space-y-10">
            {/* Başlık Çevirisi */}
            <h1 className="text-4xl font-extrabold text-primary-orange">Menü Yönetimi</h1>
            
            {/* Menu Item Form (Add/Edit) / Menü Öğesi Formu (Ekle/Düzenle) */}
            <div className="bg-white p-6 rounded-xl shadow-2xl">
                {/* Başlık Çevirisi */}
                <h2 className="text-2xl font-bold text-primary-dark mb-4">{editingItem ? 'Öğeyi Düzenle' : 'Yeni Menü Öğesi Ekle'}</h2>
                <MenuItemForm 
                    initialData={editingItem} 
                    onSave={handleSaveItem} 
                    onCancel={() => setEditingItem(null)}
                />
            </div>

            {/* List of Current Menu Items / Mevcut Menü Öğeleri Listesi */}
            <div className="bg-white p-6 rounded-xl shadow-2xl">
                {/* Başlık Çevirisi */}
                <h2 className="text-2xl font-bold text-primary-dark mb-4">Mevcut Menü ({menuItems.length})</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {menuItems.map(item => (
                        <div key={item._id} className="p-4 border rounded-lg flex items-center bg-secondary-light">
                            {/* ADDED: Image Display */}
                            {item.imageUrl && (
                                <div className="w-16 h-16 flex-shrink-0 mr-4">
                                    <img 
                                        src={item.imageUrl} 
                                        alt={item.name} 
                                        className="w-full h-full object-cover rounded-lg"
                                    />
                                </div>
                            )}

                            <div className="flex-grow">
                                <h3 className="font-bold text-lg">{item.name}</h3>
                                {/* Fiyat ve Kategori zaten formda çevrildi */}
                                <p className="text-sm text-gray-600">{item.price} TL | {item.category}</p>
                                {/* Durum metni çevirisi */}
                                <span className={`text-xs font-medium ${item.isAvailable ? 'text-green-600' : 'text-red-600'}`}>
                                    {item.isAvailable ? 'Mevcut' : 'Mevcut Değil'}
                                </span>
                            </div>
                            
                            <div className="flex-shrink-0 space-x-2 ml-4">
                                <button 
                                    onClick={() => setEditingItem(item)}
                                    className="text-sm py-1 px-3 rounded-md bg-blue-500 text-white hover:bg-blue-600"
                                >
                                    {/* Buton Metni Çevirisi */}
                                    Düzenle
                                </button>
                                <button 
                                    onClick={() => handleDeleteItem(item._id)}
                                    className="text-sm py-1 px-3 rounded-md bg-red-500 text-white hover:bg-red-600"
                                >
                                    {/* Buton Metni Çevirisi */}
                                    Sil
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default MenuManagement;