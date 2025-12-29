# 이미지 업로드 기능 설정 가이드

## 1. 업로드 폴더 생성 (Windows)

업로드 파일을 저장할 폴더를 생성합니다.

```powershell
# PowerShell에서 실행
New-Item -ItemType Directory -Path "D:\app-data\uploads" -Force
```

또는 수동으로 `D:\app-data\uploads` 폴더를 생성합니다.

### 권한 설정

Nginx와 Spring Boot가 이 폴더에 쓰기 권한을 가져야 합니다.

1. 폴더 속성 → 보안 탭
2. 편집 → 추가
3. 다음 계정에 쓰기 권한 부여:
   - `IIS_IUSRS` (Nginx 실행 계정)
   - `NETWORK SERVICE` (Spring Boot 실행 계정)
   - 또는 실행 중인 사용자 계정

## 2. Nginx 설정 업데이트

`nginx-https.conf` 파일이 이미 업데이트되었습니다. 다음 설정이 포함되어 있습니다:

- `client_max_body_size 20m` - 업로드 용량 제한
- `/uploads/` 경로 정적 서빙
- 타임아웃 설정

Nginx를 재시작하여 설정을 적용합니다:

```powershell
# Nginx 재시작
nginx -s reload
```

## 3. Spring Boot 설정 확인

`application.properties`에 다음 설정이 추가되었습니다:

```properties
spring.servlet.multipart.enabled=true
spring.servlet.multipart.max-file-size=10MB
spring.servlet.multipart.max-request-size=10MB
app.upload.dir=D:/app-data/uploads
```

## 4. API 엔드포인트

### 이미지 업로드
- **POST** `/api/upload/image`
- **Content-Type**: `multipart/form-data`
- **파라미터**: `file` (MultipartFile)
- **응답**: `{ url: "/uploads/xxx.jpg", filename: "xxx.jpg" }`

### 이미지 삭제
- **DELETE** `/api/upload/image/{filename}`
- 인증 필요

## 5. 프론트엔드 사용법

게시글 작성/수정 페이지에서 "이미지" 버튼을 클릭하여 이미지를 업로드할 수 있습니다.

업로드된 이미지는 마크다운 형식으로 본문에 삽입됩니다:
```
![이미지 설명](/uploads/xxx.jpg)
```

## 6. 문제 해결

### 413 Request Entity Too Large
- Nginx의 `client_max_body_size` 값을 증가시킵니다.

### 이미지가 표시되지 않음
- Nginx의 `/uploads/` 경로 설정을 확인합니다.
- 파일 경로가 올바른지 확인합니다 (`D:/app-data/uploads/`).

### 권한 오류
- 업로드 폴더의 쓰기 권한을 확인합니다.
- Nginx와 Spring Boot 실행 계정에 권한이 있는지 확인합니다.

