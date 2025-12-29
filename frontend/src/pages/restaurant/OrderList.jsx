// src/components/restaurant/OrderList.jsx
import React from 'react';

// Defines the status flow and the next possible status button text
// Durum akışını ve bir sonraki olası durum butonu metnini tanımlar
const statusOptions = {
    // Çeviriler: Beklemede, Onaylandı, Hazırlanıyor, Teslimat için Yolda, Teslim Edildi, İptal Edildi
    Pending: { next: 'Confirmed', btnText: 'Siparişi Onayla', color: 'bg-yellow-500' },
    Confirmed: { next: 'Preparing', btnText: 'Hazırlamaya Başla', color: 'bg-blue-500' },
    Preparing: { next: 'Out for Delivery', btnText: 'Teslimat için Yolda', color: 'bg-indigo-500' },
    'Out for Delivery': { next: 'Delivered', btnText: 'Teslim Edildi Olarak İşaretle', color: 'bg-green-500' },
    Delivered: { next: null, btnText: 'Teslim Edildi', color: 'bg-gray-400' },
    Cancelled: { next: null, btnText: 'İptal Edildi', color: 'bg-red-500' },
};

const statusTranslationMap = {
    Pending: 'Beklemede',
    Confirmed: 'Onaylandı',
    Preparing: 'Hazırlanıyor',
    'Out for Delivery': 'Teslimat için Yolda',
    Delivered: 'Teslim Edildi',
    Cancelled: 'İptal Edildi',
};

const OrderList = ({ orders, handleStatusUpdate, isRestaurantView = false }) => {

    const getStatusBadge = (status) => {
        const statusMap = {
            Pending: 'bg-yellow-100 text-yellow-800',
            Confirmed: 'bg-blue-100 text-blue-800',
            Preparing: 'bg-indigo-100 text-indigo-800',
            'Out for Delivery': 'bg-primary-orange text-white',
            Delivered: 'bg-green-100 text-green-800',
            Cancelled: 'bg-red-100 text-red-800',
        };
        const turkishStatus = statusTranslationMap[status] || status;
        return (
            <span className={`px-3 py-1 text-xs font-semibold rounded-full ${statusMap[status]}`}>
                {turkishStatus}
            </span>
        );
    };

    const OrderCard = ({ order }) => {
        const currentStatusData = statusOptions[order.status];
        const showActionButton = isRestaurantView && currentStatusData.next;

        return (
            <div className="bg-secondary-light p-4 rounded-lg shadow-md border border-gray-200">
                <div className="flex justify-between items-start mb-3 border-b pb-2">
                    {/* Display info based on who is viewing / Görüntüleyene göre bilgiyi göster */}
                    {isRestaurantView ? (
                        <div>
                            {/* Metin Çevirisi */}
                            <p className="text-lg font-bold text-primary-dark">Sipariş Veren: {order.customer.name}</p>
                            {/* Metin Çevirisi */}
                            <p className="text-sm text-gray-500">Teslimat Adresi: {order.customerAddress}</p>
                        </div>
                    ) : (
                        <div>
                            {/* Metin Çevirisi */}
                            <p className="text-lg font-bold text-primary-dark">Restoran: {order.restaurant.name}</p>
                            {/* Metin Çevirisi */}
                            <p className="text-sm text-gray-500">Toplam: {order.totalAmount.toFixed(2)} TL</p>
                        </div>
                    )}
                    
                    <div>
                        {getStatusBadge(order.status)}
                    </div>
                </div>

                {/* Items / Ürünler */}
                <ul className="text-sm text-gray-700 space-y-1 my-3">
                    {order.items.map((item, index) => (
                        <li key={index} className="flex justify-between">
                            {/* Metin Çevirisi */}
                            <span>{item.name} (x{item.quantity})</span>
                            <span className="font-medium">{(item.quantity * item.priceAtTimeOfOrder).toFixed(2)} TL</span>
                        </li>
                    ))}
                </ul>

                {/* Restaurant Action Buttons / Restoran Eylem Butonları */}
                {showActionButton && (
                    <div className="pt-3 border-t mt-3 flex justify-end space-x-3">
                        {/* Note: In a full app, 'Cancelled' would also be an option here */}
                        <button
                            onClick={() => handleStatusUpdate(order._id, currentStatusData.next)}
                            className={`py-2 px-4 text-sm font-semibold rounded-lg text-white ${currentStatusData.color} hover:opacity-90 transition`}
                        >
                            {/* Buton Metni Çevirisi (statusOptions'ta yapıldı) */}
                            {currentStatusData.btnText}
                        </button>
                    </div>
                )}
                
                {/* Tarih Metni Çevirisi */}
                <p className="text-xs text-gray-400 mt-2 text-right">Sipariş Tarihi: {new Date(order.createdAt).toLocaleDateString()}</p>
            </div>
        );
    };

    return (
        <div className="space-y-4">
            {orders.map(order => (
                <OrderCard key={order._id} order={order} />
            ))}
        </div>
    );
};

export default OrderList;