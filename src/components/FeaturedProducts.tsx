
import { useState } from "react";
import ProductCard from "./ProductCard";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const FeaturedProducts = () => {
  const [selectedTab, setSelectedTab] = useState("all");
  
  const products = [
    {
      id: 1,
      name: "Netflix",
      logo: "https://upload.wikimedia.org/wikipedia/commons/7/7a/Logonetflix.png",
      price: 89,
      oldPrice: 129,
      duration: "1 Month",
      category: "streaming",
      bgColor: "bg-red-600"
    },
    {
      id: 2,
      name: "Spotify Premium",
      logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/1/19/Spotify_logo_without_text.svg/1024px-Spotify_logo_without_text.svg.png",
      price: 49,
      duration: "1 Month",
      category: "music",
      bgColor: "bg-green-600"
    },
    {
      id: 3,
      name: "Amazon Prime",
      logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/e/e3/Amazon_Prime_Logo.svg/2560px-Amazon_Prime_Logo.svg.png",
      price: 79,
      oldPrice: 99,
      duration: "1 Month",
      category: "streaming",
      bgColor: "bg-blue-700"
    },
    {
      id: 4,
      name: "Shahid VIP",
      logo: "https://upload.wikimedia.org/wikipedia/commons/3/3b/Shahid_logo.png",
      price: 69,
      duration: "1 Month",
      category: "streaming",
      bgColor: "bg-purple-600"
    },
    {
      id: 5,
      name: "Disney+",
      logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/3/3e/Disney%2B_logo.svg/2560px-Disney%2B_logo.svg.png",
      price: 79,
      duration: "1 Month",
      category: "streaming",
      bgColor: "bg-blue-900"
    },
    {
      id: 6,
      name: "YouTube Premium",
      logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/0/09/YouTube_full-color_icon_%282017%29.svg/2560px-YouTube_full-color_icon_%282017%29.svg.png",
      price: 59,
      duration: "1 Month",
      category: "streaming",
      bgColor: "bg-red-500"
    },
    {
      id: 7,
      name: "Apple Music",
      logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/2/22/Apple_Music_logo.svg/2560px-Apple_Music_logo.svg.png",
      price: 49,
      duration: "1 Month",
      category: "music",
      bgColor: "bg-gradient-to-r from-pink-500 to-purple-500"
    },
    {
      id: 8,
      name: "OSN+",
      logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/e/e0/OSN%2B_logo.svg/2560px-OSN%2B_logo.svg.png",
      price: 75,
      duration: "1 Month",
      category: "streaming",
      bgColor: "bg-sky-600"
    },
  ];
  
  const filteredProducts = selectedTab === "all" 
    ? products 
    : products.filter(product => product.category === selectedTab);

  return (
    <div id="products" className="py-16 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold font-heading text-navy mb-4">
            Featured Subscriptions
          </h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Choose from our selection of premium digital subscriptions with instant delivery via WhatsApp.
          </p>
        </div>
        
        <Tabs defaultValue="all" className="w-full" value={selectedTab} onValueChange={setSelectedTab}>
          <div className="flex justify-center mb-8">
            <TabsList className="bg-gray-200 p-1">
              <TabsTrigger value="all" className="px-6 py-2 data-[state=active]:bg-white rounded-md">
                All
              </TabsTrigger>
              <TabsTrigger value="streaming" className="px-6 py-2 data-[state=active]:bg-white rounded-md">
                Streaming
              </TabsTrigger>
              <TabsTrigger value="music" className="px-6 py-2 data-[state=active]:bg-white rounded-md">
                Music
              </TabsTrigger>
            </TabsList>
          </div>
          
          <TabsContent value="all" className="mt-0">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {filteredProducts.map((product) => (
                <ProductCard
                  key={product.id}
                  name={product.name}
                  logo={product.logo}
                  price={product.price}
                  oldPrice={product.oldPrice}
                  duration={product.duration}
                  bgColor={product.bgColor}
                />
              ))}
            </div>
          </TabsContent>
          
          <TabsContent value="streaming" className="mt-0">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {filteredProducts.map((product) => (
                <ProductCard
                  key={product.id}
                  name={product.name}
                  logo={product.logo}
                  price={product.price}
                  oldPrice={product.oldPrice}
                  duration={product.duration}
                  bgColor={product.bgColor}
                />
              ))}
            </div>
          </TabsContent>
          
          <TabsContent value="music" className="mt-0">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {filteredProducts.map((product) => (
                <ProductCard
                  key={product.id}
                  name={product.name}
                  logo={product.logo}
                  price={product.price}
                  oldPrice={product.oldPrice}
                  duration={product.duration}
                  bgColor={product.bgColor}
                />
              ))}
            </div>
          </TabsContent>
        </Tabs>
        
        <div className="mt-12 text-center">
          <Button variant="outline" className="border-teal text-teal hover:bg-teal hover:text-white">
            View All Products
          </Button>
        </div>
      </div>
    </div>
  );
};

export default FeaturedProducts;
