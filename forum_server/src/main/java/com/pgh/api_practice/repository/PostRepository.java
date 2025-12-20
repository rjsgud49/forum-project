package com.pgh.api_practice.repository;

import com.pgh.api_practice.entity.Post;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;

public interface PostRepository extends JpaRepository<Post, Long> {

    Page<Post> findAllByIsDeletedFalseOrderByCreatedTimeDesc(Pageable pageable);
    Page<Post> findAllByIsDeletedFalseOrderByViewsDesc(Pageable pageable);

    Page<Post> findAllByUserIdAndIsDeletedFalseOrderByCreatedTimeDesc(Long userId, Pageable pageable);
    Page<Post> findAllByUserIdAndIsDeletedFalseOrderByViewsDesc(Long userId, Pageable pageable);
}
