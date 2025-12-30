-- 사용자 프로필 필드 추가 (안전한 버전)
-- 
-- 이미 컬럼이 존재하는 경우 오류가 발생하지 않도록 처리
-- 
-- 사용 방법:
-- 1. MySQL에 접속
-- 2. 데이터베이스 선택: USE your_database_name;
-- 3. 아래 스크립트 실행

-- 프로필 이미지 URL 컬럼 추가 (이미 존재하면 무시)
SET @dbname = DATABASE();
SET @tablename = 'users';
SET @columnname = 'profile_image_url';
SET @preparedStatement = (SELECT IF(
  (
    SELECT COUNT(*) FROM INFORMATION_SCHEMA.COLUMNS
    WHERE
      (TABLE_SCHEMA = @dbname)
      AND (TABLE_NAME = @tablename)
      AND (COLUMN_NAME = @columnname)
  ) > 0,
  'SELECT 1',
  CONCAT('ALTER TABLE ', @tablename, ' ADD COLUMN ', @columnname, ' VARCHAR(500) NULL')
));
PREPARE alterIfNotExists FROM @preparedStatement;
EXECUTE alterIfNotExists;
DEALLOCATE PREPARE alterIfNotExists;

-- 깃허브 링크 컬럼 추가 (이미 존재하면 무시)
SET @columnname = 'github_link';
SET @preparedStatement = (SELECT IF(
  (
    SELECT COUNT(*) FROM INFORMATION_SCHEMA.COLUMNS
    WHERE
      (TABLE_SCHEMA = @dbname)
      AND (TABLE_NAME = @tablename)
      AND (COLUMN_NAME = @columnname)
  ) > 0,
  'SELECT 1',
  CONCAT('ALTER TABLE ', @tablename, ' ADD COLUMN ', @columnname, ' VARCHAR(500) NULL')
));
PREPARE alterIfNotExists FROM @preparedStatement;
EXECUTE alterIfNotExists;
DEALLOCATE PREPARE alterIfNotExists;
