export function PostListSkeleton() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {Array.from({ length: 8 }).map((_, i) => (
        <div
          key={i}
          className="bg-white border border-gray-200 rounded-lg overflow-hidden animate-pulse h-full flex flex-col"
        >
          {/* 이미지 영역 - 정사각형 */}
          <div className="relative w-full aspect-square bg-gray-200"></div>
          
          {/* 카드 하단 정보 */}
          <div className="p-3 flex-1 flex flex-col justify-between">
            <div className="flex items-center justify-between mb-2">
              <div className="h-3 bg-gray-200 rounded w-20"></div>
              <div className="h-3 bg-gray-200 rounded w-16"></div>
            </div>
            <div className="h-3 bg-gray-200 rounded w-24"></div>
          </div>
        </div>
      ))}
    </div>
  )
}

export function PostDetailSkeleton() {
  return (
    <div className="animate-pulse">
      <div className="h-10 bg-gray-200 rounded w-3/4 mb-6"></div>
      <div className="h-4 bg-gray-200 rounded w-1/2 mb-8"></div>
      <div className="space-y-4">
        <div className="h-4 bg-gray-200 rounded"></div>
        <div className="h-4 bg-gray-200 rounded"></div>
        <div className="h-4 bg-gray-200 rounded w-5/6"></div>
      </div>
    </div>
  )
}

