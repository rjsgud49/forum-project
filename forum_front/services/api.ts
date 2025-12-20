import axios from 'axios'
import type { ApiResponse, LoginRequest, RegisterRequest, LoginResponse, PostListDTO, PostDetailDTO, CreatePost, PatchPost } from '@/types/api'

const API_BASE_URL = 'http://localhost:8081'

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
})

// 요청 인터셉터: 토큰 자동 추가
apiClient.interceptors.request.use(
  (config) => {
    const token = typeof window !== 'undefined' ? localStorage.getItem('accessToken') : null
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)

// 응답 인터셉터: 401 에러 처리
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      if (typeof window !== 'undefined') {
        localStorage.removeItem('accessToken')
        localStorage.removeItem('refreshToken')
        window.location.href = '/'
      }
    }
    return Promise.reject(error)
  }
)

// Auth API
export const authApi = {
  login: async (data: LoginRequest): Promise<ApiResponse<LoginResponse>> => {
    const response = await apiClient.post<ApiResponse<LoginResponse>>('/auth/login', data)
    return response.data
  },
  register: async (data: RegisterRequest): Promise<ApiResponse<void>> => {
    const response = await apiClient.post<ApiResponse<void>>('/auth/register', data)
    return response.data
  },
}

// Post API
export const postApi = {
  getPostList: async (page: number = 0, size: number = 10, sortType: string = 'RESENT'): Promise<ApiResponse<{ content: PostListDTO[]; totalElements: number; totalPages: number }>> => {
    const response = await apiClient.get<ApiResponse<{ content: PostListDTO[]; totalElements: number; totalPages: number }>>('/api/post', {
      params: { page, size, sortType },
    })
    return response.data
  },
  getMyPostList: async (page: number = 0, size: number = 10, sortType: string = 'RESENT'): Promise<ApiResponse<{ content: PostListDTO[]; totalElements: number; totalPages: number }>> => {
    const response = await apiClient.get<ApiResponse<{ content: PostListDTO[]; totalElements: number; totalPages: number }>>('/api/post/my-post', {
      params: { page, size, sortType },
    })
    return response.data
  },
  getPostDetail: async (id: number): Promise<ApiResponse<PostDetailDTO>> => {
    const response = await apiClient.get<ApiResponse<PostDetailDTO>>(`/api/post/${id}`)
    return response.data
  },
  createPost: async (data: CreatePost): Promise<ApiResponse<void>> => {
    const response = await apiClient.post<ApiResponse<void>>('/api/post', data)
    return response.data
  },
  updatePost: async (id: number, data: PatchPost): Promise<ApiResponse<void>> => {
    const response = await apiClient.patch<ApiResponse<void>>(`/api/post/${id}`, data)
    return response.data
  },
  deletePost: async (id: number): Promise<ApiResponse<void>> => {
    const response = await apiClient.delete<ApiResponse<void>>(`/api/post/${id}`)
    return response.data
  },
}

