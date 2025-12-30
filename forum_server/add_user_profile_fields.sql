-- 사용자 프로필 필드 추가
-- 
-- 사용 방법:
-- 1. 먼저 users 테이블이 존재하는지 확인하세요
-- 2. 아래 스크립트를 실행하여 컬럼을 추가하세요

-- 프로필 이미지 URL 컬럼 추가
ALTER TABLE users ADD COLUMN IF NOT EXISTS profile_image_url VARCHAR(500) NULL;

-- 깃허브 링크 컬럼 추가
ALTER TABLE users ADD COLUMN IF NOT EXISTS github_link VARCHAR(500) NULL;
