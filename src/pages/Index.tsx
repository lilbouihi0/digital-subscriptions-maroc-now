
import Navbar from '../components/Navbar';
import HeroSection from '../components/HeroSection';
import FeaturedProducts from '../components/FeaturedProducts';
import ReviewCard from '../components/ReviewCard';
import TrustBadges from '../components/TrustBadges';
import FloatingWhatsApp from '../components/FloatingWhatsApp';
import Footer from '../components/Footer';

const Index = () => {
  const reviews = [
    {
      name: "Mohammed A.",
      date: "May 5, 2025",
      rating: 5,
      text: "Extremely fast delivery, received my Netflix account within minutes after payment. Great service!",
      productBought: "Netflix Premium"
    },
    {
      name: "Fatima L.",
      date: "May 3, 2025",
      rating: 5,
      text: "I was skeptical at first, but the customer service was excellent and the Spotify account works perfectly.",
      productBought: "Spotify Premium"
    },
    {
      name: "Ahmed K.",
      date: "April 29, 2025",
      rating: 4,
      text: "Very good value for money. The Amazon Prime subscription is working great for months now.",
      productBought: "Amazon Prime"
    },
    {
      name: "Yasmine B.",
      date: "April 25, 2025",
      rating: 5,
      text: "Fast response on WhatsApp and clear instructions. Will buy again from this site!",
      productBought: "Shahid VIP"
    }
  ];

  return (
    <div className="min-h-screen bg-white">
      <Navbar />
      <HeroSection />
      <FeaturedProducts />
      
      {/* Customer Reviews Section */}
      <div className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold font-heading text-navy mb-4">
              What Our Customers Say
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Don't just take our word for it. Check out what our satisfied customers have to say.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {reviews.map((review, index) => (
              <ReviewCard
                key={index}
                name={review.name}
                date={review.date}
                rating={review.rating}
                text={review.text}
                productBought={review.productBought}
              />
            ))}
          </div>
        </div>
      </div>
      
      {/* FAQ Section */}
      <div id="faq" className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold font-heading text-navy mb-4">
              Frequently Asked Questions
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Find answers to common questions about our services and products.
            </p>
          </div>
          
          <div className="max-w-3xl mx-auto divide-y divide-gray-200">
            {[
              {
                q: "How does the delivery process work?",
                a: "After completing your payment, you'll receive your account credentials via WhatsApp within 5-10 minutes. We'll provide clear instructions on how to access and use your subscription."
              },
              {
                q: "Are these accounts shared or private?",
                a: "These are shared accounts but configured in a way that ensures your profile remains separate from others. Each user gets their own profile, watchlist, and recommendations."
              },
              {
                q: "How long will my subscription last?",
                a: "The duration depends on the package you purchase. We offer monthly, quarterly, and annual subscription options. The subscription period is clearly indicated on each product."
              },
              {
                q: "What payment methods do you accept?",
                a: "We accept credit/debit cards, bank transfers, and mobile payment options common in Morocco like CIH Pay, CMI, and M-Wallet."
              },
              {
                q: "What if I encounter issues with my account?",
                a: "Our customer support team is available 24/7 via WhatsApp. Simply message us, and we'll resolve your issue or provide a replacement account if necessary."
              }
            ].map((faq, index) => (
              <div key={index} className="py-5">
                <div className="flex justify-between items-start">
                  <h3 className="text-lg font-semibold text-navy">{faq.q}</h3>
                </div>
                <p className="mt-3 text-gray-600">{faq.a}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
      
      <TrustBadges />
      <Footer />
      <FloatingWhatsApp />
    </div>
  );
};

export default Index;
