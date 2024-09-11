import React from 'react';

interface ImageModalProps {
  imageUrl: string;
  onClose: () => void;
}

const ImageModal: React.FC<ImageModalProps> = ({ imageUrl, onClose }) => {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-75 flex justify-center items-center z-50">
      <div className="relative">
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-[-40px] right-[-40px] text-white text-3xl font-bold  bg-opacity-60 rounded-full p-2"
        >
          ✕
        </button>
        
        {/* Fullscreen image */}
        <img
          src={imageUrl}
          alt="Full View"
          className="max-h-[90vh] max-w-[90vw] object-contain"
        />
      </div>
    </div>
  );
};

export default ImageModal;
