
const TrustBadges = () => {
  return (
    <div className="bg-white py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-8">
          <h2 className="text-2xl font-bold text-gray-800">Trusted Payment Methods</h2>
          <p className="text-gray-600 mt-2">We accept various secure payment options</p>
        </div>
        
        <div className="flex flex-wrap justify-center items-center gap-6 md:gap-10">
          {/* Credit Cards */}
          <div className="flex flex-col items-center">
            <div className="h-12 w-20 bg-blue-600 rounded-md flex items-center justify-center text-white font-bold">
              VISA
            </div>
            <span className="text-xs mt-1 text-gray-500">Visa</span>
          </div>
          
          <div className="flex flex-col items-center">
            <div className="h-12 w-20 bg-red-600 rounded-md flex items-center justify-center text-white font-bold">
              MC
            </div>
            <span className="text-xs mt-1 text-gray-500">MasterCard</span>
          </div>
          
          {/* Local Payment Methods */}
          <div className="flex flex-col items-center">
            <div className="h-12 w-20 bg-orange-500 rounded-md flex items-center justify-center text-white text-xs font-bold">
              CIH PAY
            </div>
            <span className="text-xs mt-1 text-gray-500">CIH Pay</span>
          </div>
          
          <div className="flex flex-col items-center">
            <div className="h-12 w-20 bg-blue-800 rounded-md flex items-center justify-center text-white text-xs font-bold">
              CMI
            </div>
            <span className="text-xs mt-1 text-gray-500">CMI</span>
          </div>
          
          {/* Mobile Payment */}
          <div className="flex flex-col items-center">
            <div className="h-12 w-20 bg-green-500 rounded-md flex items-center justify-center text-white text-xs font-bold">
              M-WALLET
            </div>
            <span className="text-xs mt-1 text-gray-500">M-Wallet</span>
          </div>
          
          {/* Bank Transfer */}
          <div className="flex flex-col items-center">
            <div className="h-12 w-20 bg-gray-700 rounded-md flex items-center justify-center text-white text-xs font-bold">
              TRANSFER
            </div>
            <span className="text-xs mt-1 text-gray-500">Bank Transfer</span>
          </div>
        </div>
        
        <div className="mt-10 flex flex-wrap justify-center gap-8">
          <div className="flex items-center gap-2">
            <svg className="w-6 h-6 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
            </svg>
            <span className="text-sm text-gray-600">Secure Payments</span>
          </div>
          
          <div className="flex items-center gap-2">
            <svg className="w-6 h-6 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
            <span className="text-sm text-gray-600">Instant Delivery</span>
          </div>
          
          <div className="flex items-center gap-2">
            <svg className="w-6 h-6 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
            </svg>
            <span className="text-sm text-gray-600">24/7 Customer Support</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TrustBadges;
