-- 사용자 프로필 필드 추가 (간단한 버전)
-- 
-- 이미 컬럼이 존재하는 경우 오류가 발생할 수 있습니다.
-- 오류가 발생하면 해당 컬럼은 이미 존재하는 것이므로 무시하셔도 됩니다.
-- 
-- 사용 방법:
-- 1. MySQL에 접속
-- 2. 데이터베이스 선택: USE your_database_name;
-- 3. 아래 스크립트 실행

-- 프로필 이미지 URL 컬럼 추가
ALTER TABLE users ADD COLUMN profile_image_url VARCHAR(500) NULL;

-- 깃허브 링크 컬럼 추가
ALTER TABLE users ADD COLUMN github_link VARCHAR(500) NULL;
