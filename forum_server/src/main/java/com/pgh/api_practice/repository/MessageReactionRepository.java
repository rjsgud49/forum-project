package com.pgh.api_practice.repository;

import com.pgh.api_practice.entity.MessageReaction;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.Optional;

public interface MessageReactionRepository extends JpaRepository<MessageReaction, Long> {
    
    Optional<MessageReaction> findByMessageIdAndUserIdAndEmoji(Long messageId, Long userId, String emoji);
    
    boolean existsByMessageIdAndUserIdAndEmoji(Long messageId, Long userId, String emoji);
    
    @Query("SELECT mr.emoji, COUNT(mr) FROM MessageReaction mr WHERE mr.message.id = :messageId GROUP BY mr.emoji")
    List<Object[]> countByMessageIdGroupByEmoji(@Param("messageId") Long messageId);
    
    @Query("SELECT mr.emoji FROM MessageReaction mr WHERE mr.message.id = :messageId AND mr.user.id = :userId")
    List<String> findEmojisByMessageIdAndUserId(@Param("messageId") Long messageId, @Param("userId") Long userId);
    
    void deleteByMessageIdAndUserIdAndEmoji(Long messageId, Long userId, String emoji);
}
