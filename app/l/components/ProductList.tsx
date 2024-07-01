import ViewPrices from "./ViewPrices";
import Image from "next/image";

const ProductList: React.FC = () => {
    return (
        <div className="h-56 grid grid-cols-2 gap-10 px-10 py-10 content-stretch">
            <div className="card bg-base-100 image-full shadow-xl">
                <figure>
                    <Image
                    src="https://cdn.leonardo.ai/users/a47d5e66-3419-4c70-8651-b3e13a1a92ff/generations/6a422faf-65dd-424c-a0d4-7d2af4659275/Default_A_vibrant_masterpiece_of_a_rough_color_pencil_sketch_o_2.jpg"
                    alt="Lego Retirement Deals" />
                </figure>
                <div className="card-body">
                    <h2 className="card-title text-white">Lego Retirement Bot</h2>
                    <p className="flex justify-center text-greyText">Monitors soon-to-retire lego sets across a range websites. <br/>Using this bot, gain access to high-value deals you would otherwise spend hours searching for, in seconds. 
                        These specific lego sets are on our radar as they are confirmed to be retiring shortly and are well-known to skyrocket in value not long after being taken off the shelves.
                        <br/><br/>Currently Supporting: 
                        <br/>• Amazon
                        <br/>• John Lewis
                        <br/>• Toys R' Us
                        <br/>• Ebay
                        <br/>• Kerrisontoys
                        <br/>• Zavvi
                        <br/>• Argos
                        <br/>• Fenwick
                        <br/>• Hamleys
                    </p> 
                    <ViewPrices/>
                </div>
            </div>  
            <div className="card bg-base-100 image-full shadow-xl">
                <figure>
                    <Image
                    src="https://i.imgur.com/lok7Wcq.png"
                    alt="Shoes" />
                </figure>
                <div className="card-body">
                    <h2 className="card-title flex justify-center text-white">Coming Soon...</h2>
                    <p className="flex justify-center">Many more deals coming your way shortly.</p> 
                </div>
            </div>
        </div>
    );
}


export default ProductList;