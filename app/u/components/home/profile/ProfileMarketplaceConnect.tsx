import AmazonConnectButton from "./amazon/AmazonConnectButton";
import EbayConnectButton from "./ebay/EbayConnectButton";


// Component to handle eBay and Amazon account connections
const ProfileMarketplaceConnect = () => {
  return (
    <div className="card bg-white shadow-md rounded-lg p-6 mt-4 h-full flex flex-col justify-center items-center">
      <h2 className="text-2xl font-semibold text-gray-900 mb-4">Connect Your Accounts</h2>
      <p className="text-sm text-gray-600 mb-6 text-center">
        Connect your eBay and Amazon accounts to sync inventory, track sales, and automate your reselling business.
      </p>
      
      <div className="flex flex-col space-y-4 w-full items-center">
        {/* eBay Connect Button */}
        <EbayConnectButton />

        {/* Amazon Connect Button */}
        <AmazonConnectButton />
      </div>
    </div>
  );
};

export default ProfileMarketplaceConnect;
