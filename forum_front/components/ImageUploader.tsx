'use client'

import { useState, useRef } from 'react'
import { imageUploadApi } from '@/services/api'

// SVG 아이콘 컴포넌트
const UploadIcon = ({ className = 'w-4 h-4' }: { className?: string }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
  </svg>
)

const XIcon = ({ className = 'w-4 h-4' }: { className?: string }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
  </svg>
)

interface ImageUploaderProps {
  onImageUploaded: (url: string) => void
  maxImages?: number
  className?: string
}

export default function ImageUploader({ onImageUploaded, maxImages = 10, className = '' }: ImageUploaderProps) {
  const [uploading, setUploading] = useState(false)
  const [uploadedImages, setUploadedImages] = useState<string[]>([])
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    // 이미지 파일 검증
    if (!file.type.startsWith('image/')) {
      alert('이미지 파일만 업로드 가능합니다.')
      return
    }

    // 파일 크기 검증 (10MB)
    if (file.size > 10 * 1024 * 1024) {
      alert('파일 크기는 10MB 이하여야 합니다.')
      return
    }

    // 최대 개수 검증
    if (uploadedImages.length >= maxImages) {
      alert(`최대 ${maxImages}개의 이미지만 업로드 가능합니다.`)
      return
    }

    try {
      setUploading(true)
      const response = await imageUploadApi.uploadImage(file)
      
      if (response.success && response.data) {
        const imageUrl = response.data.url
        setUploadedImages((prev) => [...prev, imageUrl])
        onImageUploaded(imageUrl)
      }
    } catch (error: any) {
      alert(error.response?.data?.message || '이미지 업로드에 실패했습니다.')
      console.error('이미지 업로드 실패:', error)
    } finally {
      setUploading(false)
      // 파일 입력 초기화
      if (fileInputRef.current) {
        fileInputRef.current.value = ''
      }
    }
  }

  const handleRemoveImage = (index: number) => {
    setUploadedImages((prev) => prev.filter((_, i) => i !== index))
  }

  const handleClick = () => {
    fileInputRef.current?.click()
  }

  return (
    <div className={className}>
      <div className="flex items-center space-x-2 mb-2">
        <button
          type="button"
          onClick={handleClick}
          disabled={uploading || uploadedImages.length >= maxImages}
          className="flex items-center space-x-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <UploadIcon />
          <span>{uploading ? '업로드 중...' : '이미지 업로드'}</span>
        </button>
        <span className="text-sm text-gray-500">
          ({uploadedImages.length}/{maxImages})
        </span>
      </div>

      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleFileSelect}
        className="hidden"
      />

      {/* 업로드된 이미지 미리보기 */}
      {uploadedImages.length > 0 && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-4">
          {uploadedImages.map((url, index) => (
            <div key={index} className="relative group">
              <img
                src={url}
                alt={`Uploaded ${index + 1}`}
                className="w-full h-32 object-cover rounded-lg border border-gray-200"
              />
              <button
                type="button"
                onClick={() => handleRemoveImage(index)}
                className="absolute top-2 right-2 p-1 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
              >
                <XIcon />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

