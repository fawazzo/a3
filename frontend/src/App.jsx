// src/App.jsx
import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { AuthProvider, useAuth } from './context/AuthContext';
import Navbar from './components/layout/Navbar';
import Footer from './components/layout/Footer';

// Pages - Public
import Home from './components/public/Home'; 
import RestaurantDetail from './components/public/RestaurantDetail'; 

// Pages - Auth
import CustomerLogin from './pages/auth/CustomerLogin';
import CustomerRegister from './pages/auth/CustomerRegister';
import RestaurantLogin from './pages/auth/RestaurantLogin';
import RestaurantRegister from './pages/auth/RestaurantRegister';

// Pages - Protected
import CustomerDashboard from './pages/customer/CustomerDashboard';
import CustomerOrders from './pages/customer/CustomerOrders';
import RestaurantDashboard from './pages/restaurant/RestaurantDashboard';
import MenuManagement from './pages/restaurant/MenuManagement';

// Global Components
import GlobalCartModal from './components/public/GlobalCartModal';

import './App.css';

// Component for Protected Routes based on Role
const ProtectedRoute = ({ element, requiredRole }) => {
  const { isAuthenticated, role, loading } = useAuth();
  
  if (loading) return <div>Loading...</div>;

  if (!isAuthenticated) {
    return <Navigate to="/" />;
  }

  if (requiredRole && role !== requiredRole) {
    return <Navigate to="/" />;
  }

  return element;
};


// --- Global App Content with Cart State ---
const AppContent = () => {
    const { role, isAuthenticated, user } = useAuth();
    const [isCartOpen, setIsCartOpen] = useState(false);
    const [cart, setCart] = useState([]); // Global Cart State
    const navigate = useNavigate();

    // --- Local Storage and Data Persistence ---
    useEffect(() => {
        // Load cart from local storage on initial load
        const localCart = JSON.parse(localStorage.getItem('a2_global_cart') || '[]');
        setCart(localCart);
    }, []);

    useEffect(() => {
        // Save cart to local storage whenever cart state changes
        localStorage.setItem('a2_global_cart', JSON.stringify(cart));
    }, [cart]);
    
    const getTotalItems = () => cart.reduce((total, item) => total + item.quantity, 0);

    // --- Global Cart Logic (Updated for Quantity) ---
    const addToCart = (item) => {
        
        // Use the quantity provided by the detail page, default to 1 if missing
        const quantityToAdd = item.initialQuantity || 1; 

        // 1. Check permissions
        // Metin Çevirisi
        if (role === 'restaurant') return alert("Restoran sahipleri sipariş veremez.");
        
        // --- DATA SAFETY CHECK & EXTRACTION ---
        const itemId = item._id;
        const itemRestaurantId = item.restaurantId;
        const itemPrice = item.price || 0; 
        
        if (!itemId || !itemRestaurantId) {
            // Metin Çevirisi
            console.error("Attempted to add item without required _id or restaurantId:", item);
            alert("Ürün bilgileri eksik (ID veya Restoran ID).");
            return;
        }
        // --- END DATA SAFETY CHECK ---
        
        
        // 2. Cross-restaurant validation
        if (cart.length > 0 && cart[0].restaurantId !== itemRestaurantId) {
            // Metin Çevirisi
            if (!window.confirm("Sepetinizde başka bir restorandan ürün var. Yeni siparişle değiştirmek ister misiniz?")) {
                return;
            }
            // User confirmed replacement: clear old cart and proceed
            setCart([{ 
                ...item, 
                _id: itemId, 
                restaurantId: itemRestaurantId, 
                price: itemPrice, 
                quantity: quantityToAdd 
            }]);
            return;
        }

        // 3. Update or Add item
        setCart(prevCart => {
            const existingItem = prevCart.find(cartItem => cartItem._id === itemId);
            
            if (existingItem) {
                // If exists, add the new quantity
                return prevCart.map(cartItem =>
                    cartItem._id === itemId
                        ? { ...cartItem, quantity: cartItem.quantity + quantityToAdd }
                        : cartItem
                );
            } else {
                // New item added
                return [...prevCart, { 
                    ...item, 
                    _id: itemId, 
                    restaurantId: itemRestaurantId, 
                    price: itemPrice, 
                    quantity: quantityToAdd 
                }];
            }
        });
    };
    // --- End Global Cart Logic ---


    const updateQuantity = (itemId, newQuantity) => {
        if (newQuantity <= 0) {
            setCart(prevCart => prevCart.filter(item => item._id !== itemId));
        } else {
            setCart(prevCart => prevCart.map(item =>
                item._id === itemId
                    ? { ...item, quantity: newQuantity }
                    : item
            ));
        }
    };
    
    const removeFromCart = (itemId) => {
        setCart(prevCart => prevCart.filter(item => item._id !== itemId));
    };


    // --- Global Checkout Logic (Updated to accept paymentMethod) ---
    const handleGlobalCheckout = async (paymentMethod) => { 
        
        // Metin Çevirisi
        if (!isAuthenticated || role !== 'customer') {
            alert("Sipariş vermek için lütfen müşteri olarak giriş yapın.");
            return;
        }
        
        // Log the selected payment method (as requested, since it's "fake")
        console.log("Selected Payment Method:", paymentMethod);
        // Alert the user about the payment method selection
        alert(`Ödeme Yöntemi Seçildi: ${paymentMethod === 'credit_card' ? 'Kredi Kartı' : 'Kapıda Ödeme'}. Sipariş işleniyor...`);


        if (cart.length === 0) return;

        const orderItems = cart.map(item => ({
            menuItemId: item._id, // Use the MongoDB ID
            quantity: item.quantity,
        }));
        
        // Use fullAddress, fallback to ilce/il
        let customerAddress = user.fullAddress || (user.ilce && user.il ? `${user.ilce}, ${user.il}` : undefined);
        // Metin Çevirisi
        if (!customerAddress) {
            alert("Sipariş vermeden önce lütfen müşteri profilinizi geçerli bir adresle güncelleyin.");
            return;
        }

        try {
            const orderData = {
                // All items belong to the same restaurant (due to cart logic)
                restaurantId: cart[0].restaurantId, 
                orderItems: orderItems,
                customerAddress: customerAddress,
                // OPTIONAL: Add paymentMethod to orderData if the backend supported it
            };

            const { data } = await axios.post('/api/orders', orderData);
            
            // Metin Çevirisi
            alert(`Sipariş başarıyla verildi! Toplam: ${data.totalAmount} TL. Durum: ${data.status}`);
            setCart([]); // Clear cart state
            localStorage.removeItem('a2_global_cart'); // Clear local storage cart
            setIsCartOpen(false); // Close modal
            // Use navigate function from hook
            navigate('/customer/orders'); 

        } catch (err) {
            // Metin Çevirisi
            alert(`Sipariş başarısız oldu: ${err.response?.data?.message || 'Bilinmeyen bir hata oluştu.'}`);
        }
    };


    return (
        <>
            <Navbar 
                onCartClick={() => setIsCartOpen(true)}
                cartItemCount={getTotalItems()}
            />
            <main className="min-h-[80vh] py-8 bg-secondary-light">
                <div className="container mx-auto px-4">
                    <Routes>
                        {/* Public Routes */}
                        <Route path="/" element={<Home />} />
                        
                        {/* Restaurant Detail must receive the global addToCart function */}
                        <Route 
                            path="/restaurant/:id" 
                            element={
                                <RestaurantDetail 
                                    globalAddToCart={addToCart}
                                    globalCartItems={cart}
                                />
                            } 
                        />
                        
                        {/* Auth Routes */}
                        <Route path="/customer/login" element={<CustomerLogin />} />
                        <Route path="/customer/register" element={<CustomerRegister />} />
                        <Route path="/restaurant/login" element={<RestaurantLogin />} />
                        <Route path="/restaurant/register" element={<RestaurantRegister />} />

                        {/* Customer Protected Routes */}
                        <Route 
                            path="/customer/dashboard" 
                            element={<ProtectedRoute element={<CustomerDashboard />} requiredRole="customer" />} 
                        />
                        <Route 
                            path="/customer/orders" 
                            element={<ProtectedRoute element={<CustomerOrders />} requiredRole="customer" />} 
                        />
                        
                        {/* Restaurant Protected Routes */}
                        <Route 
                            path="/restaurant/dashboard" 
                            element={<ProtectedRoute element={<RestaurantDashboard />} requiredRole="restaurant" />} 
                        />
                        <Route 
                            path="/restaurant/menu" 
                            element={<ProtectedRoute element={<MenuManagement />} requiredRole="restaurant" />} 
                        />

                        {/* Redirect logged-in users to their respective dashboards */}
                        {role === 'customer' && <Route path="/login" element={<Navigate to="/customer/dashboard" />} />}
                        {role === 'restaurant' && <Route path="/login" element={<Navigate to="/restaurant/dashboard" />} />}

                    </Routes>
                </div>
            </main>
            <Footer />
            
            {/* Global Cart Modal - Visible when Navbar cart button is clicked */}
            {isCartOpen && (
                <GlobalCartModal 
                    cart={cart}
                    updateQuantity={updateQuantity}
                    removeFromCart={removeFromCart}
                    handleCheckout={handleGlobalCheckout} // Now passes paymentMethod
                    onClose={() => setIsCartOpen(false)}
                />
            )}
        </>
    );
};

const App = () => (
    <Router>
        <AuthProvider>
            <AppContent />
        </AuthProvider>
    </Router>
);

export default App;