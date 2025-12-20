package com.pgh.api_practice.dto.auth;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.Setter;
import org.hibernate.validator.constraints.Length;

@Getter
@Setter
@AllArgsConstructor
@Builder
public class RegisterRequestDTO {

    @NotBlank
    @Length(max = 100)
    private String username;

    @NotBlank
    private String password;

    @NotBlank
    @Length(max = 15)
    private String nickname;

    @NotBlank
    @Email
    private String email;
}
