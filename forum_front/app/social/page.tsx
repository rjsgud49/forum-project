'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { useSelector } from 'react-redux'
import type { RootState } from '@/store/store'
import { followApi, authApi } from '@/services/api'
import type { UserInfoDTO, User } from '@/types/api'
import Header from '@/components/Header'
import LoginModal from '@/components/LoginModal'
import { getUsernameFromToken } from '@/utils/jwt'
import Image from 'next/image'

export default function SocialPage() {
  const router = useRouter()
  const isAuthenticated = useSelector((state: RootState) => state.auth.isAuthenticated)
  const [showLoginModal, setShowLoginModal] = useState(false)
  const [user, setUser] = useState<User | null>(null)
  const [followers, setFollowers] = useState<UserInfoDTO[]>([])
  const [following, setFollowing] = useState<UserInfoDTO[]>([])
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState<'followers' | 'following'>('followers')

  useEffect(() => {
    if (!isAuthenticated) {
      setShowLoginModal(true)
    } else {
      fetchData()
    }
  }, [isAuthenticated])

  const fetchData = async () => {
    try {
      setLoading(true)
      const username = getUsernameFromToken()
      if (!username) return

      // 현재 사용자 정보 조회
      const userResponse = await authApi.getCurrentUser()
      if (userResponse.success && userResponse.data) {
        setUser(userResponse.data)
        
        // 팔로워/팔로잉 목록 조회
        const userInfoResponse = await followApi.getUserInfo(username)
        if (userInfoResponse.success && userInfoResponse.data) {
          const followersResponse = await followApi.getFollowers(userInfoResponse.data.id)
          const followingResponse = await followApi.getFollowing(userInfoResponse.data.id)
          
          if (followersResponse.success && followersResponse.data) {
            setFollowers(followersResponse.data)
          }
          if (followingResponse.success && followingResponse.data) {
            setFollowing(followingResponse.data)
          }
        }
      }
    } catch (error) {
      console.error('데이터 조회 실패:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleFollow = async (userId: number, currentFollowing: boolean) => {
    if (!isAuthenticated) {
      setShowLoginModal(true)
      return
    }

    try {
      if (currentFollowing) {
        await followApi.unfollowUser(userId)
      } else {
        await followApi.followUser(userId)
      }
      // 목록 새로고침
      fetchData()
    } catch (error: any) {
      alert(error.response?.data?.message || '팔로우 처리에 실패했습니다.')
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
            <h1 className="text-3xl font-bold text-gray-900 mb-4">소셜</h1>
            <p className="text-gray-600 mb-6">소셜 페이지에 접근하려면 로그인이 필요합니다.</p>
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

  return (
    <div className="min-h-screen bg-white">
      <Header onLoginClick={() => {}} />
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">소셜</h1>

        {/* 탭 */}
        <div className="flex space-x-4 mb-6">
          <button
            onClick={() => setActiveTab('followers')}
            className={`px-6 py-2 rounded-lg transition-colors ${
              activeTab === 'followers'
                ? 'bg-primary text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            팔로워 {followers.length}
          </button>
          <button
            onClick={() => setActiveTab('following')}
            className={`px-6 py-2 rounded-lg transition-colors ${
              activeTab === 'following'
                ? 'bg-primary text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            팔로잉 {following.length}
          </button>
        </div>

        {/* 목록 */}
        {loading ? (
          <div className="text-center text-gray-500">로딩 중...</div>
        ) : (
          <div className="space-y-4">
            {(activeTab === 'followers' ? followers : following).map((userInfo) => (
              <div
                key={userInfo.id}
                className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:border-primary transition-colors"
              >
                <div className="flex items-center space-x-4">
                  {userInfo.profileImageUrl ? (
                    <Image
                      src={userInfo.profileImageUrl.startsWith('http') 
                        ? userInfo.profileImageUrl 
                        : `${process.env.NEXT_PUBLIC_UPLOAD_BASE_URL || ''}${userInfo.profileImageUrl}`}
                      alt={userInfo.username}
                      width={48}
                      height={48}
                      className="rounded-full object-cover"
                      unoptimized
                    />
                  ) : (
                    <div className="w-12 h-12 rounded-full bg-gray-300 flex items-center justify-center">
                      <span className="text-gray-600 font-medium">
                        {userInfo.username?.charAt(0).toUpperCase() || 'U'}
                      </span>
                    </div>
                  )}
                  <div>
                    <h3 
                      className="font-semibold text-gray-900 cursor-pointer hover:text-primary"
                      onClick={() => router.push(`/users/${userInfo.username}`)}
                    >
                      {userInfo.username}
                    </h3>
                    <p className="text-sm text-gray-500">{userInfo.nickname}</p>
                    <div className="flex space-x-4 mt-1 text-xs text-gray-400">
                      <span>팔로워 {userInfo.followerCount}</span>
                      <span>팔로잉 {userInfo.followingCount}</span>
                    </div>
                  </div>
                </div>
                {activeTab === 'following' ? (
                  <button
                    onClick={() => handleFollow(userInfo.id, true)}
                    className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors"
                  >
                    언팔로우
                  </button>
                ) : (
                  <button
                    onClick={() => handleFollow(userInfo.id, userInfo.isFollowing)}
                    className={`px-4 py-2 rounded-lg transition-colors ${
                      userInfo.isFollowing
                        ? 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                        : 'bg-primary text-white hover:bg-secondary'
                    }`}
                  >
                    {userInfo.isFollowing ? '언팔로우' : '팔로우'}
                  </button>
                )}
              </div>
            ))}
            {(activeTab === 'followers' ? followers : following).length === 0 && (
              <div className="text-center py-12 text-gray-500">
                {activeTab === 'followers' ? '팔로워가 없습니다.' : '팔로잉이 없습니다.'}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
