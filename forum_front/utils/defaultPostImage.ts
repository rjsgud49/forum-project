/**
 * 게시물 기본 이미지 생성 함수
 * 다양한 무늬의 카드에 "rjsgud's forum" 텍스트가 있는 이미지를 생성합니다.
 */
export function generateDefaultPostImage(postId: number): string {
  // postId를 기반으로 다양한 패턴 생성
  const patterns = [
    // 그라데이션 패턴 1
    {
      gradient: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      textColor: '#ffffff',
    },
    // 그라데이션 패턴 2
    {
      gradient: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
      textColor: '#ffffff',
    },
    // 그라데이션 패턴 3
    {
      gradient: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
      textColor: '#ffffff',
    },
    // 그라데이션 패턴 4
    {
      gradient: 'linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)',
      textColor: '#1a1a1a',
    },
    // 그라데이션 패턴 5
    {
      gradient: 'linear-gradient(135deg, #fa709a 0%, #fee140 100%)',
      textColor: '#1a1a1a',
    },
    // 그라데이션 패턴 6
    {
      gradient: 'linear-gradient(135deg, #30cfd0 0%, #330867 100%)',
      textColor: '#ffffff',
    },
    // 그라데이션 패턴 7
    {
      gradient: 'linear-gradient(135deg, #a8edea 0%, #fed6e3 100%)',
      textColor: '#1a1a1a',
    },
    // 그라데이션 패턴 8
    {
      gradient: 'linear-gradient(135deg, #ff9a9e 0%, #fecfef 100%)',
      textColor: '#1a1a1a',
    },
  ]

  const pattern = patterns[postId % patterns.length]
  
  // SVG를 Data URL로 생성
  const svg = `
    <svg width="400" height="250" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="grad${postId}" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" style="stop-color:#667eea;stop-opacity:1" />
          <stop offset="100%" style="stop-color:#764ba2;stop-opacity:1" />
        </linearGradient>
        <pattern id="dots${postId}" x="0" y="0" width="20" height="20" patternUnits="userSpaceOnUse">
          <circle cx="10" cy="10" r="1.5" fill="${pattern.textColor}" opacity="0.1"/>
        </pattern>
      </defs>
      <rect width="400" height="250" fill="url(#grad${postId})"/>
      <rect width="400" height="250" fill="url(#dots${postId})"/>
      <text x="200" y="120" font-family="Arial, sans-serif" font-size="32" font-weight="bold" 
            fill="${pattern.textColor}" text-anchor="middle" opacity="0.9">
        rjsgud's forum
      </text>
      <text x="200" y="160" font-family="Arial, sans-serif" font-size="14" 
            fill="${pattern.textColor}" text-anchor="middle" opacity="0.7">
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
 */
export function generateDefaultPostImageCanvas(postId: number): string {
  const canvas = document.createElement('canvas')
  canvas.width = 400
  canvas.height = 250
  const ctx = canvas.getContext('2d')
  
  if (!ctx) return ''

  const patterns = [
    { start: '#667eea', end: '#764ba2', textColor: '#ffffff' },
    { start: '#f093fb', end: '#f5576c', textColor: '#ffffff' },
    { start: '#4facfe', end: '#00f2fe', textColor: '#ffffff' },
    { start: '#43e97b', end: '#38f9d7', textColor: '#1a1a1a' },
    { start: '#fa709a', end: '#fee140', textColor: '#1a1a1a' },
    { start: '#30cfd0', end: '#330867', textColor: '#ffffff' },
    { start: '#a8edea', end: '#fed6e3', textColor: '#1a1a1a' },
    { start: '#ff9a9e', end: '#fecfef', textColor: '#1a1a1a' },
  ]

  const pattern = patterns[postId % patterns.length]
  
  // 그라데이션 생성
  const gradient = ctx.createLinearGradient(0, 0, 400, 250)
  gradient.addColorStop(0, pattern.start)
  gradient.addColorStop(1, pattern.end)
  
  // 배경 그리기
  ctx.fillStyle = gradient
  ctx.fillRect(0, 0, 400, 250)
  
  // 도트 패턴 추가
  ctx.fillStyle = pattern.textColor
  ctx.globalAlpha = 0.1
  for (let x = 0; x < 400; x += 20) {
    for (let y = 0; y < 250; y += 20) {
      ctx.beginPath()
      ctx.arc(x + 10, y + 10, 1.5, 0, Math.PI * 2)
      ctx.fill()
    }
  }
  
  // 텍스트 그리기
  ctx.globalAlpha = 0.9
  ctx.fillStyle = pattern.textColor
  ctx.font = 'bold 32px Arial, sans-serif'
  ctx.textAlign = 'center'
  ctx.textBaseline = 'middle'
  ctx.fillText("rjsgud's forum", 200, 110)
  
  ctx.globalAlpha = 0.7
  ctx.font = '14px Arial, sans-serif'
  ctx.fillText('Welcome to our community', 200, 150)
  
  return canvas.toDataURL('image/png')
}
