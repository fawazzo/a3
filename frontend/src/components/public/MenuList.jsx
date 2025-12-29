// src/components/public/MenuList.jsx
import React from 'react';

// Utility to group items by category
// Öğeleri kategoriye göre gruplamak için yardımcı işlev
const groupByCategory = (menu) => {
  return menu.reduce((acc, item) => {
    (acc[item.category] = acc[item.category] || []).push(item);
    return acc;
  }, {});
};

const MenuListItem = ({ item, addToCart }) => (
    <div className="flex justify-between items-start p-4 bg-white border-b border-gray-100 last:border-b-0">
        <div className="flex space-x-4">
            {item.imageUrl && (
                <img 
                    src={item.imageUrl} 
                    alt={item.name} 
                    className="w-20 h-20 object-cover rounded-md flex-shrink-0" 
                    // Mock fallback image if URL is broken
                    // URL bozuksa sahte yedek resim
                    onError={(e) => {e.target.onerror = null; e.target.src="https://via.placeholder.com/80/FF8C00/FFFFFF?text=Yemek"}} // Metin çevirisi
                />
            )}
            <div>
                <h4 className="text-lg font-semibold text-primary-dark">{item.name}</h4>
                <p className="text-sm text-gray-500">{item.description}</p>
                <p className="text-xl font-bold text-primary-orange mt-1">{item.price} TL</p>
            </div>
        </div>
        <button
            onClick={() => addToCart(item)}
            disabled={!item.isAvailable}
            className={`
                mt-2 py-1 px-3 text-sm rounded-full transition duration-200 
                ${item.isAvailable 
                    ? 'bg-primary-orange text-white hover:bg-primary-orange/90'
                    : 'bg-gray-300 text-gray-600 cursor-not-allowed'
                }
            `}
        >
            {/* Buton Metni Çevirisi */}
            {item.isAvailable ? 'Ekle' : 'Tükendi'}
        </button>
    </div>
);

const MenuList = ({ menu, addToCart }) => {
  const groupedMenu = groupByCategory(menu);
  const categories = Object.keys(groupedMenu);

  return (
    <div className="space-y-8">
      {categories.map(category => (
        <div key={category} className="bg-white rounded-xl shadow-lg overflow-hidden">
          {/* Başlık (Kategori) Çevrilmesi Gerekir (e.g., Ana Yemek, Başlangıç) - Bu, MenuItemForm'daki çevrilmiş kategorilere bağlıdır */}
          <h3 className="text-2xl font-bold p-4 bg-primary-orange text-white sticky top-0">
            {category}
          </h3>
          <div className="divide-y divide-gray-100">
            {groupedMenu[category].map(item => (
              <MenuListItem key={item._id} item={item} addToCart={addToCart} />
            ))}
          </div>
        </div>
      ))}
    </div>
  );
};

export default MenuList;