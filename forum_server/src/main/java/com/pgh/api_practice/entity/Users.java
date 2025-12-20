    package com.pgh.api_practice.entity;

    import jakarta.persistence.*;
    import lombok.*;
    import org.springframework.data.annotation.CreatedDate;
    import org.springframework.data.jpa.domain.support.AuditingEntityListener;

    import java.time.LocalDateTime;

    @Entity
    @Table(name = "users")
    @Getter
    @Setter
    @NoArgsConstructor
    @AllArgsConstructor
    @Builder
    @EntityListeners(AuditingEntityListener.class)
    public class Users {

        @Id
        @GeneratedValue(strategy = GenerationType.IDENTITY)
        private Long id;

        @Column(nullable = false)
        private String username;

        @Column(nullable = false)
        private String password;

        @Column(nullable = false, unique = true, length = 15)
        private String nickname;

        @Column(nullable = false, unique = true, length = 200)
        private String email;

        @Builder.Default
        @Column(name = "is_deleted", nullable = false)
        private boolean isDeleted = false;




        @CreatedDate
        @Column(name = "created_datetime", nullable = false, updatable = false)
        private LocalDateTime createdDate;
    }