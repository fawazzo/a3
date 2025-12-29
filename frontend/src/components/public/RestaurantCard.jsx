// src/components/public/RestaurantCard.jsx
import React from 'react';
import { Link } from 'react-router-dom';

const RestaurantCard = ({ restaurant }) => {
  // FIX: Construct the display address from the new fields (il, ilce)
  // Yeni alanlardan (il, ilce) görüntüleme adresini oluşturun
  const displayLocation = restaurant.ilce && restaurant.il 
    ? `${restaurant.ilce}, ${restaurant.il}` 
    : (restaurant.fullAddress ? restaurant.fullAddress : 'Adres Bilgisi Yok'); // Çeviri
  
  // FIX: Ensure description exists before calling substring
  // Alt dizeyi çağırmadan önce açıklamanın var olduğundan emin olun
  const displayDescription = restaurant.description 
    ? restaurant.description.substring(0, 70) + '...'
    : 'Açıklama mevcut değil.'; // Çeviri

  return (
    <div className="bg-white rounded-xl shadow-lg hover:shadow-xl transition duration-300 overflow-hidden border border-gray-100">
      <div className="p-6">
        <h3 className="text-xl font-semibold text-primary-dark mb-2">{restaurant.name}</h3>
        {/* Mutfak Türü çevrilmeye gerek yok */}
        <p className="text-sm text-gray-500 mb-3">{restaurant.cuisineType}</p>
        
        <div className="space-y-1 text-sm">
            <p className="text-gray-600">
                {/* Etiket Çevirisi */}
                <span className="font-medium">Min. Sipariş:</span> {restaurant.minOrderValue} TL
            </p>
            <p className="text-gray-600">
                {/* Etiket Çevirisi ve konumu kullanma */}
                <span className="font-medium">Konum:</span> {displayLocation.substring(0, 30)}...
            </p>
        </div>

        <p className="mt-4 text-gray-700 text-sm italic">{displayDescription}</p>

        <Link
          to={`/restaurant/${restaurant._id}`}
          className="mt-6 inline-block bg-primary-orange text-white font-medium py-2 px-4 rounded-lg text-center hover:bg-primary-orange/90 transition duration-200"
        >
          {/* Buton Metni Çevirisi */}
          Menüyü Görüntüle
        </Link>
      </div>
    </div>
  );
};

export default RestaurantCard;