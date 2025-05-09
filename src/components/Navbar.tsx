
import { useState } from "react";
import { Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);

  return (
    <nav className="bg-white sticky top-0 z-50 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <a href="/" className="flex-shrink-0 flex items-center">
              <span className="text-navy font-heading font-bold text-2xl">DigiSubs</span>
            </a>
          </div>
          
          {/* Desktop Nav */}
          <div className="hidden md:flex items-center space-x-8">
            <a href="/" className="nav-link font-medium">Home</a>
            <a href="#products" className="nav-link font-medium">Products</a>
            <a href="#faq" className="nav-link font-medium">FAQ</a>
            <a href="#contact" className="nav-link font-medium">Contact</a>
            
            {/* Language switcher */}
            <div className="relative ml-4">
              <select 
                className="appearance-none bg-transparent border border-gray-300 rounded-md pl-3 pr-8 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-teal"
              >
                <option value="en">English</option>
                <option value="ar">العربية</option>
                <option value="fr">Français</option>
              </select>
              <div className="absolute right-3 top-1/2 transform -translate-y-1/2 pointer-events-none">
                <svg className="h-4 w-4 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </div>
            </div>
          </div>
          
          {/* Mobile menu button */}
          <div className="md:hidden flex items-center">
            <Button
              variant="ghost"
              size="icon"
              onClick={toggleMenu}
              aria-label="Toggle menu"
            >
              {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </Button>
          </div>
        </div>
      </div>
      
      {/* Mobile menu */}
      {isMenuOpen && (
        <div className="md:hidden bg-white pb-4 px-4 animate-fade-in">
          <div className="flex flex-col space-y-4 pt-2 pb-3">
            <a 
              href="/" 
              className="block px-3 py-2 text-base font-medium text-gray-700 hover:bg-gray-100 hover:text-teal rounded-md"
              onClick={toggleMenu}
            >
              Home
            </a>
            <a 
              href="#products" 
              className="block px-3 py-2 text-base font-medium text-gray-700 hover:bg-gray-100 hover:text-teal rounded-md"
              onClick={toggleMenu}
            >
              Products
            </a>
            <a 
              href="#faq" 
              className="block px-3 py-2 text-base font-medium text-gray-700 hover:bg-gray-100 hover:text-teal rounded-md"
              onClick={toggleMenu}
            >
              FAQ
            </a>
            <a 
              href="#contact" 
              className="block px-3 py-2 text-base font-medium text-gray-700 hover:bg-gray-100 hover:text-teal rounded-md"
              onClick={toggleMenu}
            >
              Contact
            </a>
            <div className="px-3 py-2">
              <label htmlFor="mobile-language" className="block text-sm font-medium text-gray-700">Language</label>
              <select 
                id="mobile-language"
                className="mt-1 block w-full rounded-md border-gray-300 py-2 pl-3 pr-10 text-base focus:border-teal focus:outline-none focus:ring-teal border"
              >
                <option value="en">English</option>
                <option value="ar">العربية</option>
                <option value="fr">Français</option>
              </select>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
