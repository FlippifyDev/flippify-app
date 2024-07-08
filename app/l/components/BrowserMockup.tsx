import Image from "next/image";

const BrowserMockup = () => {
  return (
      <div className="mockup-browser bg-base-300">
        <div className="mockup-browser-toolbar">
          <div className="input">https://flippify.co.uk</div>
        </div>
        <div className="bg-base-200 flex justify-center px-4 py-1">
          <figure>
            <Image
              src="https://i.imgur.com/IcHL9wg.png"
              alt="Browser Mockup"
              width={960}
              height={540}
              loading="lazy"
            />
          </figure>
        </div>
      </div>
  );
};

export default BrowserMockup;
