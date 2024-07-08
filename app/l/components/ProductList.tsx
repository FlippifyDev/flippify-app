import ProductCard from "./ProductCard";
import ComingSoonProductCard from "./ComingSoonProductCard"


const ProductList: React.FC = () => {
    const legoRetirementWebsites = ["Amazon", "John Lewis", "eBay", "Hamleys", "Zavvi", "More soon..."]
    return (
        <div className="flex flex-wrap justify-center mt-10 mb-10 md:px-10">
            <ProductCard 
                title="Lego Retirement Deals" 
                description="Monitors soon-to-retire lego sets across a range websites. Using this bot, gain access to high-value deals you would otherwise spend hours searching for, in seconds. These specific lego sets are on our radar as they are confirmed to be retiring shortly and are well-known to skyrocket in value not long after being taken off the shelves." 
                image="https://i.imgur.com/lOcRZPP.jpeg"
                websites={legoRetirementWebsites}
            />
            <ComingSoonProductCard 
                title="Coming Soon..." 
                description="Many more bots coming your way shortly." 
                image="https://i.imgur.com/lok7Wcq.png"
            />
        </div>
    );
}


export default ProductList;