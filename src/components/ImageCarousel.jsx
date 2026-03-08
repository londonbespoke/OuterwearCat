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
      <div className="aspect-square bg-surface-elevated flex items-center justify-center rounded-lg">
        <span className="text-text-muted">No image available</span>
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
        className="aspect-square bg-surface-elevated rounded-lg overflow-hidden cursor-zoom-in"
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
            className="absolute left-2 top-1/2 -translate-y-1/2 p-2 rounded-full shadow-lg bg-gold/90 hover:bg-gold transition-colors"
          >
            <ChevronLeft className="w-5 h-5 text-surface-base" />
          </button>
          <button
            onClick={goToNext}
            className="absolute right-2 top-1/2 -translate-y-1/2 p-2 rounded-full shadow-lg bg-gold/90 hover:bg-gold transition-colors"
          >
            <ChevronRight className="w-5 h-5 text-surface-base" />
          </button>

          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
            {allImages.map((_, idx) => (
              <button
                key={idx}
                onClick={() => setCurrentIndex(idx)}
                className={`w-2 h-2 rounded-full transition-colors ${
                  idx === currentIndex ? 'bg-gold' : 'bg-white/40 hover:bg-white/60'
                }`}
              />
            ))}
          </div>

          <div className="absolute top-4 right-4 bg-surface-base/70 backdrop-blur-sm text-gold text-sm px-3 py-1 rounded-full border border-gold/20">
            {currentIndex + 1} / {allImages.length}
          </div>
        </>
      )}
    </div>
  )
}
