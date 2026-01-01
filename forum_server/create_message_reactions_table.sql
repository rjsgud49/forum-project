-- message_reactions 테이블 생성
-- 이미 테이블이 존재하면 생성하지 않음

SET @exist := (SELECT COUNT(*) FROM information_schema.TABLES
               WHERE TABLE_SCHEMA = DATABASE()
               AND TABLE_NAME = 'message_reactions');

SET @sqlstmt := IF(@exist = 0,
    'CREATE TABLE message_reactions (
        id BIGINT AUTO_INCREMENT PRIMARY KEY,
        message_id BIGINT NOT NULL,
        user_id BIGINT NOT NULL,
        emoji VARCHAR(10) NOT NULL,
        create_datetime DATETIME DEFAULT CURRENT_TIMESTAMP,
        UNIQUE KEY unique_message_user_emoji (message_id, user_id, emoji),
        FOREIGN KEY (message_id) REFERENCES group_chat_messages(id) ON DELETE CASCADE,
        FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
        INDEX idx_message_id (message_id),
        INDEX idx_user_id (user_id)
    )',
    'SELECT "message_reactions table already exists"');

PREPARE stmt FROM @sqlstmt;
EXECUTE stmt;
DEALLOCATE PREPARE stmt;
