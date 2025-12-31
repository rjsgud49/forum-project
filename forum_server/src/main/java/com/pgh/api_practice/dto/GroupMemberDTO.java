package com.pgh.api_practice.dto;

import lombok.*;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class GroupMemberDTO {
    private Long userId;
    private String username;
    private String nickname;
    private String profileImageUrl;
    private boolean isAdmin;
    private boolean isOwner;
}
