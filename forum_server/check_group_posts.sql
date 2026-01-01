-- 모임 게시글 확인 쿼리
-- 특정 모임(groupId = 4)의 게시글 확인

-- 1. posts 테이블에 group_id 컬럼이 있는지 확인
SELECT COLUMN_NAME, DATA_TYPE, IS_NULLABLE 
FROM INFORMATION_SCHEMA.COLUMNS 
WHERE TABLE_SCHEMA = DATABASE() 
AND TABLE_NAME = 'posts' 
AND COLUMN_NAME = 'group_id';

-- 2. 특정 모임의 게시글 확인
SELECT 
    p.id,
    p.title,
    p.user_id,
    p.group_id,
    p.is_public,
    p.is_deleted,
    p.create_datetime
FROM posts p
WHERE p.group_id = 4
AND p.is_deleted = false
ORDER BY p.create_datetime DESC;

-- 3. 모든 모임 게시글 확인 (group_id가 NULL이 아닌 게시글)
SELECT 
    p.id,
    p.title,
    p.group_id,
    g.name AS group_name,
    p.is_public,
    p.create_datetime
FROM posts p
LEFT JOIN user_groups g ON p.group_id = g.id
WHERE p.group_id IS NOT NULL
AND p.is_deleted = false
ORDER BY p.create_datetime DESC;

-- 4. 모임 ID 4의 정보 확인
SELECT id, name, owner_id, is_deleted 
FROM user_groups 
WHERE id = 4;
