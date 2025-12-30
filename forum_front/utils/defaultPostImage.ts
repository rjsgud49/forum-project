/**
 * 게시물 기본 이미지 생성 함수
 * 회색 패턴에 사이트명이 있는 이미지를 생성합니다.
 */
export function generateDefaultPostImage(postId: number): string {
  // 회색 톤의 다양한 패턴 (postId 기반으로 약간의 변화)
  const grayShades = [
    { bg: '#f3f4f6', pattern: '#e5e7eb', text: '#374151' }, // 연한 회색
    { bg: '#e5e7eb', pattern: '#d1d5db', text: '#4b5563' }, // 중간 회색
    { bg: '#d1d5db', pattern: '#9ca3af', text: '#6b7280' }, // 진한 회색
    { bg: '#f9fafb', pattern: '#e5e7eb', text: '#374151' }, // 매우 연한 회색
    { bg: '#f3f4f6', pattern: '#d1d5db', text: '#4b5563' }, // 연한-중간 회색
  ]
  
  const shade = grayShades[postId % grayShades.length]
  
  // 정사각형 비율 (400x400)
  const svg = `
    <svg width="400" height="400" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <!-- 격자 패턴 -->
        <pattern id="grid${postId}" x="0" y="0" width="40" height="40" patternUnits="userSpaceOnUse">
          <path d="M 40 0 L 0 0 0 40" fill="none" stroke="${shade.pattern}" stroke-width="1" opacity="0.3"/>
        </pattern>
        <!-- 대각선 패턴 -->
        <pattern id="diagonal${postId}" x="0" y="0" width="20" height="20" patternUnits="userSpaceOnUse">
          <path d="M 0 20 L 20 0" fill="none" stroke="${shade.pattern}" stroke-width="0.5" opacity="0.2"/>
        </pattern>
      </defs>
      
      <!-- 배경 -->
      <rect width="400" height="400" fill="${shade.bg}"/>
      
      <!-- 격자 패턴 -->
      <rect width="400" height="400" fill="url(#grid${postId})"/>
      
      <!-- 대각선 패턴 -->
      <rect width="400" height="400" fill="url(#diagonal${postId})"/>
      
      <!-- 사이트명 텍스트 -->
      <text x="200" y="180" font-family="Arial, sans-serif" font-size="36" font-weight="bold" 
            fill="${shade.text}" text-anchor="middle" opacity="0.9">
        rjsgud's forum
      </text>
      <text x="200" y="220" font-family="Arial, sans-serif" font-size="16" 
            fill="${shade.text}" text-anchor="middle" opacity="0.6">
        Welcome to our community
      </text>
    </svg>
  `.trim()

  // SVG를 Data URL로 변환
  const svgBlob = new Blob([svg], { type: 'image/svg+xml;charset=utf-8' })
  return URL.createObjectURL(svgBlob)
}

/**
 * Canvas를 사용한 고품질 기본 이미지 생성 (대안)
 * 회색 패턴에 사이트명이 있는 이미지를 생성합니다.
 */
export function generateDefaultPostImageCanvas(postId: number): string {
  const canvas = document.createElement('canvas')
  canvas.width = 400
  canvas.height = 400 // 정사각형
  const ctx = canvas.getContext('2d')
  
  if (!ctx) return ''

  // 회색 톤의 다양한 패턴
  const grayShades = [
    { bg: '#f3f4f6', pattern: '#e5e7eb', text: '#374151' },
    { bg: '#e5e7eb', pattern: '#d1d5db', text: '#4b5563' },
    { bg: '#d1d5db', pattern: '#9ca3af', text: '#6b7280' },
    { bg: '#f9fafb', pattern: '#e5e7eb', text: '#374151' },
    { bg: '#f3f4f6', pattern: '#d1d5db', text: '#4b5563' },
  ]
  
  const shade = grayShades[postId % grayShades.length]
  
  // 배경 그리기
  ctx.fillStyle = shade.bg
  ctx.fillRect(0, 0, 400, 400)
  
  // 격자 패턴 추가
  ctx.strokeStyle = shade.pattern
  ctx.lineWidth = 1
  ctx.globalAlpha = 0.3
  for (let x = 0; x <= 400; x += 40) {
    ctx.beginPath()
    ctx.moveTo(x, 0)
    ctx.lineTo(x, 400)
    ctx.stroke()
  }
  for (let y = 0; y <= 400; y += 40) {
    ctx.beginPath()
    ctx.moveTo(0, y)
    ctx.lineTo(400, y)
    ctx.stroke()
  }
  
  // 대각선 패턴 추가
  ctx.globalAlpha = 0.2
  for (let i = -400; i <= 400; i += 20) {
    ctx.beginPath()
    ctx.moveTo(i, 0)
    ctx.lineTo(i + 400, 400)
    ctx.stroke()
  }
  
  // 텍스트 그리기
  ctx.globalAlpha = 0.9
  ctx.fillStyle = shade.text
  ctx.font = 'bold 36px Arial, sans-serif'
  ctx.textAlign = 'center'
  ctx.textBaseline = 'middle'
  ctx.fillText("rjsgud's forum", 200, 180)
  
  ctx.globalAlpha = 0.6
  ctx.font = '16px Arial, sans-serif'
  ctx.fillText('Welcome to our community', 200, 220)
  
  return canvas.toDataURL('image/png')
}
