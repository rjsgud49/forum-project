'use client'

import { useState, useRef } from 'react'
import { imageUploadApi } from '@/services/api'

// SVG 아이콘 컴포넌트
const ImageIcon = ({ className = 'w-4 h-4' }: { className?: string }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
  </svg>
)

const UploadIcon = ({ className = 'w-4 h-4' }: { className?: string }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
  </svg>
)

interface ImageInsertButtonProps {
  onImageInserted: (markdown: string) => void
  textareaRef?: React.RefObject<HTMLTextAreaElement>
}

export default function ImageInsertButton({ onImageInserted, textareaRef }: ImageInsertButtonProps) {
  const [uploading, setUploading] = useState(false)
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

    try {
      setUploading(true)
      const response = await imageUploadApi.uploadImage(file)
      
      if (response.success && response.data) {
        const imageUrl = response.data.url
        // 마크다운 형식으로 이미지 삽입
        const markdown = `![${response.data.originalFilename}](${imageUrl})`
        onImageInserted(markdown)
        
        // 텍스트 영역에 직접 삽입 (선택적)
        if (textareaRef?.current) {
          const textarea = textareaRef.current
          const start = textarea.selectionStart
          const end = textarea.selectionEnd
          const text = textarea.value
          const before = text.substring(0, start)
          const after = text.substring(end)
          const newText = before + markdown + after
          
          textarea.value = newText
          textarea.focus()
          textarea.setSelectionRange(start + markdown.length, start + markdown.length)
          
          // onChange 이벤트 트리거
          const event = new Event('input', { bubbles: true })
          textarea.dispatchEvent(event)
        }
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

  const handleClick = () => {
    fileInputRef.current?.click()
  }

  return (
    <>
      <button
        type="button"
        onClick={handleClick}
        disabled={uploading}
        className="flex items-center space-x-1 px-3 py-1.5 text-sm bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        title="이미지 삽입"
      >
        {uploading ? (
          <>
            <UploadIcon className="w-4 h-4 animate-spin" />
            <span>업로드 중...</span>
          </>
        ) : (
          <>
            <ImageIcon className="w-4 h-4" />
            <span>이미지</span>
          </>
        )}
      </button>
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleFileSelect}
        className="hidden"
      />
    </>
  )
}

