import { useState } from 'react'
import { ChevronLeft, ChevronRight } from 'lucide-react'

export function ImageCarousel({ images, coverImageUrl, onImageClick }) {
  const allImages = [
    coverImageUrl,
    ...(images || []).map(img => img.image_url)
  ].filter(Boolean).filter((url, idx, arr) => arr.indexOf(url) === idx) // dedupe

  const [currentIndex, setCurrentIndex] = useState(0)

  if (allImages.length === 0) {
    return (
      <div className="aspect-square bg-gray-100 flex items-center justify-center rounded-lg">
        <span className="text-gray-400">No image available</span>
      </div>
    )
  }

  const goToPrevious = () =>
    setCurrentIndex(prev => (prev === 0 ? allImages.length - 1 : prev - 1))

  const goToNext = () =>
    setCurrentIndex(prev => (prev === allImages.length - 1 ? 0 : prev + 1))

  return (
    <div className="relative">
      <div
        className="aspect-square bg-gray-100 rounded-lg overflow-hidden cursor-zoom-in"
        onClick={() => onImageClick?.(currentIndex)}
      >
        <img
          src={allImages[currentIndex]}
          alt={`Product image ${currentIndex + 1}`}
          className="w-full h-full object-cover"
        />
      </div>

      {allImages.length > 1 && (
        <>
          <button
            onClick={goToPrevious}
            className="absolute left-2 top-1/2 -translate-y-1/2 p-2 rounded-full shadow-lg"
            style={{ backgroundColor: '#14a3c7' }}
          >
            <ChevronLeft className="w-5 h-5 text-white" />
          </button>
          <button
            onClick={goToNext}
            className="absolute right-2 top-1/2 -translate-y-1/2 p-2 rounded-full shadow-lg"
            style={{ backgroundColor: '#14a3c7' }}
          >
            <ChevronRight className="w-5 h-5 text-white" />
          </button>

          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
            {allImages.map((_, idx) => (
              <button
                key={idx}
                onClick={() => setCurrentIndex(idx)}
                className={`w-2 h-2 rounded-full transition-colors ${
                  idx === currentIndex ? 'bg-white' : 'bg-white/50 hover:bg-white/75'
                }`}
              />
            ))}
          </div>

          <div className="absolute top-4 right-4 bg-black/60 text-white text-sm px-3 py-1 rounded-full">
            {currentIndex + 1} / {allImages.length}
          </div>
        </>
      )}
    </div>
  )
}
