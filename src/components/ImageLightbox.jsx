import { useState, useEffect, useCallback } from 'react'
import { X, ChevronLeft, ChevronRight } from 'lucide-react'

export function ImageLightbox({ images, initialIndex = 0, onClose }) {
  const [currentIndex, setCurrentIndex] = useState(initialIndex)

  const goToPrevious = useCallback(() =>
    setCurrentIndex(prev => (prev === 0 ? images.length - 1 : prev - 1)), [images.length])

  const goToNext = useCallback(() =>
    setCurrentIndex(prev => (prev === images.length - 1 ? 0 : prev + 1)), [images.length])

  useEffect(() => {
    const handleKey = (e) => {
      if (e.key === 'Escape') onClose()
      if (e.key === 'ArrowLeft') goToPrevious()
      if (e.key === 'ArrowRight') goToNext()
    }
    document.addEventListener('keydown', handleKey)
    return () => document.removeEventListener('keydown', handleKey)
  }, [onClose, goToPrevious, goToNext])

  useEffect(() => {
    document.body.style.overflow = 'hidden'
    return () => { document.body.style.overflow = '' }
  }, [])

  if (!images?.length) return null

  return (
    <div
      className="fixed inset-0 z-[60] flex items-center justify-center bg-black/95"
      onClick={onClose}
    >
      <button
        onClick={onClose}
        className="absolute top-4 right-4 p-3 text-white/80 hover:text-white hover:bg-white/10 rounded-full transition-colors z-10"
      >
        <X className="w-8 h-8" />
      </button>

      {images.length > 1 && (
        <div className="absolute top-4 left-4 text-white/80 text-lg font-medium z-10">
          {currentIndex + 1} / {images.length}
        </div>
      )}

      <div
        className="max-w-[90vw] max-h-[90vh] flex items-center justify-center"
        onClick={e => e.stopPropagation()}
      >
        <img
          src={images[currentIndex]}
          alt={`Product image ${currentIndex + 1}`}
          className="max-w-full max-h-[90vh] object-contain"
        />
      </div>

      {images.length > 1 && (
        <>
          <button
            onClick={e => { e.stopPropagation(); goToPrevious() }}
            className="absolute left-4 top-1/2 -translate-y-1/2 p-3 rounded-full shadow-lg"
            style={{ backgroundColor: '#14a3c7' }}
          >
            <ChevronLeft className="w-10 h-10 text-white" />
          </button>
          <button
            onClick={e => { e.stopPropagation(); goToNext() }}
            className="absolute right-4 top-1/2 -translate-y-1/2 p-3 rounded-full shadow-lg"
            style={{ backgroundColor: '#14a3c7' }}
          >
            <ChevronRight className="w-10 h-10 text-white" />
          </button>

          <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-2">
            {images.map((_, idx) => (
              <button
                key={idx}
                onClick={e => { e.stopPropagation(); setCurrentIndex(idx) }}
                className={`w-3 h-3 rounded-full transition-colors ${
                  idx === currentIndex ? 'bg-white' : 'bg-white/40 hover:bg-white/60'
                }`}
              />
            ))}
          </div>
        </>
      )}
    </div>
  )
}
