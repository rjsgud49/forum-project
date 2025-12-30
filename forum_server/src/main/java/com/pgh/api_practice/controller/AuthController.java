package com.pgh.api_practice.controller;

import com.pgh.api_practice.dto.ChangePasswordDTO;
import com.pgh.api_practice.dto.LoginRequestDTO;
import com.pgh.api_practice.dto.UpdateProfileDTO;
import com.pgh.api_practice.dto.auth.RegisterRequestDTO;
import com.pgh.api_practice.dto.auth.LoginResponseDTO;
import com.pgh.api_practice.dto.auth.RefreshTokenRequestDTO;
import com.pgh.api_practice.entity.Users;
import com.pgh.api_practice.service.AuthService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import com.pgh.api_practice.dto.ApiResponse;
import jakarta.validation.Valid;

@RestController
@RequestMapping("/auth")
@RequiredArgsConstructor
public class AuthController {

    private final AuthService authService;

    @PostMapping("/register")
    public ResponseEntity<ApiResponse<Void>> register(
            @Valid @RequestBody RegisterRequestDTO registerRequestDTO
    ) {
        authService.register(registerRequestDTO);
        return ResponseEntity.ok(ApiResponse.ok("회원가입이 완료되었습니다."));
    }

    @PostMapping("/login")
    public ResponseEntity<ApiResponse<LoginResponseDTO>> login(
            @Valid @RequestBody LoginRequestDTO loginRequestDTO
    ) {
    LoginResponseDTO result = authService.login(loginRequestDTO);
    return ResponseEntity.ok(ApiResponse.ok(result,"로그인이 완료되었습니다"));
    }

    @PostMapping("/refresh")
    public ResponseEntity<ApiResponse<LoginResponseDTO>> refresh(
            @Valid @RequestBody RefreshTokenRequestDTO refreshTokenRequestDTO
    ) {
        LoginResponseDTO result = authService.refreshToken(refreshTokenRequestDTO);
        return ResponseEntity.ok(ApiResponse.ok(result, "토큰이 재발급되었습니다."));
    }
    
    /** ✅ 현재 사용자 정보 조회 */
    @GetMapping("/me")
    public ResponseEntity<ApiResponse<Users>> getCurrentUser() {
        Users user = authService.getCurrentUser();
        return ResponseEntity.ok(ApiResponse.ok(user, "사용자 정보 조회 성공"));
    }
    
    /** ✅ 프로필 정보 수정 */
    @PatchMapping("/profile")
    public ResponseEntity<ApiResponse<Void>> updateProfile(@RequestBody UpdateProfileDTO dto) {
        authService.updateProfile(dto);
        return ResponseEntity.ok(ApiResponse.ok("프로필 수정 성공"));
    }
    
    /** ✅ 비밀번호 변경 */
    @PatchMapping("/password")
    public ResponseEntity<ApiResponse<Void>> changePassword(@Valid @RequestBody ChangePasswordDTO dto) {
        authService.changePassword(dto);
        return ResponseEntity.ok(ApiResponse.ok("비밀번호 변경 성공"));
    }
    
    /** ✅ 회원탈퇴 */
    @DeleteMapping("/account")
    public ResponseEntity<ApiResponse<Void>> deleteAccount() {
        authService.deleteAccount();
        return ResponseEntity.ok(ApiResponse.ok("회원탈퇴 성공"));
    }
}














