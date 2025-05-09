
import { useState } from "react";
import ProductCard from "./ProductCard";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useLanguage } from "@/contexts/LanguageContext";
import { DurationOption } from "./DurationDialog";

const FeaturedProducts = () => {
  const [selectedTab, setSelectedTab] = useState("all");
  const { t, dir } = useLanguage();
  
  const productDurations: Record<string, DurationOption[]> = {
    "Netflix": [
      { duration: "1 Month", price: 89 },
      { duration: "3 Months", price: 120 },
      { duration: "6 Months", price: 200 },
      { duration: "12 Months", price: 300 }
    ],
    "Spotify Premium": [
      { duration: "1 Month", price: 49 },
      { duration: "3 Months", price: 60 },
      { duration: "6 Months", price: 100 },
      { duration: "12 Months", price: 200 }
    ],
    "Amazon Prime": [
      { duration: "1 Month", price: 79 },
      { duration: "3 Months", price: 60 },
      { duration: "6 Months", price: 100 },
      { duration: "12 Months", price: 150 }
    ],
    "Shahid VIP": [
      { duration: "1 Month", price: 69 },
      { duration: "3 Months", price: 80 },
      { duration: "6 Months", price: 150 },
      { duration: "12 Months", price: 200 }
    ],
    "Shahid VIP Sport": [
      { duration: "1 Month", price: 99 },
      { duration: "3 Months", price: 120 },
      { duration: "6 Months", price: 200 },
      { duration: "12 Months", price: 300 }
    ]
  };
  
  const products = [
    {
      id: 1,
      name: "Netflix",
      logo: "https://upload.wikimedia.org/wikipedia/commons/7/7a/Logonetflix.png",
      price: 89,
      oldPrice: 129,
      duration: "1 Month",
      category: "streaming",
      bgColor: "bg-black"
    },
    {
      id: 2,
      name: "Spotify Premium",
      logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/2/26/Spotify_logo_with_text.svg/1200px-Spotify_logo_with_text.svg.png",
      price: 49,
      duration: "1 Month",
      category: "music",
      bgColor: "bg-black"
    },
    {
      id: 3,
      name: "Amazon Prime",
      logo: "https://m.media-amazon.com/images/G/01/digital/video/acquisition/logo/pv_logo_white._CB548637580_.png",
      price: 79,
      oldPrice: 99,
      duration: "1 Month",
      category: "streaming",
      bgColor: "bg-[#00A8E1]"
    },
    {
      id: 4,
      name: "Shahid VIP",
      logo: "https://upload.wikimedia.org/wikipedia/commons/1/1e/Mbc_Shahid_logo.svg",
      price: 69,
      duration: "1 Month",
      category: "streaming",
      bgColor: "bg-[#7C3AED]"
    },
    {
      id: 5,
      name: "Shahid VIP Sport",
      logo: "https://upload.wikimedia.org/wikipedia/commons/1/1e/Mbc_Shahid_logo.svg",
      price: 99,
      duration: "1 Month",
      category: "streaming",
      bgColor: "bg-[#10B981]"
    }
  ];
  
  const filteredProducts = selectedTab === "all" 
    ? products 
    : products.filter(product => product.category === selectedTab);

  return (
    <div id="products" className="py-16 bg-gray-50" dir={dir}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold font-heading text-navy mb-4">
            {t("products.title")}
          </h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            {t("products.subtitle")}
          </p>
        </div>
        
        <Tabs defaultValue="all" className="w-full" value={selectedTab} onValueChange={setSelectedTab}>
          <div className="flex justify-center mb-8">
            <TabsList className="bg-gray-200 p-1">
              <TabsTrigger value="all" className="px-6 py-2 data-[state=active]:bg-white rounded-md">
                {t("products.all")}
              </TabsTrigger>
              <TabsTrigger value="streaming" className="px-6 py-2 data-[state=active]:bg-white rounded-md">
                {t("products.streaming")}
              </TabsTrigger>
              <TabsTrigger value="music" className="px-6 py-2 data-[state=active]:bg-white rounded-md">
                {t("products.music")}
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
                  durationOptions={productDurations[product.name]}
                  category={product.category}
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
                  durationOptions={productDurations[product.name]}
                  category={product.category}
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
                  durationOptions={productDurations[product.name]}
                  category={product.category}
                />
              ))}
            </div>
          </TabsContent>
        </Tabs>
        
        <div className="mt-12 text-center">
          <Button variant="outline" className="border-teal text-teal hover:bg-teal hover:text-white">
            {t("products.viewAll")}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default FeaturedProducts;
