import React from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import FeaturedProducts from '../components/FeaturedProducts';
import FloatingWhatsApp from '../components/FloatingWhatsApp';
import { useLanguage } from '../contexts/LanguageContext';

const Products = () => {
  const { t, dir } = useLanguage();
  
  return (
    <div className="min-h-screen bg-white" dir={dir}>
      <Navbar />
      
      <div className="py-12 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl font-bold text-navy mb-4">
              {t("products.title")}
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              {t("products.subtitle")}
            </p>
          </div>
        </div>
      </div>
      
      <FeaturedProducts />
      
      <Footer />
      <FloatingWhatsApp />
    </div>
  );
};

export default Products;