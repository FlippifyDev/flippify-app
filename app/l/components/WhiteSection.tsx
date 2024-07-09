// WhiteSection.tsx
import React from "react";

interface Props {
  topPadding: {
    base: number;
    sm?: number;
    md?: number;
    lg?: number;
    xl?: number;
  };
}

const WhiteSection: React.FC<Props> = ({ topPadding }) => {
  return (
    <div className="absolute top-0 left-0 w-full z-10">
      <svg
        id="visual"
        viewBox="0 0 900 6000"
        width="900"
        height="6000"
        xmlns="http://www.w3.org/2000/svg"
        xmlnsXlink="http://www.w3.org/1999/xlink"
        version="1.1"
        className="w-full h-auto"
        style={{
          paddingTop: `${topPadding.base}px`,
          // Responsive padding based on screen size
          ...(topPadding.sm && { '@screen sm': { paddingTop: `${topPadding.sm}px` } }),
          ...(topPadding.md && { '@screen md': { paddingTop: `${topPadding.md}px` } }),
          ...(topPadding.lg && { '@screen lg': { paddingTop: `${topPadding.lg}px` } }),
          ...(topPadding.xl && { '@screen xl': { paddingTop: `${topPadding.xl}px` } }),
        }}
      >
        {/* SVG paths */}
        <path
          d="M0 333L21.5 326.7C43 320.3 86 307.7 128.8 320.7C171.7 333.7 214.3 372.3 257.2 376.3C300 380.3 343 349.7 385.8 318.2C428.7 286.7 471.3 254.3 514.2 257C557 259.7 600 297.3 642.8 313C685.7 328.7 728.3 322.3 771.2 308.8C814 295.3 857 274.7 878.5 264.3L900 254L900 601L878.5 601C857 601 814 601 771.2 601C728.3 601 685.7 601 642.8 601C600 601 557 601 514.2 601C471.3 601 428.7 601 385.8 601C343 601 300 601 257.2 601C214.3 601 171.7 601 128.8 601C86 601 43 601 21.5 601L0 601Z"
          fill="#eeeeee"
        ></path>
        <path
          d="M0 492L21.5 494C43 496 86 500 128.8 484.8C171.7 469.7 214.3 435.3 257.2 415.7C300 396 343 391 385.8 395.5C428.7 400 471.3 414 514.2 430.7C557 447.3 600 466.7 642.8 463.5C685.7 460.3 728.3 434.7 771.2 421.8C814 409 857 409 878.5 409L900 409L900 6000L878.5 6000C857 6000 814 6000 771.2 6000C728.3 6000 685.7 6000 642.8 6000C600 6000 557 6000 514.2 6000C471.3 6000 428.7 6000 385.8 6000C343 6000 300 6000 257.2 6000C214.3 6000 171.7 6000 128.8 6000C86 6000 43 6000 21.5 6000L0 6000Z"
          fill="#ffffff"
        ></path>
      </svg>
    </div>
  );
};

export default WhiteSection;
