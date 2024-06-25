import BuyNow from "./BuyNow";

const ProductList: React.FC = () => {
    return (
        <div className="flex justify-center space-x-10 mt-10">
            <div className="card card-compact w-80 bg-base-100 shadow-xl">
                <figure><img src="https://img.daisyui.com/images/stock/photo-1606107557195-0e29a4b5b4aa.jpg" alt="Shoes" /></figure>
                <div className="card-body">
                    <h2 className="card-title">Sneaker Deals</h2>
                    <p>If a dog chews shoes whose shoes does he choose?</p>
                    <div className="card-actions justify-end">
                        <BuyNow redirectURL="/l/login"/>
                    </div>
                </div>
            </div>

            <div className="card card-compact w-80 bg-base-100 shadow-xl">
                <figure><img src="https://images-na.ssl-images-amazon.com/images/I/91K5JOBomKL._SL1500_.jpg" alt="Shoes" /></figure>
                <div className="card-body">
                    <h2 className="card-title">Lego Retirement Sales</h2>
                    <p>Monitor soon to retire lego sets across multiple websites.</p>
                    <div className="card-actions justify-end">
                        <BuyNow redirectURL="/l/login"/>
                    </div>
                </div>
            </div>
        </div>
    );
}


export default ProductList;