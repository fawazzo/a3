// src/components/public/CartSummary.jsx
import React from 'react';
import { useAuth } from '../../context/AuthContext';

const CartSummary = ({ cart, addToCart, removeFromCart, handleCheckout }) => {
    const { isAuthenticated, role } = useAuth();
    
    const subtotal = cart.reduce((acc, item) => acc + item.price * item.quantity, 0).toFixed(2);
    
    // Determine the action button text and style
    let checkoutButtonText = "Ödemeye Devam Et"; // Çeviri
    let isCheckoutDisabled = false;
    if (!isAuthenticated || role === 'restaurant') {
        checkoutButtonText = "Sipariş İçin Müşteri Olarak Giriş Yapın"; // Çeviri
        isCheckoutDisabled = true;
    }
    if (cart.length === 0) {
        checkoutButtonText = "Sepet Boş"; // Çeviri
        isCheckoutDisabled = true;
    }

    return (
        <div className="bg-white p-6 rounded-xl shadow-2xl border border-primary-orange/20">
            {/* Başlık Çevirisi */}
            <h3 className="text-2xl font-bold text-primary-dark border-b pb-3 mb-4">Siparişiniz</h3>
            
            <div className="space-y-3 max-h-80 overflow-y-auto pr-2">
                {cart.length === 0 ? (
                    // Metin Çevirisi
                    <p className="text-gray-500 italic">Siparişinizi başlatmak için menüden ürün ekleyin.</p>
                ) : (
                    cart.map(item => (
                        <div key={item._id} className="flex justify-between items-center border-b border-gray-50 last:border-b-0 py-1">
                            <div className="flex-1">
                                <p className="font-medium text-gray-800">{item.name}</p>
                                {/* Metin Çevirisi */}
                                <p className="text-sm text-gray-500">adet {item.price} TL</p>
                            </div>
                            <div className="flex items-center space-x-2">
                                <button 
                                    onClick={() => removeFromCart(item._id)}
                                    className="text-white bg-red-500 hover:bg-red-600 w-6 h-6 rounded-full text-sm transition"
                                >
                                    -
                                </button>
                                <span className="font-bold w-4 text-center">{item.quantity}</span>
                                <button 
                                    onClick={() => addToCart(item)}
                                    className="text-white bg-primary-orange hover:bg-primary-orange/90 w-6 h-6 rounded-full text-sm transition"
                                >
                                    +
                                </button>
                            </div>
                        </div>
                    ))
                )}
            </div>

            <div className="border-t pt-4 mt-4">
                <div className="flex justify-between font-bold text-xl text-primary-dark">
                    {/* Etiket Çevirisi */}
                    <span>Toplam:</span>
                    <span className="text-primary-orange">{subtotal} TL</span>
                </div>
            </div>

            <button
                onClick={handleCheckout}
                disabled={isCheckoutDisabled}
                className={`w-full mt-6 font-bold py-3 rounded-lg transition duration-200 shadow-lg ${
                    isCheckoutDisabled
                        ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                        : 'bg-primary-orange hover:bg-primary-orange/90 text-white'
                }`}
            >
                {/* Buton Metni Çevirisi (Yukarıda ayarlandı) */}
                {checkoutButtonText}
            </button>
        </div>
    );
};

export default CartSummary;