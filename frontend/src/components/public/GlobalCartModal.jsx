// src/components/public/GlobalCartModal.jsx
import React from 'react';
// Removed: import { X, Plus, Minus, ShoppingBag, Trash2 } from 'lucide-react';

const GlobalCartModal = ({ cart, updateQuantity, removeFromCart, handleCheckout, onClose }) => {

    const totalAmount = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    const isCartEmpty = cart.length === 0;

    return (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-xl shadow-2xl w-full max-w-lg max-h-[90vh] overflow-hidden flex flex-col">
                
                {/* Header */}
                <div className="bg-primary-orange text-white p-4 flex items-center justify-between">
                    <h2 className="text-xl font-bold flex items-center space-x-2">
                        {/* Replaced ShoppingBag icon with text/unicode */}
                        <span>🛒</span> 
                        <span>Sepetim ({cart.length})</span>
                    </h2>
                    <button onClick={onClose} className="hover:bg-white/20 p-1 rounded transition">
                        {/* Replaced X icon with unicode */}
                        <span>✕</span>
                    </button>
                </div>

                {/* Cart Items List */}
                <div className="flex-1 overflow-y-auto p-4 space-y-3">
                    {isCartEmpty ? (
                        <div className="text-center py-10 text-gray-500">Sepetiniz boş.</div>
                    ) : (
                        cart.map(item => (
                            <div key={item._id} className="flex justify-between items-center border-b pb-3">
                                <div>
                                    <p className="font-semibold">{item.name}</p>
                                    {/* Assuming item.price is present from the item object defined in App.jsx */}
                                    <p className="text-sm text-gray-500">{item.price} TL</p>
                                </div>
                                <div className="flex items-center space-x-3">
                                    <div className="flex items-center border rounded-md">
                                        <button 
                                            onClick={() => updateQuantity(item._id, item.quantity - 1)}
                                            className="p-1 hover:bg-gray-100 rounded-l-md"
                                        >
                                            {/* Replaced Minus icon with unicode */}
                                            <span className="text-base text-gray-600">−</span>
                                        </button>
                                        <span className="px-2 text-sm">{item.quantity}</span>
                                        <button 
                                            onClick={() => updateQuantity(item._id, item.quantity + 1)}
                                            className="p-1 hover:bg-gray-100 rounded-r-md"
                                        >
                                            {/* Replaced Plus icon with unicode */}
                                            <span className="text-base text-gray-600">+</span>
                                        </button>
                                    </div>
                                    <button 
                                        onClick={() => removeFromCart(item._id)}
                                        className="p-1 text-red-500 hover:bg-red-50 rounded"
                                    >
                                        {/* Replaced Trash2 icon with unicode */}
                                        <span>🗑️</span>
                                    </button>
                                </div>
                            </div>
                        ))
                    )}
                </div>

                {/* Footer / Summary */}
                <div className="p-4 border-t bg-gray-50">
                    <div className="flex justify-between text-lg font-bold mb-3">
                        <span>Toplam Tutar:</span>
                        <span className="text-primary-orange">{totalAmount.toFixed(2)} TL</span>
                    </div>
                    
                    <button
                        onClick={handleCheckout}
                        disabled={isCartEmpty}
                        className="w-full bg-primary-dark text-white py-3 rounded-lg font-semibold hover:bg-primary-dark/90 disabled:bg-gray-400 transition"
                    >
                        Ödemeye Yap
                    </button>
                </div>
            </div>
        </div>
    );
};

export default GlobalCartModal;