-- 사용자 프로필 필드 추가
-- 
-- 사용 방법:
-- 1. 먼저 users 테이블이 존재하는지 확인하세요
-- 2. 아래 스크립트를 실행하여 컬럼을 추가하세요
-- 
-- 참고: MySQL 8.0.19 미만 버전에서는 IF NOT EXISTS를 지원하지 않을 수 있습니다.
--       이미 컬럼이 존재하는 경우 오류가 발생할 수 있으니, 필요시 수동으로 확인하세요.

-- 프로필 이미지 URL 컬럼 추가
-- MySQL 8.0.19 이상
-- ALTER TABLE users ADD COLUMN IF NOT EXISTS profile_image_url VARCHAR(500) NULL;

-- MySQL 8.0.19 미만 또는 호환성을 위한 방법
ALTER TABLE users ADD COLUMN profile_image_url VARCHAR(500) NULL;

-- 깃허브 링크 컬럼 추가
-- MySQL 8.0.19 이상
-- ALTER TABLE users ADD COLUMN IF NOT EXISTS github_link VARCHAR(500) NULL;

-- MySQL 8.0.19 미만 또는 호환성을 위한 방법
ALTER TABLE users ADD COLUMN github_link VARCHAR(500) NULL;
