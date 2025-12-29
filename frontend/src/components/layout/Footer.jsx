// src/components/layout/Footer.jsx
import React from 'react';

const Footer = () => {
  return (
    <footer className="bg-primary-dark text-white py-6">
      <div className="container mx-auto px-4 text-center">
        {/* Telif hakkı çevirisi */}
        <p>&copy; {new Date().getFullYear()} Yemeksepeti. Tüm hakları saklıdır.</p>
        {/* Metin çevirisi */}
        <p className="text-sm text-gray-400 mt-1">React, Node ve Orange ile geliştirilmiştir.</p>
      </div>
    </footer>
  );
};

export default Footer;