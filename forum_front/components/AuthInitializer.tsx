'use client'

import { useEffect } from 'react'
import { useDispatch } from 'react-redux'
import { setCredentials } from '@/store/slices/authSlice'

// 클라이언트에서만 localStorage의 토큰을 읽어서 Redux 상태 초기화
export default function AuthInitializer() {
  const dispatch = useDispatch()

  useEffect(() => {
    const accessToken = localStorage.getItem('accessToken')
    const refreshToken = localStorage.getItem('refreshToken')
    
    if (accessToken && refreshToken) {
      dispatch(setCredentials({ accessToken, refreshToken }))
    }
  }, [dispatch])

  return null
}

