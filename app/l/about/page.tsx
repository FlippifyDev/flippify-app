import Navbar from '../components/Navbar';
import Loading from '../components/Loading';


export default function About() {
  return (
    <div className="h-screen w-screen flex flex-col">
      <div className="fixed top-0 left-0 right-0 z-10">
          <Navbar />
      </div>
      <Loading />
    </div>
  );
}