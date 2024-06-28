import Navbar from '../components/Navbar';
import ProductsList from '../components/ProductList';

export default function Products() {
  return (
    <div className="h-screen w-screen flex flex-col">
    <div className="fixed top-0 left-0 right-0 z-10">
        <Navbar />
    </div>
    <div className="mt-16 flex-1 overflow-y-auto">
        <ProductsList />
    </div>
</div>
  );
}