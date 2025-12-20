'use client'

import { useState } from 'react'
import { useSelector } from 'react-redux'
import type { RootState } from '@/store/store'
import Header from '@/components/Header'
import Hero from '@/components/Hero'
import PostList from '@/components/PostList'
import LoginModal from '@/components/LoginModal'

export default function Home() {
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false)
  const isAuthenticated = useSelector((state: RootState) => state.auth.isAuthenticated)

  return (
    <div className="min-h-screen bg-white">
      <Header onLoginClick={() => setIsLoginModalOpen(true)} />
      <Hero />
      <PostList />
      {isLoginModalOpen && (
        <LoginModal
          isOpen={isLoginModalOpen}
          onClose={() => setIsLoginModalOpen(false)}
        />
      )}
    </div>
  )
}

