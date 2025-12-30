'use client'

import { useEffect, useState, useRef } from 'react'
import { useRouter } from 'next/navigation'
import { useSelector } from 'react-redux'
import type { RootState } from '@/store/store'
import { authApi, imageUploadApi } from '@/services/api'
import type { User, UpdateProfile, ChangePassword } from '@/types/api'
import Header from '@/components/Header'
import LoginModal from '@/components/LoginModal'
import ImageCropModal from '@/components/ImageCropModal'
import Image from 'next/image'

export default function SettingsPage() {
  const router = useRouter()
  const isAuthenticated = useSelector((state: RootState) => state.auth.isAuthenticated)
  const [showLoginModal, setShowLoginModal] = useState(false)
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')
  
  // 프로필 이미지 관련
  const [profileImagePreview, setProfileImagePreview] = useState<string>('')
  const [showCropModal, setShowCropModal] = useState(false)
  const [selectedImageFile, setSelectedImageFile] = useState<File | null>(null)
  const profileImageInputRef = useRef<HTMLInputElement>(null)
  
  // 폼 데이터
  const [formData, setFormData] = useState<UpdateProfile>({
    profileImageUrl: '',
    email: '',
    githubLink: '',
  })
  
  // 비밀번호 변경
  const [passwordData, setPasswordData] = useState<ChangePassword>({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  } as any)

  useEffect(() => {
    if (!isAuthenticated) {
      setShowLoginModal(true)
    } else {
      fetchUserInfo()
    }
  }, [isAuthenticated])

  const fetchUserInfo = async () => {
    try {
      setLoading(true)
      const response = await authApi.getCurrentUser()
      if (response.success && response.data) {
        setUser(response.data)
        setFormData({
          profileImageUrl: response.data.profileImageUrl || '',
          email: response.data.email || '',
          githubLink: response.data.githubLink || '',
        })
        if (response.data.profileImageUrl) {
          const baseUrl = process.env.NEXT_PUBLIC_UPLOAD_BASE_URL || ''
          const previewUrl = response.data.profileImageUrl.startsWith('http') 
            ? response.data.profileImageUrl 
            : `${baseUrl}${response.data.profileImageUrl}`
          setProfileImagePreview(previewUrl)
        }
      }
    } catch (error) {
      console.error('사용자 정보 조회 실패:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleProfileImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    if (!file.type.startsWith('image/')) {
      alert('이미지 파일만 업로드 가능합니다.')
      return
    }

    if (file.size > 10 * 1024 * 1024) {
      alert('파일 크기는 10MB 이하여야 합니다.')
      return
    }

    setSelectedImageFile(file)
    const reader = new FileReader()
    reader.onload = (e) => {
      if (e.target?.result) {
        setProfileImagePreview(e.target.result as string)
        setShowCropModal(true)
      }
    }
    reader.readAsDataURL(file)
  }

  const handleCropComplete = async (croppedBlob: Blob) => {
    try {
      const croppedFile = new File([croppedBlob], 'cropped-image.jpg', { type: 'image/jpeg' })
      const response = await imageUploadApi.uploadImage(croppedFile)
      
      if (response.success && response.data) {
        const imageUrl = response.data.url
        setFormData({
          ...formData,
          profileImageUrl: imageUrl,
        })
        
        const baseUrl = process.env.NEXT_PUBLIC_UPLOAD_BASE_URL || ''
        const previewUrl = imageUrl.startsWith('http') 
          ? imageUrl 
          : `${baseUrl}${imageUrl}`
        setProfileImagePreview(previewUrl)
      }
    } catch (error: any) {
      alert(error.response?.data?.message || '프로필 이미지 업로드에 실패했습니다.')
      console.error('프로필 이미지 업로드 실패:', error)
    } finally {
      if (profileImageInputRef.current) {
        profileImageInputRef.current.value = ''
      }
    }
  }

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setSaving(true)

    try {
      const updateData: UpdateProfile = {}
      if (formData.profileImageUrl !== user?.profileImageUrl) {
        updateData.profileImageUrl = formData.profileImageUrl
      }
      if (formData.email !== user?.email) {
        updateData.email = formData.email
      }
      if (formData.githubLink !== user?.githubLink) {
        updateData.githubLink = formData.githubLink
      }

      if (Object.keys(updateData).length === 0) {
        alert('변경사항이 없습니다.')
        return
      }

      const response = await authApi.updateProfile(updateData)
      if (response.success) {
        alert('프로필이 수정되었습니다.')
        fetchUserInfo()
      }
    } catch (err: any) {
      setError(err.response?.data?.message || '프로필 수정에 실패했습니다.')
    } finally {
      setSaving(false)
    }
  }

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')

    if (passwordData.newPassword !== (passwordData as any).confirmPassword) {
      setError('새 비밀번호와 확인 비밀번호가 일치하지 않습니다.')
      return
    }

    if (passwordData.newPassword.length < 6) {
      setError('비밀번호는 6자 이상이어야 합니다.')
      return
    }

    try {
      const response = await authApi.changePassword({
        currentPassword: passwordData.currentPassword,
        newPassword: passwordData.newPassword,
      })
      if (response.success) {
        alert('비밀번호가 변경되었습니다.')
        setPasswordData({
          currentPassword: '',
          newPassword: '',
          confirmPassword: '',
        } as any)
      }
    } catch (err: any) {
      setError(err.response?.data?.message || '비밀번호 변경에 실패했습니다.')
    }
  }

  const handleDeleteAccount = async () => {
    if (!confirm('정말로 회원탈퇴를 하시겠습니까? 이 작업은 되돌릴 수 없습니다.')) {
      return
    }

    try {
      const response = await authApi.deleteAccount()
      if (response.success) {
        alert('회원탈퇴가 완료되었습니다.')
        router.push('/')
        router.refresh()
      }
    } catch (err: any) {
      alert(err.response?.data?.message || '회원탈퇴에 실패했습니다.')
    }
  }

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-white">
        <Header onLoginClick={() => setShowLoginModal(true)} />
        {showLoginModal && (
          <LoginModal
            isOpen={showLoginModal}
            onClose={() => setShowLoginModal(false)}
          />
        )}
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="text-center py-20">
            <h1 className="text-3xl font-bold text-gray-900 mb-4">설정</h1>
            <p className="text-gray-600 mb-6">설정 페이지에 접근하려면 로그인이 필요합니다.</p>
            <button
              onClick={() => setShowLoginModal(true)}
              className="px-6 py-3 bg-primary text-white rounded-lg font-medium hover:bg-secondary transition-colors"
            >
              로그인하기
            </button>
          </div>
        </div>
      </div>
    )
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-white">
        <Header onLoginClick={() => {}} />
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="text-center text-gray-500">로딩 중...</div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-white">
      <Header onLoginClick={() => {}} />
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">설정</h1>

        {/* 프로필 이미지 수정 */}
        <div className="bg-white border border-gray-200 rounded-lg p-6 mb-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">프로필 이미지</h2>
          <div className="flex items-start space-x-4">
            {profileImagePreview ? (
              <div className="relative w-32 h-32 border border-gray-300 rounded-full overflow-hidden bg-gray-100">
                <Image
                  src={profileImagePreview}
                  alt="프로필 이미지"
                  fill
                  className="object-cover"
                  unoptimized
                />
              </div>
            ) : (
              <div className="w-32 h-32 border-2 border-dashed border-gray-300 rounded-full flex items-center justify-center bg-gray-50">
                <span className="text-gray-400 text-4xl">
                  {user?.username?.charAt(0).toUpperCase() || 'U'}
                </span>
              </div>
            )}
            <div className="flex-1">
              <input
                ref={profileImageInputRef}
                type="file"
                accept="image/*"
                onChange={handleProfileImageSelect}
                className="hidden"
              />
              <button
                onClick={() => profileImageInputRef.current?.click()}
                className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
              >
                이미지 선택
              </button>
              <p className="mt-2 text-sm text-gray-500">최대 10MB</p>
            </div>
          </div>
        </div>

        {/* 프로필 정보 수정 */}
        <form onSubmit={handleUpdateProfile} className="bg-white border border-gray-200 rounded-lg p-6 mb-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">프로필 정보</h2>
          <div className="space-y-4">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                이메일
              </label>
              <input
                type="email"
                id="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
              />
            </div>
            <div>
              <label htmlFor="githubLink" className="block text-sm font-medium text-gray-700 mb-2">
                깃허브 링크
              </label>
              <input
                type="url"
                id="githubLink"
                value={formData.githubLink}
                onChange={(e) => setFormData({ ...formData, githubLink: e.target.value })}
                placeholder="https://github.com/username"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
              />
            </div>
            {error && <div className="text-red-500 text-sm">{error}</div>}
            <button
              type="submit"
              disabled={saving}
              className="px-6 py-2 bg-primary text-white rounded-lg hover:bg-secondary transition-colors disabled:opacity-50"
            >
              {saving ? '저장 중...' : '저장'}
            </button>
          </div>
        </form>

        {/* 비밀번호 변경 */}
        <form onSubmit={handleChangePassword} className="bg-white border border-gray-200 rounded-lg p-6 mb-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">비밀번호 변경</h2>
          <div className="space-y-4">
            <div>
              <label htmlFor="currentPassword" className="block text-sm font-medium text-gray-700 mb-2">
                현재 비밀번호
              </label>
              <input
                type="password"
                id="currentPassword"
                value={passwordData.currentPassword}
                onChange={(e) => setPasswordData({ ...passwordData, currentPassword: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
              />
            </div>
            <div>
              <label htmlFor="newPassword" className="block text-sm font-medium text-gray-700 mb-2">
                새 비밀번호
              </label>
              <input
                type="password"
                id="newPassword"
                value={passwordData.newPassword}
                onChange={(e) => setPasswordData({ ...passwordData, newPassword: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
              />
            </div>
            <div>
              <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-2">
                새 비밀번호 확인
              </label>
              <input
                type="password"
                id="confirmPassword"
                value={(passwordData as any).confirmPassword || ''}
                onChange={(e) => setPasswordData({ ...passwordData, confirmPassword: e.target.value } as any)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
              />
            </div>
            {error && <div className="text-red-500 text-sm">{error}</div>}
            <button
              type="submit"
              className="px-6 py-2 bg-primary text-white rounded-lg hover:bg-secondary transition-colors"
            >
              비밀번호 변경
            </button>
          </div>
        </form>

        {/* 회원탈퇴 */}
        <div className="bg-white border border-red-200 rounded-lg p-6">
          <h2 className="text-xl font-semibold text-red-900 mb-4">회원탈퇴</h2>
          <p className="text-sm text-gray-600 mb-4">
            회원탈퇴를 하시면 모든 데이터가 삭제되며 복구할 수 없습니다.
          </p>
          <button
            onClick={handleDeleteAccount}
            className="px-6 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
          >
            회원탈퇴
          </button>
        </div>

        {/* 이미지 크롭 모달 */}
        {showCropModal && profileImagePreview && (
          <ImageCropModal
            isOpen={showCropModal}
            imageSrc={profileImagePreview}
            onClose={() => {
              setShowCropModal(false)
              setProfileImagePreview(user?.profileImageUrl ? 
                (user.profileImageUrl.startsWith('http') 
                  ? user.profileImageUrl 
                  : `${process.env.NEXT_PUBLIC_UPLOAD_BASE_URL || ''}${user.profileImageUrl}`) 
                : '')
              setSelectedImageFile(null)
            }}
            onCrop={handleCropComplete}
            aspectRatio={1}
          />
        )}
      </div>
    </div>
  )
}
