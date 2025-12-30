'use client'

import { useState, useRef, useCallback } from 'react'
import Image from 'next/image'

interface ImageCropModalProps {
  isOpen: boolean
  imageSrc: string
  onClose: () => void
  onCrop: (croppedImageBlob: Blob) => void
  aspectRatio?: number // 정사각형이면 1
}

export default function ImageCropModal({
  isOpen,
  imageSrc,
  onClose,
  onCrop,
  aspectRatio = 1,
}: ImageCropModalProps) {
  const [crop, setCrop] = useState({ x: 0, y: 0 })
  const [zoom, setZoom] = useState(1)
  const [imageSize, setImageSize] = useState({ width: 0, height: 0 })
  const [containerSize, setContainerSize] = useState({ width: 400, height: 400 })
  const imageRef = useRef<HTMLImageElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)
  const [isDragging, setIsDragging] = useState(false)
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 })

  const handleImageLoad = useCallback(() => {
    if (imageRef.current && containerRef.current) {
      const img = imageRef.current
      const container = containerRef.current
      
      const containerWidth = container.offsetWidth
      const containerHeight = container.offsetHeight
      
      // 이미지 비율 계산
      const imgAspect = img.naturalWidth / img.naturalHeight
      const containerAspect = containerWidth / containerHeight
      
      let displayWidth: number
      let displayHeight: number
      
      if (imgAspect > containerAspect) {
        // 이미지가 더 넓음 - 높이에 맞춤
        displayHeight = containerHeight
        displayWidth = displayHeight * imgAspect
      } else {
        // 이미지가 더 높음 - 너비에 맞춤
        displayWidth = containerWidth
        displayHeight = displayWidth / imgAspect
      }
      
      setImageSize({ width: displayWidth, height: displayHeight })
      
      // 초기 위치를 중앙으로
      const initialX = Math.max(0, (displayWidth - containerWidth) / 2)
      const initialY = Math.max(0, (displayHeight - containerHeight) / 2)
      setCrop({ x: initialX, y: initialY })
    }
  }, [])

  const handleMouseDown = (e: React.MouseEvent) => {
    setIsDragging(true)
    setDragStart({ x: e.clientX - crop.x, y: e.clientY - crop.y })
  }

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging || !imageRef.current || !containerRef.current) return
    
    const img = imageRef.current
    const container = containerRef.current
    
    const newX = e.clientX - dragStart.x
    const newY = e.clientY - dragStart.y
    
    // 경계 체크
    const maxX = Math.max(0, imageSize.width * zoom - container.offsetWidth)
    const maxY = Math.max(0, imageSize.height * zoom - container.offsetHeight)
    
    setCrop({
      x: Math.max(0, Math.min(maxX, newX)),
      y: Math.max(0, Math.min(maxY, newY)),
    })
  }

  const handleMouseUp = () => {
    setIsDragging(false)
  }

  const handleCrop = () => {
    if (!imageRef.current || !containerRef.current) return

    const canvas = document.createElement('canvas')
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const img = imageRef.current
    const container = containerRef.current
    
    // 최종 크기 (정사각형)
    const outputSize = 400
    canvas.width = outputSize
    canvas.height = outputSize

    // 원본 이미지에서 크롭할 영역 계산
    // 이미지가 확대/축소된 상태에서의 실제 크기
    const scaledWidth = imageSize.width * zoom
    const scaledHeight = imageSize.height * zoom
    
    // 원본 이미지 비율
    const scaleX = img.naturalWidth / imageSize.width
    const scaleY = img.naturalHeight / imageSize.height
    
    // 컨테이너 크기에 맞춰 크롭 영역 계산
    const cropWidth = Math.min(container.offsetWidth, scaledWidth)
    const cropHeight = Math.min(container.offsetHeight, scaledHeight)
    
    // 원본 이미지에서의 실제 좌표
    const sourceX = (crop.x / zoom) * scaleX
    const sourceY = (crop.y / zoom) * scaleY
    const sourceWidth = (cropWidth / zoom) * scaleX
    const sourceHeight = (cropHeight / zoom) * scaleY

    // 캔버스에 그리기
    ctx.drawImage(
      img,
      sourceX,
      sourceY,
      sourceWidth,
      sourceHeight,
      0,
      0,
      outputSize,
      outputSize
    )

    // Blob으로 변환
    canvas.toBlob((blob) => {
      if (blob) {
        onCrop(blob)
        onClose()
      }
    }, 'image/jpeg', 0.9)
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-75">
      <div className="bg-white rounded-lg p-6 max-w-2xl w-full mx-4">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold text-gray-900">이미지 크롭</h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 transition-colors"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div className="mb-4">
          <div
            ref={containerRef}
            className="relative w-full aspect-square bg-gray-100 overflow-hidden rounded-lg border-2 border-gray-300"
            style={{ maxWidth: '400px', maxHeight: '400px', margin: '0 auto' }}
            onMouseDown={handleMouseDown}
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUp}
            onMouseLeave={handleMouseUp}
          >
            <img
              ref={imageRef}
              src={imageSrc}
              alt="크롭할 이미지"
              className="object-contain"
              style={{
                position: 'absolute',
                top: 0,
                left: 0,
                width: `${imageSize.width * zoom}px`,
                height: `${imageSize.height * zoom}px`,
                transform: `translate(${-crop.x}px, ${-crop.y}px)`,
                cursor: isDragging ? 'grabbing' : 'grab',
              }}
              onLoad={handleImageLoad}
            />
          </div>
        </div>

        <div className="mb-4 space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              확대/축소: {Math.round(zoom * 100)}%
            </label>
            <input
              type="range"
              min="1"
              max="3"
              step="0.1"
              value={zoom}
              onChange={(e) => setZoom(parseFloat(e.target.value))}
              className="w-full"
            />
          </div>
        </div>

        <div className="flex justify-end space-x-3">
          <button
            onClick={onClose}
            className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
          >
            취소
          </button>
          <button
            onClick={handleCrop}
            className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-secondary transition-colors"
          >
            적용
          </button>
        </div>
      </div>
    </div>
  )
}
