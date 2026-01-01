-- 채팅방별 별명 컬럼 추가
ALTER TABLE group_members 
ADD COLUMN display_name VARCHAR(30) NULL 
AFTER is_admin;

-- 인덱스는 필요 없음 (별명은 개별 조회용)
