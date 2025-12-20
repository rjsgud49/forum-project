-- posts 테이블의 body 컬럼을 TEXT 타입으로 변경
ALTER TABLE posts MODIFY COLUMN body TEXT NOT NULL;

-- posts 테이블의 title 컬럼 길이를 500으로 변경
ALTER TABLE posts MODIFY COLUMN title VARCHAR(500) NOT NULL;
