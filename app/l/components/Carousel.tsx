import React from "react";
import Image from "next/image";

const Carousel = () => {
  return (
    <div className="carousel carousel-end rounded-box">
      <div className="carousel-item">
        <Image
          src="https://img.daisyui.com/images/stock/photo-1559703248-dcaaec9fab78.jpg"
          alt="Drink"
          width={500}
          height={500}
        />
      </div>
      <div className="carousel-item">
        <Image
          src="https://img.daisyui.com/images/stock/photo-1565098772267-60af42b81ef2.jpg"
          alt="Drink"
          width={500}
          height={500}
        />
      </div>
      <div className="carousel-item">
        <Image
          src="https://img.daisyui.com/images/stock/photo-1572635148818-ef6fd45eb394.jpg"
          alt="Drink"
          width={500}
          height={500}
        />
      </div>
    </div>
  );
};

export default Carousel;
