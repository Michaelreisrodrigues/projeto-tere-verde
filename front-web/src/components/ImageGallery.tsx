import React, { useState } from 'react';
import { ChevronLeft, ChevronRight, X, Trees, Map } from 'lucide-react';

interface ImageGalleryProps {
  imagens: string[];
  nome: string;
  type: 'parque' | 'trilha';
  className?: string;
}

const ImageGallery: React.FC<ImageGalleryProps> = ({ imagens, nome, type, className = '' }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFullscreen, setIsFullscreen] = useState(false);

  const hasImages = imagens && imagens.length > 0;

  const nextImage = (e?: React.MouseEvent) => {
    e?.stopPropagation();
    if (hasImages) {
      setCurrentIndex((prev) => (prev + 1) % imagens.length);
    }
  };

  const prevImage = (e?: React.MouseEvent) => {
    e?.stopPropagation();
    if (hasImages) {
      setCurrentIndex((prev) => (prev - 1 + imagens.length) % imagens.length);
    }
  };

  const openFullscreen = () => {
    if (hasImages) {
      setIsFullscreen(true);
    }
  };

  const closeFullscreen = () => {
    setIsFullscreen(false);
  };

  const Icon = type === 'parque' ? Trees : Map;

  if (!hasImages) {
    return (
      <div className={`relative h-48 bg-gradient-to-br ${type === 'parque' ? 'from-emerald-400 to-emerald-600' : 'from-blue-400 to-blue-600'} flex items-center justify-center ${className}`}>
        <Icon className="w-20 h-20 text-white/60" />
      </div>
    );
  }

  return (
    <>
      {/* Mini Gallery */}
      <div className={`relative h-48 overflow-hidden ${className}`}>
        <img
          src={imagens[currentIndex]}
          alt={`${nome} - Imagem ${currentIndex + 1}`}
          className="w-full h-full object-cover cursor-pointer hover:scale-105 transition-transform duration-300"
          onClick={openFullscreen}
        />

        {/* Navigation Arrows */}
        {imagens.length > 1 && (
          <>
            <button
              onClick={prevImage}
              className="absolute left-2 top-1/2 transform -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white p-2 rounded-full transition-colors z-10"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <button
              onClick={nextImage}
              className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white p-2 rounded-full transition-colors z-10"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </>
        )}

        {/* Image Counter */}
        {imagens.length > 1 && (
          <div className="absolute bottom-2 right-2 bg-black/60 text-white text-xs px-2 py-1 rounded-full">
            {currentIndex + 1} / {imagens.length}
          </div>
        )}

        {/* Thumbnail Strip */}
        {imagens.length > 1 && (
          <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 to-transparent p-2">
            <div className="flex justify-center gap-1">
              {imagens.map((_, index) => (
                <button
                  key={index}
                  onClick={(e) => {
                    e.stopPropagation();
                    setCurrentIndex(index);
                  }}
                  className={`w-2 h-2 rounded-full transition-colors ${
                    index === currentIndex ? 'bg-white' : 'bg-white/50'
                  }`}
                />
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Fullscreen Modal */}
      {isFullscreen && (
        <div 
          className="fixed inset-0 bg-black/95 z-50 flex items-center justify-center"
          onClick={closeFullscreen}
        >
          {/* Close Button */}
          <button
            onClick={closeFullscreen}
            className="absolute top-4 right-4 bg-white/10 hover:bg-white/20 text-white p-2 rounded-full transition-colors z-50"
          >
            <X className="w-6 h-6" />
          </button>

          {/* Navigation */}
          {imagens.length > 1 && (
            <>
              <button
                onClick={prevImage}
                className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-white/10 hover:bg-white/20 text-white p-3 rounded-full transition-colors z-50"
              >
                <ChevronLeft className="w-8 h-8" />
              </button>
              <button
                onClick={nextImage}
                className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-white/10 hover:bg-white/20 text-white p-3 rounded-full transition-colors z-50"
              >
                <ChevronRight className="w-8 h-8" />
              </button>
            </>
          )}

          {/* Image */}
          <img
            src={imagens[currentIndex]}
            alt={`${nome} - Imagem ${currentIndex + 1}`}
            className="max-w-full max-h-full object-contain"
            onClick={(e) => e.stopPropagation()}
          />

          {/* Info */}
          <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 text-white text-center">
            <p className="font-medium">{nome}</p>
            <p className="text-sm text-white/70">
              {currentIndex + 1} de {imagens.length}
            </p>
          </div>

          {/* Thumbnails */}
          {imagens.length > 1 && (
            <div className="absolute bottom-20 left-1/2 transform -translate-x-1/2 flex gap-2">
              {imagens.map((img, index) => (
                <button
                  key={index}
                  onClick={(e) => {
                    e.stopPropagation();
                    setCurrentIndex(index);
                  }}
                  className={`w-16 h-16 rounded-lg overflow-hidden border-2 transition-all ${
                    index === currentIndex ? 'border-white scale-110' : 'border-transparent opacity-60'
                  }`}
                >
                  <img src={img} alt="" className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          )}
        </div>
      )}
    </>
  );
};

export default ImageGallery;
