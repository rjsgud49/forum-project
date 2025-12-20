'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { useSelector } from 'react-redux'
import type { RootState } from '@/store/store'
import { postApi } from '@/services/api'
import type { PostListDTO } from '@/types/api'
import Header from '@/components/Header'
import Link from 'next/link'
import { formatDistanceToNow } from 'date-fns'
import { ko } from 'date-fns/locale'

export default function MyPostsPage() {
  const router = useRouter()
  const isAuthenticated = useSelector((state: RootState) => state.auth.isAuthenticated)
  const [posts, setPosts] = useState<PostListDTO[]>([])
  const [loading, setLoading] = useState(true)
  const [page, setPage] = useState(0)
  const [totalPages, setTotalPages] = useState(0)

  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/')
      return
    }
    fetchPosts()
  }, [page, isAuthenticated])

  const fetchPosts = async () => {
    try {
      setLoading(true)
      const response = await postApi.getMyPostList(page, 10, 'RESENT')
      if (response.success && response.data) {
        setPosts(response.data.content || [])
        setTotalPages(response.data.totalPages || 0)
      }
    } catch (error) {
      console.error('내 게시글 목록 조회 실패:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (postId: number, e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    
    if (!confirm('정말 이 게시글을 삭제하시겠습니까?')) {
      return
    }

    try {
      const response = await postApi.deletePost(postId)
      if (response.success) {
        fetchPosts()
      }
    } catch (error: any) {
      alert(error.response?.data?.message || '게시글 삭제에 실패했습니다.')
    }
  }

  const formatDate = (dateString: string) => {
    try {
      return formatDistanceToNow(new Date(dateString), { addSuffix: true, locale: ko })
    } catch {
      return dateString
    }
  }

  if (!isAuthenticated) {
    return null
  }

  return (
    <div className="min-h-screen bg-white">
      <Header onLoginClick={() => router.push('/')} />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">내 게시글</h1>
          <p className="text-gray-600">작성한 게시글을 관리하세요</p>
        </div>

        {loading && posts.length === 0 ? (
          <div className="text-center text-gray-500">로딩 중...</div>
        ) : posts.length === 0 ? (
          <div className="text-center py-12 text-gray-500">
            작성한 게시글이 없습니다.
          </div>
        ) : (
          <div className="space-y-4">
            {posts.map((post) => (
              <div
                key={post.id}
                className="p-6 bg-white border border-gray-200 rounded-lg hover:border-primary hover:shadow-md transition-all"
              >
                <Link href={`/posts/${post.id}`}>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2 line-clamp-2">
                    {post.title}
                  </h3>
                  <div className="flex items-center justify-between text-sm text-gray-500">
                    <span>{post.username}</span>
                    <span>{formatDate(post.createDateTime)}</span>
                  </div>
                </Link>
                <div className="mt-4 pt-4 border-t flex justify-end space-x-2">
                  <button
                    onClick={(e) => {
                      e.preventDefault()
                      router.push(`/posts/${post.id}/edit`)
                    }}
                    className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-secondary transition-colors text-sm"
                  >
                    수정
                  </button>
                  <button
                    onClick={(e) => handleDelete(post.id, e)}
                    className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors text-sm"
                  >
                    삭제
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {totalPages > 1 && (
          <div className="flex justify-center mt-8 space-x-2">
            <button
              onClick={() => setPage((p) => Math.max(0, p - 1))}
              disabled={page === 0}
              className="px-4 py-2 border border-gray-300 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
            >
              이전
            </button>
            <span className="px-4 py-2 text-gray-700">
              {page + 1} / {totalPages}
            </span>
            <button
              onClick={() => setPage((p) => Math.min(totalPages - 1, p + 1))}
              disabled={page >= totalPages - 1}
              className="px-4 py-2 border border-gray-300 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
            >
              다음
            </button>
          </div>
        )}
      </div>
    </div>
  )
}

